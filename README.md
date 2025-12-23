# Sistem Manajemen Kos

Aplikasi web untuk mengelola properti kost, penghuni, tagihan, pembayaran, dan laporan kerusakan.

## Fitur Utama

- **Manajemen Kamar** - CRUD kamar dengan foto dan fasilitas
- **Manajemen Penghuni** - Registrasi, verifikasi email, profil
- **Tagihan & Pembayaran** - Generate tagihan, integrasi Midtrans
- **Laporan Kerusakan** - Submit dan tracking laporan
- **Notifikasi Email** - Verifikasi, pembayaran, laporan
- **Kompresi Gambar** - Otomatis compress & convert ke WebP

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Node.js, Express, Prisma, PostgreSQL |
| **Frontend** | React 18, Vite, TailwindCSS, Zustand |
| **DevOps** | Docker, Docker Compose, Nginx |
| **Payment** | Midtrans |
| **Email** | Nodemailer |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Jalankan Aplikasi

```bash
# Clone repository
git clone https://github.com/nandana05-tech/sistemManagemenKos.git
cd sistemManagemenKos

# Copy environment file
cp .env.example .env
# Edit .env sesuai kebutuhan

# Start semua services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Jalankan migration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed data (opsional)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma db seed

# Akses di http://localhost
```

## Struktur Project

```
├── backend/                 # Express.js API
│   ├── prisma/             # Schema & migrations
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth, upload
│   │   ├── utils/          # Email, logger, compression
│   │   └── routes/         # API routes
│   └── uploads/            # Uploaded files
│
├── frontend/               # React.js SPA
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Zustand stores
│   │   └── services/       # API services
│   └── public/
│
├── docker/                 # Docker configs
│   ├── nginx/              # Reverse proxy
│   └── postgres/           # DB init
│
├── docs/                   # Documentation
│   └── DEPLOYMENT.md       # Deployment guide
│
└── docker-compose*.yml     # Docker Compose files
```

## API Endpoints

### Authentication
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/verify-email/:token` | Verifikasi email |
| POST | `/api/auth/forgot-password` | Lupa password |
| GET | `/api/auth/me` | Get current user |

### Kamar
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kamar` | List semua kamar |
| GET | `/api/kamar/:id` | Detail kamar |
| POST | `/api/kamar` | Tambah kamar |
| PUT | `/api/kamar/:id` | Update kamar |
| POST | `/api/kamar/:id/photos` | Upload foto |

### Tagihan & Pembayaran
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tagihan` | List tagihan |
| POST | `/api/tagihan/generate` | Generate tagihan bulanan |
| POST | `/api/payment` | Buat pembayaran (Midtrans) |
| POST | `/api/payment/notification` | Webhook Midtrans |

### Laporan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/laporan` | List laporan |
| POST | `/api/laporan` | Buat laporan |
| PATCH | `/api/laporan/:id/status` | Update status |

## User Roles

| Role | Akses |
|------|-------|
| **Pemilik** | Full akses: kelola kamar, penghuni, tagihan, laporan |
| **Penghuni** | View kamar, bayar tagihan, submit laporan |

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Pemilik | admin@kostmanagement.com | admin123 |
| Penghuni | penghuni1@example.com | password123 |

## Dokumentasi Lengkap

Lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) untuk:
- Konfigurasi environment
- Setup production server
- SSL/HTTPS setup
- Troubleshooting

## Contributors

- **Nandana Ayudya Natasakara** - 23.12.2903
- **Raehan Mahardika Herlambang** - 23.12.2884

## License
