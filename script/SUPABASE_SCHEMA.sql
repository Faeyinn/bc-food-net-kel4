-- Copy and paste this SQL into your Supabase SQL Editor to create the tables

CREATE TABLE IF NOT EXISTS toko (
    id_toko VARCHAR(10) PRIMARY KEY,
    nama_toko VARCHAR(100),
    jenis_toko VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS pelanggan (
    id_pelanggan VARCHAR(20) PRIMARY KEY,
    nama_pembeli VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255),
    no_hp VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS sesi_pemesanan (
    id_sesi VARCHAR(20) PRIMARY KEY,
    no_meja VARCHAR(10),
    id_pelanggan VARCHAR(20),
    tanggal_pemesanan TIMESTAMP DEFAULT NOW(),
    status_sesi VARCHAR(10) CHECK(status_sesi IN ('AKTIF','SELESAI')),
    FOREIGN KEY (id_pelanggan) REFERENCES pelanggan(id_pelanggan) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS meja (
    no_meja VARCHAR(10),
    id_sesi VARCHAR(20),
    status_meja VARCHAR(10) CHECK(status_meja IN ('KOSONG', 'TERISI')),
    PRIMARY KEY (no_meja, id_sesi),
    FOREIGN KEY (id_sesi) REFERENCES sesi_pemesanan(id_sesi) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS item (
    id_item VARCHAR(20) PRIMARY KEY,
    nama_item VARCHAR(100),
    harga_item INT,
    id_toko VARCHAR(10),
    FOREIGN KEY (id_toko) REFERENCES toko(id_toko) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transaksi (
    id_transaksi VARCHAR(20) PRIMARY KEY,
    id_sesi VARCHAR(20),
    id_toko VARCHAR(10),
    jenis_transaksi VARCHAR(10) CHECK(jenis_transaksi IN ('TUNAI','NON-TUNAI')),
    total_harga DECIMAL(10,2),
    status_pesanan VARCHAR(20) CHECK(status_pesanan IN ('MENUNGGU','DITERIMA','DIPROSES','SIAP','SELESAI')),
    tanggal_transaksi TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_sesi) REFERENCES sesi_pemesanan(id_sesi) ON DELETE RESTRICT,
    FOREIGN KEY (id_toko) REFERENCES toko(id_toko) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS antrian_order (
    order_line VARCHAR(25) PRIMARY KEY,
    id_transaksi VARCHAR(20),
    id_item VARCHAR(20),
    jumlah_item INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_transaksi) REFERENCES transaksi(id_transaksi) ON DELETE CASCADE,
    FOREIGN KEY (id_item) REFERENCES item(id_item) ON DELETE RESTRICT
);
