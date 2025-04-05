import React from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import * as d3 from 'd3';
import { FRACTAL_FRAMEWORK, THERAPEUTIC_ANCHORS } from '../utils/framework';

export function FractalVisualization({ thoughts }) {
  const svgRef = React.useRef();
  const [selectedNode, setSelectedNode] = React.useState(null);
  
  React.useEffect(() => {
    if (!thoughts.length || !svgRef.current) return;
    
    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Group thoughts by iteration series
    const iterationSeries = {};
    thoughts.forEach(thought => {
      const seriesId = thought.seriesId || thought.timestamp;
      if (!iterationSeries[seriesId]) {
        iterationSeries[seriesId] = [];
      }
      iterationSeries[seriesId].push(thought);
    });
    
    // Create hierarchical data structure
    const hierarchyData = {
      name: "Thought Patterns",
      children: Object.values(iterationSeries).map(series => ({
        name: `Series ${series[0].timestamp}`,
        children: series.map(thought => ({
          name: thought.initialState.substring(0, 30),
          value: 1,
          data: thought,
          color: FRACTAL_FRAMEWORK[thought.processingLevel || "mesoLevel"].color
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
    
    // Add circles for each node
    const node = g.selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("click", (event, d) => {
        setSelectedNode(d.data);
        event.stopPropagation();
      });
    
    // Add circles with different styling based on depth
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => d.data.color || (d.depth === 0 ? "transparent" : d.depth === 1 ? "#222" : "#444"))
      .attr("stroke", d => d.depth === 0 ? "transparent" : d.depth === 1 ? "#fff" : d.data.color || "#888")
      .attr("stroke-width", d => d.depth === 0 ? 0 : 2)
      .attr("fill-opacity", d => 1 - d.depth * 0.2);
    
    // Add labels for nodes
    node.filter(d => d.depth < 3)
      .append("text")
      .attr("dy", d => d.depth === 0 ? "-0.5em" : "0.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", d => Math.max(8, 18 - d.depth * 4))
      .attr("fill", "#fff")
      .text(d => d.data.name?.substring(0, Math.max(3, 20 - d.depth * 5)));
    
    // Add fractal patterns for connected thought processes
    const links = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4)
      .selectAll("path")
      .data(root.links().filter(d => d.source.depth < 2))
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
  }, [thoughts]);
  
  return (
    <Box sx={{ position: "relative", width: "100%", height: "600px", mt: 4 }}>
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%", backgroundColor: "#111" }}
        onClick={() => setSelectedNode(null)}
      />
      
      {selectedNode && selectedNode.data && (
        <Card sx={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          maxWidth: 350, 
          backgroundColor: "#222",
          border: `1px solid ${selectedNode.data.color || "#fff"}`
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: selectedNode.data.color || "#fff" }}>
              {selectedNode.data.initialState?.substring(0, 50)}
            </Typography>
            
            {selectedNode.data.recursiveElaboration && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.recursiveElaboration.color }}>
                  Recursive Elaboration (z²):
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {selectedNode.data.recursiveElaboration}
                </Typography>
              </Box>
            )}
            
            {selectedNode.data.transformativeInput && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: FRACTAL_FRAMEWORK.transformativeInput.color }}>
                  Transformative Input (c):
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