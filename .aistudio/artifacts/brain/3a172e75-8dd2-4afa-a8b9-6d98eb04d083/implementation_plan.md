# Daddy's Kitchen – Restaurant & Online Ordering Platform

A production-grade restaurant web application and ordering platform for **Daddy's Kitchen – The Cafe and Restaurant** (Kalikanagar, Butwal, Nepal), featuring real-time menu management, multi-channel ordering (Delivery, Takeaway Pickup, and Dine-in QR Table Ordering), eSewa and Khalti digital wallet sandbox integration, full product customizer, order status tracking, and a comprehensive administration dashboard.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your specifications and regional operational model:

- **Confirmed Fulfillment Modes**:
  1. **Home Delivery** (covering Butwal zones: Kalikanagar, Golpark, Traffic Chowk, Tilottama, Manigram, Deepnagar with zone-based delivery fees and minimum orders).
  2. **Takeaway Pickup** (quick order ahead with preparation countdown).
  3. **Dine-In QR Table Ordering** (table selector/scanner with direct kitchen ticket dispatch).
- **Confirmed Payment Integrations**:
  1. **Cash on Delivery (COD)** & **Cash on Pickup (COP)**.
  2. **Interactive eSewa Sandbox & Khalti Sandbox** test gateways with OTP/PIN simulation and instant server-verified callback handling.
  3. **Admin Payment Gateway Settings** to configure merchant keys and toggle test mode vs. live merchant parameters.
- **Confirmed Menu Catalog**:
  Authentic Butwal cafe menu seeded with real Daddy's Kitchen signatures: Momos (Steam, Kothey, Jhol, Chilli), Chowmein & Thukpa, Daddy's Crispy Chicken Burger, Pizzas, Nepali Khaja (Chicken & Peanut Sadeko, Chilly), Butter Chicken with Naan, and specialty Espresso & Smoothies.

---

## 1. Overview & Core Concept

- **What It Does**:
  Daddy's Kitchen Web Application provides customers in Butwal with a seamless digital ordering experience across mobile and desktop. Customers can browse verified food and beverage offerings, customize portions and spicy levels/add-ons, place orders for delivery, takeaway, or direct table service, pay via eSewa, Khalti, or Cash, and track their order progress live through an unguessable tracking token. For the business owner and kitchen team, it provides an admin dashboard to control live orders, update kitchen statuses, manage menus, set daily operating hours in Asia/Kathmandu time, and analyze sales.
- **Target Audience / Persona**:
  - **Diners & Fast-Food Enthusiasts in Butwal**: Young professionals, students, families, and night-owls seeking quick lunch, evening khaja, or late-night dinners.
  - **In-Restaurant Guests**: Diners scanning QR codes at tables to place orders without waiting for waitstaff.
  - **Restaurant Owners & Managers**: Need real-time visibility into sales, pending tickets, out-of-stock items, and delivery riders.
- **Key Value**:
  Replaces fragmented phone/messaging ordering with an automated, tamper-proof ordering engine that enforces pricing consistency, computes exact zone delivery fees, eliminates kitchen misunderstandings, and tracks every order status from grill to doorstep.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Browsing**:
   - Customer lands on the storefront featuring high-impact photography of sizzling momos, burgers, and hand-crafted drinks.
   - Category navigation (All, Momos, Fast Food & Burgers, Noodles & Chowmein, Nepali Khaja & Starters, Main Course, Beverages & Cafe).
   - Instant search with dietary filter (Veg / Non-Veg) and sorting (Popularity, Price low-to-high, Preparation time).
2. **Item Customization & Cart**:
   - Clicking a dish opens the **Contiguous Purchase Module Modal**: size selection (Half / Full / Steamed / Fried / Jhol), spice level (Mild, Medium, Spicy, Nepali Fire), add-ons (Extra Chutney, Cheese, Extra Patty), special instructions.
   - Immediate cart slide-out drawer with itemized line items, quantity steppers, subtotal, and minimum order progress indicator.
