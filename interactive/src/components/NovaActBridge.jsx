import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, CircularProgress, Tabs, Tab } from '@mui/material';
import { PlayArrow as PlayArrowIcon, Stop as StopIcon, Settings as SettingsIcon } from '@mui/icons-material';
import * as d3 from 'd3';
import { NovaActAPIBridge } from '../lib/NovaActAPIBridge';
import { NovaActConfig } from './NovaActConfig';

export const NovaActBridge = ({ onThoughtGenerated, onInterventionGenerated }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('idle');
  const [novaAct, setNovaAct] = useState(null);
  const [activeTab, setActiveTab] = useState('control');
  const svgRef = useRef(null);
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
        const instance = new NovaActAPIBridge({
          baseURL: 'http://localhost:8000',
          timeout: 30000
        });

        await instance.initialize({
          environment: "development",
          logging: { level: "info" },
          browser: {
            starting_page: config.startingUrl,
            headless: true,
            chrome_channel: "chrome",
            screen_width: 1920,
            screen_height: 1080,
          }
        });

        setNovaAct(instance);
        setStatus('ready');
        
        // Initialize D3 visualization
        if (svgRef.current) {
          d3.select(svgRef.current)
            .attr('width', 600)
            .attr('height', 400)
            .style('background', '#f8f9fa');
        }
      } catch (error) {
        console.error('Failed to initialize Nova Act:', error);
        setStatus('error');
      }
    };

    initNovaAct();

    // Cleanup on unmount
    return () => {
      if (novaAct) {
        novaAct.stop().catch(console.error);
        novaAct.cancelAllRequests();
      }
    };
  }, [config.startingUrl]);

  const updateVisualization = (patterns) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;

    // Update circles based on patterns
    const circles = svg.selectAll('circle')
      .data(patterns, (d, i) => i);

    // Enter new circles
    circles.enter()
      .append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 0)
      .style('fill', 'rgba(144, 238, 144, 0.3)')
      .style('stroke', '#4CAF50')
      .transition()
      .duration(1000)
      .attr('r', d => d.radius * (1 + d.complexity * 0.2))
      .attr('transform', d => `rotate(${d.angle}, ${centerX}, ${centerY})`);

    // Update existing circles
    circles
      .transition()
      .duration(1000)
      .attr('r', d => d.radius * (1 + d.complexity * 0.2))
      .attr('transform', d => `rotate(${d.angle}, ${centerX}, ${centerY})`);

    // Remove old circles
    circles.exit()
      .transition()
      .duration(500)
      .attr('r', 0)
      .remove();
  };

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
        updateVisualization(result.patterns || []);
        
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
    if (!novaAct) return;
    
    try {
      await novaAct.stop();
      setIsRunning(false);
      setStatus('ready');
    } catch (error) {
      console.error('Error stopping NovaAct:', error);
      setStatus('error');
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="CONTROL" value="control" />
          <Tab label="CONFIGURATION" value="configuration" />
        </Tabs>
      </Box>

      {activeTab === 'control' && (
        <Box>
          <Button
            variant="contained"
            color={isRunning ? "error" : "primary"}
            startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
            onClick={isRunning ? handleStop : handleStart}
            disabled={status === 'error' || !novaAct}
          >
            {isRunning ? 'Stop' : 'Start'} Nova Act
          </Button>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>
            Status: {status}
          </Typography>
          
          <Box sx={{ mt: 3, width: '100%', height: 400, display: 'flex', justifyContent: 'center' }}>
            <svg ref={svgRef}></svg>
          </Box>
        </Box>
      )}

      {activeTab === 'configuration' && (
        <NovaActConfig config={config} onConfigChange={setConfig} />
      )}
    </Box>
  );
}; 