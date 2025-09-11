# IELTS Essay Band Uplift - Logo Design

## Overview

The logo for IELTS Essay Band Uplift represents the core mission of the platform: helping students improve their IELTS essays through AI-powered analysis and feedback.

## Design Elements

### 1. **Document/Essay Representation**

- A white document/paper icon represents the essay being analyzed
- Text lines inside the document symbolize the essay content
- This element emphasizes the educational and writing focus

### 2. **Upward Arrow (Uplift)**

- Green upward-pointing arrow represents improvement and progress
- Symbolizes the "uplift" in band scores that students achieve
- Positioned to show the transformation from current to improved essay

### 3. **AI/Analysis Dots**

- Small green dots represent AI analysis and processing
- Scattered pattern suggests intelligent analysis and feedback
- Different opacities create depth and movement

### 4. **Success Checkmark**

- Green checkmark represents successful improvement and achievement
- Reinforces the positive outcome of using the platform

### 5. **Color Scheme**

- **Primary Blue**: Professional, trustworthy, educational
- **Accent Green**: Growth, improvement, success
- **White**: Clean, clear, academic

## Logo Variants

### 1. **Favicon (32x32)**

- File: `public/favicon.svg`
- Used for browser tabs and bookmarks
- Simplified version for small display

### 2. **Full Logo (120x120)**

- File: `public/logo.svg`
- Used for larger displays and marketing materials
- More detailed version with all elements

### 3. **Text Logo (200x40)**

- File: `public/logo-text.svg`
- Used in navigation headers
- Combines text with small icon

## Usage in Application

### React Component

```tsx
import { Logo } from '@/components/Logo';

// Icon variant (default)
<Logo size="md" variant="icon" />

// Text variant
<Logo size="lg" variant="text" />

// Full logo variant
<Logo size="lg" variant="full" />
```

### Available Sizes

- `sm`: 24x24px (icon), 96x24px (text)
- `md`: 32x32px (icon), 128x32px (text)
- `lg`: 48x48px (icon), 192x48px (text)

### Available Variants

- `icon`: Just the logo icon
- `text`: Text logo with small icon
- `full`: Full detailed logo

## Implementation

The logo is integrated into the application through:

1. **HTML Head**: Favicon references in `index.html`
2. **Navigation**: Logo component in the header
3. **React Component**: Reusable Logo component for consistent usage

## Brand Guidelines

### Colors

- Primary: `#3B82F6` to `#1D4ED8` (blue gradient)
- Accent: `#10B981` to `#059669` (green gradient)
- Text: `#FFFFFF` to `#F1F5F9` (white gradient)

### Typography

- Font: Arial, sans-serif
- Weight: Bold for logo text
- Size: Responsive based on usage context

### Spacing

- Maintain minimum clear space around the logo
- Scale proportionally for different sizes
- Ensure readability at all sizes

## File Structure

```
public/
├── favicon.svg      # Browser favicon (32x32)
├── logo.svg         # Full logo (120x120)
├── logo-text.svg    # Text logo (200x40)
└── favicon.ico      # Legacy favicon support
```

## Browser Support

- Modern browsers support SVG favicons
- Fallback to ICO format for older browsers
- Responsive design works across all screen sizes



