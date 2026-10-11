# 🎬 KINO XII — Cinema Ticket Booking App

A modern, full-featured single-page application for browsing movies and booking cinema tickets at **KINO XII**, built with React and Vite.

---

## ✨ Features

### 🏠 Home Page
- **Hero banner** — rotating featured movies with auto-play slideshow and gradient overlays
- **Now Playing** — horizontally scrollable movie card row
- **Coming Soon** — upcoming films with Notify Me subscription support
- **Recently Viewed** — tracks the last 10 movies you've visited (stored locally)

### 🎥 Movie Detail Page
- Full movie info: poster, synopsis, cast, genre, runtime, age rating, release date
- Session schedule filtered by date (next 7 days)
- One-click session booking

### 🗓️ Sessions Page
- Browse all showings for a selected date
- Filter by venue, format (2D / 3D / IMAX MAX), language, and time-of-day band
- Search by movie title
- Persistent URL state — filters survive page refresh and deep-links work

### 🎟️ Booking Flow (2-step modal)

**Step 1 — Seat Selection**
- Live seat map per session fetched from the API
- Seat states: Available / Selected / Held / Sold
- Up to 3 seats per order
- Ticket type per seat: Adult (100%) / Student (75%) / Child (60%)
- Child ticket hidden automatically for age-restricted titles (16+, 18+)

**Step 2 — Checkout**
- 8-minute countdown timer (seats held server-side)
- Order summary with seat breakdown and total
- Payment form pre-filled from user profile
- Client-side validation + server-side 422 error mapping per field
- Conflict handling (409) — redirects back to seat selection with a message

**Confirmation**
- Full order confirmation view after successful payment

### 👤 Authentication
- Register with avatar upload
- Login / Logout
- Auth-protected routes and actions (prompts login modal when needed)

### 👤 Profile Page
- Edit profile: full name, email, mobile, avatar
- **My Tickets** tab — upcoming and past orders with refund support
  - Refund button enabled only when isRefundable is true
  - Refund confirmation before submission

### 🔍 Search
- Global search overlay from the Navbar
- Searches movies by title in real time

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Styling | Vanilla CSS (no Tailwind) |
| API | REST — https://api.kinoxii.redberryinternship.ge/api |
| Deployment | Netlify (SPA redirect configured) |

---

## 📁 Project Structure

```
src/
├── assets/              # Static assets (icons, images)
├── components/
│   ├── Auth/            # LoginModal, RegisterModal
│   ├── Booking/
│   │   ├── Step1Seats/      # SeatMap, SeatButton, SelectedSeatsPanel
│   │   ├── Step2Checkout/   # CheckoutForm, CheckoutStep, OrderSummaryPanel
│   │   └── Confirmation/    # OrderConfirmationView
│   ├── ComingSoon/      # Coming Soon section + Notify Me
│   ├── Footer/
│   ├── Hero/            # Hero banner with slideshow
│   ├── MovieCard/       # Reusable movie card component
│   ├── MovieDetails/    # Movie detail sections
│   ├── Navbar/          # Top navigation + search trigger
│   ├── NowPlaying/      # Now Playing horizontal scroll
│   ├── Profile/         # Profile form, TicketCard, refund logic
│   ├── ProfileDropdown/
│   ├── RecentlyViewed/
│   ├── SearchOverlay/
│   └── Sessions/        # Session list, filters, session cards
├── context/
│   └── AuthContext.jsx  # Global auth state (user, token, modals)
├── pages/
│   ├── HomePage/
│   ├── MovieDetailPage/
│   ├── ProfilePage/
│   └── SessionsPage/
├── services/
│   └── api.js           # API wrappers (authApi, moviesApi, bookingApi, ticketsApi)
├── utils/
│   ├── dateHelpers.js   # Date utilities
│   └── recentStorage.js # LocalStorage recently-viewed tracker
├── App.jsx
├── index.css            # Global CSS tokens + reset
└── main.jsx
```

---

## 🔧 Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at http://localhost:5173.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready for deployment.

---

## 🔐 Authentication

The app uses **Bearer token** auth stored in localStorage under the key kinoxii_token.

- Token is attached to every API request automatically
- On 401, the token is cleared and a global kinoxii_auth_required event is dispatched, triggering the login modal

---

## 🌐 API Reference

Base URL: https://api.kinoxii.redberryinternship.ge/api

| Method | Endpoint | Description |
|---|---|---|
| POST | /login | Authenticate user |
| POST | /register | Register new user |
| GET | /me | Get current user profile |
| PUT | /profile | Update profile |
| GET | /movies/featured | Hero banner movies |
| GET | /movies/now-playing | Now playing list |
| GET | /movies/coming-soon | Coming soon list |
| GET | /sessions | Sessions with filters |
| GET | /movies/:slug | Movie detail |
| GET | /sessions/:id/seats | Seat map |
| POST | /sessions/:id/holds | Hold seats (8 min) |
| DELETE | /holds/:id | Release hold |
| POST | /orders | Create order (pay) |
| GET | /tickets | User tickets |
| POST | /orders/:ref/refund | Refund an order |

---

## 📋 Notes

- Age-restricted titles (16+, 18+) hide the **Child** ticket type automatically
- Session filters use AND between types and OR within — e.g., (Galleria OR Vake) AND MAX
- Changing any filter or sort resets pagination to page 1
- The hold timer counts down from the expiresAt timestamp returned by the API
- Sold-out sessions are shown disabled, not hidden
- Profile must be completed before booking is allowed

---

## 📄 License

Built as part of the **Redberry Bootcamp** programme.