3. **Multi-Channel Checkout**:
   - Fulfillment selector:
     - **Delivery**: Recipient name, phone (+977), Butwal area/zone selector, street address, landmark.
     - **Takeaway Pickup**: Name, phone, estimated pickup time.
     - **Dine-In QR Table**: Table number (1–20), diner name, phone.
   - Payment method selection: Cash on Delivery/Pickup, eSewa Wallet, or Khalti Wallet.
   - If eSewa or Khalti is chosen, an interactive verified sandbox modal simulates the wallet login, OTP verification, and server callback handshake.
4. **Order Confirmation & Live Tracking**:
   - Generates unique order number (e.g., `#DK-8924`) and private tracking token (`trk_...`).
   - Visual progress timeline: `Pending Confirmation` $\to$ `Confirmed` $\to$ `Preparing in Kitchen` $\to$ `Ready for Pickup / Out for Delivery` $\to$ `Completed`.
   - Direct WhatsApp support link prepopulated with order number and live status refresh.
5. **Admin Operations (`/admin`)**:
   - Overview metrics: Today's Orders, Gross & Net Revenue (NPR), Active Kitchen Queue, Low Stock Alerts.
   - Live Order Management: Filter by status, one-click progress buttons (`Confirm`, `Start Prep`, `Ready`, `Dispatch`, `Complete`, `Cancel`), kitchen print ticket generator.
   - Menu Editor: Add/edit dishes, upload images, adjust pricing, toggle availability, edit add-ons and allergen notes.
   - Business Settings: Asia/Kathmandu opening/closing hours, Butwal delivery zones & fees, payment gateway toggles.

### Visual Identity & Theme

- **Aesthetic Direction**: Modern Himalayan Urban Bistro — combining rich coffee-house warmth, crisp typography, and high-contrast food photography with clean, anti-slop editorial restraint.
- **Color Palette (60-30-10 Rule)**:
  - **60% Canvas**: Crisp off-white `#FAFAF7` background with warm paper undertones for daylight warmth, paired with deep slate `#0F172A` in admin/dark accents.
  - **30% Structural Surfaces**: Clean white cards `#FFFFFF` with hairline borders (`border-stone-200/80`), subtle stone dividers, and charcoal `#1C1917` typography.
  - **10% Brand Accent**: Rich spiced terracotta `#C2410C` and warm roasted coffee `#78350F` strictly reserved for primary CTA buttons, active category indicators, and cart accents.
- **Typography & Hierarchy**:
  - **Display / Headers**: `Plus Jakarta Sans` (Bold 700 / SemiBold 600) with balanced line wraps (`text-wrap: balance`).
  - **Body Prose**: `Plus Jakarta Sans` / `Inter` (Regular 400 / Medium 500) with comfortable line height (1.6).
  - **Pricing & Numbers**: Strict tabular numerals (`font-mono tabular-nums font-semibold`) for all NPR prices, line totals, and metrics.
- **Design System Restraint (Anti-Slop Compliance)**:
  - Zero static pill enclosures: metadata rendered as clean unboxed text with subtle typographic dot separators (`Non-Veg · 15 min prep · Spicy`).
  - No decorative status dots or pulsing glowing animations on static content.
  - Strict Top Bar Contract: Zone 1 Wordmark ("Daddy's Kitchen"), Zone 2 single-line nav links (Menu, About, Contact, Track Order), Zone 3 primary action (Cart & Order Now).
  - Seamless responsive mobile navigation capped at $<15\%$ mobile viewport height.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Fulfillment Modalities (Delivery, Pickup, Dine-In)
