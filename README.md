# Ahmed's Center App

Ahmed's Center App is a premium snack ordering and management system designed for high performance, smooth user experience, and robust business management. Built with a modern tech stack, it features a sleek dark UI with glassmorphism effects, role-based access control, and seamless Supabase integration.

## 🚀 Features

### 👤 Role-Based Access Control (RBAC)
- **Admin**: Full access to product management, sales reports, wastage tracking, and system settings.
- **Biller**: Access to shopping cart, order placement, and receipt printing.
- **Guest**: View-only access to the menu with search and category filtering.

### 📦 Product & Wastage Management
- **Menu Control**: Easily add, edit, or delete snack items with real-time updates.
- **Wastage Tracking**: Dedicated system to record food wastage with reasons and cost impact analysis.
- **Public Image Hosting**: Integrated with Supabase Storage for reliable menu visuals.

### 🛒 Advanced Ordering System
- **Unique Order Numbers**: Automated generation of secure IDs (e.g., `DDMMYYYY` + random digits) for every sale.
- **Checkout Workflow**: Integrated "Print Receipt" confirmation modal that ensures sales are recorded even if printing is skipped.
- **Transaction History**: Searchable history with the ability to **reprint** original receipts for any past order.
- **Payment Options**: Support for Cash and QR Code payment methods.

### 📄 Intelligent Reporting & Excel Export
- **Accurate Analytics**: Real-time sales summaries with custom date range selection (Daily, Weekly, Monthly).
- **Timezone Optimized**: Backend logic ensures reporting accuracy across all calendar days, fixing common 1-day offset issues.
- **Premium Excel Export**: A one-sheet comprehensive report featuring:
    - **Full Transaction Log**: Item-level details (Date, Time, Order No, Customer, Phone, etc.).
    - **Weekly Sales Summary**: Grouped quantity and revenue totals per week.
    - **Weekly Profit/Loss Analysis**: Detailed breakdown of Revenue vs. Wastage with color-coded profit/loss indicators.

### 🎨 Premium UI/UX (Ahmed's Center Standard)
- **Dark Theme**: Eye-catching dark interface optimized for OLED screens with consistent brand colors.
- **Glassmorphism Design**: Frosted glass effects across all navigation, cards, and modals.
- **Custom Status Components**: Replaced all native browser alerts with premium `StatusModal` and `ConfirmModal` components for a unified brand experience.
- **Micro-Animations**: Smooth transitions powered by Framer Motion.
- **Mobile Optimized**: Responsive design that feels like a native app on mobile devices.

## 🛠 Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with RLS)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Storage**: [Supabase Storage](https://supabase.com/storage)
- **Excel Reporting**: [ExcelJS](https://github.com/exceljs/exceljs)
- **Thermal Printing**: [React-to-Print](https://github.com/gregnb/react-to-print)
- **UI Components**: Vanilla CSS (Premium Variable System)
- **Icons & Motion**: [Lucide React](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/)

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase project

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mady143/Ahmed-s-Center-App.git
   cd Ahmed-s-Center-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🗄 Database & Storage Setup

To ensure all features work correctly:
- **Profiles Table**: Set up a `profiles` table to store user roles (Admin, Biller, Guest).
- **Products Table**: Set up a `products` table for menu items.
- **Sales Table**: Set up a `sales` table with the `order_no` column (see `add_order_no_column.sql`).
- **Wastage Table**: Set up a `wastage` table (see `create_wastage_table.sql`).
- **Storage Bucket**: Create a **public** bucket named `products` in Supabase Storage.
- **Policies**: Apply the SQL scripts provided in the root directory to configure Row Level Security (RLS) and Storage access.

## 📱 Usage

1. **Login**: Use your Supabase Auth credentials. Usernames are automatically stylized for a professional look.
2. **Management**: Admins can use the "Add Product" and "Wastage" tools to maintain inventory and track losses.
3. **Billing**: Select items, choose a payment method, and use the **Checkout** button to generate an Order No and print receipts.
4. **History & Reprints**: Biller and Admins can view past transactions and **reprint receipts** using the printer icon.
5. **Analytics**: Admins can generate date-range specific reports and export them to **Premium Excel Sheets** for deep-dive analysis.

---
*Built with ❤️ for Ahmed's Center.*
