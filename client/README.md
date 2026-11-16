# ParkVolt – Smart Parking & EV Charging Finder

A simple, attractive 3D web application built with **React 18 + Vite**, **plain CSS with CSS variables**, **Three.js with @react-three/fiber & @react-three/drei**, and **qrcode.react**.

Built for modern web browsers and designed specifically for easy demonstration in a **B.Tech Computer Science viva**.

---

## 🚀 How to Run on macOS

Open your macOS Terminal and execute the following commands:

```bash
# 1. Navigate to the client folder
cd "/Users/ajay/Downloads/INT259  CA2/client"

# 2. Install dependencies (already pre-installed)
npm install

# 3. Start the Vite development server
npm run dev
```

The app will start immediately at:  
👉 **[http://localhost:3000](http://localhost:3000)**

To create an optimized production build:
```bash
npm run build
```

---

## 📄 Complete List of Pages (All 10 Routes)

| # | Route | Page Name | Key Capabilities |
|---|---|---|---|
| **1** | `/` | **Landing Page** | 3D Hero island scene, animated vehicles & pedestrians, search box, live statistics, featured places, 4-step "How It Works", pricing tiers in INR (₹), FAQ accordion, and footer. |
| **2** | `/find-parking` | **Find Parking** | Interactive search, filters (price range, city, availability, amenities), location cards with real photos, live free slot counts, hourly rates, and opening hours. |
| **3** | `/parking/:id` | **Parking Detail** | Photo gallery, interactive 3D slot picker (Green = free, Red = taken with 3D car, Blue = selected), start time & duration picker (30m to 24h), dynamic 18% GST calculation, and Google Maps directions link. |
| **4** | `/find-ev` | **Find EV Charging** | Real-time filters by connector type (Type 2, CCS2, CHAdeMO, Bharat AC001, Bharat DC001), charging speed (kW), hourly rate, and live status badges. |
| **5** | `/checkout` | **Checkout** | Booking order summary, mock payment modes (UPI ID, Credit/Debit Card, ParkVolt Wallet), double-booking collision prevention, input validation, and animated confirmation screen. |
| **6** | `/ticket/:id` | **Booking Ticket** | Live QR code generated via `qrcode.react`, active countdown timer, "+30 Mins" extension button, and instant cancel with wallet refund. |
| **7** | `/my-bookings` | **My Bookings** | Segmented tabs for `Upcoming`, `Active`, and `Past` reservations, persistent across sessions. |
| **8** | `/wallet` | **Digital Wallet** | Live INR balance display, one-click quick top-up buttons (₹200, ₹500, ₹1000), and transaction history log. |
| **9** | `/login` & `/register` | **Authentication** | Client-side SHA-256 Web Crypto password hashing, form validation, pre-seeded demo user (`alex@parkvolt.com` / `password123`), and session persistence in `localStorage`. |
| **10** | `*` | **404 Not Found** | Clean error page with navigation shortcuts back to safety. |

---

## 🎨 Visual Design & Theme System

- **Tesla / Airbnb Modern Aesthetic**: Rounded cards (`14px` - `20px` radius), soft elevation shadows, crisp whitespace, and sticky navigation.
- **Typography**: Google Font **Plus Jakarta Sans** with clean numerical hierarchy.
- **Theme Modes (Light / Dark / Auto)**:
  - **Light Mode**: High-contrast, daylight palette (`#F8FAFC` background).
  - **Dark Mode**: Cyber nightscape (`#070C1F` background).
  - **Auto Mode**: Listens live to your Mac's system appearance (`prefers-color-scheme`) and switches automatically without a page reload.
  - **Interactive 3D Scene Adaptation**: The 3D city scene lighting, sky gradient, building window glows, and streetlights dynamically adjust to light or dark mode in real time.
- **Color Palette**:
  - Primary Blue: `#2F6BFF`
  - Violet Accent: `#7C5CFF`
  - Success Green: `#12B76A`
  - Warning Amber: `#F59E0B`
  - Danger Red: `#EF4444`

---

## 💡 What Parts Are Mocked? (Viva Explanation)

For a clean, standalone frontend project that runs anywhere without requiring external database servers or third-party paid API keys:

1. **No External Backend or Database**:
   - Initial parking locations and EV charging stations are loaded from clean JSON files (`src/data/parkingLocations.json` and `src/data/evStations.json`).
   - All user reservations, active sessions, saved favorites, and wallet balances are stored directly in the browser's `localStorage`.
2. **Real-time Availability Simulation**:
   - Every 4 seconds, a timer background worker slightly shifts slot availability up or down to simulate live IoT sensors.
   - A visible **"Simulated data"** badge is proudly displayed in the top navigation and on cards, transparently informing users.
3. **Double-Booking Collision Prevention Algorithm**:
   - In `BookingContext.jsx`, whenever a reservation is attempted, the system compares the requested slot and time range against all existing active bookings to guarantee no slot is double-booked for overlapping windows.
4. **Mock Payment Gateway**:
   - Supports simulated **UPI**, **Credit/Debit Card**, and **ParkVolt Wallet** payment flows with real client-side regex format validation (e.g., `user@upi` and 16-digit card numbers) labeled clearly with a **"Demo payment – No real money is charged"** badge.
5. **Client-Side SHA-256 Auth**:
   - Passwords are securely hashed directly in the browser using the native Web Cryptography API (`crypto.subtle.digest('SHA-256', ...)`) before being compared with stored credentials.

---

## 📁 Project Folder Structure (In Simple English)

```text
client/
├── public/
│   └── images/                     # Real, high-resolution parking & EV photos
│       ├── airport.jpg             # Aerocity Terminal 3 Parking
│       ├── ev-charge.jpg           # EV plugged into charging cable
│       ├── ev-fast.jpg             # 150 kW DC Fast Charging Hub
│       ├── ev-station.jpg          # Commercial EV charging plaza
│       ├── mall.jpg                # Ambience Mall underground parking
│       ├── multistorey.jpg         # Cyber Hub Multi-Storey Garage
│       ├── street.jpg              # Connaught Place smart street bays
│       └── underground.jpg         # One BKC Corporate Basement
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   └── FloatingCityScene.jsx  # Interactive 3D Canvas (R3F + Drei)
│   │   ├── common/
│   │   │   └── ToastNotifications.jsx # Floating toast alerts (Booking, Extension, etc.)
│   │   └── layout/
│   │       ├── BottomNav.jsx          # Mobile bottom navigation bar
│   │       ├── Footer.jsx             # Comprehensive footer with INR notes & links
│   │       └── Navbar.jsx             # Top bar with Logo, Search, Theme toggle & Balance
│   ├── context/
│   │   ├── AuthContext.jsx         # Web Crypto SHA-256 login, register & session state
│   │   ├── BookingContext.jsx      # Double-booking check, 4s simulation & tickets
│   │   └── ThemeContext.jsx        # Light / Dark / Auto system theme manager
│   ├── data/
│   │   ├── evStations.json         # EV charging locations (CCS2, Type 2, Bharat DC)
│   │   └── parkingLocations.json   # Parking facilities in Gurugram, Delhi, Mumbai, BLR
│   ├── pages/
│   │   ├── AuthPage.jsx            # /login and /register forms
│   │   ├── BookingTicketPage.jsx   # /ticket/:id with live QR code & countdown
│   │   ├── CheckoutPage.jsx        # /checkout payment simulation & validation
│   │   ├── FindEvChargingPage.jsx  # /find-ev connector & speed filter matrix
│   │   ├── FindParkingPage.jsx     # /find-parking search, filter & card view
│   │   ├── LandingPage.jsx         # / hero 3D island, stats, steps & FAQ
│   │   ├── MyBookingsPage.jsx      # /my-bookings upcoming, active & past tabs
│   │   ├── NotFoundPage.jsx        # /404 page
│   │   ├── ParkingDetailPage.jsx   # /parking/:id with 3D slot picker & pricing
│   │   └── WalletPage.jsx          # /wallet balance and top-up chips
│   ├── styles/
│   │   └── main.css                # Pure CSS design system with CSS custom properties
│   ├── App.jsx                     # Route definitions & Context providers wrapping
│   └── main.jsx                    # React 18 DOM mount point
├── index.html                      # HTML entry with Plus Jakarta Sans font
├── package.json                    # Dependencies & scripts
└── vite.config.js                  # Vite bundler configuration (Port 3000)
```

---

## 📸 Image Credits

All images used in this project are licensed for free commercial and personal use from **Unsplash**:

1. `multistorey.jpg`: Photo by CHUTTERSNAP on Unsplash (Multi-level concrete parking structure).
2. `underground.jpg`: Photo by Michael Fousert on Unsplash (Underground basement garage with LED guidance).
3. `street.jpg`: Photo by John Matychuk on Unsplash (Urban curbside smart parking bays).
4. `mall.jpg`: Photo by Alex Suprun on Unsplash (Shopping mall parking facility).
5. `ev-fast.jpg`: Photo by CHUTTERSNAP on Unsplash (High-speed DC electric vehicle charging station).
6. `ev-station.jpg`: Photo by Sophie Louisnave on Unsplash (Modern solar-canopy EV charging park).
7. `ev-charge.jpg`: Photo by Ernest Ojeh on Unsplash (Electric vehicle plugged in with glowing indicator).
8. `airport.jpg`: Photo by Artur Tumasjan on Unsplash (Airport terminal long-stay parking zone).
