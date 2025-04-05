import React from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  MenuBook as MenuBookIcon,
  Timeline as TimelineIcon,
  BubbleChart as BubbleChartIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { CssBaseline } from '@mui/material';
import { useLocalStorage } from './utils/useLocalStorage';
import { FractalThoughtProcess } from './components/FractalThoughtProcess';
import { FractalVisualization } from './components/FractalVisualization';
import { MetaCInterventionTool } from './components/MetaCInterventionTool';
import { FRACTAL_FRAMEWORK, interventionTypes } from './utils/framework';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  console.log('App component rendering');
  
  const [thoughts, setThoughts] = useLocalStorage("fractal_thoughts", []);
  const [interventions, setInterventions] = useLocalStorage("meta_c_interventions", []);
  const [view, setView] = React.useState("fractal");
  
  console.log('Current state:', { thoughts, interventions, view });
  
  const handleSaveThought = (newThought) => {
    console.log('Saving new thought:', newThought);
    setThoughts(prev => {
      const updatedThoughts = [...prev, newThought];
      console.log('Updated thoughts:', updatedThoughts);
      return updatedThoughts;
    });
  };
  
  const handleSaveIntervention = (newIntervention) => {
    setInterventions(prev => [...prev, newIntervention]);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
                  Fractal Communication Explorer
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Where thoughts evolve through z = z² + c
                </Typography>
              </Box>
            </Box>
            
            <Tabs 
              value={view} 
              onChange={(e, newValue) => setView(newValue)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab value="fractal" icon={<TimelineIcon />} label="Fractal Process" />
              <Tab value="visualization" icon={<BubbleChartIcon />} label="Visualization" />
              <Tab value="intervention" icon={<VisibilityIcon />} label="Meta-C" />
            </Tabs>
          </Box>
          
          {view === "fractal" && (
            <>
              <FractalThoughtProcess onSave={handleSaveThought} />
              
              <Typography variant="h6" sx={{ mt: 4, mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                Recent Thought Processes ({thoughts.length})
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {thoughts.slice(-5).reverse().map((thought, index) => (
                  <Card key={thought.timestamp || index} sx={{ 
                    backgroundColor: "#fff", 
                    border: `1px solid ${FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].color}30` 
                  }}>
                    <CardContent>
                      <Typography variant="h6">
                        {thought.initialState?.substring(0, 50)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.recursiveElaboration.color }}>
                            Recursive Elaboration (z²)
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {thought.recursiveElaboration?.substring(0, 100)}...
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.transformativeInput.color }}>
                            Transformative Input (c)
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {thought.transformativeInput?.substring(0, 100)}...
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.emergentPattern.color }}>
                            Emergent Pattern (new z)
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {thought.emergentPattern?.substring(0, 100)}...
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Chip 
                          size="small" 
                          icon={FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].icon}
                          label={FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].label}
                          sx={{ backgroundColor: `${FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].color}30` }}
                        />
                        
                        <Chip 
                          size="small" 
                          label={`Iteration ${thought.iterationCount || 1}`}
                          sx={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </>
          )}
          
          {view === "visualization" && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Fractal Thought Visualization
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                This visualization represents your thought processes as fractal patterns. Zoom and pan to explore connections. Click on nodes to view details.
              </Typography>
              <FractalVisualization thoughts={thoughts} />
            </>
          )}
          
          {view === "intervention" && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Meta-C Interventions
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Meta-C interventions introduce awareness of the thinking process itself, creating transformative shifts in perspective. 
                Use these for collaborative conversations to help groups recognize patterns and make conscious choices.
              </Typography>
              
              <MetaCInterventionTool thoughts={thoughts} onSaveIntervention={handleSaveIntervention} />
              
              <Typography variant="h6" sx={{ mt: 4, mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 1 }}>
                Recent Interventions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {interventions.slice(-5).reverse().map((intervention) => {
                  const interventionType = interventionTypes[intervention.type];
                  const InterventionIcon = interventionType.icon;
                  return (
                    <Card key={intervention.timestamp} sx={{ 
                      backgroundColor: "#fff", 
                      border: `1px solid ${interventionType.color}` 
                    }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ 
                          color: interventionType.color,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <InterventionIcon /> {interventionType.label}
                        </Typography>
                        
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {intervention.content}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
                          <Chip 
                            size="small" 
                            icon={FRACTAL_FRAMEWORK[intervention.processingLevel].icon}
                            label={FRACTAL_FRAMEWORK[intervention.processingLevel].label}
                            sx={{ backgroundColor: `${FRACTAL_FRAMEWORK[intervention.processingLevel].color}30` }}
                          />
                          
                          {intervention.targetThought && (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Targeted at: {
                                thoughts.find(t => t.timestamp === intervention.targetThought)?.initialState.substring(0, 30) || "Unknown thought"
                              }...
                            </Typography>
                          )}
                          
                          <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
                            {new Date(intervention.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </>
          )}
          
          {/* Footer with fractal model reference */}
          <Box sx={{ mt: 8, pt: 3, borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Based on the Fractal Communication Framework: z = z² + c
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
              Where z = current understanding, z² = recursive elaboration, c = novel input, and new z = evolved insight
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 