# ACE Uplift AI - Style Guide

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Code Style & Conventions](#code-style--conventions)
4. [File Organization](#file-organization)
5. [Component Guidelines](#component-guidelines)
6. [Styling Guidelines](#styling-guidelines)
7. [TypeScript Guidelines](#typescript-guidelines)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Testing Guidelines](#testing-guidelines)
11. [Performance Guidelines](#performance-guidelines)
12. [Accessibility Guidelines](#accessibility-guidelines)

## Project Overview

ACE Uplift AI is an IELTS essay analysis and improvement application built with React, TypeScript, and shadcn/ui. The application provides AI-powered essay analysis with band score assessment and generates improved versions for different IELTS bands.

## Technology Stack

### Core Technologies

- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type safety and development experience
- **Vite 5.4.19** - Build tool and development server
- **React Router DOM 6.30.1** - Client-side routing

### UI & Styling

- **shadcn/ui** - Component library built on Radix UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

### State Management & Data

- **React Query (TanStack Query) 5.83.0** - Server state management
- **React Hook Form 7.62.0** - Form handling
- **Zod 3.25.76** - Schema validation

### Additional Libraries

- **Axios 1.11.0** - HTTP client
- **jsPDF 3.0.2** - PDF generation
- **html2canvas 1.4.1** - HTML to canvas conversion
- **Recharts 2.15.4** - Chart components
- **Sonner 1.7.4** - Toast notifications

## Code Style & Conventions

### General Principles

- Use **functional components** with hooks
- Prefer **composition over inheritance**
- Follow **single responsibility principle**
- Write **self-documenting code** with clear naming

### Naming Conventions

#### Files and Directories

```typescript
// Use PascalCase for components
EssayAnalyzer.tsx;
Navigation.tsx;

// Use kebab-case for pages
index.tsx;
about.tsx;
pricing.tsx;

// Use camelCase for utilities and hooks
useToast.ts;
utils.ts;
```

#### Variables and Functions

```typescript
// Use camelCase for variables and functions
const [isAnalyzing, setIsAnalyzing] = useState(false);
const analyzeEssay = async () => {};

// Use PascalCase for components and interfaces
interface EssayAnalyzerProps {
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
}

// Use UPPER_SNAKE_CASE for constants
const MAX_CHECKS = 3;
const ANIMATION_DURATION = 1500;
```

#### CSS Classes

```typescript
// Use Tailwind utility classes with consistent spacing
className = 'bg-background text-foreground p-4 rounded-lg shadow-medium';

// Use semantic class names for complex styling
className = 'gradient-hero bg-clip-text text-transparent';
```

### Import Organization

```typescript
// 1. React and core libraries
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// 3. Icons
import { Copy, Lightbulb, CheckCircle2 } from 'lucide-react';

// 4. Local utilities and hooks
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// 5. Types and interfaces
import type { EssayAnalyzerProps } from './types';
```

## File Organization

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── [feature]/      # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── routes/             # Routing configuration
└── api/                # API integration
```

### Component File Structure

```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types and interfaces
interface ComponentProps {
  // props definition
}

// 3. Component definition
export const Component = ({ prop }: ComponentProps) => {
  // state and hooks
  const [state, setState] = useState();

  // effects
  useEffect(() => {
    // effect logic
  }, []);

  // event handlers
  const handleEvent = () => {
    // handler logic
  };

  // render
  return <div>{/* JSX */}</div>;
};
```

## Component Guidelines

### Component Patterns

#### 1. Forward Ref Pattern

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
```

#### 2. Compound Component Pattern

```typescript
// For complex components with multiple parts
const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: CardHeaderProps) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

const CardContent = ({ className, ...props }: CardContentProps) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
);

export { Card, CardHeader, CardContent };
```

#### 3. Custom Hook Pattern

```typescript
// Extract reusable logic into custom hooks
export const useEssayAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const analyzeEssay = async (essay: string) => {
    setIsAnalyzing(true);
    try {
      // analysis logic
    } catch (error) {
      // error handling
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { isAnalyzing, results, analyzeEssay };
};
```

### Props Guidelines

- Use **destructuring** for props
- Provide **default values** where appropriate
- Use **TypeScript interfaces** for prop types
- Keep props **minimal and focused**

```typescript
interface EssayAnalyzerProps {
  onScoreUpdate: (band: number | null, hasAnalyzed: boolean) => void;
  initialEssay?: string;
  maxChecks?: number;
}

export const EssayAnalyzer = ({
  onScoreUpdate,
  initialEssay = '',
  maxChecks = 3,
}: EssayAnalyzerProps) => {
  // component logic
};
```

## Styling Guidelines

### Design System

#### Color Palette

The project uses a comprehensive HSL-based color system defined in `src/index.css`:

```css
/* Primary Colors */
--primary: 142 76% 36%; /* Green */
--accent: 217 91% 60%; /* Blue */
--success: 142 76% 36%; /* Green */
--warning: 32 95% 44%; /* Orange */
--destructive: 0 84.2% 60.2%; /* Red */

/* Semantic Colors */
--background: 249 100% 98%; /* Light background */
--foreground: 222.2 84% 4.9%; /* Text color */
--muted: 210 40% 96.1%; /* Muted elements */
--border: 214.3 31.8% 91.4%; /* Borders */
```

#### Gradients

```css
--gradient-primary: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 46%));
--gradient-accent: linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%));
--gradient-hero: linear-gradient(135deg, hsl(142 76% 36%), hsl(217 91% 60%));
```

#### Shadows

```css
--shadow-soft: 0 2px 8px hsl(142 76% 36% / 0.08);
--shadow-medium: 0 4px 16px hsl(142 76% 36% / 0.12);
--shadow-strong: 0 8px 32px hsl(142 76% 36% / 0.16);
```

### Tailwind CSS Usage

#### Utility Classes

- Use **semantic color tokens** instead of hardcoded values
- Prefer **responsive design** with mobile-first approach
- Use **consistent spacing** scale

```typescript
// ✅ Good - Using design tokens
className = 'bg-primary text-primary-foreground hover:bg-primary/90';

// ❌ Bad - Hardcoded values
className = 'bg-green-600 text-white hover:bg-green-700';
```

#### Component Variants

Use `class-variance-authority` for component variants:

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

#### Responsive Design

```typescript
// Mobile-first approach
className = 'p-4 sm:p-6 lg:p-8';
className = 'text-sm sm:text-base lg:text-lg';
className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
```

### CSS Custom Properties

- Define **all colors in HSL format**
- Use **CSS custom properties** for design tokens
- Support **dark mode** with class-based switching

```css
:root {
  --primary: 142 76% 36%;
  --primary-foreground: 0 0% 98%;
}

.dark {
  --primary: 142 76% 36%;
  --primary-foreground: 0 0% 98%;
}
```

## TypeScript Guidelines

### Type Safety

- Use **strict TypeScript configuration** where possible
- Define **interfaces for all props and state**
- Use **generic types** for reusable components
- Avoid **any type** unless absolutely necessary

### Interface Definitions

```typescript
// Use descriptive interface names
interface EssayAnalysisResult {
  band: number;
  text: string;
  improvements: string[];
  sentences: SentenceMap[];
}

interface SentenceMap {
  original: string;
  improved: string;
  color: string;
  id: string;
}

// Use union types for constrained values
type AnalysisVariant = 'default' | 'detailed' | 'minimal';
type BandLevel = 7 | 8 | 9;
```

### Type Guards

```typescript
// Use type guards for runtime type checking
const isAnalysisResult = (data: unknown): data is EssayAnalysisResult => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'band' in data &&
    'text' in data &&
    'improvements' in data
  );
};
```

### Generic Components

```typescript
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
}

export const Select = <T>({
  options,
  value,
  onChange,
  getLabel,
  getValue,
}: SelectProps<T>) => {
  // component implementation
};
```

## State Management

### Local State

- Use **useState** for simple component state
- Use **useReducer** for complex state logic
- Keep state **minimal and normalized**

```typescript
// ✅ Good - Minimal state
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ❌ Bad - Redundant state
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [errorMessage, setErrorMessage] = useState('');
```

### Global State

- Use **React Query** for server state
- Use **Context API** for theme/auth state
- Consider **Zustand** for complex client state

### State Updates

```typescript
// Use functional updates for state that depends on previous value
setCount(prev => prev + 1);

// Use callback refs for DOM measurements
const [height, setHeight] = useState(0);
const elementRef = useCallback((node: HTMLElement | null) => {
  if (node) {
    setHeight(node.getBoundingClientRect().height);
  }
}, []);
```

## API Integration

### HTTP Client

- Use **Axios** for HTTP requests
- Implement **request/response interceptors**
- Use **React Query** for caching and synchronization

### API Structure

```typescript
// api/essayAPI.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
});

export const essayAPI = {
  analyze: async (essay: string, options: AnalysisOptions) => {
    const response = await api.post('/analyze', { essay, options });
    return response.data;
  },

  generateTopic: async (category: string) => {
    const response = await api.get(`/topics/${category}`);
    return response.data;
  },
};
```

### Error Handling

```typescript
// Use React Query for automatic error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['essay-analysis', essay],
  queryFn: () => essayAPI.analyze(essay, options),
  enabled: !!essay.trim(),
});

// Handle errors gracefully
if (error) {
  toast({
    title: 'Analysis Failed',
    description: 'Please try again later.',
    variant: 'destructive',
  });
}
```

## Testing Guidelines

### Testing Strategy

- Write **unit tests** for utility functions
- Write **integration tests** for components
- Write **E2E tests** for critical user flows

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { EssayAnalyzer } from './EssayAnalyzer';

describe('EssayAnalyzer', () => {
  it('should analyze essay when submit button is clicked', async () => {
    const mockOnScoreUpdate = jest.fn();
    render(<EssayAnalyzer onScoreUpdate={mockOnScoreUpdate} />);

    const textarea = screen.getByPlaceholderText('Enter your essay...');
    const submitButton = screen.getByRole('button', { name: /analyze/i });

    fireEvent.change(textarea, { target: { value: 'Test essay content' } });
    fireEvent.click(submitButton);

    expect(mockOnScoreUpdate).toHaveBeenCalled();
  });
});
```

### Utility Testing

```typescript
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('base-class', 'additional-class', {
      'conditional-class': true,
    });
    expect(result).toBe('base-class additional-class conditional-class');
  });
});
```

## Performance Guidelines

### Code Splitting

- Use **React.lazy** for route-based code splitting
- Use **dynamic imports** for heavy components
- Implement **preloading** for critical routes

```typescript
// Route-based code splitting
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));

// Wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/about" element={<About />} />
    <Route path="/pricing" element={<Pricing />} />
  </Routes>
</Suspense>;
```

### Memoization

- Use **React.memo** for expensive components
- Use **useMemo** for expensive calculations
- Use **useCallback** for stable function references

```typescript
// Memoize expensive components
const ExpensiveChart = React.memo(({ data }: ChartProps) => {
  // chart rendering logic
});

// Memoize expensive calculations
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    processed: expensiveCalculation(item),
  }));
}, [data]);

