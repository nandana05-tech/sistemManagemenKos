# Deployment & Production Guide

Panduan deployment dan menjalankan aplikasi di environment production.

## Quick Start Production

### Untuk Lokal (Laptop/Testing)
```bash
# Build dan jalankan production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Jalankan migration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed data (opsional)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma db seed

# Akses aplikasi di http://localhost (port 80)
```

### Untuk Server Production
Ikuti langkah lengkap di bagian [Step-by-Step Production Deployment](#step-by-step-production-deployment).

---

## Prerequisites

### Wajib
- Docker & Docker Compose
- Git

### Untuk Production Server
- Domain (untuk production)
- SSL Certificate (untuk HTTPS)
- SMTP Server (untuk email)
- Midtrans Account (untuk payment)

### Untuk Lokal/Testing
- Docker Desktop
- Browser modern

> **Catatan:** Untuk testing lokal, SSL Certificate **tidak diperlukan**.

---

## Environment Variables

Buat file `.env` di root project:

```env
# ============================================
# DATABASE
# ============================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=kos_management

# ============================================
# JWT AUTHENTICATION
# ============================================
JWT_SECRET=your-very-long-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# ============================================
# FRONTEND URL
# Untuk lokal: http://localhost
# Untuk production: https://yourdomain.com
# ============================================
FRONTEND_URL=http://localhost

# ============================================
# MIDTRANS PAYMENT GATEWAY
# ============================================
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false

# ============================================
# SMTP EMAIL
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@yourdomain.com

# ============================================
# IMAGE COMPRESSION (Opsional)
# ============================================
IMAGE_QUALITY=80
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
IMAGE_FORMAT=webp
```

### Perbedaan Environment

| Variable | Lokal/Testing | Production Server |
|----------|---------------|-------------------|
| `FRONTEND_URL` | `http://localhost` | `https://yourdomain.com` |
| `MIDTRANS_IS_PRODUCTION` | `false` | `true` |
| `POSTGRES_PASSWORD` | `postgres` | `[Password Kuat]` |

---

## Step-by-Step Production Deployment

### Step 1: Clone dan Persiapan

```bash
# 1. Clone repository
git clone https://github.com/yourusername/sistemManagemenKos.git
cd sistemManagemenKos

# 2. Copy file environment
cp .env.example .env
```

### Step 2: Konfigurasi `.env`

Edit file `.env` sesuai environment:

| Variable | Development | Production |
|----------|-------------|------------|
| `NODE_ENV` | development | **production** |
| `POSTGRES_PASSWORD` | postgres | **[Password Kuat]** |
| `JWT_SECRET` | your-super... | **[Random 64+ chars]** |
| `MIDTRANS_SERVER_KEY` | sandbox key | **[Production Key]** |
| `MIDTRANS_CLIENT_KEY` | sandbox key | **[Production Key]** |
| `MIDTRANS_IS_PRODUCTION` | false | **true** |
| `FRONTEND_URL` | http://localhost | **https://yourdomain.com** |

> **PENTING:** `FRONTEND_URL` harus sesuai dengan domain production untuk email verification, notifikasi, dan Midtrans callback!

**Generate JWT Secret yang aman:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3: Konfigurasi Nginx

Edit `docker/nginx/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;  # Untuk lokal
    # server_name yourdomain.com;  # Untuk production
    # ...
}
```

| Skenario | `server_name` |
|----------|---------------|
| Lokal/Laptop | `localhost` |
| Server dengan IP | IP address, misal `192.168.1.100` |
| Server dengan Domain | Domain Anda, misal `yourdomain.com` |

> **Catatan:** Untuk lokal, biarkan `localhost`. Tidak perlu mengubah apapun.

### Step 4: Setup SSL Certificate (Untuk Server Production Saja)

> ⚠️ **SKIP langkah ini jika menjalankan di lokal/laptop!**

```bash
# Buat direktori SSL
mkdir -p docker/nginx/ssl

# Letakkan certificate Anda
# docker/nginx/ssl/cert.pem
# docker/nginx/ssl/key.pem
```

### Step 5: Build dan Jalankan

```bash
# Build dan start semua services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Verifikasi semua container berjalan
docker ps
```

**Output yang diharapkan:**
```
CONTAINER ID   IMAGE          STATUS          PORTS
xxxxx          kos-nginx      Up              0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
xxxxx          kos-backend    Up              5000/tcp
xxxxx          kos-frontend   Up              80/tcp
xxxxx          postgres       Up (healthy)    5432/tcp
```

### Step 6: Jalankan Database Migration

```bash
# Apply migrations
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Seed data awal (opsional, untuk data testing)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma db seed
```

**Default Credentials setelah seed:**
| Role | Email | Password |
|------|-------|----------|
| Pemilik (Admin) | admin@kostmanagement.com | admin123 |
| Penghuni 1 | penghuni1@example.com | password123 |
| Penghuni 2 | penghuni2@example.com | password123 |

### Step 7: Konfigurasi Midtrans Dashboard (Production Only)

1. Login ke [Midtrans Dashboard](https://dashboard.midtrans.com)
2. Pergi ke **Settings > Configuration**
3. Set URL berikut:
   - **Finish Redirect URL**: `https://yourdomain.com/payment/finish`
   - **Unfinish Redirect URL**: `https://yourdomain.com/payment/unfinish`
   - **Error Redirect URL**: `https://yourdomain.com/payment/error`
   - **Notification URL**: `https://yourdomain.com/api/payment/notification`

### Step 8: Verifikasi Deployment

```bash
# Test API health
curl http://localhost/api/health

# Test halaman utama
curl http://localhost

# Check logs jika ada error
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

---

## Docker Commands Reference

### Restart Tanpa Down (Zero Downtime)

```bash
# Restart satu service (tanpa rebuild)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart frontend

# Rebuild & restart satu service (jika ada perubahan code)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build frontend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build nginx

# Rebuild & restart semua (hanya yang berubah)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

| Perintah | Downtime | Use Case |
|----------|----------|----------|
| `restart <service>` | ⚡ ~2-5 detik | Config change (env, nginx.conf) |
| `up -d --build <service>` | ⚡ ~10-30 detik | Code change |
| `up -d --build` | ⚡ Minimal | Update semua yang berubah |
| `down` + `up -d --build` | ⏱️ ~1-2 menit | Full reset, clean state |

### Development Mode

```bash
# Start development
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Production Mode

```bash
# Build & Start
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop all
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs nginx
```

---

## 🗄️ Database Management

### Migration

```bash
# Development - run migrations
docker-compose exec backend npx prisma migrate dev

# Production - apply migrations
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Seeding

```bash
# Development
docker-compose exec backend npx prisma db seed

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma db seed
```

### Reset Database (Development Only!)

```bash
# CAUTION: Deletes all data!
docker-compose exec backend npx prisma migrate reset --force
```

### Backup & Restore

```bash
# Backup database
docker exec kos-postgres pg_dump -U postgres kos_management > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i kos-postgres psql -U postgres kos_management < backup_20241222.sql
```

---

## 🌐 Port Mapping

| Service    | Development | Production |
|------------|-------------|------------|
| Frontend   | 3000        | 80 (via nginx) |
| Backend    | 5000        | 5000 (internal) |
| PostgreSQL | 5432        | 5432 |
| Nginx      | -           | 80, 443 |

---

## 📁 Volume & Data Persistence

### Named Volume vs Bind Mount

| Environment | Volume Type | File Location |
|-------------|-------------|---------------|
| Development | Bind Mount (`./backend/uploads`) | Folder lokal |
| Production | Named Volume (`backend_uploads`) | Docker internal |

### Backup Uploads (Production)

```bash
# Copy uploads dari container
docker cp kos-backend:/app/uploads ./backup_uploads

# Restore uploads ke container
docker cp ./backup_uploads/. kos-backend:/app/uploads/
```

---

## SSL/HTTPS Setup (Production Server)

### 1. Siapkan Certificate

Letakkan SSL certificate di `docker/nginx/ssl/`:
```
docker/nginx/ssl/
├── cert.pem
└── key.pem
```

### 2. Update Nginx Config

Edit `docker/nginx/nginx.conf`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... rest of config
}
```

---

## 📧 Email Notifications

Sistem email notification yang tersedia:

| Event | Penerima | Deskripsi |
|-------|----------|-----------|
| Registrasi User | User baru | Email verifikasi |
| Lupa Password | User | Link reset password |
| Pembayaran | Penghuni | Notifikasi status pembayaran |
| **Laporan Baru** | Pemilik/Admin | Notifikasi saat penghuni buat laporan |
| **Update Status Laporan** | Penghuni | Notifikasi saat status laporan berubah |

### Konfigurasi Gmail SMTP

1. Aktifkan 2FA di Google Account
2. Generate App Password: Google Account > Security > App passwords
3. Gunakan App Password di `SMTP_PASS`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App Password (bukan password biasa!)
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🖼️ Image Compression

Sistem secara otomatis mengompres gambar yang diupload untuk menghemat storage dan mempercepat loading.

### Fitur Kompresi

| Fitur | Deskripsi |
|-------|----------|
| **Auto Resize** | Resize ke max 1920x1080px |
| **WebP Conversion** | Convert ke format WebP (40-60% lebih kecil) |
| **Quality Control** | Kualitas 80% (configurable) |
| **All Upload Types** | Berlaku untuk profile, kamar, laporan, pembayaran |

### Konfigurasi (Opsional)

Tambahkan di `.env` jika ingin mengubah default:

```env
IMAGE_QUALITY=80        # Kualitas 1-100 (default: 80)
IMAGE_MAX_WIDTH=1920    # Lebar maksimal dalam px (default: 1920)
IMAGE_MAX_HEIGHT=1080   # Tinggi maksimal dalam px (default: 1080)
IMAGE_FORMAT=webp       # Format output: webp, jpeg, png (default: webp)
```

### Hasil Kompresi

Contoh hasil kompresi yang tercatat di log:
```
Image compressed: fotoKamar-xxx.jpg -> fotoKamar-xxx.webp (saved 97.6%)
```

> **Catatan:** Kompresi hanya berlaku untuk upload **baru**. Gambar yang sudah ada sebelum fitur ini aktif tidak akan dikompres otomatis.

---

## 🛠️ Troubleshooting

### Gambar Tidak Muncul

**Penyebab:** CORS blocking atau URL tidak benar.

**Solusi:**
1. Pastikan frontend di-build dengan `VITE_API_URL=/api` (relative path)
2. Pastikan nginx config sudah ada CORS headers untuk `/uploads`:
   ```nginx
   location ^~ /uploads {
       add_header Cross-Origin-Resource-Policy "cross-origin" always;
       add_header Access-Control-Allow-Origin "*" always;
       # ...
   }
   ```
3. Rebuild frontend: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build frontend`

### CORS Error

Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend yang diakses.

### Database Connection Error

```bash
# Check if postgres is running
docker ps | grep postgres

# Check postgres logs
docker logs kos-postgres

# Verify connection
docker exec kos-backend npx prisma db pull
```

### Port Already in Use

```bash
# Find process using port (Windows)
netstat -ano | findstr :80

# Kill process (Windows)
taskkill /PID <PID> /F

# Find process using port (Linux/Mac)
lsof -i :80
kill -9 <PID>
```

### Container Won't Start

```bash
# Check container logs
docker logs kos-backend
docker logs kos-frontend
docker logs kos-nginx

# Rebuild from scratch
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Email Tidak Terkirim

```bash
# Check backend logs untuk error email
docker logs kos-backend | grep -i email

# Verify SMTP config
docker exec kos-backend env | grep SMTP
```

### Sharp / Image Compression Error

```bash
# Test apakah sharp berfungsi
docker exec kos-backend node -e "require('sharp'); console.log('Sharp OK')"

# Jika error "Cannot find module 'sharp'", rebuild backend:
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache backend
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d backend

# Jika error "out of memory", restart Docker Desktop:
# Windows: wsl --shutdown (di PowerShell)
# Lalu buka Docker Desktop lagi
```

### Upload File Gagal (413 Request Entity Too Large)

**Penyebab:** Nginx membatasi ukuran upload.

**Solusi:** Pastikan `nginx.conf` sudah ada:
```nginx
http {
    # ...
    client_max_body_size 50M;
    # ...
}
```

---

## ✅ Production Checklist

Sebelum go-live, pastikan semua item berikut sudah dicek:

### Environment
- [ ] `.env` sudah dikonfigurasi dengan nilai production
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL` mengarah ke domain production
- [ ] Database password sudah diganti dari default
- [ ] JWT_SECRET menggunakan random string yang kuat (64+ chars)

### Payments
- [ ] `MIDTRANS_IS_PRODUCTION=true`
- [ ] `MIDTRANS_SERVER_KEY` menggunakan production key
- [ ] `MIDTRANS_CLIENT_KEY` menggunakan production key
- [ ] Midtrans dashboard sudah dikonfigurasi dengan URL production

### Infrastructure
- [ ] SSL certificate sudah terpasang (untuk HTTPS)
- [ ] Nginx `server_name` sudah diset ke domain
- [ ] Semua container berjalan (`docker ps`)
- [ ] Database migration sudah dijalankan

### Email
- [ ] Email SMTP sudah ditest dan berfungsi
- [ ] App Password sudah digenerate (untuk Gmail)

### Testing
- [ ] Homepage bisa diakses
- [ ] Login/Register berfungsi
- [ ] Email verifikasi terkirim
- [ ] Payment flow berjalan
- [ ] Upload gambar berfungsi dan terkompres (cek log: "Image compressed")

---

## Project Structure (Docker)

```
├── docker-compose.yml          # Base configuration (development)
├── docker-compose.prod.yml     # Production overrides
├── .env                        # Environment variables
├── backend/
│   ├── Dockerfile              # Backend container
│   └── uploads/                # Uploaded files (bind mount in dev)
├── frontend/
│   ├── Dockerfile              # Frontend container (includes VITE_API_URL)
│   └── nginx.conf              # Frontend nginx config
└── docker/
    ├── nginx/
    │   ├── Dockerfile          # Reverse proxy
    │   ├── nginx.conf          # Nginx configuration (with CORS headers)
    │   └── ssl/                # SSL certificates (production only)
    │       ├── cert.pem
    │       └── key.pem
    └── postgres/
        └── init.sql            # Database initialization
```

---

## Update & Redeploy

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart (tanpa downtime)
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# 3. Run new migrations if any
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# 4. Verify
docker ps
curl http://localhost/api/health
```
