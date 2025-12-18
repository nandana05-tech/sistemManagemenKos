# Component Documentation

Dokumentasi lengkap untuk reusable components di aplikasi Kost Management System.

## Table of Contents

- [Common Components](#common-components)
  - [Button](#button)
  - [Modal](#modal)
  - [ConfirmModal](#confirmmodal)
  - [Badge](#badge)
  - [Card](#card)
  - [Loading](#loading)
  - [Alert](#alert)
  - [EmptyState](#emptystate)
  - [Pagination](#pagination)
- [Form Components](#form-components)
  - [Input](#input)
  - [Select](#select)
  - [Textarea](#textarea)
  - [Checkbox](#checkbox)
  - [Toggle](#toggle)
  - [RadioGroup](#radiogroup)
  - [FileUpload](#fileupload)

---

## Common Components

### Button

Button component dengan berbagai variants dan states.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'outline' \| 'ghost'` | `'primary'` | Style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `leftIcon` | `ReactNode` | - | Icon di kiri text |
| `rightIcon` | `ReactNode` | - | Icon di kanan text |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |

#### Example

```jsx
import { Button } from '@/components';
import { HiPlus, HiDownload } from 'react-icons/hi';

// Basic
<Button>Click Me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Outline</Button>

// With icons
<Button leftIcon={<HiPlus />}>Add New</Button>
<Button rightIcon={<HiDownload />}>Download</Button>

// Loading state
<Button isLoading>Processing...</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

---

### Modal

Modal dialog dengan portal rendering.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Control visibility |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full'` | `'md'` | Modal width |
| `showCloseButton` | `boolean` | `true` | Show X button |
| `closeOnOverlay` | `boolean` | `true` | Close on overlay click |
| `footer` | `ReactNode` | - | Footer content |

#### Example

```jsx
import { Modal, Button } from '@/components';

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit User"
  size="lg"
  footer={
    <div className="flex gap-2 justify-end">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save</Button>
    </div>
  }
>
  <p>Modal content here...</p>
</Modal>
```

---

### ConfirmModal

Modal konfirmasi untuk aksi berbahaya.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Control visibility |
| `onClose` | `() => void` | - | Close handler |
| `onConfirm` | `() => void` | - | Confirm handler |
| `title` | `string` | `'Konfirmasi'` | Dialog title |
| `message` | `string` | - | Confirmation message |
| `confirmText` | `string` | `'Ya, Lanjutkan'` | Confirm button text |
| `cancelText` | `string` | `'Batal'` | Cancel button text |
| `variant` | `'danger' \| 'warning' \| 'info' \| 'question'` | `'danger'` | Icon & style |
| `isLoading` | `boolean` | `false` | Loading state |

#### Example

```jsx
import { ConfirmModal } from '@/components';

<ConfirmModal
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  variant="danger"
  title="Hapus Data?"
  message="Data ini akan dihapus permanen."
  confirmText="Ya, Hapus"
  isLoading={isDeleting}
/>
```

---

### Badge

Status badge/tag component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `dot` | `boolean` | `false` | Show status dot |
| `icon` | `ReactNode` | - | Left icon |
| `removable` | `boolean` | `false` | Show remove button |
| `onRemove` | `() => void` | - | Remove handler |

#### Example

```jsx
import { Badge } from '@/components';
import { HiCheck } from 'react-icons/hi';

<Badge variant="success">Active</Badge>
<Badge variant="warning" dot>Pending</Badge>
<Badge variant="danger" icon={<HiCheck />}>Verified</Badge>
<Badge removable onRemove={() => {}}>Tag</Badge>
```

---

### Card

Card container dengan subcomponents.

#### Subcomponents

- `Card.Header` - Header section
- `Card.Body` - Body/content section
- `Card.Footer` - Footer section

#### Example

```jsx
import { Card } from '@/components';

<Card hover>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content...</p>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

---

### Loading

Loading spinner component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Spinner size |
| `text` | `string` | - | Loading text |
| `fullScreen` | `boolean` | `false` | Full screen mode |
| `overlay` | `boolean` | `false` | Overlay mode |

#### Example

```jsx
import { Loading } from '@/components';

// Basic
<Loading />

// With text
<Loading text="Memuat data..." />

// Full screen
<Loading fullScreen />

// Overlay (in relative container)
<div className="relative">
  <Loading overlay />
</div>
```

---

### Alert

Alert message component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Alert type |
| `title` | `string` | - | Alert title |
| `dismissible` | `boolean` | `false` | Can dismiss |
| `onDismiss` | `() => void` | - | Dismiss handler |
| `icon` | `ReactNode` | - | Custom icon |

#### Example

```jsx
import { Alert } from '@/components';

<Alert variant="success" title="Berhasil!">
  Data berhasil disimpan.
</Alert>

<Alert 
  variant="warning" 
  title="Perhatian"
  dismissible 
  onDismiss={() => {}}
>
  Session akan berakhir dalam 5 menit.
</Alert>
```

---

### EmptyState

Empty state display component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `ComponentType` | - | Icon component |
| `title` | `string` | - | Title text |
| `description` | `string` | - | Description text |
| `action` | `ReactNode` | - | Action button |

#### Example

```jsx
import { EmptyState, Button } from '@/components';
import { HiInbox } from 'react-icons/hi';

<EmptyState
  icon={HiInbox}
  title="Tidak ada data"
  description="Belum ada data yang tersedia."
  action={<Button>Tambah Baru</Button>}
/>
```

---

### Pagination

Pagination control component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | - | Current page number |
| `totalPages` | `number` | - | Total pages |
| `totalItems` | `number` | - | Total items count |
| `itemsPerPage` | `number` | - | Items per page |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `showInfo` | `boolean` | `true` | Show item info |

#### Example

```jsx
import { Pagination } from '@/components';

<Pagination
  currentPage={page}
  totalPages={10}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={(p) => setPage(p)}
/>
```

---

## Form Components

### Input

Text input dengan label dan error handling.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `leftIcon` | `ReactNode` | - | Left icon |
| `rightIcon` | `ReactNode` | - | Right icon |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Input size |
| `required` | `boolean` | `false` | Show required mark |

#### Example

```jsx
import { Input } from '@/components';
import { HiMail } from 'react-icons/hi';

<Input
  label="Email"
  type="email"
  placeholder="email@example.com"
  leftIcon={<HiMail />}
  required
  {...register('email')}
  error={errors.email?.message}
/>
```

---

### Select

Dropdown select component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Select label |
| `options` | `{ value: string, label: string }[]` | `[]` | Options array |
| `placeholder` | `string` | `'Pilih opsi'` | Placeholder |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |

#### Example

```jsx
import { Select } from '@/components';

<Select
  label="Role"
  options={[
    { value: 'PEMILIK', label: 'Pemilik' },
    { value: 'PENGHUNI', label: 'Penghuni' },
  ]}
  placeholder="Pilih role"
  {...register('role')}
/>
```

---

### Textarea

Multi-line text input.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Textarea label |
| `rows` | `number` | `4` | Number of rows |
| `maxLength` | `number` | - | Max characters |
| `showCount` | `boolean` | `false` | Show character count |
| `error` | `string` | - | Error message |

#### Example

```jsx
import { Textarea } from '@/components';

<Textarea
  label="Deskripsi"
  rows={5}
  maxLength={500}
  showCount
  {...register('description')}
/>
```

---

### Checkbox

Checkbox input component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Checkbox label |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Checkbox size |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |

#### Example

```jsx
import { Checkbox } from '@/components';

<Checkbox
  label="Saya menyetujui syarat dan ketentuan"
  {...register('terms')}
/>
```

---

### Toggle

Toggle switch component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Toggle label |
| `description` | `string` | - | Description text |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggle size |

#### Example

```jsx
import { Toggle } from '@/components';

<Toggle
  label="Aktifkan Notifikasi"
  description="Dapatkan notifikasi melalui email"
  {...register('notifications')}
/>
```

---

### RadioGroup

Radio button group component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Group label |
| `options` | `{ value, label, description? }[]` | `[]` | Options |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout |
| `name` | `string` | - | Field name |
| `value` | `string` | - | Selected value |
| `onChange` | `(value: string) => void` | - | Change handler |

#### Example

```jsx
import { RadioGroup } from '@/components';

<RadioGroup
  label="Prioritas"
  name="priority"
  options={[
    { value: 'LOW', label: 'Rendah' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'HIGH', label: 'Tinggi' },
  ]}
  value={priority}
  onChange={setPriority}
/>
```

---

### FileUpload

File upload dengan drag & drop.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Upload label |
| `accept` | `string` | `'image/*'` | Accepted file types |
| `multiple` | `boolean` | `false` | Allow multiple |
| `maxSize` | `number` | `5MB` | Max file size |
| `maxFiles` | `number` | `5` | Max number of files |
| `preview` | `boolean` | `true` | Show preview |
| `value` | `File[]` | `[]` | Current files |
| `onChange` | `(files: File[]) => void` | - | Change handler |

#### Example

```jsx
import { FileUpload } from '@/components';

const [files, setFiles] = useState([]);

<FileUpload
  label="Foto Kamar"
  accept="image/*"
  multiple
  maxFiles={5}
  maxSize={2 * 1024 * 1024} // 2MB
  value={files}
  onChange={setFiles}
/>
```
