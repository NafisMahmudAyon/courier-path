# 🚚 Courier Path

**Courier Path** is a web-based courier and parcel tracking application that allows users to book parcels, track shipments, and manage deliveries. It supports roles for **Admin**, **Agent**, and **Customer** with distinct dashboards and access levels.

---

## 🔗 Live URL & Repository

- **Live App**: [https://courier-path.vercel.app](https://courier-path.vercel.app)
- **Backend Repository**: [https://github.com/NafisMahmudAyon/courier-path-backend](https://github.com/NafisMahmudAyon/courier-path-backend)

---

## 🔐 Demo Login Credentials

| Role   | Email                 | Password |
|--------|------------------------|----------|
| Admin  | `admin@admin.admin`    | `@admin` |
| User   | `user@user.user`       | `123456` |
| Agent  | `agent@agent.agent`    | `123456` |

---

## 🌐 Routes Overview

| Path                   | Description                                              |
|------------------------|----------------------------------------------------------|
| `/`                    | Landing page with parcel tracking and user actions       |
| `/book`                | Book a new parcel (only for logged-in users)             |
| `/dashboard`           | Role-based dashboard (admin, agent, customer)            |
| `/login`               | Login page for all users                                 |
| `/register`            | Register as a user (customer by default)                 |
| `/register?role=agent` | Register as an agent                                     |
| `/track`               | Public parcel tracking page                              |
| `/track/:id`           | Track a specific parcel using parcel ID                  |

---

## 🧑‍💼 Role-Based Dashboard Details

### Admin Dashboard
- View all bookings
- Manage users and agents
- Assign parcels to agents
- View system metrics

### Agent Dashboard
- View assigned parcels
- Update delivery status
- Accept/reject assignments

### Customer Dashboard
- View personal parcel bookings
- Track delivery progress
- Book new parcels

---

## 📦 Key Features

- 🔐 Role-based authentication (Admin, Agent, User)
- 🚀 Parcel booking and tracking system
- 📬 Agent assignment for parcel delivery
- 🧭 Real-time tracking (Socket.IO support)
- 📊 Dashboard analytics and parcel overview
- 🎨 Clean and responsive UI
- 🌍 Hosted on Vercel & Render

---

## 🛠 Tech Stack

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js + Express + Socket.IO
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📎 Environment Variables (Backend)

Create a `.env` file in your backend with the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=https://courier-path.vercel.app
