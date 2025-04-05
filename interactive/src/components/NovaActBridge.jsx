import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Stop as StopIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { FRACTAL_FRAMEWORK } from '../utils/framework';
import { NovaActConfig } from './NovaActConfig';

const API_BASE_URL = 'http://localhost:8000';

export const NovaActBridge = ({ onThoughtGenerated, onInterventionGenerated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const [sessionId, setSessionId] = useState(null);
  const [activeTab, setActiveTab] = useState('control');
  const [config, setConfig] = useState({
    processingLevel: 'mesoLevel',
    explorationDepth: 3,
    thoughtRate: 1000,
    enableMetaC: false,
    enableVisualization: true,
    startingUrl: 'https://www.google.com',
    patternThreshold: 0.7
  });

  useEffect(() => {
    // Initialize Nova Act
    const initNovaAct = async () => {
      try {
        // Generate a unique session ID
        const newSessionId = Math.random().toString(36).substring(7);
        setSessionId(newSessionId);

        // Initialize NovaAct through the API
        const response = await fetch(`${API_BASE_URL}/init`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: newSessionId,
            config: {
              environment: "development",
              logging: { level: "info" },
              browser: {
                starting_page: config.startingUrl,
                headless: true,
                chrome_channel: "chrome",
                screen_width: 1920,
                screen_height: 1080,
              }
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize NovaAct');
        }

        setStatus('ready');
      } catch (error) {
        console.error('Failed to initialize Nova Act:', error);
        setStatus('error');
      }
    };

    initNovaAct();
  }, [config.startingUrl]);

  const handleStart = async () => {
    if (!sessionId) return;
    
    setIsRunning(true);
    setStatus('running');
    
    try {
      // Start NovaAct through the API
      const startResponse = await fetch(`${API_BASE_URL}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!startResponse.ok) {
        throw new Error('Failed to start NovaAct');
      }
      
      // Generate initial thought
      const initialThought = {
        timestamp: Date.now(),
        initialState: "Nova Act initialized and running",
        processingLevel: config.processingLevel,
        iterationCount: 1,
        config: { ...config }
      };
      
      onThoughtGenerated(initialThought);
      
      // Start the action loop
      while (isRunning) {
        const actResponse = await fetch(`${API_BASE_URL}/act`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            session_id: sessionId,
            action: "explore",
            params: {
              depth: config.explorationDepth,
              patternThreshold: config.patternThreshold
            }
          }),
        });

        if (!actResponse.ok) {
          throw new Error('Failed to execute NovaAct action');
        }

        const result = await actResponse.json();
        
        const thought = {
          timestamp: Date.now(),
          initialState: result.result.initialState || "Exploring with Nova Act",
          recursiveElaboration: result.result.recursiveElaboration,
          transformativeInput: result.result.transformativeInput,
          emergentPattern: result.result.emergentPattern,
          processingLevel: config.processingLevel,
          iterationCount: result.result.iterationCount || 1,
          config: { ...config }
        };
        
        onThoughtGenerated(thought);
        
        // Generate Meta-C intervention if enabled
        if (config.enableMetaC && Math.random() < 0.3) {
          const intervention = {
            timestamp: Date.now(),
            type: 'pattern_recognition',
            content: `Observing pattern in thought process: ${thought.emergentPattern?.substring(0, 50)}...`,
            processingLevel: config.processingLevel,
            targetThought: thought.timestamp
          };
          onInterventionGenerated(intervention);
        }
        
        // Wait for the next thought
        await new Promise(resolve => setTimeout(resolve, config.thoughtRate));
      }
    } catch (error) {
      console.error('Error in NovaAct loop:', error);
      setStatus('error');
      setIsRunning(false);
    }
  };

  const handleStop = async () => {
    if (!sessionId) return;
    
    try {
      // Stop NovaAct through the API
      const stopResponse = await fetch(`${API_BASE_URL}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!stopResponse.ok) {
        throw new Error('Failed to stop NovaAct');
      }

      setIsRunning(false);
      setStatus('ready');
    } catch (error) {
      console.error('Error stopping NovaAct:', error);
      setStatus('error');
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      border: `1px solid ${FRACTAL_FRAMEWORK.metaAwareness.color}30`,
      borderRadius: 2,
      backgroundColor: '#fff'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ 
          color: FRACTAL_FRAMEWORK.metaAwareness.color,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          Nova Act Bridge
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="control" label="Control" />
          <Tab value="config" icon={<SettingsIcon />} label="Configuration" />
        </Tabs>
      </Box>
      
      {activeTab === 'control' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color={isRunning ? "error" : "primary"}
              startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
              onClick={isRunning ? handleStop : handleStart}
              disabled={status === 'error' || !sessionId}
            >
              {isRunning ? 'Stop' : 'Start'} Nova Act
            </Button>
            
            {status === 'running' && <CircularProgress size={24} />}
            
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Status: {status}
            </Typography>
          </Box>
          
          {status === 'error' && (
            <Typography variant="body2" color="error">
              An error occurred. Please check the console for details.
            </Typography>
          )}
        </Box>
      )}
      
      {activeTab === 'config' && (
        <NovaActConfig 
          config={config} 
          onConfigChange={setConfig} 
        />
      )}
    </Box>
  );
}; 