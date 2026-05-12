# Ahmed's Center App - Copilot Instructions

## Project Overview
Ahmed's Center App is a premium snack ordering and management system built with:
- **Frontend**: React 19 + Vite (modern, fast development)
- **Backend**: Supabase (PostgreSQL with Row-Level Security)
- **Storage**: Supabase Storage for product images
- **UI**: Dark theme with glassmorphism effects, custom React components
- **Features**: Role-based access control (Admin/Biller/Guest), product management, sales tracking, Excel reporting

## Core Architecture

### Context & State Management
- `AuthContext.jsx`: User authentication and role management
- `CartContext.jsx`: Shopping cart state
- `SalesContext.jsx`: Sales data and transaction management

### Key Directories
- `components/`: Reusable UI components (Cart, Layout, Menu, Print, UI utilities)
- `utils/`: Helper functions (orderIdGenerator.js for unique order IDs)
- `lib/`: Supabase client setup and utilities
- `styles/`: Global styling with CSS variables

## Supabase Integration Guidelines

### Database Tables (Based on SQL files)
- **Products table**: Menu items with pricing and images stored in Supabase Storage
- **Sales/Orders table**: Transaction records with order numbers, items, and payment method
- **Wastage table**: Food wastage tracking with cost analysis
- **Users table**: User accounts with role-based access (Admin/Biller/Guest)

### Common Supabase Queries
When working with Supabase:
1. **Always use Row-Level Security (RLS)** - Check existing policies in SQL files
2. **Use Supabase Auth** - Authenticate via `supabase.auth.getUser()`
3. **Handle real-time updates** - Use `.on()` for live data subscriptions
4. **Proper error handling** - Wrap queries in try-catch and check for `error` objects
5. **Storage operations** - Use `supabase.storage.from('bucket-name')` for image uploads

Example pattern:
```javascript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value);

if (error) {
  console.error('Supabase error:', error);
  // Handle error
}
```

### Auth & Permissions
- **Admin**: Full system access (product CRUD, all reports, settings)
- **Biller**: Order entry and receipt printing only
- **Guest**: Read-only menu access

Check `AuthContext.jsx` for role-based rendering logic.

## React Component Patterns

### Styling Approach
- Use CSS variables defined in `src/index.css` (glassmorphism color palette)
- Dark theme with consistent spacing and typography
- Responsive design for mobile-first approach

### Modal Components
- Use custom `ConfirmModal` and `StatusModal` instead of `alert()` or `confirm()`
- Located in `components/UI/`
- Provide consistent UX across the app

### Form & Input Handling
- Controlled components with state management
- Validation before Supabase submission
- Real-time feedback via StatusModal

## Development Workflow

### Adding New Features
1. **Plan the Supabase schema** first - Create/update SQL migrations
2. **Create UI components** - React component with forms/displays
3. **Integrate with context** - Update relevant Context (AuthContext, SalesContext, etc.)
4. **Add Supabase queries** - Use RLS-protected queries
5. **Test with different roles** - Ensure role-based access works

### SQL Migrations
- Files: `*.sql` in root directory
- Always include RLS policies
- Test migrations on Supabase dashboard first
- Add comments for complex logic

### Printing & Exports
- Receipt printing: Use `react-to-print` library
- Excel reports: Use `exceljs` for comprehensive data export
- See `components/Print/Receipt.jsx` for pattern

## Code Quality
- Run `npm lint` to check ESLint rules
- Follow React best practices (hooks, functional components)
- Use semantic HTML for accessibility
- Keep components focused and reusable

## Build & Deploy
- **Development**: `npm run dev` (Vite hot reload)
- **Build**: `npm run build` (optimized production bundle)
- **Preview**: `npm run preview`

## Common Issues & Solutions

### Supabase Connection Issues
- Check `VITE_SUPABASE_ANON_KEY` in environment
- Verify RLS policies allow current user's role
- Check network tab for CORS errors

### State Not Updating
- Ensure Context Provider wraps components
- Check context consumption with `useContext()`
- Verify state setters are called in useEffect cleanup

### Image Upload/Download
- Use Supabase Storage bucket (check bucket name in policy files)
- Generate signed URLs for private images
- Implement proper error handling for 404s

## Key Files to Know
- `supabaseClient.js`: Supabase initialization
- `AuthContext.jsx`: Authentication state & role management
- `package.json`: Dependencies and scripts
- `.sql` files: Database schema and RLS policies

---

**Last Updated**: May 2026
**Project Lead**: Ahmed's Center Team
