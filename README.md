# Keshavan Realty — Premium Real Estate Website (Pune, Maharashtra)

> **Trust | Transparency | Value**

A modern, high-performance, responsive real estate web application built with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, designed specifically for **Keshavan Realty** operating across Pune, Maharashtra, India.

---

## 🏗️ Project Architecture & Tech Stack

- **Framework**: React.js 18 + Vite 6
- **Language**: TypeScript with strict types
- **Styling**: Tailwind CSS with custom brand design system
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **State & Storage**: Custom React hooks + LocalStorage (wishlist & demonstration enquiries)
- **Backend-Ready**: Clean decoupled service layer ready for Supabase

---

## 🎨 Brand Identity & Color Palette

- **Primary Orange**: `#FF6A00` (Calls-to-action, highlights, active states)
- **Secondary Orange**: `#F28C00` (Accents)
- **Dark Charcoal**: `#15191E` (Navbar, hero backdrop, typography, footer)
- **Light Grey**: `#F5F6F7` (Section backgrounds & pill controls)
- **Subtle Green**: `#10B981` (Verification badges & nature accents inspired by the logo)

---

## 📂 Project Directory Structure

```text
keshavan-realty/
├── public/
│   ├── keshavan-logo.png      # Official brand logo
│   └── ...
├── src/
│   ├── config/
│   │   └── business.ts        # Centralized business contact & coverage config
│   ├── types/
│   │   └── property.ts        # TypeScript interfaces for properties, filters, & forms
│   ├── data/
│   │   └── properties.ts      # 16 rich realistic demonstration properties across Pune
│   ├── utils/
│   │   └── formatters.ts      # Indian currency (Lakh/Cr), area, & WhatsApp utilities
│   ├── services/
│   │   ├── propertyService.ts # Decoupled query, facet filter & sorting engine
│   │   └── enquiryService.ts  # Form validation & mock submission layer (Supabase-ready)
│   ├── lib/
│   │   └── supabase.ts        # Supabase client wrapper & environment hook
│   ├── hooks/
│   │   ├── useProperties.ts   # Property data fetching & filter state hook
│   │   └── useWishlist.ts     # Persistent saved properties hook
│   ├── components/
│   │   ├── Navbar.tsx         # Responsive navbar with dropdown & mobile drawer
│   │   ├── Footer.tsx         # Comprehensive footer with disclaimer & modals
│   │   ├── PropertyCard.tsx   # Premium property card with specs & wishlist
│   │   ├── PropertyGrid.tsx   # Responsive 3-col grid with loading skeletons
│   │   ├── PropertySearch.tsx # Hero search panel with multi-facet filters
│   │   ├── PropertyFilters.tsx# Desktop sidebar & mobile drawer filters
│   │   ├── PropertyGallery.tsx# Gallery with thumbnail bar & lightbox preview
│   │   ├── EnquiryForm.tsx    # Indian phone validation & enquiry submission
│   │   ├── QuickEnquiryModal.tsx # Quick enquiry popup
│   │   ├── WishlistDrawer.tsx # Slide-out saved properties drawer
│   │   ├── CategoryCard.tsx   # 8 Category cards with hover animations
│   │   └── LocationCard.tsx   # Pune neighborhood cards
│   ├── pages/
│   │   ├── Home.tsx           # Premium homepage with hero, categories, FAQ, etc.
│   │   ├── Properties.tsx     # All properties listing with multi-facet filters
│   │   ├── PropertyDetails.tsx# Dynamic listing details with specs, gallery & map
│   │   ├── About.tsx          # About Us page with brand philosophy & coverage
│   │   ├── Contact.tsx        # Contact page with details, form & map preview
│   │   ├── ListProperty.tsx   # Property owner submission form with disclaimer
│   │   └── NotFound.tsx       # Custom 404 page
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Running the Project Locally

1. **Navigate to the project folder**:
   ```bash
   cd e:\keshavan-realty
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at: `http://localhost:5173/`

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## ⚡ Connecting to Live Supabase (Phase 2)

When ready to connect to a live Supabase database:
1. Create a `.env` file in `e:\keshavan-realty` with:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Replace mock queries in `src/services/propertyService.ts` and `src/services/enquiryService.ts` with Supabase client calls (`supabase.from('properties').select('*')`).
3. The frontend is fully decoupled and will transition seamlessly without changing any UI components!
