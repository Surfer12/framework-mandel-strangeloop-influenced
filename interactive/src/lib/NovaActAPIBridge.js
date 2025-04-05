export class NovaActAPIBridge {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'http://localhost:8000';
    this.timeout = options.timeout || 30000;
    this.sessionId = null;
    this.abortControllers = new Map();
  }

  async _fetchWithTimeout(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const abortController = new AbortController();
    const id = Date.now().toString();
    this.abortControllers.set(id, abortController);

    const headers = {
      'Content-Type': 'application/json',
      ...(this.sessionId && { 'X-Session-ID': this.sessionId }),
      ...options.headers
    };

    const timeoutId = setTimeout(() => abortController.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: abortController.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${this.timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(id);
    }
  }

  async initialize(config) {
    try {
      const data = await this._fetchWithTimeout('/init', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      
      this.sessionId = data.sessionId;
      return data;
    } catch (error) {
      console.error('NovaAct initialization failed:', error);
      throw new Error(`Failed to initialize NovaAct: ${error.message}`);
    }
  }

  async start() {
    if (!this.sessionId) {
      throw new Error('NovaAct not initialized. Call initialize() first.');
    }
    
    try {
      return await this._fetchWithTimeout('/start', {
        method: 'POST'
      });
    } catch (error) {
      console.error('NovaAct start failed:', error);
      throw new Error(`Failed to start NovaAct: ${error.message}`);
    }
  }

  async act(action, params) {
    if (!this.sessionId) {
      throw new Error('NovaAct not initialized. Call initialize() first.');
    }
    
    try {
      return await this._fetchWithTimeout('/act', {
        method: 'POST',
        body: JSON.stringify({ action, params })
      });
    } catch (error) {
      console.error('NovaAct action failed:', error);
      throw new Error(`Failed to perform action: ${error.message}`);
    }
  }

  async stop() {
    if (!this.sessionId) {
      return { status: 'success', message: 'No active session' };
    }
    
    try {
      const result = await this._fetchWithTimeout('/stop', {
        method: 'POST'
      });
      this.sessionId = null;
      return result;
    } catch (error) {
      console.error('Failed to stop NovaAct:', error);
      throw new Error(`Failed to stop NovaAct: ${error.message}`);
    } finally {
      this.sessionId = null;
    }
  }

  cancelAllRequests() {
    for (const controller of this.abortControllers.values()) {
      controller.abort();
    }
    this.abortControllers.clear();
  }
} 