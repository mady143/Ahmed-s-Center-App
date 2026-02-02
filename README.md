# Ahmed's Center App

Ahmed's Center App is a premium snack ordering and management system designed for high performance, smooth user experience, and robust business management. Built with a modern tech stack, it features a sleek dark UI with glassmorphism effects, role-based access control, and seamless Supabase integration.

## 🚀 Features

### 👤 Role-Based Access Control (RBAC)
- **Admin**: Full access to product management, sales reports, and system settings.
- **Biller**: Access to shopping cart, order placement, and receipt printing.
- **Guest**: View-only access to the menu with search and category filtering.

### 📦 Product Management (Admin Only)
- **Add Products**: Easily add new snacks with names, descriptions, prices, categories, and images.
- **Edit Products**: Update existing product details in real-time.
- **Delete Products**: Remove items from the menu.
- **Image Hosting**: Integrated with Supabase Storage for fast and reliable image serving.

### 🛒 Ordering System
- **Dynamic Cart**: Add/remove items and adjust quantities with live subtotal calculation.
- **Category Filtering**: Quickly navigate through Veg, Non-Veg, Beverages, and more.
- **Smart Search**: Find specific snacks instantly with real-time search.
- **Payment Options**: Support for Cash and QR Code payment methods.

### 📄 Professional Printing
- **Receipts**: Automated thermal receipt printing with "Ahmed's Center" branding and subtle security watermarks.
- **Sales Reports**: Detailed sales summaries for Admins (Daily, Weekly, Monthly, or Custom ranges) with professional print layouts.

### 🎨 Premium UI/UX
- **Dark Theme**: Eye-catching dark interface optimized for OLED screens.
- **Glassmorphism**: Modern frosted glass effects.
- **Micro-Animations**: Smooth transitions and interactive elements powered by Framer Motion.
- **Mobile Optimized**: Responsive design that feels like a native app on mobile devices.

## 🛠 Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Storage**: [Supabase Storage](https://supabase.com/storage) (for product images)
- **Styling**: Vanilla CSS (Custom Variable System)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Printing**: [React-to-Print](https://github.com/gregnb/react-to-print)

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
- **Storage Bucket**: Create a **public** bucket named `products` in Supabase Storage.
- **Policies**: Apply the SQL scripts provided in the root directory (`recreate_db.sql`, `storage_policy_v2.sql`) to configure Row Level Security (RLS) and Storage access.

## 📱 Usage

1. **Login**: Use your Supabase Auth credentials. Usernames are automatically capitalized for a professional look.
2. **Setup**: Admins can use the "Add Product" button to populate the menu.
3. **Billing**: Select items, choose a payment method in the cart, and print the receipt.
4. **Reports**: Admins can access sales reports via the analytics icon to monitor business performance.

---
*Built with ❤️ for Ahmed's Center.*
