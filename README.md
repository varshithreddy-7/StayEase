# 🏨 StayEase – Hotel Booking Application

A full-stack MERN hotel booking app with JWT auth, admin panel, and mock payment system.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

---

### 1. Clone / Extract the project
```bash
cd hotel-booking
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGO_URI
npm install
```

### 3. Seed the Database
```bash
npm run seed
```
This creates 12 hotels, 5 users, sample bookings & reviews.

**Demo credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotelbooking.com | admin123 |
| User | rahul@example.com | password123 |

### 4. Start Backend
```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```
Backend runs on: http://localhost:5000

---

### 5. Setup Frontend
```bash
cd ../frontend
cp .env.example .env
npm install
npm start
```
Frontend runs on: http://localhost:3000

---

## 📁 Project Structure

```
hotel-booking/
├── backend/
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── scripts/         # Seed script
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Navbar, Footer, HotelCard
        ├── context/     # AuthContext
        ├── pages/       # All pages
        ├── styles/      # Global CSS
        └── utils/       # Axios config
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/hotels | List hotels (with filters) |
| GET | /api/hotels/:id | Hotel detail |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | My bookings |
| POST | /api/payments/mock-pay | Mock payment |
| GET | /api/admin/stats | Admin dashboard |

## 💳 Payment
Uses a **mock payment system** by default — no real card is charged.
To use real Stripe: add `STRIPE_SECRET_KEY=sk_test_...` in backend `.env` and `REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...` in frontend `.env`.

## 🛠 Tech Stack
- **Frontend**: React 18, React Router 6, Context API, CSS Variables
- **Backend**: Node.js, Express 4, Mongoose 8
- **Database**: MongoDB
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Payment**: Mock system / Stripe-ready