- **Chosen Approach**: Single unified checkout flow with a 3-tab fulfillment switch (`Delivery`, `Takeaway Pickup`, `Dine-In Table`).
- **Why**: Allows Daddy's Kitchen to serve neighborhood deliveries, walk-in takeaway customers, and seated dine-in customers with one cohesive system, without requiring separate apps.
- **Alternatives Considered**: Separate dine-in portal vs online delivery. Rejected because a single responsive interface reduces customer friction and centralizes kitchen queues.

### Decision 2: Digital Wallets (eSewa & Khalti) Architecture
- **Chosen Approach**: Robust payment provider abstraction with built-in interactive sandbox testing plus database-driven merchant configuration.
- **Why**: Allows instant testing and live demonstrations of Nepal's two leading payment wallets with full server-side verification and idempotency keys, while allowing the restaurant owner to enter production merchant keys in Admin Settings when ready.
- **Alternatives Considered**: Client-only fake success alert. Rejected because security rules prohibit trusting client-side payment assertions.

### Decision 3: Relational Persistence & State Model
- **Chosen Approach**: Robust Express + TypeScript backend with a normalized relational database schema (using SQLite/PostgreSQL-compatible relational engine), transaction-backed order processing, and audit logs.
- **Why**: Guarantees atomic order creation, preserves historical price snapshots (`product_name_snapshot`, `unit_price_snapshot`), prevents duplicate charges via idempotency keys, and eliminates floating-point calculation errors.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DADDY'S KITCHEN SYSTEM                          │
├──────────────────────────────────┬─────────────────────────────────────┤
│      CUSTOMER WEB / MOBILE       │          ADMIN DASHBOARD            │
│  - Hero, Story, Butwal Context   │  - Live Order Board & Kitchen View  │
│  - Filterable Menu & Customizer  │  - Menu & Add-on Management         │
│  - Cart, Delivery/Table Selector │  - Delivery Zones & Fees            │
│  - eSewa / Khalti / Cash Checkout│  - Asia/Kathmandu Operating Hours   │
│  - Unpredictable Order Tracker   │  - Printable Kitchen Tickets        │
└─────────────────┬────────────────┴──────────────────┬──────────────────┘
                  │                                   │
                  ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS FULL-STACK BACKEND API                     │
