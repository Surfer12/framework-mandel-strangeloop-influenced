import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Stop as StopIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { FRACTAL_FRAMEWORK } from '../utils/framework';
import { NovaActConfig } from './NovaActConfig';

export const NovaActBridge = ({ onThoughtGenerated, onInterventionGenerated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const [novaAct, setNovaAct] = useState(null);
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
        // Import Nova Act dynamically
        const { NovaAct } = await import('../../../nova-act/nova_act');
        const instance = new NovaAct({
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
        });
        setNovaAct(instance);
        setStatus('ready');
      } catch (error) {
        console.error('Failed to initialize Nova Act:', error);
        setStatus('error');
      }
    };

    initNovaAct();
  }, [config.startingUrl]);

  const handleStart = async () => {
    if (!novaAct) return;
    
    setIsRunning(true);
    setStatus('running');
    
    try {
      await novaAct.start();
      
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
        const result = await novaAct.act("explore", {
          depth: config.explorationDepth,
          patternThreshold: config.patternThreshold
        });
        
        const thought = {
          timestamp: Date.now(),
          initialState: result.initialState || "Exploring with Nova Act",
          recursiveElaboration: result.recursiveElaboration,
          transformativeInput: result.transformativeInput,
          emergentPattern: result.emergentPattern,
          processingLevel: config.processingLevel,
          iterationCount: result.iterationCount || 1,
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
        
        await new Promise(resolve => setTimeout(resolve, config.thoughtRate));
      }
    } catch (error) {
      console.error('Nova Act error:', error);
      setStatus('error');
    }
  };

  const handleStop = async () => {
    if (!novaAct) return;
    
    setIsRunning(false);
    setStatus('stopping');
    
    try {
      await novaAct.stop();
      setStatus('ready');
    } catch (error) {
      console.error('Error stopping Nova Act:', error);
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
              disabled={status === 'error' || !novaAct}
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