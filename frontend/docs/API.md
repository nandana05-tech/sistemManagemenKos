# API Documentation

Dokumentasi API services untuk frontend Kost Management System.

## Base Configuration

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor
- Menambahkan Authorization header dengan token dari localStorage

### Response Interceptor
- Handle response format
- Handle 401 Unauthorized (auto logout)
- Handle error messages

---

## Authentication Service

**File:** `src/services/auth.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login user |
| POST | `/auth/register` | Register new user |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout user |
| POST | `/auth/refresh` | Refresh token |

### Usage

```javascript
import { authService } from '@/services/auth.service';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  noTelepon: '08123456789'
});

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

---

## Kamar Service

**File:** `src/services/kamar.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/kamar` | Get all rooms |
| GET | `/kamar/:id` | Get room by ID |
| POST | `/kamar` | Create room (Pemilik) |
| PUT | `/kamar/:id` | Update room (Pemilik) |
| DELETE | `/kamar/:id` | Delete room (Pemilik) |
| PATCH | `/kamar/:id/status` | Update room status |

### Parameters

**GET /kamar**
```javascript
{
  page: number,
  limit: number,
  search: string,
  status: 'TERSEDIA' | 'TERISI' | 'PERBAIKAN',
  kategori: string,
  minHarga: number,
  maxHarga: number
}
```

### Usage

```javascript
import { kamarService } from '@/services/kamar.service';

// Get all rooms
const rooms = await kamarService.getAll({
  page: 1,
  limit: 10,
  status: 'TERSEDIA'
});

// Get room by ID
const room = await kamarService.getById(1);

// Create room
const newRoom = await kamarService.create({
  namaKamar: 'Kamar 101',
  nomorKamar: '101',
  hargaBulanan: 1500000,
  ukuran: 16,
  kapasitas: 1,
  status: 'TERSEDIA'
});

// Update status
await kamarService.updateStatus(1, 'TERISI');
```

---

## User Service

**File:** `src/services/user.service.js`

### Endpoints (Pemilik only, except updateProfile)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| PUT | `/users/profile` | Update own profile |
| DELETE | `/users/:id` | Delete user |
| PATCH | `/users/:id/toggle-status` | Toggle active status |

### Usage

```javascript
import { userService } from '@/services/user.service';

// Get all users
const users = await userService.getAll({
  page: 1,
  limit: 10,
  role: 'PENGHUNI'
});

// Create user
const newUser = await userService.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'PENGHUNI',
  noTelepon: '08123456789'
});

// Toggle status
await userService.toggleStatus(1);
```

---

## Tagihan Service

**File:** `src/services/tagihan.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tagihan` | Get all bills |
| GET | `/tagihan/:id` | Get bill by ID |
| POST | `/tagihan` | Create bill (Pemilik) |
| PUT | `/tagihan/:id` | Update bill (Pemilik) |
| DELETE | `/tagihan/:id` | Delete bill (Pemilik) |
| POST | `/tagihan/generate-monthly` | Generate monthly bills |
| GET | `/tagihan/summary` | Get billing summary |

### Parameters

**GET /tagihan**
```javascript
{
  page: number,
  limit: number,
  status: 'BELUM_LUNAS' | 'LUNAS' | 'JATUH_TEMPO',
  userId: number,
  startDate: string,
  endDate: string
}
```

### Usage

```javascript
import { tagihanService } from '@/services/tagihan.service';

// Get all bills
const bills = await tagihanService.getAll({ status: 'BELUM_LUNAS' });

// Get summary
const summary = await tagihanService.getSummary();
// Response: { total, belumLunas, lunas, jatuhTempo, totalNominal }

// Generate monthly bills
await tagihanService.generateMonthly();

// Create bill
const bill = await tagihanService.create({
  userId: 1,
  riwayatSewaId: 1,
  jenisTagihan: 'SEWA_BULANAN',
  nominal: 1500000,
  tanggalJatuhTempo: '2024-01-31'
});
```

---

## Laporan Service

**File:** `src/services/laporan.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/laporan` | Get all reports |
| GET | `/laporan/:id` | Get report by ID |
| POST | `/laporan` | Create report (Penghuni) |
| PUT | `/laporan/:id` | Update report |
| PATCH | `/laporan/:id/status` | Update status (Pemilik) |
| DELETE | `/laporan/:id` | Delete report |
| GET | `/laporan/summary` | Get report summary |

### Parameters

**GET /laporan**
```javascript
{
  page: number,
  limit: number,
  status: 'DIAJUKAN' | 'DIPROSES' | 'SELESAI' | 'DITOLAK',
  prioritas: 'RENDAH' | 'NORMAL' | 'TINGGI' | 'URGENT'
}
```

### Usage

```javascript
import { laporanService } from '@/services/laporan.service';

// Get all reports
const reports = await laporanService.getAll({ 
  status: 'DIAJUKAN',
  prioritas: 'URGENT'
});

// Create report
const report = await laporanService.create({
  kamarId: 1,
  judul: 'AC Tidak Dingin',
  isiLaporan: 'AC di kamar saya sudah tidak dingin...',
  jenisLaporan: 'AC',
  prioritas: 'TINGGI'
});

// Update status
await laporanService.updateStatus(1, 'SELESAI', new Date().toISOString());
```

---

## Barang Service

**File:** `src/services/barang.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/barang/kategori` | Get all categories |
| POST | `/barang/kategori` | Create category |
| DELETE | `/barang/kategori/:id` | Delete category |
| GET | `/barang/nama` | Get item names by category |
| POST | `/barang/nama` | Create item name |
| GET | `/barang` | Get all inventory items |
| POST | `/barang` | Create inventory item |
| PUT | `/barang/:id` | Update inventory item |
| DELETE | `/barang/:id` | Delete inventory item |
| GET | `/barang/inventori/:kamarId` | Get inventory by room |
| POST | `/barang/inventori` | Add item to room |

### Usage

```javascript
import { barangService } from '@/services/barang.service';

// Get categories
const categories = await barangService.getAllKategori();

// Create category
await barangService.createKategori({ namaKategori: 'Elektronik' });

// Get item names by category
const items = await barangService.getAllNamaBarang(categoryId);

// Create inventory item
await barangService.create({
  namaBarangId: 1,
  kamarId: 1,
  jumlah: 1,
  kondisi: 'BAIK',
  keterangan: 'AC 1 PK'
});
```

---

## Payment Service

**File:** `src/services/payment.service.js`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/payment` | Get all payments |
| GET | `/payment/:id` | Get payment by ID |
| POST | `/payment` | Create payment (initiate) |
| POST | `/payment/:id/verify` | Verify payment (Pemilik) |
| GET | `/payment/:id/status` | Check payment status |

### Usage

```javascript
import { paymentService } from '@/services/payment.service';

// Get all payments
const payments = await paymentService.getAll({ status: 'SUCCESS' });

// Create payment (get Midtrans token)
const response = await paymentService.create(tagihanId);
// Response includes snapToken for Midtrans

// Verify payment manually
await paymentService.verify(paymentId);

// Check payment status
const status = await paymentService.checkStatus(paymentId);
```

---

## Error Handling

All services throw errors with the following format:

```javascript
{
  message: string,
  status: number,
  errors?: object // Validation errors
}
```

### Example

```javascript
try {
  await authService.login(credentials);
} catch (error) {
  console.error(error.message); // "Email atau password salah"
  toast.error(error.message);
}
```

---

## Response Format

### Success Response

```javascript
{
  success: true,
  data: object | array,
  meta?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Error Response

```javascript
{
  success: false,
  message: string,
  errors?: object
}
```
