import {
  MenuBookIcon,
  AccountTreeIcon,
  BoltIcon,
  TimelineIcon,
  VisibilityIcon,
  ZoomInIcon,
  ViewCompactIcon,
  ZoomOutIcon,
  AnchorIcon,
  AllInclusiveIcon,
  HubIcon,
  AutoAwesomeIcon,
  AccessibilityNewIcon,
  SettingsEthernetIcon,
  TuneIcon,
  LoopIcon,
} from '@mui/icons-material';

export const FRACTAL_FRAMEWORK = {
  initialState: {
    label: "Initial State (z₀)",
    prompt: "Record your initial thought or observation...",
    description: "The starting point of exploration",
    color: "#E54D2E",
    icon: MenuBookIcon,
  },
  recursiveElaboration: {
    label: "Recursive Elaboration (z²)",
    prompt: "How does this thought expand and connect to itself?",
    description: "Exploring patterns within the initial thought",
    color: "#30A46C",
    icon: AccountTreeIcon,
  },
  transformativeInput: {
    label: "Transformative Input (c)",
    prompt: "What new perspective or information shifts this pattern?",
    description: "Introducing novel elements to transform understanding",
    color: "#6E56CF",
    icon: BoltIcon,
    anchorSelector: true,
  },
  emergentPattern: {
    label: "Emergent Pattern (new z)",
    prompt: "What new understanding emerges from this process?",
    description: "The evolved insight resulting from the iteration",
    color: "#DC8A0C",
    icon: TimelineIcon,
  },
  metaAwareness: {
    label: "Meta-Awareness",
    prompt: "What patterns do you notice in this thinking process itself?",
    description: "Awareness of the fractal patterns in your thought process",
    color: "#1570EF",
    icon: VisibilityIcon,
    metaProperty: true,
  },
  microLevel: {
    label: "Micro Level",
    description: "Focus on individual elements and details",
    color: "#9353D3",
    scaleProperty: true,
    icon: ZoomInIcon,
  },
  mesoLevel: {
    label: "Meso Level",
    description: "Patterns between elements and relationships",
    color: "#7BD959",
    scaleProperty: true,
    icon: ViewCompactIcon,
  },
  macroLevel: {
    label: "Macro Level",
    description: "Overall themes and conceptual frameworks",
    color: "#FFA629",
    scaleProperty: true,
    icon: ZoomOutIcon,
  },
};

export const THERAPEUTIC_ANCHORS = {
  grounding: {
    name: "present_awareness",
    description: "Establishing awareness of the present moment",
    icon: AnchorIcon,
    color: "#3694FF",
  },
  openness: {
    name: "receptivity_to_experience",
    description: "Allowing experiences without resistance",
    icon: AllInclusiveIcon,
    color: "#FF7BBF",
  },
  integration: {
    name: "meaning_construction",
    description: "Connecting insights across domains",
    icon: HubIcon,
    color: "#9AFF8C",
  },
  transformation: {
    name: "pattern_disruption",
    description: "Altering established patterns",
    icon: AutoAwesomeIcon,
    color: "#FFB067",
  },
  embodiment: {
    name: "somatic_awareness",
    description: "Bringing awareness to bodily experience",
    icon: AccessibilityNewIcon,
    color: "#FF9551",
  },
  metaAwareness: {
    name: "pattern_recognition_across_scales",
    description: "Recognizing patterns at different levels",
    icon: SettingsEthernetIcon,
    color: "#67D2FF",
  },
  attentionalFlexibility: {
    name: "dynamic_focus_allocation",
    description: "Shifting attention across levels of detail",
    icon: TuneIcon,
    color: "#9E8CFF",
  },
  iterativeRefinement: {
    name: "recursive_understanding_development",
    description: "Developing understanding through multiple iterations",
    icon: LoopIcon,
    color: "#78D96C",
  },
}; 