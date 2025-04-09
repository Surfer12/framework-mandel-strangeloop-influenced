import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import * as d3 from 'd3';
import { FRACTAL_FRAMEWORK, THERAPEUTIC_ANCHORS } from '../utils/framework';
import { useAuth } from '../hooks/useAuth'; // Import auth hook

export function FractalVisualization({ thoughts }) {
  const svgRef = React.useRef();
  const [selectedNode, setSelectedNode] = React.useState(null);
  const { user, isAuthorized } = useAuth(); // Get auth context
  
  // Authorization check function
  const checkNodeAuthorization = (node) => {
    if (!user) return false;
    
    // Check if user has access to the thought's processing level
    const processingLevel = node.data?.processingLevel || 'mesoLevel';
    const userAccessLevels = user.accessLevels || [];
    
    return userAccessLevels.includes(processingLevel);
  };
  
  React.useEffect(() => {
    if (!thoughts.length || !svgRef.current || !user) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Group thoughts by iteration series with authorization check
    const iterationSeries = {};
    thoughts.forEach(thought => {
      if (!checkNodeAuthorization({ data: thought })) return;
      
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
          authorized: checkNodeAuthorization({ data: thought })
        }))
      }))
    };
    
    // Setup visualization dimensions
    const width = svgRef.current.clientWidth;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    
    // Create fractal tree layout
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
    
    // Create a circular packing layout
    const pack = d3.pack()
      .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
      .padding(3);
    
    // Prepare hierarchical data
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);
    
    // Apply the pack layout
    pack(root);
    
    // Create container for the visualization
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Add circles for each node with enhanced authorization checks
    const node = g.selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => {
        if (!checkNodeAuthorization(d)) {
          console.warn('Unauthorized access attempt to node:', d.data.name);
          return "translate(0,0)";
        }
        return `translate(${d.x},${d.y})`;
      })
      .on("click", (event, d) => {
        if (!checkNodeAuthorization(d)) {
          console.warn('Unauthorized click attempt on node:', d.data.name);
          event.preventDefault();
          return;
        }
        setSelectedNode(d.data);
        event.stopPropagation();
      });
    
    // Add circles with different styling based on depth and authorization
    node.append("circle")
      .attr("r", d => {
        if (!checkNodeAuthorization(d)) {
          return 0;
        }
        return d.r;
      })
      .attr("fill", d => {
        if (!checkNodeAuthorization(d)) {
          return "transparent";
        }
        return d.data.color || (d.depth === 0 ? "transparent" : d.depth === 1 ? "#f5f5f5" : "#e0e0e0");
      })
      .attr("stroke", d => {
        if (!checkNodeAuthorization(d)) {
          return "transparent";
        }
        return d.depth === 0 ? "transparent" : d.depth === 1 ? "#333" : d.data.color || "#666";
      })
      .attr("stroke-width", d => {
        if (!checkNodeAuthorization(d)) {
          return 0;
        }
        return d.depth === 0 ? 0 : 2;
      })
      .attr("fill-opacity", d => {
        if (!checkNodeAuthorization(d)) {
          return 0;
        }
        return 1 - d.depth * 0.2;
      });
    
    // Add labels for nodes with authorization check
    node.filter(d => {
      if (!checkNodeAuthorization(d)) {
        return false;
      }
      return d.depth < 3;
    })
      .append("text")
      .attr("dy", d => d.depth === 0 ? "-0.5em" : "0.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", d => Math.max(8, 18 - d.depth * 4))
      .attr("fill", "#333")
      .text(d => d.data.name?.substring(0, Math.max(3, 20 - d.depth * 5)));
    
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
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    // Cleanup when component unmounts
    return () => {
      svg.on(".zoom", null);
    };
  }, [thoughts, user]);
  
  if (!user) {
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
      
      {selectedNode && selectedNode.data && checkNodeAuthorization({ data: selectedNode.data }) && (
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
                  {t('transformativeInput')} {/* import { useTranslation } from 'react-i18next'; */}
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
                  Emergent Pattern (new z):
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.emergentPattern}
                </Typography>
              </Box>
            )}
            
            {selectedNode.data.metaAwareness && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.metaAwareness.color }}>
                  Meta-Awareness:
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