│  - /api/v1/restaurant (Settings, Hours, Zones, Info)                  │
│  - /api/v1/categories & /api/v1/products (with variants & add-ons)     │
│  - /api/v1/orders (Transactional creation, idempotency validation)    │
│  - /api/v1/orders/track/:token (Safe tracking without PII leakage)    │
│  - /api/v1/payments (eSewa & Khalti sandbox callback verification)     │
│  - /api/v1/admin/* (Orders, Status Transitions, Menu CRUD, Settings)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               NORMALIZED RELATIONAL DATA STORAGE & SEED                │
│  - Categories, Products, Variants, AddOnGroups, AddOnOptions           │
│  - Orders, OrderItems (Snapshots), OrderStatusHistory, Payments        │
│  - DeliveryZones (Butwal Suburbs), BusinessHours, RestaurantSettings   │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Entities & Relationships

1. **`categories`**: `id`, `name`, `slug`, `description`, `display_order`, `is_active`.
2. **`products`**: `id`, `category_id`, `name`, `slug`, `description`, `base_price` (numeric NPR), `image_url`, `is_vegetarian`, `spice_level`, `preparation_time_minutes`, `is_available`, `is_featured`.
3. **`product_variants`**: `id`, `product_id`, `name` (e.g. "Steamed (10 pcs)", "Kothey Fried", "Jhol Gravy", "Regular", "Large"), `price_adjustment`.
4. **`add_on_groups` & `add_on_options`**: Extra chutney, melting cheese, double patty, dips.
5. **`orders`**:
   - `id` (UUID), `order_number` (e.g., `#DK-1042`), `tracking_token` (unpredictable token).
   - `customer_name`, `customer_phone`, `fulfillment_type` (`delivery` | `takeaway` | `dine_in`), `table_number`.
   - `delivery_zone_id`, `delivery_address`, `order_status` (`pending`, `confirmed`, `preparing`, `ready`, `delivered`, `cancelled`).
   - `subtotal`, `delivery_fee`, `discount_amount`, `total_amount` in NPR.
   - `payment_method` (`cash_on_delivery`, `cash_on_pickup`, `esewa`, `khalti`), `payment_status` (`pending`, `paid`, `refunded`).
   - `idempotency_key`, `created_at`, `updated_at`.
6. **`order_items`**: `id`, `order_id`, `product_id`, `product_name_snapshot`, `variant_name_snapshot`, `unit_price_snapshot`, `quantity`, `line_total`, `special_instructions`, `add_ons_snapshot`.
7. **`delivery_zones`**: Butwal zones (Kalikanagar, Golpark, Traffic Chowk, Tilottama, Manigram, Deepnagar) with minimum orders and fees.
8. **`business_hours`**: Monday through Sunday operating windows configured for Asia/Kathmandu.

### Interactive Component & State Mapping

- **`Navbar`**: Single-line logo, clean navigation links, order tracking link, and dynamic cart badge with total items.
- **`HeroSection` & `StorySection`**: High-fidelity food showcase, verified Butwal address (`12 Teacher's Path, Kalikanagar, Butwal`), phone (`+977 980-2672008`), opening hours indicator, and direct Order Online action.
- **`MenuSection`**: Real-time category selector tabs, search input, vegetarian filter toggle, responsive product card grid with instant customizer trigger.
- **`ProductCustomizerModal`**: Size/variant radio selector, spice selector, add-on checkboxes, live total calculator, and "Add to Order" action.
- **`CartDrawer`**: Slide-over drawer with itemized line items, quantity adjustment, remove button, delivery fee breakdown, and checkout trigger.
- **`CheckoutModal`**: Multi-step fulfillment and contact form, zone selection, payment selector, and eSewa/Khalti sandbox interactive flow.
- **`OrderTrackerView`**: Real-time visual order pipeline, kitchen notes, live status refresh, and WhatsApp contact button.
- **`AdminDashboard`**: Tabbed administration interface with KPI cards, live order dispatch queue, status changer, kitchen ticket printer modal, menu item creator/editor, and business settings form.

---

## 5. Implementation Phases & Verification Steps

1. **Phase 1: Foundations & Backend API Engine**
   - Create normalized relational data store with robust schema and seed authentic Daddy's Kitchen dishes and Butwal delivery zones.
   - Implement Express REST API endpoints (`/api/v1/restaurant`, `/api/v1/categories`, `/api/v1/products`, `/api/v1/orders`, `/api/v1/orders/track/:token`, `/api/v1/payments`, `/api/v1/admin/*`).
   - Configure Vite dev server proxy to handle `/api` requests seamlessly.
2. **Phase 2: High-Fidelity Visual Assets**
   - Generate authentic, domain-tailored food photography for Daddy's Kitchen signature dishes using `generate_image` in a single batch turn.
3. **Phase 3: Storefront & Menu Customization Experience**
   - Build responsive Header, Hero, Category Filter, Product Cards, and Search.
   - Build Product Customizer with variants, spice levels, add-on selections, and live pricing.
4. **Phase 4: Cart, Multi-Fulfillment Checkout & Digital Wallets**
   - Build Cart slide-over drawer with persistent local storage backup.
   - Build Checkout supporting Delivery, Takeaway, and Dine-In Table service.
   - Build interactive eSewa and Khalti sandbox test payment modals with server-side validation.
   - Build Live Order Tracking view with unpredictable tokens.
5. **Phase 5: Administration Console & Operations**
   - Build `/admin` dashboard with order queue, status changers, printable kitchen tickets, menu manager, and business settings.
6. **Phase 6: Quality Assurance & Build Verification**
   - Verify WCAG contrast, mobile viewport, single-line controls, zero dead clicks, and run `compile_applet` to ensure error-free production build.
