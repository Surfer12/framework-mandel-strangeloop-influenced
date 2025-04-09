import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { FRACTAL_FRAMEWORK, THERAPEUTIC_ANCHORS } from '../utils/framework';

export function FractalThoughtProcess({ onSave }) {
  const [thoughtProcess, setThoughtProcess] = React.useState({
    initialState: "",
    recursiveElaboration: "",
    transformativeInput: "",
    emergentPattern: "",
    selectedAnchor: "openness",
    metaAwareness: "",
    processingLevel: "mesoLevel",
    timestamp: Date.now(),
    iterationCount: 1,
  });
  
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = ["initialState", "recursiveElaboration", "transformativeInput", "emergentPattern", "metaAwareness"];
  
  const handleChange = (field) => (event) => {
    setThoughtProcess({
      ...thoughtProcess,
      [field]: event.target.value,
    });
  };
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onSave({
        ...thoughtProcess,
        timestamp: Date.now(),
      });
      
      setThoughtProcess({
        ...thoughtProcess,
        initialState: thoughtProcess.emergentPattern,
        recursiveElaboration: "",
        transformativeInput: "",
        emergentPattern: "",
        metaAwareness: "",
        iterationCount: thoughtProcess.iterationCount + 1,
      });
      setActiveStep(0);
    } else {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(Math.max(0, activeStep - 1));
  };
  
  const currentStep = steps[activeStep];
  const currentFramework = FRACTAL_FRAMEWORK[currentStep];
  const CurrentIcon = currentFramework.icon;
  
  return (
    <Card sx={{ mb: 4, p: 2, backgroundColor: "#fff", border: `1px solid ${currentFramework.color}` }}>
      <CardContent>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: currentFramework.color }}>
          <CurrentIcon /> {currentFramework.label}
          {thoughtProcess.iterationCount > 1 && (
            <Chip 
              size="small" 
              label={`Iteration ${thoughtProcess.iterationCount}`} 
              sx={{ ml: 2, backgroundColor: 'rgba(0,0,0,0.1)' }} 
            />
          )}
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 1, mb: 3, color: 'text.secondary' }}>
          {currentFramework.description}
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder={currentFramework.prompt}
          value={thoughtProcess[currentStep]}
          onChange={handleChange(currentStep)}
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: `${currentFramework.color}50`,
              },
              '&:hover fieldset': {
                borderColor: currentFramework.color,
              },
            }
          }}
        />
        
        {currentStep === 'transformativeInput' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('selectTherapeuticAnchor')} {/* import { useTranslation } from 'react-i18next'; */}
            </Typography>
            <FormControl fullWidth>
              <Select
                value={thoughtProcess.selectedAnchor}
                onChange={handleChange('selectedAnchor')}
              >
                {Object.entries(THERAPEUTIC_ANCHORS).map(([key, anchor]) => {
                  const AnchorIcon = anchor.icon;
                  return (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AnchorIcon />
                        <Typography>{t(anchor.name)}</Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}
        
        {currentStep === 'metaAwareness' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('metaAwareness.processingLevel', 'Processing Level:')}
            </Typography>
            <RadioGroup
              row
              value={thoughtProcess.processingLevel}
              onChange={handleChange('processingLevel')}
            >
              {['microLevel', 'mesoLevel', 'macroLevel'].map((level) => {
                const LevelIcon = FRACTAL_FRAMEWORK[level].icon;
                return (
                  <FormControlLabel
                    key={level}
                    value={level}
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LevelIcon />
                        <Typography variant="body2">{FRACTAL_FRAMEWORK[level].label}</Typography>
                      </Box>
                    }
                  />
                );
              })}
            </RadioGroup>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBackIcon />}
          >
            {t('button.back', 'Back')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? <SaveIcon /> : <ArrowForwardIcon />}
            sx={{ backgroundColor: currentFramework.color }}
          >
            {activeStep === steps.length - 1 ? 'Save & Continue' : 'Next Step'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 