# DADDY’S KITCHEN — COMPREHENSIVE OPERATING MANUAL & STAFF SETUP GUIDE
**The Cafe and Restaurant**  
*Location: MFM6+PCH, 12 Teacher’s Path, Kalikanagar, Butwal 32907, Nepal*  
*Hotline: +977 980-2672008 | Currency: NPR | Timezone: Asia/Kathmandu*  

---

## TABLE OF CONTENTS
1. [Platform Architecture & Core Concepts](#1-platform-architecture--core-concepts)
2. [How the Online Ordering Engine Works](#2-how-the-online-ordering-engine-works)
3. [How to Link Gmail & Google Authentication](#3-how-to-link-gmail--google-authentication)
4. [Creating Admin, Manager & Staff Accounts (RBAC)](#4-creating-admin-manager--staff-accounts-rbac)
5. [Kitchen Dispatch, Kitchen Tickets & Status Workflow](#5-kitchen-dispatch-kitchen-tickets--status-workflow)
6. [Payment Gateway Operations (eSewa, Khalti & Cash)](#6-payment-gateway-operations-esewa-khalti--cash)
7. [Delivery Zones & Tariff Administration](#7-delivery-zones--tariff-administration)
8. [Menu Management & Live Inventory Toggles](#8-menu-management--live-inventory-toggles)
9. [Daily Operational Checklist for Restaurant Managers](#9-daily-operational-checklist-for-restaurant-managers)

---

## 1. PLATFORM ARCHITECTURE & CORE CONCEPTS

Daddy’s Kitchen is a unified restaurant operating system designed specifically for the Butwal culinary market. It bridges three distinct operational channels:
- **Home Delivery**: Zone-calculated dispatch across Kalikanagar, Golpark, Traffic Chowk, Tilottama, Manigram, and Deepnagar with thermal food bag tracking and late-night delivery until 2:00 AM.
- **Takeaway Pickup**: Fast prep queue allowing customers to order ahead and pick up at 12 Teacher’s Path without waiting.
- **Dine-In QR Table Ordering**: Tables equipped with QR codes allow seated diners to order directly from their smartphones, printing tickets automatically at the kitchen pass.

The system is powered by an Express.js server and React frontend with server-authoritative price validation, idempotency guards, and unguessable tracking tokens (`trk_...`) to protect customer data privacy.

---

## 2. HOW THE ONLINE ORDERING ENGINE WORKS

### Step-by-Step Customer Journey
1. **Catalog Browsing**: Customers browse categorized dishes (Momos, Burgers, Chowmein, Nepali Khaja, Curries, Barista Cafe).
2. **Item Customization**: Clicking any dish opens the Contiguous Purchase Module where customers choose:
   - Portion size / style (e.g., Steamed 10 pcs, Kothey Fried, Himalayan Jhol Gravy, Wok Chilli Tossed).
   - Spice level (Mild, Medium, Spicy, Nepali Fire).
   - Add-ons (Extra sesame-tomato achar, fire garlic dip, melted cheese, double patty, butter naan).
   - Kitchen notes (e.g., "Less oil", "No onions").
3. **Cart & Zone Validation**: The cart calculates subtotal and enforces zone-specific minimum order amounts (e.g., NPR 300 for Kalikanagar, NPR 500 for Tilottama).
4. **Checkout & Fulfillment Selection**:
   - Customer enters their name and Nepal mobile number (`+977 98...`).
   - If Delivery: Selects Butwal zone and enters street address + landmark.
   - If Dine-In: Enters their Table Number (e.g., Table 4).
   - Selects payment method (Cash on Delivery, Cash at Counter, eSewa, or Khalti).
5. **Live Order Tracking**: After submission, the customer receives a unique Order Number (e.g., `#DK-1042`) and an unguessable tracking token. They can track live status or contact the kitchen via WhatsApp with one click.

---

## 3. HOW TO LINK GMAIL & GOOGLE AUTHENTICATION

To enable Google Sign-In for administrators, managers, and staff using their official Google/Gmail accounts (e.g., `kingavibk@gmail.com`), follow this standard Google OAuth 2.0 integration procedure:

### A. Google Cloud Console Configuration
1. Open the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Select your Google Cloud Project or create a new project named `Daddys-Kitchen-Platform`.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select **Web application** as the Application type:
   - **Name**: `Daddy's Kitchen Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for local development)
     - `https://ais-dev-mqgvzrecwcfutafijsyzb2-15554198730.europe-west1.run.app` (Development App URL)
     - `https://ais-pre-mqgvzrecwcfutafijsyzb2-15554198730.europe-west1.run.app` (Shared App URL)
     - `https://daddyskitchen.com.np` (Your custom domain)
   - **Authorized redirect URIs**:
     - Add the app callback URL (or popup origin).
6. Click **Create**. Copy your **Client ID** and **Client Secret**.

### B. OAuth Consent Screen
1. In the Google Cloud Console, go to **APIs & Services > OAuth consent screen**.
2. Set User Type to **External** (or Internal for Google Workspace domains).
3. App information:
   - **App name**: `Daddy's Kitchen Staff Portal`
   - **User support email**: `contact@daddyskitchen.com.np` or `kingavibk@gmail.com`
   - **Developer contact email**: `kingavibk@gmail.com`
4. Scopes: Add `openid`, `email`, and `profile`.
5. Test users: If publishing in Testing status, add the Gmail addresses of the restaurant owner and staff members.

### C. Whitelisting Admin Accounts in the System
In the backend database configuration (`src/db/store.ts` or environment settings), designate which Gmail addresses are recognized as administrators:
```json
{
  "admin_whitelist_emails": [
    "kingavibk@gmail.com",
    "contact@daddyskitchen.com.np"
  ]
}
```
When a user logs in with Google, the server verifies the ID token with Google's public keys. If the verified email is in the admin whitelist, the user is immediately granted the `OWNER` or `MANAGER` role and given full access to the `/admin` portal.

---

## 4. CREATING ADMIN, MANAGER & STAFF ACCOUNTS (RBAC)

The system enforces a **Role-Based Access Control (RBAC)** model to safeguard financial totals, prevent unauthorized refunds, and protect customer personal data.

### Role Hierarchy & Permissions Matrix

| Permission / Capability | Owner | Manager | Kitchen Chef | Delivery Rider | Customer |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Live Kitchen Ticket Queue | ✅ | ✅ | ✅ | ❌ | ❌ |
| Change Status: Confirm / Start Cooking | ✅ | ✅ | ✅ | ❌ | ❌ |
| Change Status: Mark Ready / Out for Delivery | ✅ | ✅ | ✅ | ✅ | ❌ |
| Mark Delivered / Order Completed | ✅ | ✅ | ❌ | ✅ | ❌ |
| Print Kitchen Thermal Receipts | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Menu Dishes, Pricing & Availability | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configure Butwal Delivery Zones & Fees | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Gross Sales, Net Revenue & Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| Modify Payment Gateways (eSewa/Khalti keys) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Cancel Order with Reason Log | ✅ | ✅ | ❌ | ❌ | ❌ |

### How to Onboard New Staff Members
1. **Owner Access**:
   - Access the platform and navigate to the top announcement bar or footer.
   - Click **Admin Portal**.
   - Sign in using the whitelisted primary Gmail (`kingavibk@gmail.com`).
2. **Assigning Kitchen Display Staff**:
   - For kitchen line tablet devices, log in using the designated kitchen staff account.
   - Switch to the **Live Orders** tab. The kitchen view displays incoming tickets, portion specifications, and customer notes (e.g. "Extra spicy red achar", "No coriander").
3. **Assigning Delivery Riders**:
   - Riders access the portal on their smartphones.
   - When orders transition to `Ready`, the rider clicks **Dispatch Rider**.
   - Upon doorstep arrival in Kalikanagar or Golpark, the rider collects cash (if COD) and clicks **Complete Order**.

---

## 5. KITCHEN DISPATCH, KITCHEN TICKETS & STATUS WORKFLOW

The order lifecycle follows strict finite-state transitions:

```
[ PENDING ] ────────► [ CONFIRMED ] ────────► [ PREPARING ]
     │                      │                      │
     ▼                      ▼                      ▼
[ CANCELLED ]         [ CANCELLED ]         [ READY / OUT FOR DELIVERY ]
                                                   │
                                                   ▼
                                            [ DELIVERED ]
```

### Transition Rules
1. **Pending**: New web order placed. Audio alert chimes on the kitchen tablet.
2. **Confirmed**: Kitchen manager clicks **Confirm Order**. Customer's live tracking page updates instantly to "Accepted by kitchen staff".
3. **Preparing**: Chef begins steaming momos or tossing chowmein. Status updates to "Cooking & Assembling".
4. **Ready / Out for Delivery**:
   - For Dine-In: Server delivers plate to Table #.
   - For Takeaway: Placed on pickup counter.
   - For Delivery: Handed to motorcycle rider with customer phone and street directions.
5. **Delivered**: Transaction completed. Gross and net revenue counters update in the reporting ledger.

### Printing Kitchen Tickets
Click **Kitchen Ticket** on any order card in the admin portal. A formatted 80mm thermal receipt displays:
- Restaurant Header: `DADDY'S KITCHEN, Kalikanagar, Butwal`
- Order Number & Timestamp
- Fulfillment Mode: `DELIVERY`, `TAKEAWAY`, or `DINE-IN (Table #)`
- Itemized lines with variant styles, add-ons, and italicized special instructions
- Final Total Amount in NPR
Click **Print Ticket** (`Ctrl+P` / `Cmd+P`) to route directly to your kitchen receipt printer.

---

## 6. PAYMENT GATEWAY OPERATIONS (eSewa, Khalti & Cash)

Daddy’s Kitchen supports hybrid payments tailored for Nepal:

### 1. Cash on Delivery (COD) & Cash on Pickup
- Customer pays physical cash to the delivery rider or counter cashier.
- Payment status remains `Pending` until cash is collected, then shifts to `Paid`.

### 2. eSewa Sandbox & Production Configuration
- **Sandbox Mode (Current)**: Allows customers and staff to test digital payments safely.
  - Merchant Code: `EPAYTEST`
  - Demo ID: Any 10-digit mobile number (e.g., `9802672008`)
  - MPIN: `1234` | OTP: `889900`
- **Switching to Live eSewa Merchant**:
  1. Register for an official eSewa Merchant account at [merchant.esewa.com.np](https://merchant.esewa.com.np).
  2. Obtain your live Merchant Code and Secret Key from eSewa.
  3. In the Daddy’s Kitchen Admin Portal > **Hours & Gateway Config**, enter your Merchant Code and uncheck "Sandbox Test Mode".
  4. Click **Save Business Settings**.

### 3. Khalti Sandbox & Production Configuration
- **Sandbox Mode (Current)**:
  - Test ID: `9802672008`
  - PIN: `5678` | OTP: `112233`
- **Switching to Live Khalti Merchant**:
  1. Create a merchant profile at [admin.khalti.com](https://admin.khalti.com).
  2. Retrieve your Live Public Key and Secret Key.
  3. In Admin Portal > **Hours & Gateway Config**, enter your Live Public Key and toggle Live Mode.

---

## 7. DELIVERY ZONES & TARIFF ADMINISTRATION

Delivery tariffs can be updated dynamically without altering source code:
1. Open **Admin Portal > Butwal Delivery Zones**.
2. Current pre-configured zones:
   - **Kalikanagar & 12 Teacher’s Path**: Fee NPR 50 | Minimum Order NPR 300 | 25 mins
   - **Traffic Chowk & Amarpath**: Fee NPR 60 | Minimum Order NPR 350 | 30 mins
   - **Golpark & Hospital Line**: Fee NPR 70 | Minimum Order NPR 400 | 35 mins
   - **Deepnagar & Ramnagar**: Fee NPR 70 | Minimum Order NPR 400 | 35 mins
   - **Tilottama & Driver Tole**: Fee NPR 90 | Minimum Order NPR 500 | 40 mins
   - **Manigram & Shankarnagar**: Fee NPR 110 | Minimum Order NPR 600 | 45 mins
3. Enter updated fees or minimum order values in the input boxes. Changes reflect immediately on customer checkouts.

---

## 8. MENU MANAGEMENT & LIVE INVENTORY TOGGLES

### Marking Dishes In or Out of Stock
When ingredients run out (e.g., fresh mutton or seasonal greens):
1. Navigate to **Admin Portal > Menu & Pricing**.
2. Locate the dish card.
3. Click the status button to toggle between **Available (In Stock)** and **Unavailable (Sold Out)**.
4. Sold out dishes immediately disable their "Add to Cart" button on the customer menu.

### Adding New Menu Offerings
1. Click **Add New Dish** at the top of the Menu tab.
2. Fill in:
   - **Dish Name**: e.g., "Himalayan Thukpa Bowl"
   - **Category**: Select from Momos, Burgers, Chowmein, Starters, Mains, or Cafe
   - **Base Price (NPR)**: e.g., `280`
   - **Description**: Highlight ingredients, cooking style, and pairings
   - **Prep Time**: e.g., `15` minutes
   - **Dietary Tag**: Vegetarian or Non-Vegetarian
3. Click **Add Dish to Live Menu**.

---

## 9. DAILY OPERATIONAL CHECKLIST FOR RESTAURANT MANAGERS

### Morning Opening (10:00 AM Asia/Kathmandu)
- [ ] Log in to the Admin Portal using your authorized Google/Gmail account.
- [ ] Check the announcement banner text (update with daily lunch specials if desired).
- [ ] Verify that kitchen ingredients are stocked and toggle any unavailable dishes to "Sold Out".
- [ ] Ensure the kitchen thermal receipt printer has paper loaded.

### During Peak Rush (1:00 PM – 3:00 PM & 6:00 PM – 9:00 PM)
- [ ] Keep the **Live Orders** screen open on the counter and kitchen tablets.
- [ ] Confirm new orders within 2 minutes of placement.
- [ ] Group delivery dispatches by neighborhood (e.g., batching Kalikanagar and Traffic Chowk orders).

### Late-Night Service (10:00 PM – 2:00 AM)
- [ ] Switch front door to takeaway/delivery-only mode.
- [ ] Keep phone hotline (`+977 980-2672008`) and WhatsApp dispatch active.

### End of Day Closing (2:00 AM)
- [ ] Review the **Gross Sales** and **Net Paid** counters in the Admin KPI strip.
- [ ] Reconcile physical Cash on Delivery envelopes against the `PAID (Cash)` ledger.
- [ ] Check digital wallet transaction summaries (eSewa & Khalti) against merchant settlements.

---

*Document Version 1.0 — Daddy's Kitchen The Cafe and Restaurant (Butwal, Nepal)*  
*For technical support or infrastructure inquiries, contact: kingavibk@gmail.com*
