# Kost Management System

Sistem Manajemen Kost terpadu untuk mengelola properti kost, penghuni, tagihan, pembayaran, dan laporan kerusakan.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Payment Gateway**: Midtrans
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### DevOps
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Nginx

## 📁 Project Structure

```
uas-kos/
├── backend/                    # Express.js Backend
│   ├── prisma/                 # Prisma schema & migrations
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Express middlewares
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── validations/       # Zod schemas
│   │   └── app.js             # Express app setup
│   ├── uploads/               # Uploaded files
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # React.js Frontend
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable components
│   │   │   └── layout/        # Layout components
│   │   ├── features/          # Zustand stores
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── routes/            # Routing config
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── docker/                     # Docker configurations
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── Dockerfile
│   └── postgres/
│       └── init.sql
│
├── docker-compose.yml          # Main Docker Compose
├── docker-compose.dev.yml      # Development config
├── docker-compose.prod.yml     # Production config
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development

#### 1. Clone the repository

```bash
git clone <repository-url>
cd uas-kos
```

#### 2. Backend Setup

```bash
cd backend
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data
npm run prisma:seed

# Start development server
npm run dev
```

#### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Docker Development

```bash
# Start all services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Production

```bash
# Create .env file with production values
cp .env.example .env

# Start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify-email/:token` | Verify email |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/change-password` | Change password (auth) |
| GET | `/api/auth/me` | Get current user (auth) |
| POST | `/api/auth/logout` | Logout user (auth) |

### Users (Pemilik only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| PATCH | `/api/users/:id/toggle-status` | Toggle user status |

### Kamar (Rooms)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/kamar` | Get all rooms |
| GET | `/api/kamar/:id` | Get room by ID |
| POST | `/api/kamar` | Create room (Pemilik) |
| PUT | `/api/kamar/:id` | Update room (Pemilik) |
| DELETE | `/api/kamar/:id` | Delete room (Pemilik) |
| PATCH | `/api/kamar/:id/status` | Update room status (Pemilik) |
| POST | `/api/kamar/:id/photos` | Upload room photos (Pemilik) |
| POST | `/api/kamar/:id/fasilitas` | Add facility (Pemilik) |

### Tagihan (Billing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tagihan` | Get all bills |
| GET | `/api/tagihan/:id` | Get bill by ID |
| POST | `/api/tagihan` | Create bill (Pemilik) |
| PUT | `/api/tagihan/:id` | Update bill (Pemilik) |
| DELETE | `/api/tagihan/:id` | Delete bill (Pemilik) |
| POST | `/api/tagihan/generate` | Generate monthly bills (Pemilik) |
| GET | `/api/tagihan/summary` | Get billing summary |

### Payment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment` | Get all payments |
| POST | `/api/payment` | Create payment (Midtrans) |
| POST | `/api/payment/notification` | Midtrans webhook |
| POST | `/api/payment/:id/verify` | Verify payment (Pemilik) |

### Laporan (Damage Reports)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/laporan` | Get all reports |
| POST | `/api/laporan` | Create report |
| PUT | `/api/laporan/:id` | Update report |
| PATCH | `/api/laporan/:id/status` | Update status (Pemilik) |
| DELETE | `/api/laporan/:id` | Delete report |

## 👤 User Roles

### Pemilik (Owner/Admin)
- Full access to all features
- Manage users, rooms, billing, payments
- View and process damage reports
- Generate monthly bills

### Penghuni (Tenant)
- View assigned room details
- View and pay bills
- Submit damage reports
- Update own profile

## 🔐 Test Credentials

After running seed script:

| Role | Email | Password |
|------|-------|----------|
| Pemilik | admin@kostmanagement.com | admin123 |
| Penghuni | penghuni1@example.com | password123 |
| Penghuni | penghuni2@example.com | password123 |

## 👥 Contributors

- Nandana Ayudya Natasakara 23.12.2903
- Raehan Mahardika Herlambang 23.12.2884
- Muhammad Asfihan 23.12.2876
- Awaluddin Maghrifatullah 23.12.2896
