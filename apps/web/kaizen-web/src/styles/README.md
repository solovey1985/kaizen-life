# Kaizen Life Styles Architecture

This document describes the reorganized CSS/SCSS architecture for the Kaizen Life application, following common sense practices and maintainable structure.

## File Structure

```
src/styles/
├── styles.scss              # Main entry point
├── _variables.scss          # Design system variables
├── _mixins.scss            # Reusable mixins and functions
├── _base.scss              # Base styles and resets
├── _layouts.scss           # Layout systems and containers
├── _components.scss        # Reusable component styles
└── pages/                  # Page-specific styles
    ├── _page.scss
    ├── _login.scss
    ├── _login-material.scss
    ├── _dashboard.scss
    ├── _dashboard-material.scss
    └── _dialogs.scss
```

## Import Order (ITCSS Pattern)

The main `styles.scss` file imports files in this specific order:

1. **Variables** - Design tokens, colors, typography, spacing
2. **Mixins** - Reusable functions and mixins
3. **Base** - Resets, typography, base element styles
4. **Layouts** - Page layouts, containers, grid systems
5. **Components** - Reusable UI components
6. **Pages** - Page-specific styles
7. **Material Theme** - Angular Material theme configuration

## Key Features

### Variables (`_variables.scss`)
- **Brand colors** - Kaizen primary, accent, and semantic colors
- **Typography** - Font families, weights, and sizes
- **Spacing** - Consistent spacing scale
- **Border radius** - Standardized border radius values
- **Shadows** - Material Design elevation shadows
- **Z-index** - Organized z-index scale
- **Breakpoints** - Responsive design breakpoints
- **Transitions** - Animation timing functions

### Mixins (`_mixins.scss`)
- **Responsive** - `@include respond-to(breakpoint)`
- **Cards** - `@include card($shadow, $radius)`
- **Buttons** - `@include button-reset`
- **Layout** - `@include flex-center`, `@include full-height`
- **Effects** - `@include hover-effect`, `@include elevation`
- **Animations** - `@include slide-up`, `@include fade-in`

### Base Styles (`_base.scss`)
- CSS resets and normalizations
- Typography base styles
- Form element defaults
- Utility classes

### Layouts (`_layouts.scss`)
- Page layout systems
- Container and grid systems
- Dashboard and login layouts
- Responsive layout patterns

### Components (`_components.scss`)
- Reusable UI components
- Dialog systems
- Form components
- Navigation components
- Table components
- Badge components

## Usage Examples

### Using Variables
```scss
.my-component {
  color: $kaizen-primary;
  padding: $spacing-lg;
  border-radius: $border-radius-md;
  font-family: $font-family-primary;
}
```

### Using Mixins
```scss
.my-card {
  @include card($shadow-lg, $border-radius-xl);
  @include respond-to(md) {
    padding: $spacing-xl;
  }
}

.my-button {
  @include button-reset;
  @include hover-effect(background-color, var(--mat-sys-primary-container));
}
```

### Using Components
```scss
// Use existing component classes
.my-form {
  .field {
    @extend .kaizen-form-field;
  }
}
```

## Benefits

1. **Maintainability** - Single source of truth for design tokens
2. **Consistency** - Standardized patterns and components
3. **Scalability** - Easy to add new components and pages
4. **Performance** - Reduced CSS duplication
5. **Developer Experience** - Clear structure and reusable patterns

## Migration Notes

- All page-specific files now import shared variables and mixins
- Duplicated color variables have been removed
- Layout styles are centralized in `_layouts.scss`
- Component styles are centralized in `_components.scss`
- The main `styles.scss` follows ITCSS import order

## Future Improvements

1. Add CSS custom properties support for better runtime theming
2. Implement CSS modules or styled-components for component isolation
3. Add more utility classes for rapid development
4. Consider adding animation keyframes library
5. Implement CSS-in-TypeScript type safety