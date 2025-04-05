import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { FRACTAL_FRAMEWORK } from '../utils/framework';

export const NovaActConfig = ({ config, onConfigChange }) => {
  const handleChange = (key, value) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  return (
    <Box sx={{ 
      p: 3, 
      border: `1px solid ${FRACTAL_FRAMEWORK.metaAwareness.color}30`,
      borderRadius: 2,
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Typography variant="h6" sx={{ 
        color: FRACTAL_FRAMEWORK.metaAwareness.color,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2
      }}>
        Nova Act Configuration
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Processing Level</InputLabel>
        <Select
          value={config.processingLevel || 'mesoLevel'}
          onChange={(e) => handleChange('processingLevel', e.target.value)}
          label="Processing Level"
        >
          <MenuItem value="microLevel">Micro Level</MenuItem>
          <MenuItem value="mesoLevel">Meso Level</MenuItem>
          <MenuItem value="macroLevel">Macro Level</MenuItem>
        </Select>
      </FormControl>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Exploration Depth
        </Typography>
        <Slider
          value={config.explorationDepth || 3}
          onChange={(e, value) => handleChange('explorationDepth', value)}
          min={1}
          max={5}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Thought Generation Rate (ms)
        </Typography>
        <Slider
          value={config.thoughtRate || 1000}
          onChange={(e, value) => handleChange('thoughtRate', value)}
          min={500}
          max={5000}
          step={500}
          valueLabelDisplay="auto"
        />
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={config.enableMetaC || false}
            onChange={(e) => handleChange('enableMetaC', e.target.checked)}
          />
        }
        label="Enable Meta-C Interventions"
      />

      <FormControlLabel
        control={
          <Switch
            checked={config.enableVisualization || true}
            onChange={(e) => handleChange('enableVisualization', e.target.checked)}
          />
        }
        label="Enable Real-time Visualization"
      />

      <TextField
        label="Starting URL"
        value={config.startingUrl || 'https://www.google.com'}
        onChange={(e) => handleChange('startingUrl', e.target.value)}
        fullWidth
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Pattern Recognition Threshold
        </Typography>
        <Slider
          value={config.patternThreshold || 0.7}
          onChange={(e, value) => handleChange('patternThreshold', value)}
          min={0}
          max={1}
          step={0.1}
          valueLabelDisplay="auto"
        />
      </Box>
    </Box>
  );
}; 