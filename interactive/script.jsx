import {
  ThemeProvider,
  CssBaseline,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import BoltIcon from "@mui/icons-material/Bolt";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScrollIcon from "@mui/icons-material/HourglassEmpty";
import TimelineIcon from "@mui/icons-material/Timeline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import * as d3 from "d3";

// Enhanced framework with storytelling elements
const COGNITIVE_FRAMEWORK = {
  understanding: {
    label: "Memory Crystal",
    prompt: "Record the initial memory or observation...",
    metaPrompt: "What echoes does this memory create in your mind?",
    sublevels: ["observation", "context", "emotional_resonance"],
    color: "#E54D2E", // Tomato color from radix
  },
  analysis: {
    label: "Pattern Weaving",
    prompt: "What patterns emerge from this memory?",
    metaPrompt: "How do these patterns connect to the greater tapestry?",
    sublevels: ["connections", "rhythms", "dissonance"],
    color: "#30A46C", // Jade color from radix
  },
  exploration: {
    label: "Timeline Bridging",
    prompt: "How does this moment bridge past and future?",
    metaPrompt: "What possibilities emerge from this intersection?",
    sublevels: ["past_echoes", "future_ripples", "present_moment"],
    color: "#6E56CF", // Purple color from radix
  },
  reflection: {
    label: "Wisdom Synthesis",
    prompt: "What wisdom crystallizes from this experience?",
    metaPrompt: "How does this wisdom transform your understanding?",
    sublevels: ["lessons", "transformations", "questions"],
    color: "#DC8A0C", // Amber color from radix
  },
  meta_observation: {
    label: "Archive Integration",
    prompt: "How does this story connect to the greater Archive?",
    metaPrompt: "What deeper patterns emerge in the collective memory?",
    sublevels: [
      "collective_patterns",
      "individual_threads",
      "future_implications",
    ],
    color: "#1570EF", // Blue color from radix
  },
};

// Helper function to safely get framework data
const getFrameworkData = (thought) => {
  if (!thought || !thought.type || !COGNITIVE_FRAMEWORK[thought.type]) {
    return COGNITIVE_FRAMEWORK.understanding; // Default to understanding if invalid
  }
  return COGNITIVE_FRAMEWORK[thought.type];
};

// Network visualization component
function NetworkVisualizer({ thoughts }) {
  const svgRef = React.useRef();
  const [selectedNode, setSelectedNode] = React.useState(null);

  React.useEffect(() => {
    if (!thoughts.length || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare data
    const nodes = thoughts.map((t) => ({
      id: t.timestamp,
      group: t.type,
      label: t.thought.substring(0, 30) + (t.thought.length > 30 ? "..." : ""),
      data: t,
    }));

    const links = [];
    thoughts.forEach((t) => {
      if (t.path && t.path.length > 1) {
        const parentIndex = thoughts.findIndex(
          (pt) =>
            pt.type === t.path[t.path.length - 2] && pt.level === t.level - 1,
        );
        if (parentIndex !== -1) {
          links.push({
            source: thoughts[parentIndex].timestamp,
            target: t.timestamp,
          });
        }
      }
    });

    // Setup visualization
    const width = svgRef.current.clientWidth;
    const height = 500;

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create node groups
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      )
      .on("click", (event, d) => {
        setSelectedNode(d);
        event.stopPropagation();
      });

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 25)
      .attr("fill", (d) => getFrameworkData(d.data).color)
      .attr("fill-opacity", 0.8)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add labels to nodes
    node
      .append("text")
      .text((d) => d.label)
      .attr("x", 30)
      .attr("y", 5)
      .attr("font-size", "12px")
      .attr("fill", "#fff");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [thoughts]);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        className="w-full h-[500px] bg-neutral-2 rounded-lg"
        onClick={() => setSelectedNode(null)}
      />
      {selectedNode && (
        <Card className="absolute top-4 right-4 w-72 bg-neutral-2 border border-accent-6">
          <div className="p-4 space-y-2">
            <h3 className="font-medium text-neutral-12">
              {getFrameworkData(selectedNode.data).label}
            </h3>
            <p className="text-sm text-neutral-11">
              {selectedNode.data.thought}
            </p>
            {selectedNode.data.metaThought && (
              <p className="text-xs italic text-neutral-11">
                {selectedNode.data.metaThought}
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

// ThoughtCard component for displaying individual thoughts
function ThoughtCard({ thought, onAddMetaThought }) {
  const framework = getFrameworkData(thought);

  return (
    <Card className="bg-neutral-2 border border-accent-6">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-neutral-12">{framework.label}</h3>
          <span className="text-xs text-neutral-11">
            {new Date(thought.timestamp).toLocaleString()}
          </span>
        </div>
        <p className="text-neutral-11">{thought.thought}</p>
        {thought.metaThought && (
          <p className="text-sm italic text-neutral-11">
            {thought.metaThought}
          </p>
        )}
      </div>
    </Card>
  );
}

// ThoughtEntry component for creating new thoughts
function ThoughtEntry({ onSave }) {
  const [type, setType] = React.useState("understanding");
  const [thought, setThought] = React.useState("");
  const [metaThought, setMetaThought] = React.useState("");

  const handleSave = () => {
    if (!thought.trim()) return;

    const newThought = {
      type,
      thought: thought.trim(),
      metaThought: metaThought.trim(),
      timestamp: Date.now(),
      path: [type],
      level: 0,
    };

    onSave(newThought);
    setThought("");
    setMetaThought("");
  };

  const framework = getFrameworkData({ type });

  return (
    <Card className="bg-neutral-2 border border-accent-6">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1"
          >
            {Object.entries(COGNITIVE_FRAMEWORK).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
          <Button variant="primary" onClick={handleSave} icon={<Plus />}>
            Add Entry
          </Button>
        </div>

        <Textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder={framework.prompt}
          rows={3}
        />

        <Textarea
          value={metaThought}
          onChange={(e) => setMetaThought(e.target.value)}
          placeholder={framework.metaPrompt}
          rows={2}
        />
      </div>
    </Card>
  );
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6E56CF', // Purple for primary actions
    },
    secondary: {
      main: '#30A46C', // Jade for secondary elements
    },
    background: {
      default: '#111',
      paper: '#222',
    },
    text: {
      primary: '#fff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
  },
});

function App() {
  const [thoughts, setThoughts] = useLocalStorage("thoughts", []);
  const [view, setView] = React.useState("list"); // "list" or "network"

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <MenuBookIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'serif' }}>
                  The Archives of Transition
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Where memories become wisdom, and wisdom becomes future
                </Typography>
              </Box>
            </Box>
            <RadioGroup 
              row 
              value={view} 
              onChange={(e) => setView(e.target.value)}
            >
              <FormControlLabel 
                value="list" 
                control={<Radio size="small" />} 
                label={<ListIcon />} 
              />
              <FormControlLabel 
                value="network" 
                control={<Radio size="small" />} 
                label={<BubbleChartIcon />} 
              />
            </RadioGroup>
          </Box>
          
          <ThoughtEntry onSave={(newThought) => setThoughts(prev => [...prev, newThought])} />
          
          {view === "list" ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {thoughts.map((thought) => (
                <ThoughtCard 
                  key={thought.timestamp}
                  thought={thought}
                  onAddMetaThought={(original, newThought) => 
                    setThoughts(prev => [...prev, newThought])}
                />
              ))}
            </Box>
          ) : (
            <NetworkVisualizer thoughts={thoughts} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
