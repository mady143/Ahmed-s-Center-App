# React Component Instructions

Apply to: `src/components/**/*.jsx`

Use when: Building new UI components, adding component features, refactoring existing components.

## Component Structure

All components should follow this pattern:
```javascript
import { useState, useContext, useEffect } from 'react';
import { SomeContext } from '../context/SomeContext';
import StatusModal from '../UI/StatusModal';
import './ComponentName.css';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState('initial');
  const { contextValue } = useContext(SomeContext);

  useEffect(() => {
    // Initialize or fetch data
  }, []);

  const handleAction = async () => {
    try {
      // Do work
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="component-container">
      {/* JSX */}
    </div>
  );
}
```

## Modal Components
Always use custom `ConfirmModal` or `StatusModal` instead of `alert()`:

```javascript
import ConfirmModal from '../UI/ConfirmModal';
import StatusModal from '../UI/StatusModal';

// In component:
const [showConfirm, setShowConfirm] = useState(false);
const [status, setStatus] = useState(null);

// Usage:
<ConfirmModal
  isOpen={showConfirm}
  title="Confirm Action"
  message="Are you sure?"
  onConfirm={handleConfirm}
  onCancel={() => setShowConfirm(false)}
/>

<StatusModal
  message={status}
  type="success|error|info"
  onClose={() => setStatus(null)}
/>
```

## Styling Guidelines
1. Use CSS variables from `src/index.css` (dark theme palette)
2. Component-specific styles in `ComponentName.css`
3. Follow BEM naming convention: `.component__element--modifier`
4. Responsive: mobile-first approach

Example CSS:
```css
.button {
  padding: var(--spacing-2);
  background: var(--color-primary);
  color: var(--color-text);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.button:hover {
  background: var(--color-primary-hover);
}
```

## Form Handling
```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate
  if (!formData.name) {
    setStatus({ type: 'error', message: 'Name required' });
    return;
  }

  // Submit to Supabase
  try {
    // database operation
    setStatus({ type: 'success', message: 'Success!' });
  } catch (error) {
    setStatus({ type: 'error', message: error.message });
  }
};
```

## Context Usage
Import and use context for shared state:
```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { SalesContext } from '../context/SalesContext';

// In component:
const { user, role } = useContext(AuthContext);
const { cart, addToCart } = useContext(CartContext);
const { sales, addSale } = useContext(SalesContext);
```

## Accessibility
- Use semantic HTML (`<button>`, `<form>`, `<label>`)
- Add `aria-label` for icon-only buttons
- Ensure proper heading hierarchy
- Test keyboard navigation

## Performance
- Memoize expensive components: `memo(ComponentName)`
- Use `useCallback` for event handlers passed to child components
- Lazy load routes with `lazy()` and `Suspense`
- Avoid inline function definitions in JSX
