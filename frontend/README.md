# Kost Management System - Frontend

Aplikasi frontend untuk sistem manajemen kos dengan React.js, Vite, dan TailwindCSS.

## 🚀 Tech Stack

- **React 18** - Library UI
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS framework
- **Zustand** - State management
- **React Router v6** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## 📁 Struktur Folder

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/         # UI components (Button, Modal, Badge, etc.)
│   │   ├── forms/          # Form components (Input, Select, etc.)
│   │   └── layout/         # Layout components (Navbar, Sidebar)
│   ├── features/           # Zustand stores per feature
│   │   ├── auth/           # Authentication store
│   │   ├── kamar/          # Room management store
│   │   ├── users/          # User management store
│   │   ├── tagihan/        # Billing store
│   │   ├── laporan/        # Report store
│   │   ├── barang/         # Inventory store
│   │   └── payment/        # Payment store
│   ├── pages/              # Page components
│   │   ├── auth/           # Login, Register
│   │   ├── dashboard/      # Dashboard
│   │   ├── kamar/          # Room pages
│   │   ├── users/          # User pages
│   │   ├── tagihan/        # Billing pages
│   │   ├── laporan/        # Report pages
│   │   ├── barang/         # Inventory pages
│   │   └── payment/        # Payment pages
│   ├── routes/             # Router configuration
│   ├── services/           # API services
│   ├── utils/              # Utilities & helpers
│   ├── App.jsx            
│   ├── main.jsx           
│   └── index.css          
├── .env.example            # Environment template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone & navigate
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local sesuai kebutuhan
```

### Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
```

### Development

```bash
# Start development server
npm run dev

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Components

### Common Components

| Component | Path | Description |
|-----------|------|-------------|
| `Button` | `components/common/Button` | Button dengan variants, sizes, loading |
| `Modal` | `components/common/Modal` | Modal dialog dengan sizes |
| `ConfirmModal` | `components/common/ConfirmModal` | Confirmation dialog |
| `Badge` | `components/common/Badge` | Status badges |
| `Card` | `components/common/Card` | Card container |
| `Loading` | `components/common/Loading` | Loading spinner |
| `Alert` | `components/common/Alert` | Alert messages |
| `EmptyState` | `components/common/EmptyState` | Empty state display |
| `Pagination` | `components/common/Pagination` | Pagination control |

### Form Components

| Component | Path | Description |
|-----------|------|-------------|
| `Input` | `components/forms/Input` | Text input dengan label, error |
| `Select` | `components/forms/Select` | Dropdown select |
| `Textarea` | `components/forms/Textarea` | Multi-line text input |
| `Checkbox` | `components/forms/Checkbox` | Checkbox input |
| `Toggle` | `components/forms/Toggle` | Toggle switch |
| `RadioGroup` | `components/forms/RadioGroup` | Radio button group |
| `FileUpload` | `components/forms/FileUpload` | File upload dengan drag & drop |

### Usage Example

```jsx
import { Button, Modal, Badge, Card } from '@/components';
import { Input, Select, Toggle } from '@/components';

// Button variants
<Button variant="primary">Primary</Button>
<Button variant="danger" isLoading>Loading...</Button>
<Button variant="outline" leftIcon={<HiPlus />}>Add</Button>

// Form inputs
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>

// Modal
<Modal isOpen={isOpen} onClose={onClose} title="Edit User">
  <p>Modal content here</p>
</Modal>
```

## 📄 Pages

### Auth
- `/login` - Login page
- `/register` - Register page

### Dashboard
- `/dashboard` - Main dashboard dengan statistik

### Kamar (Rooms)
- `/kamar` - List semua kamar
- `/kamar/new` - Tambah kamar baru (Pemilik)
- `/kamar/:id` - Detail kamar
- `/kamar/:id/edit` - Edit kamar (Pemilik)

### Users (Pemilik only)
- `/users` - List semua pengguna
- `/users/new` - Tambah pengguna
- `/users/:id/edit` - Edit pengguna

### Tagihan (Bills)
- `/tagihan` - List tagihan
- `/tagihan/new` - Buat tagihan (Pemilik)
- `/tagihan/:id` - Detail tagihan
- `/tagihan/:id/edit` - Edit tagihan (Pemilik)

### Laporan (Reports)
- `/laporan` - List laporan
- `/laporan/new` - Buat laporan (Penghuni)
- `/laporan/:id` - Detail laporan
- `/laporan/:id/edit` - Edit laporan

### Barang (Inventory)
- `/barang` - List inventaris
- `/barang/new` - Tambah barang (Pemilik)
- `/barang/:id/edit` - Edit barang (Pemilik)

### Payment
- `/payment` - Riwayat pembayaran
- `/payment/:id` - Detail pembayaran
- `/payment/finish` - Callback dari Midtrans

## 🔐 Authentication & Authorization

### Roles
- **PEMILIK** - Pemilik kos, full access
- **PENGHUNI** - Penghuni kos, limited access

### Protected Routes
Routes dilindungi menggunakan:
- `ProtectedRoute` - Require authentication
- `RoleRoute` - Require specific role

```jsx
<Route
  path="/users"
  element={
    <RoleRoute allowedRoles={['PEMILIK']}>
      <UserList />
    </RoleRoute>
  }
/>
```

## 📦 State Management

Menggunakan Zustand untuk state management per-feature:

```jsx
// Import store
import { useAuthStore } from '@/features/auth/authStore';
import { useKamarStore } from '@/features/kamar/kamarStore';

// Usage in component
const { user, logout } = useAuthStore();
const { kamar, fetchKamar, isLoading } = useKamarStore();

useEffect(() => {
  fetchKamar({ page: 1, limit: 10 });
}, []);
```

## 🎨 Styling

### TailwindCSS Classes
Custom classes tersedia di `index.css`:

```css
/* Buttons */
.btn-primary, .btn-outline, .btn-success, .btn-danger

/* Forms */
.input, .input-error, .label, .error-message

/* Cards */
.card, .card-header, .card-body

/* Badges */
.badge, .badge-success, .badge-warning, .badge-danger, .badge-info
```

### Color Palette
- Primary: Blue (#2563eb)
- Success: Green (#16a34a)
- Warning: Yellow (#ca8a04)
- Danger: Red (#dc2626)

## 🔌 API Integration

Services configure di `src/services/`:

```javascript
// api.js - Axios instance dengan interceptors
import api from './api';

// Service example
export const kamarService = {
  getAll: (params) => api.get('/kamar', { params }),
  getById: (id) => api.get(`/kamar/${id}`),
  create: (data) => api.post('/kamar', data),
  update: (id, data) => api.put(`/kamar/${id}`, data),
  delete: (id) => api.delete(`/kamar/${id}`),
};
```

## 💳 Payment Integration

Midtrans Snap integration untuk pembayaran:

```javascript
// Load Midtrans script di index.html
<script src="https://app.sandbox.midtrans.com/snap/snap.js"></script>

// Initiate payment
window.snap.pay(snapToken, {
  onSuccess: (result) => { /* handle success */ },
  onPending: (result) => { /* handle pending */ },
  onError: (result) => { /* handle error */ },
});
```

## 📋 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🤝 Contributing

1. Buat branch baru dari `main`
2. Commit changes dengan pesan yang jelas
3. Push branch dan buat Pull Request

## 📝 License

MIT License
