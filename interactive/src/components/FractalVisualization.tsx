import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import * as d3 from 'd3';
import { FRACTAL_FRAMEWORK, THERAPEUTIC_ANCHORS } from '../utils/framework';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface Thought {
  seriesId?: string;
  timestamp: string;
  initialState: string;
  processingLevel?: string;
  recursiveElaboration?: string;
  transformativeInput?: string;
  emergentPattern?: string;
  metaAwareness?: string;
  selectedAnchor?: string;
}

interface FractalVisualizationProps {
  thoughts: Thought[];
}

export function FractalVisualization({ thoughts }: FractalVisualizationProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = React.useState<d3.HierarchyNode<any> | null>(null);
  const { user, isAuthorized } = useAuth();
  const { t } = useTranslation();
  
  // Authorization check function
  const checkNodeAuthorization = (node: d3.HierarchyNode<any>) => {
    if (!user || !isAuthorized) return false;
    
    // Check if user has access to the thought's processing level
    const processingLevel = node.data?.processingLevel || 'mesoLevel';
    const userAccessLevels = user.accessLevels || [];
    
    return userAccessLevels.includes(processingLevel);
  };
  
  React.useEffect(() => {
    if (!thoughts.length || !svgRef.current || !user || !isAuthorized) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Group thoughts by iteration series with authorization check
    const iterationSeries: Record<string, Thought[]> = {};
    thoughts.forEach(thought => {
      if (!checkNodeAuthorization({ data: thought } as d3.HierarchyNode<any>)) return;
      
      const seriesId = thought.seriesId || thought.timestamp;
      if (!iterationSeries[seriesId]) {
        iterationSeries[seriesId] = [];
      }
      iterationSeries[seriesId].push(thought);
    });
    
    // Create hierarchical data structure with authorization
    const hierarchyData = {
      name: "Thought Patterns",
      children: Object.values(iterationSeries).map(series => ({
        name: `Series ${series[0].timestamp}`,
        children: series.map(thought => ({
          name: thought.initialState.substring(0, 30),
          value: 1,
          data: thought,
          color: FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].color,
        }))
      }))
    };
    
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0);
    
    const tree = d3.tree()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));
    
    tree(root);
    
    const svg = d3.select(svgRef.current);
    const g = svg.append("g");
    
    // Add nodes with authorization check
    const nodes = g.selectAll(".node")
      .data(root.descendants().filter(d => {
        if (!checkNodeAuthorization(d)) {
          return false;
        }
        return d.depth < 3;
      }))
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x + margin.left},${d.y + margin.top})`);
    
    nodes.append("circle")
      .attr("r", d => Math.max(3, 8 - d.depth * 2))
      .attr("fill", d => d.data.color || "#fff");
    
    nodes.filter(d => {
      if (!checkNodeAuthorization(d)) {
        return false;
      }
      return d.depth < 3;
    })
      .append("text")
      .attr("dy", d => d.depth === 0 ? "-0.5em" : "0.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", d => Math.max(8, 18 - d.depth * 4)) 
      .text(d => {
        if (!checkNodeAuthorization(d)) {
          return '';
        }
        return d.data.name?.substring(0, Math.max(3, 20 - d.depth * 5));
      });
    
    // Add fractal patterns for connected thought processes with authorization
    const links = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .selectAll("path")
      .data(root.links().filter(d => d.source.depth < 2 && checkNodeAuthorization(d.source) && checkNodeAuthorization(d.target)))
      .join("path")
      .attr("d", d => {   
        const sourceX = d.source.x + margin.left;
        const sourceY = d.source.y + margin.top;
        const targetX = d.target.x + margin.left;
        const targetY = d.target.y + margin.top;
        
        return `M${sourceX},${sourceY}
                C${sourceX},${(sourceY + targetY) / 2}
                 ${targetX},${(sourceY + targetY) / 2}
                 ${targetX},${targetY}`;
      })
      .attr("stroke", d => d.target.data.color || "#fff") 
      .attr("stroke-width", d => Math.max(1, 3 - d.source.depth));    
    
    // Zoom functionality
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => { 
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Cleanup when component unmounts
    return () => {
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.on(".zoom", null);
      }
    };
  }, [thoughts, user, isAuthorized]);
  
  if (!user || !isAuthorized) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Please log in to view the visualization</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ position: "relative", width: "100%", height: "600px", mt: 4 }}>
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%", backgroundColor: "#fff" }}
        onClick={() => setSelectedNode(null)}
      />
      
      {selectedNode && selectedNode.data && checkNodeAuthorization({ data: selectedNode.data } as d3.HierarchyNode<any>) && (
        <Card sx={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          maxWidth: 350, 
          backgroundColor: "#fff",
          border: `1px solid ${selectedNode.data.color || "#333"}`
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: selectedNode.data.color || "#333" }}>
              {selectedNode.data.initialState?.substring(0, 50)}
            </Typography>
            
            {selectedNode.data.recursiveElaboration && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.recursiveElaboration.color }}>
                  {t('recursiveElaboration')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.recursiveElaboration}
                </Typography>
              </Box>
            )}
            
            {selectedNode.data.transformativeInput && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.transformativeInput.color }}>
                  {t('transformativeInput')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.transformativeInput}
                </Typography>
                {selectedNode.data.selectedAnchor && (
                  <Chip 
                    size="small" 
                    icon={THERAPEUTIC_ANCHORS[selectedNode.data.selectedAnchor].icon}
                    label={THERAPEUTIC_ANCHORS[selectedNode.data.selectedAnchor].name}
                    sx={{ mt: 1, backgroundColor: `${THERAPEUTIC_ANCHORS[selectedNode.data.selectedAnchor].color}30` }}
                  />
                )}
              </Box>
            )}
            
            {selectedNode.data.emergentPattern && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.emergentPattern.color }}>
                  {t('emergentPattern', 'Emergent Pattern (new z):')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.emergentPattern}
                </Typography>
              </Box>
            )}
            
            {selectedNode.data.metaAwareness && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.metaAwareness.color }}>
                  {t('metaAwareness', 'Meta-Awareness:')}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.metaAwareness}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
} 