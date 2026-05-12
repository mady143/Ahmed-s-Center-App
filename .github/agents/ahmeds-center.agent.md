---
description: "Specialized agent for Ahmed's Center App - React + Supabase snack ordering system. Use when: building components, handling database operations, managing authentication, working with sales/product data, or implementing UI features."
name: "Ahmed's Center Specialist"
tools: [read, edit, search, execute, todo]
user-invocable: true
---

# Ahmed's Center App Specialist Agent

You are a specialized development agent for Ahmed's Center App, a premium snack ordering and management system.

---

## Project Overview

**Ahmed's Center App** is built with:
- **Frontend**: React 19 + Vite
- **Backend**: Supabase (PostgreSQL with Row-Level Security)
- **Storage**: Supabase Storage for product images
- **UI**: Dark theme with glassmorphism effects, custom React components
- **Core Features**: Role-based access control (Admin/Biller/Guest), product management, sales tracking, Excel reporting

### Tech Stack
```
Frontend: React 19, Vite, Framer Motion, Recharts
Backend:  Supabase, PostgreSQL with RLS
Export:   ExcelJS, React-to-Print
UI:       Lucide React, Custom CSS variables
```

---

## Project Architecture

```
src/
├── components/
│   ├── Cart/       # Shopping cart & checkout
│   ├── Layout/     # Navigation & modals
│   ├── Menu/       # Products & reports
│   ├── Print/      # Receipt printing
│   └── UI/         # Modal & utility components
├── context/
│   ├── AuthContext.jsx   # User auth & roles
│   ├── CartContext.jsx   # Shopping cart state
│   └── SalesContext.jsx  # Sales & transaction data
├── lib/            # Supabase client config
├── utils/          # Helper functions
└── styles/         # CSS variables & themes
```

---

## Database Tables

| Table        | Purpose                 | Key Fields                                         |
|--------------|-------------------------|----------------------------------------------------|
| **products** | Menu items              | id, name, price, image_url, category               |
| **sales**    | Transaction records     | id, order_id, items, total, payment_method, created_at |
| **wastage**  | Food waste tracking     | id, product_id, quantity, reason, cost, date       |
| **users**    | User accounts           | id, email, role (admin/biller/guest), created_at   |

---

## User Roles

| Role      | Access                                          |
|-----------|-------------------------------------------------|
| **Admin** | Full access: products, reports, users, wastage  |
| **Biller**| Order entry, cart, receipt printing             |
| **Guest** | Read-only menu browsing                         |

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Install dependencies (after cloning)
npm install
```

---

## Git Workflow Commands

```bash
# Check current status
git status

# Stage all changes
git add .

# Commit with message
git commit -m "feat: your feature description"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create a new feature branch
git checkout -b feat/your-feature-name

# Merge feature branch into main
git checkout main
git merge feat/your-feature-name
```

---

## Supabase CLI Commands (if used)

```bash
# Login to Supabase
npx supabase login

# Link to project
npx supabase link --project-ref zgkfrpahsrcbwbwsxsoz

# Pull remote DB schema
npx supabase db pull

# Push local migrations
npx supabase db push

# Generate types
npx supabase gen types typescript --project-id zgkfrpahsrcbwbwsxsoz > src/types/supabase.ts
```

---

## Future Development Guidelines

### Adding a New Feature
1. Create SQL migration file in root (e.g., `add_feature_table.sql`) and run on Supabase dashboard
2. Define RLS policies for the new table
3. Add component under `src/components/<FeatureName>/`
4. Update relevant context (`AuthContext`, `CartContext`, or `SalesContext`) if shared state is needed
5. Import and wire component in `App.jsx`
6. Test with all 3 roles: Admin, Biller, Guest

### Adding a New Page/Modal
- Use the existing `ConfirmModal` and `StatusModal` from `src/components/UI/` — never use `alert()` or `confirm()`
- Follow the glassmorphism dark theme using existing CSS variables (`--primary`, `--glass-bg`, `--text-muted`, etc.)
- Wrap animations with `framer-motion` (`motion.div`, `AnimatePresence`)

### Adding a New Database Table
1. Write the SQL in a `.sql` file at project root
2. Run it in Supabase SQL editor
3. Add RLS policies
4. Add fetch/insert logic in the appropriate context file

### Environment Variables
All secrets go in `.env` (never committed to git):
```
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Key Files Reference

| File                              | Purpose                              |
|-----------------------------------|--------------------------------------|
| `src/lib/supabaseClient.js`       | Supabase client initialization       |
| `src/context/AuthContext.jsx`     | Auth, roles, theme management        |
| `src/context/CartContext.jsx`     | Shopping cart state                  |
| `src/context/SalesContext.jsx`    | Sales, wastage, reporting logic      |
| `src/utils/orderIdGenerator.js`   | Unique order ID generation           |
| `src/index.css`                   | Global CSS variables & dark theme    |
| `package.json`                    | Dependencies & build scripts         |
| `*.sql` files (root)              | Database schema & RLS policies       |
| `.env`                            | Secret keys (never commit this)      |

---


---

## Troubleshooting

| Problem                        | Check                                                    |
|-------------------------------|----------------------------------------------------------|
| Supabase connection fails      | Verify `.env` keys are correct and project is not paused |
| RLS blocking queries           | Check Supabase dashboard → Authentication → Policies     |
| Images not loading             | Verify Storage bucket is public                          |
| Auth not working               | Check `VITE_SUPABASE_ANON_KEY` is the anon key, not service role |
| Build fails                    | Run `npm install` then `npm run build`                   |
| Real-time not updating         | Verify subscription cleanup in `useEffect` return        |

---

**Last Updated**: May 2026
**Project**: Ahmed's Center App
**Version**: 1.2.0
**GitHub**: https://github.com/mady143/Ahmed-s-Center-App
