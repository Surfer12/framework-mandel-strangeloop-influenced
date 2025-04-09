import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Repeat as RepeatIcon,
  AltRoute as AltRouteIcon,
  ZoomOutMap as ZoomOutMapIcon,
  MergeType as MergeTypeIcon,
  Spa as SpaIcon,
} from '@mui/icons-material';
import { FRACTAL_FRAMEWORK } from '../utils/framework';

const interventionTypes = {
  patternRecognition: {
    label: "Pattern Recognition Meta-C",
    prompt: "Identify a recurring pattern in the conversation...",
    description: "Makes invisible recursion visible",
    color: "#FF5050",
    icon: RepeatIcon,
  },
  bifurcationPoint: {
    label: "Bifurcation Point Meta-C",
    prompt: "Identify a choice point or opportunity for transformation...",
    description: "Creates conscious choice at critical junctures",
    color: "#FFD700",
    icon: AltRouteIcon,
  },
  scaleShifting: {
    label: "Scale-Shifting Meta-C",
    prompt: "Suggest shifting attention to a different scale...",
    description: "Helps group move between micro, meso, and macro perspectives",
    color: "#50C878",
    icon: ZoomOutMapIcon,
  },
  integration: {
    label: "Integration Meta-C",
    prompt: "Connect diverse inputs that remain fragmented...",
    description: "Helps the group perceive emerging coherence",
    color: "#9370DB",
    icon: MergeTypeIcon,
  },
  embodiment: {
    label: "Embodiment Meta-C",
    prompt: "Connect discussion to physical/emotional experience...",
    description: "Connects cognitive understanding with somatic awareness",
    color: "#FF7F50",
    icon: SpaIcon,
  },
};

export function MetaCInterventionTool({ thoughts, onSaveIntervention }) {
  const [intervention, setIntervention] = React.useState({
    type: "patternRecognition",
    content: "",
    targetThought: null,
    processingLevel: "mesoLevel",
  });
  
  const [open, setOpen] = React.useState(false);
  
  const handleSubmit = () => {
    if (!intervention.content.trim()) return;
    
    onSaveIntervention({
      ...intervention,
      timestamp: Date.now(),
    });
    
    setIntervention({
      ...intervention,
      content: "",
    });
    
    setOpen(false);
  };
  
  const currentType = interventionTypes[intervention.type];
  const CurrentIcon = currentType.icon;
  
  return (
    <>
      <Button 
        variant="contained" 
        startIcon={<VisibilityIcon />}
        onClick={() => setOpen(true)}
        sx={{ 
          mt: 2, 
          backgroundColor: "#1570EF",
          '&:hover': {
            backgroundColor: "#1264D3"
          }
        }}
      >
        {t('metaC.createIntervention')}
      </Button>
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ backgroundColor: "#fff", color: currentType.color }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrentIcon /> {currentType.label}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: "#fff", pt: 2 }}>
          <DialogContentText sx={{ color: 'text.secondary', mb: 3 }}>
            {currentType.description}
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('metaC.interventionType')}</InputLabel>
            <Select
              value={intervention.type}
              onChange={(e) => setIntervention({ ...intervention, type: e.target.value })}
            >
              {Object.entries(interventionTypes).map(([key, type]) => {
                const TypeIcon = type.icon;
                return (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TypeIcon />
                      <Typography>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('interventionContent')} // import { useTranslation } from 'react-i18next';
            placeholder={currentType.prompt}
            value={intervention.content}
            onChange={(e) => setIntervention({ ...intervention, content: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('processingLevel')}</InputLabel>
            <Select
              value={intervention.processingLevel}
              onChange={(e) => setIntervention({ ...intervention, processingLevel: e.target.value })}
            >
              {['microLevel', 'mesoLevel', 'macroLevel'].map((level) => {
                const LevelIcon = FRACTAL_FRAMEWORK[level].icon;
                return (
                  <MenuItem key={level} value={level}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LevelIcon />
                      <Typography>{FRACTAL_FRAMEWORK[level].label}</Typography>
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('targetThoughtOptional')}</InputLabel> {/* import { useTranslation } from 'react-i18next'; */}
            <Select
              value={intervention.targetThought || ""}
              onChange={(e) => setIntervention({ ...intervention, targetThought: e.target.value })}
            >
              <MenuItem value="">
                <em>{t('noneGeneralIntervention')}</em>
              </MenuItem>
              {thoughts.map((thought) => (
                <MenuItem key={thought.timestamp} value={thought.timestamp}>
                  {thought.initialState?.substring(0, 50) || t('untitledThought')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: "#fff", p: 2 }}>
          <Button onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            sx={{ backgroundColor: currentType.color }}
          >
            {t('metaC.createIntervention')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 