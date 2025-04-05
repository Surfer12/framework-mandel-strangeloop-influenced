# Fractal Communication Explorer

A React-based application for exploring and applying fractal communication patterns, inspired by the Mandelbrot set formula z = z² + c.

## Features

- **Fractal Thought Process**: Guide users through the z = z² + c formula for thought exploration
  - Initial State (z₀): Record initial thoughts
  - Recursive Elaboration (z²): Explore patterns within thoughts
  - Transformative Input (c): Introduce novel perspectives
  - Emergent Pattern (new z): Document evolved insights

- **Therapeutic Anchors**: Integrate therapeutic concepts into the thought process
  - Grounding
  - Openness
  - Integration
  - Transformation
  - Embodiment
  - Meta-Awareness
  - Attentional Flexibility
  - Iterative Refinement

- **Multi-Scale Processing**: Work across different levels of detail
  - Micro Level: Individual elements
  - Meso Level: Patterns and relationships
  - Macro Level: Overall themes

- **Fractal Visualization**: Interactive D3.js visualization of thought patterns
  - Zoom and pan capabilities
  - Color-coded nodes by processing level
  - Detailed view of selected thoughts

- **Meta-C Interventions**: Tools for creating awareness-of-awareness interventions
  - Pattern Recognition
  - Bifurcation Points
  - Scale-Shifting
  - Integration
  - Embodiment

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Dependencies

- React 18
- Material-UI
- D3.js
- Vite

## License

MIT 

# Fractal Communication Framework - Icon Fixes

## Issue Resolution

The application was experiencing icon-related import errors that needed to be fixed. Here are the changes made:

### 1. Icon Import Corrections
- Replaced non-existent `Integration` icon with `CallMerge`
- Replaced non-existent `Body` icon with `Accessibility`
- Ensured all icon imports match their Material-UI names exactly

### 2. Icon Reference Updates
All icon references in the framework objects were updated to match their import names:
- Removed all `Icon` suffixes (e.g., `MenuBookIcon` → `MenuBook`)
- Updated icon references in:
  - `FRACTAL_FRAMEWORK`
  - `THERAPEUTIC_ANCHORS`
  - `interventionTypes`

### 3. Specific Changes Made
```javascript
// Before
import { Integration, Body } from '@mui/icons-material';
icon: MenuBookIcon,
icon: IntegrationIcon,
icon: BodyIcon,

// After
import { CallMerge, Accessibility } from '@mui/icons-material';
icon: MenuBook,
icon: CallMerge,
icon: Accessibility,
```

## Current Icon Set
The application now uses the following Material-UI icons:
- MenuBook
- AccountTree
- Bolt
- Timeline
- Visibility
- ZoomIn
- ViewCompact
- ZoomOut
- Anchor
- AllInclusive
- Hub
- AutoAwesome
- AccessibilityNew
- SettingsEthernet
- Tune
- Loop
- Pattern
- ForkRight
- Scale
- CallMerge
- Accessibility 