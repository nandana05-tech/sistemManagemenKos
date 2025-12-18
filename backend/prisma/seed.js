const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create Pemilik (Owner/Admin)
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const pemilik = await prisma.user.upsert({
    where: { email: 'admin@kostmanagement.com' },
    update: {},
    create: {
      name: 'Admin Kost',
      email: 'admin@kostmanagement.com',
      password: hashedPassword,
      role: 'PEMILIK',
      noTelepon: '08123456789',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Created pemilik: ${pemilik.email}`);

  // Create sample Penghuni (Tenants)
  const penghuni1 = await prisma.user.upsert({
    where: { email: 'penghuni1@example.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'penghuni1@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'PENGHUNI',
      noTelepon: '08111222333',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Created penghuni: ${penghuni1.email}`);

  const penghuni2 = await prisma.user.upsert({
    where: { email: 'penghuni2@example.com' },
    update: {},
    create: {
      name: 'Siti Aminah',
      email: 'penghuni2@example.com',
      password: await bcrypt.hash('password123', 12),
      role: 'PENGHUNI',
      noTelepon: '08222333444',
      isActive: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log(`✅ Created penghuni: ${penghuni2.email}`);

  // Create Kategori Kamar
  const kategoriStandard = await prisma.kategoriKamar.upsert({
    where: { namaKategori: 'Standard' },
    update: {},
    create: {
      namaKategori: 'Standard',
      deskripsi: 'Kamar standard dengan fasilitas dasar',
      hargaDasar: 1500000,
    },
  });

  const kategoriDeluxe = await prisma.kategoriKamar.upsert({
    where: { namaKategori: 'Deluxe' },
    update: {},
    create: {
      namaKategori: 'Deluxe',
      deskripsi: 'Kamar deluxe dengan fasilitas lengkap',
      hargaDasar: 2500000,
    },
  });

  const kategoriSuite = await prisma.kategoriKamar.upsert({
    where: { namaKategori: 'Suite' },
    update: {},
    create: {
      namaKategori: 'Suite',
      deskripsi: 'Kamar suite premium dengan fasilitas mewah',
      hargaDasar: 4000000,
    },
  });
  console.log('✅ Created kategori kamar');

  // Create Kamar - using upsert on unique namaKamar
  const kamar1 = await prisma.kamar.upsert({
    where: { namaKamar: 'Kamar Standard A101' },
    update: {},
    create: {
      nomorKamar: 'A101',
      namaKamar: 'Kamar Standard A101',
      kategoriId: kategoriStandard.id,
      hargaPerBulan: 1500000,
      luasKamar: 12,
      lantai: 1,
      deskripsi: 'Kamar nyaman dengan jendela menghadap taman',
      status: 'TERISI',
      stokKamar: 1,
    },
  });

  const kamar2 = await prisma.kamar.upsert({
    where: { namaKamar: 'Kamar Standard A102' },
    update: {},
    create: {
      nomorKamar: 'A102',
      namaKamar: 'Kamar Standard A102',
      kategoriId: kategoriStandard.id,
      hargaPerBulan: 1500000,
      luasKamar: 12,
      lantai: 1,
      deskripsi: 'Kamar nyaman dengan AC dan kamar mandi dalam',
      status: 'TERSEDIA',
      stokKamar: 1,
    },
  });

  const kamar3 = await prisma.kamar.upsert({
    where: { namaKamar: 'Kamar Deluxe B201' },
    update: {},
    create: {
      nomorKamar: 'B201',
      namaKamar: 'Kamar Deluxe B201',
      kategoriId: kategoriDeluxe.id,
      hargaPerBulan: 2500000,
      luasKamar: 20,
      lantai: 2,
      deskripsi: 'Kamar luas dengan balkon pribadi',
      status: 'TERISI',
      stokKamar: 1,
    },
  });

  const kamar4 = await prisma.kamar.upsert({
    where: { namaKamar: 'Kamar Suite C301' },
    update: {},
    create: {
      nomorKamar: 'C301',
      namaKamar: 'Kamar Suite C301',
      kategoriId: kategoriSuite.id,
      hargaPerBulan: 4000000,
      luasKamar: 30,
      lantai: 3,
      deskripsi: 'Kamar suite dengan ruang tamu dan dapur kecil',
      status: 'TERSEDIA',
      stokKamar: 1,
    },
  });
  console.log('✅ Created kamar');

  // Delete existing fasilitas first, then recreate
  await prisma.fasilitasKamar.deleteMany({
    where: { kamarId: { in: [kamar1.id, kamar2.id, kamar3.id, kamar4.id] } }
  });

  // Create Fasilitas for each room
  const fasilitasData = [
    { kamarId: kamar1.id, namaFasilitas: 'AC', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar1.id, namaFasilitas: 'Kamar Mandi Dalam', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar1.id, namaFasilitas: 'WiFi', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar2.id, namaFasilitas: 'AC', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar2.id, namaFasilitas: 'Kamar Mandi Dalam', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar3.id, namaFasilitas: 'AC', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar3.id, namaFasilitas: 'Kamar Mandi Dalam', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar3.id, namaFasilitas: 'TV LED', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar3.id, namaFasilitas: 'Balkon', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar4.id, namaFasilitas: 'AC', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar4.id, namaFasilitas: 'Kamar Mandi Dalam', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar4.id, namaFasilitas: 'Dapur Kecil', jumlah: 1, kondisi: 'Baik' },
    { kamarId: kamar4.id, namaFasilitas: 'Ruang Tamu', jumlah: 1, kondisi: 'Baik' },
  ];

  await prisma.fasilitasKamar.createMany({ data: fasilitasData });
  console.log('✅ Created fasilitas kamar');

  // Create Kategori Barang
  const kategoriElektronik = await prisma.kategoriBarang.upsert({
    where: { namaKategori: 'Elektronik' },
    update: {},
    create: { namaKategori: 'Elektronik' },
  });

  const kategoriFurniture = await prisma.kategoriBarang.upsert({
    where: { namaKategori: 'Furniture' },
    update: {},
    create: { namaKategori: 'Furniture' },
  });

  const kategoriPerabotan = await prisma.kategoriBarang.upsert({
    where: { namaKategori: 'Perabotan' },
    update: {},
    create: { namaKategori: 'Perabotan' },
  });
  console.log('✅ Created kategori barang');

  // Skip nama barang if already exists to avoid conflicts
  const existingNamaBarang = await prisma.namaBarang.findFirst();
  if (!existingNamaBarang) {
    const namaBarangData = [
      { kategoriId: kategoriElektronik.id, namaBarang: 'AC' },
      { kategoriId: kategoriElektronik.id, namaBarang: 'TV LED' },
      { kategoriId: kategoriElektronik.id, namaBarang: 'Kulkas' },
      { kategoriId: kategoriFurniture.id, namaBarang: 'Kasur' },
      { kategoriId: kategoriFurniture.id, namaBarang: 'Lemari' },
      { kategoriId: kategoriFurniture.id, namaBarang: 'Meja Belajar' },
      { kategoriId: kategoriPerabotan.id, namaBarang: 'Shower' },
      { kategoriId: kategoriPerabotan.id, namaBarang: 'Cermin' },
    ];
    await prisma.namaBarang.createMany({ data: namaBarangData });
    console.log('✅ Created nama barang');
  } else {
    console.log('⏭️ Nama barang already exists, skipping');
  }

  // Check if riwayat sewa already exists
  const existingRiwayat = await prisma.riwayatSewa.findFirst({
    where: { userId: penghuni1.id, kamarId: kamar1.id }
  });

  if (!existingRiwayat) {
    // Create Riwayat Sewa
    const riwayat1 = await prisma.riwayatSewa.create({
      data: {
        kodeSewa: `SEWA-${Date.now()}-001`,
        userId: penghuni1.id,
        kamarId: kamar1.id,
        tanggalMulai: new Date('2024-01-01'),
        tanggalBerakhir: new Date('2024-12-31'),
        durasiBulan: 12,
        hargaSewa: 1500000,
        deposit: 3000000,
        status: 'AKTIF',
      },
    });

    const riwayat2 = await prisma.riwayatSewa.create({
      data: {
        kodeSewa: `SEWA-${Date.now()}-002`,
        userId: penghuni2.id,
        kamarId: kamar3.id,
        tanggalMulai: new Date('2024-03-01'),
        tanggalBerakhir: new Date('2025-02-28'),
        durasiBulan: 12,
        hargaSewa: 2500000,
        deposit: 5000000,
        status: 'AKTIF',
      },
    });
    console.log('✅ Created riwayat sewa');

    // Create Tagihan
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 10);

    await prisma.tagihan.create({
      data: {
        nomorTagihan: `TGH-${Date.now()}-001`,
        riwayatSewaId: riwayat1.id,
        userId: penghuni1.id,
        jenisTagihan: 'SEWA_BULANAN',
        nominal: 1500000,
        tanggalJatuhTempo: dueDate,
        status: 'BELUM_LUNAS',
        keterangan: 'Tagihan sewa bulan Desember 2024',
      },
    });

    await prisma.tagihan.create({
      data: {
        nomorTagihan: `TGH-${Date.now()}-002`,
        riwayatSewaId: riwayat2.id,
        userId: penghuni2.id,
        jenisTagihan: 'SEWA_BULANAN',
        nominal: 2500000,
        tanggalJatuhTempo: dueDate,
        status: 'BELUM_LUNAS',
        keterangan: 'Tagihan sewa bulan Desember 2024',
      },
    });
    console.log('✅ Created tagihan');
  } else {
    console.log('⏭️ Riwayat sewa already exists, skipping');
  }

  // Check if laporan already exists
  const existingLaporan = await prisma.laporan.findFirst({
    where: { userId: penghuni1.id }
  });

  if (!existingLaporan) {
    // Create Laporan
    await prisma.laporan.create({
      data: {
        userId: penghuni1.id,
        kamarId: kamar1.id,
        judul: 'AC Tidak Dingin',
        isiLaporan: 'AC di kamar tidak mengeluarkan udara dingin, sudah 2 hari tidak berfungsi dengan baik.',
        prioritas: 'TINGGI',
        status: 'DIAJUKAN',
      },
    });

    await prisma.laporan.create({
      data: {
        userId: penghuni2.id,
        kamarId: kamar3.id,
        judul: 'Keran Bocor',
        isiLaporan: 'Keran di kamar mandi bocor kecil, perlu diganti.',
        prioritas: 'NORMAL',
        status: 'DIPROSES',
      },
    });
    console.log('✅ Created laporan');
  } else {
    console.log('⏭️ Laporan already exists, skipping');
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('   Pemilik: admin@kostmanagement.com / admin123');
  console.log('   Penghuni 1: penghuni1@example.com / password123');
  console.log('   Penghuni 2: penghuni2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