// Memoize callback functions
const handleSubmit = useCallback((formData: FormData) => {
  submitForm(formData);
}, []);
```

### Bundle Optimization

- Use **tree shaking** for unused code elimination
- Implement **proper import/export** patterns
- Use **webpack bundle analyzer** for monitoring

## Accessibility Guidelines

### ARIA Attributes

- Use **semantic HTML** elements
- Add **ARIA labels** for screen readers
- Implement **keyboard navigation**

```typescript
// Use semantic HTML
<button
  aria-label="Analyze essay"
  aria-describedby="analysis-description"
  onClick={handleAnalyze}
>
  Analyze Essay
</button>

// Provide descriptions
<div id="analysis-description" className="sr-only">
  Click to analyze your essay and get band score feedback
</div>
```

### Keyboard Navigation

```typescript
// Support keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleAction();
  }
};

// Use focus management
const focusRef = useRef<HTMLButtonElement>(null);
useEffect(() => {
  if (isVisible) {
    focusRef.current?.focus();
  }
}, [isVisible]);
```

### Color and Contrast

- Ensure **sufficient color contrast** (WCAG AA)
- Don't rely **solely on color** for information
- Support **high contrast mode**

```css
/* Use design tokens for consistent contrast */
.text-primary {
  color: hsl(var(--primary));
}

/* Provide alternative indicators */
.status-indicator {
  color: hsl(var(--success));
}

.status-indicator::before {
  content: '✓ ';
}
```

### Screen Reader Support

```typescript
// Use proper heading hierarchy
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Provide alternative text for images
<img src="chart.png" alt="Essay analysis results chart showing band scores" />

// Use live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {analysisStatus}
</div>
```

---

## Best Practices Summary

1. **Consistency**: Follow established patterns and conventions
2. **Simplicity**: Keep components and functions focused and simple
3. **Performance**: Optimize for speed and user experience
4. **Accessibility**: Ensure the app is usable by everyone
5. **Maintainability**: Write code that's easy to understand and modify
6. **Type Safety**: Leverage TypeScript for better development experience
7. **Testing**: Write tests for critical functionality
8. **Documentation**: Document complex logic and APIs

This style guide should be treated as a living document and updated as the project evolves.
