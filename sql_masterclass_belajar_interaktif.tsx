import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Code2, 
  Play, 
  BookOpen, 
  ChevronRight, 
  CheckCircle2,
  Table as TableIcon,
  LayoutTemplate,
  TerminalSquare,
  PlusSquare,
  Edit,
  Trash2,
  Key,
  Network,
  ArrowDownUp,
  BrainCircuit,
  Lightbulb,
  AlertCircle,
  Trophy,
  XCircle,
  RefreshCw
} from 'lucide-react';

const LESSONS = [
  // --- TINGKAT PEMULA ---
  {
    id: 'b1', level: 'Pemula', title: '1. Membuat Tabel (CREATE TABLE)', icon: <PlusSquare size={18} />,
    theory: `
      <p class="mb-2">Langkah paling awal dalam SQL adalah membuat tempat untuk menyimpan data. Kita menggunakan <strong>CREATE TABLE</strong>.</p>
      <p class="mb-2">Setiap kolom (column) harus memiliki <strong>Tipe Data</strong> (seperti INT untuk angka bulat, VARCHAR untuk teks/string, DATE untuk tanggal).</p>
      <p>Di sini kita akan membuat tabel <code>karyawan</code> untuk menyimpan data staf perusahaan.</p>
    `,
    query: `CREATE TABLE karyawan (\n  id INT PRIMARY KEY,\n  nama VARCHAR(100),\n  departemen VARCHAR(50),\n  gaji INT,\n  tanggal_masuk DATE\n);`,
    explanation: "Query ini menginstruksikan database untuk membuat kerangka tabel baru. 'PRIMARY KEY' berarti kolom 'id' adalah pengenal unik (tidak boleh ada data kembar).",
    visualType: 'schema-create', beforeData: null,
    afterData: {
      columns: ['Nama Kolom', 'Tipe Data', 'Keterangan'],
      rows: [['id', 'INT', 'PRIMARY KEY (Unik)'], ['nama', 'VARCHAR(100)', 'Teks maksimal 100 huruf'], ['departemen', 'VARCHAR(50)', 'Teks'], ['gaji', 'INT', 'Angka bulat'], ['tanggal_masuk', 'DATE', 'Format Tanggal (YYYY-MM-DD)']]
    }
  },
  {
    id: 'b2', level: 'Pemula', title: '2. Memasukkan Data (INSERT INTO)', icon: <Database size={18} />,
    theory: `
      <p class="mb-2">Setelah tabel terbuat, strukturnya masih kosong. Kita menggunakan <strong>INSERT INTO</strong> untuk menambahkan baris (row) data baru ke dalamnya.</p>
      <p>Urutan nilai pada <code>VALUES</code> harus sama dengan urutan kolom yang disebutkan setelah nama tabel.</p>
    `,
    query: `INSERT INTO karyawan (id, nama, departemen, gaji) \nVALUES \n  (1, 'Budi', 'IT', 8000000),\n  (2, 'Siti', 'HR', 6000000),\n  (3, 'Andi', 'IT', 8500000);`,
    explanation: "Kita memasukkan 3 baris data sekaligus ke dalam tabel karyawan. Kolom 'tanggal_masuk' tidak kita isi, sehingga database akan membiarkannya kosong (NULL).",
    visualType: 'table-insert',
    beforeData: { columns: ['id', 'nama', 'departemen', 'gaji'], rows: [] },
    afterData: { columns: ['id', 'nama', 'departemen', 'gaji'], rows: [[1, 'Budi', 'IT', 8000000], [2, 'Siti', 'HR', 6000000], [3, 'Andi', 'IT', 8500000]] },
    highlightRows: [0, 1, 2]
  },
  {
    id: 'b3', level: 'Pemula', title: '3. Membaca Data (SELECT & WHERE)', icon: <TerminalSquare size={18} />,
    theory: `
      <p class="mb-2"><strong>SELECT</strong> mengambil data dari tabel. Anda bisa menggunakan <code>*</code> untuk mengambil semua kolom, atau menyebutkan nama kolomnya secara spesifik.</p>
      <p><strong>WHERE</strong> bertugas sebagai saringan (filter) agar database hanya menampilkan baris yang memenuhi kondisi tertentu.</p>
    `,
    query: `SELECT id, nama, departemen \nFROM karyawan \nWHERE departemen = 'IT';`,
    explanation: "Tampilkan kolom id, nama, dan departemen HANYA dari karyawan yang nilai departemennya adalah 'IT'.",
    visualType: 'table-filter',
    beforeData: { columns: ['id', 'nama', 'departemen', 'gaji'], rows: [[1, 'Budi', 'IT', 8000000], [2, 'Siti', 'HR', 6000000], [3, 'Andi', 'IT', 8500000], [4, 'Desi', 'Finance', 7000000]] },
    afterData: { columns: ['id', 'nama', 'departemen'], rows: [[1, 'Budi', 'IT'], [3, 'Andi', 'IT']] }
  },
  {
    id: 'b4', level: 'Pemula', title: '4. Mengubah Data (UPDATE)', icon: <Edit size={18} />,
    theory: `
      <p class="mb-2">Jika ada kesalahan data atau perubahan (misal: naik gaji), kita gunakan <strong>UPDATE</strong>.</p>
      <p class="text-rose-600 font-semibold text-sm bg-rose-50 p-2 rounded border border-rose-200 mt-2">PENTING: Selalu gunakan WHERE saat melakukan UPDATE! Jika Anda lupa WHERE, maka SEMUA data di tabel akan berubah nilainya.</p>
    `,
    query: `UPDATE karyawan \nSET gaji = 9000000, departemen = 'Engineering'\nWHERE id = 1;`,
    explanation: "Cari karyawan dengan id = 1 (Budi), lalu ubah gajinya menjadi 9 juta dan departemennya menjadi Engineering.",
    visualType: 'table-update',
    beforeData: { columns: ['id', 'nama', 'departemen', 'gaji'], rows: [[1, 'Budi', 'IT', 8000000], [2, 'Siti', 'HR', 6000000]] },
    afterData: { columns: ['id', 'nama', 'departemen', 'gaji'], rows: [[1, 'Budi', 'Engineering', 9000000], [2, 'Siti', 'HR', 6000000]] },
    highlightCells: [{row: 0, col: 2}, {row: 0, col: 3}]
  },
  {
    id: 'b5', level: 'Pemula', title: '5. Menghapus Data (DELETE & DROP)', icon: <Trash2 size={18} />,
    theory: `
      <p class="mb-2"><strong>DELETE</strong> digunakan untuk menghapus baris data DARI DALAM tabel (tabelnya tetap ada).</p>
      <p class="mb-2"><strong>DROP TABLE</strong> digunakan untuk menghancurkan KESELURUHAN tabel beserta isinya.</p>
    `,
    query: `-- Menghapus 1 baris:\nDELETE FROM karyawan WHERE id = 2;\n\n-- Menghapus seluruh tabel:\nDROP TABLE karyawan;`,
    explanation: "Pertama kita menghapus Siti (id=2). Kemudian, kita menghancurkan seluruh tabel karyawan (DROP).",
    visualType: 'table-delete',
    beforeData: { columns: ['id', 'nama'], rows: [[1, 'Budi'], [2, 'Siti']] },
    afterData: { columns: ['Status'], rows: [['Tabel Karyawan Berhasil Dihapus (DROP)']] },
    deletedRows: [1]
  },

  // --- TINGKAT MENENGAH ---
  {
    id: 'i1', level: 'Menengah', title: '1. Relasi (Primary & Foreign Key)', icon: <Key size={18} />,
    theory: `<p class="mb-2"><strong>Primary Key (PK)</strong> adalah ID unik di sebuah tabel.<br/><strong>Foreign Key (FK)</strong> adalah kolom di tabel lain yang menunjuk ke PK tersebut.</p>`,
    query: `CREATE TABLE departemen (\n  id INT PRIMARY KEY,\n  nama_dept VARCHAR(50)\n);\n\nALTER TABLE karyawan \nADD COLUMN dept_id INT,\nADD FOREIGN KEY (dept_id) REFERENCES departemen(id);`,
    explanation: "Kita membuat tabel 'departemen'. Lalu mengubah tabel 'karyawan' dengan menambahkan kolom 'dept_id' sebagai jembatan (Foreign Key).",
    visualType: 'schema-relation',
    beforeData1: { title: 'Tabel Karyawan', columns: ['id', 'nama'], rows: [] },
    afterData: { tables: [{ name: 'KARYAWAN', columns: ['id (PK)', 'nama', 'gaji', 'dept_id (FK)'] }, { name: 'DEPARTEMEN', columns: ['id (PK)', 'nama_dept'] }] }
  },
  {
    id: 'i2', level: 'Menengah', title: '2. INNER JOIN', icon: <Network size={18} />,
    theory: `<p><strong>INNER JOIN</strong> hanya akan mengambil data yang memiliki pasangan (cocok) di KEDUA tabel. Jika ada karyawan tanpa departemen, ia tidak akan muncul.</p>`,
    query: `SELECT k.nama, d.nama_dept \nFROM karyawan k\nINNER JOIN departemen d\n  ON k.dept_id = d.id;`,
    explanation: "Gabungkan data berdasarkan kunci relasinya (ON). Joko (tidak punya dept) tidak akan muncul.",
    visualType: 'join',
    beforeData1: { title: 'karyawan (k)', columns: ['nama', 'dept_id'], rows: [['Budi', 101], ['Siti', 102], ['Joko', null]] },
    beforeData2: { title: 'departemen (d)', columns: ['id', 'nama_dept'], rows: [[101, 'Engineering'], [102, 'HR']] },
    afterData: { title: 'Hasil INNER JOIN', columns: ['nama', 'nama_dept'], rows: [['Budi', 'Engineering'], ['Siti', 'HR']] }
  },
  {
    id: 'i3', level: 'Menengah', title: '3. LEFT JOIN', icon: <TableIcon size={18} />,
    theory: `<p><strong>LEFT JOIN</strong> mengambil SEMUA data dari tabel kiri, dan jika tidak ada pasangan di tabel kanan, hasilnya akan menjadi <em>NULL</em>.</p>`,
    query: `SELECT k.nama, d.nama_dept \nFROM karyawan k\nLEFT JOIN departemen d\n  ON k.dept_id = d.id;`,
    explanation: "Joko tetap muncul meskipun tidak punya departemen. Kolom nama_dept untuk Joko akan berisi nilai kosong (NULL).",
    visualType: 'join-left',
    beforeData1: { title: 'karyawan (KIRI)', columns: ['nama', 'dept_id'], rows: [['Budi', 101], ['Siti', 102], ['Joko', null]] },
    beforeData2: { title: 'departemen (KANAN)', columns: ['id', 'nama_dept'], rows: [[101, 'Engineering'], [102, 'HR']] },
    afterData: { title: 'Hasil LEFT JOIN', columns: ['nama', 'nama_dept'], rows: [['Budi', 'Engineering'], ['Siti', 'HR'], ['Joko', 'NULL']] },
    highlightCells: [{row: 2, col: 1}]
  },
  {
    id: 'i4', level: 'Menengah', title: '4. GROUP BY', icon: <Database size={18} />,
    theory: `<p><strong>GROUP BY</strong> mengelompokkan data (misal: per departemen) sehingga kita bisa melakukan perhitungan (COUNT, SUM, AVG) pada kelompok tersebut.</p>`,
    query: `SELECT dept_id, COUNT(*) as total_orang\nFROM karyawan\nGROUP BY dept_id;`,
    explanation: "Kelompokkan data berdasarkan dept_id, lalu hitung ada berapa baris (orang) di masing-masing kelompok.",
    visualType: 'table-group',
    beforeData: { columns: ['nama', 'dept_id'], rows: [['Budi', 101], ['Andi', 101], ['Siti', 102]] },
    afterData: { columns: ['dept_id', 'total_orang'], rows: [[101, 2], [102, 1]] }
  },
  {
    id: 'i5', level: 'Menengah', title: '5. HAVING (Filter Group)', icon: <TerminalSquare size={18} />,
    theory: `<p><strong>HAVING</strong> fungsinya sama persis seperti WHERE, tetapi digunakan khusus untuk memfilter hasil agregasi (setelah di GROUP BY).</p>`,
    query: `SELECT dept_id, SUM(gaji) as total_gaji\nFROM karyawan\nGROUP BY dept_id\nHAVING SUM(gaji) > 10000000;`,
    explanation: "Kelompokkan per departemen, jumlahkan gajinya. TAPI hanya tampilkan departemen yang total gajinya di atas 10 Juta.",
    visualType: 'table-group',
    beforeData: { columns: ['dept_id', 'gaji'], rows: [[101, 8000000], [101, 7000000], [102, 6000000]] },
    afterData: { columns: ['dept_id', 'total_gaji'], rows: [[101, 15000000]] }
  },

  // --- TINGKAT MAHIR ---
  {
    id: 'a1', level: 'Mahir', title: '1. Subquery', icon: <Code2 size={18} />,
    theory: `<p><strong>Subquery</strong> adalah query di dalam query. Berguna saat kita membutuhkan hasil dari perhitungan lain sebagai filter.</p>`,
    query: `SELECT nama, gaji \nFROM karyawan \nWHERE gaji > (SELECT AVG(gaji) FROM karyawan);`,
    explanation: "Query di dalam kurung (Subquery) akan dijalankan lebih dulu untuk mencari rata-rata gaji semua orang. Lalu query utama mencari siapa yang gajinya di atas angka rata-rata tersebut.",
    visualType: 'cte',
    beforeData1: { title: 'Tabel Karyawan', columns: ['nama', 'gaji'], rows: [['A', 9000], ['B', 5000], ['C', 4000]] },
    beforeData2: { title: 'Subquery (AVG)', columns: ['AVG(gaji)'], rows: [[6000]] },
    afterData: { title: 'Hasil (Gaji > 6000)', columns: ['nama', 'gaji'], rows: [['A', 9000]] }
  },
  {
    id: 'a2', level: 'Mahir', title: '2. CTE (WITH)', icon: <LayoutTemplate size={18} />,
    theory: `<p><strong>CTE (Common Table Expression)</strong> adalah tabel virtual sementara untuk merapikan Subquery yang rumit.</p>`,
    query: `WITH RataGaji AS (\n  SELECT AVG(gaji) as avg_g\n  FROM karyawan\n)\nSELECT k.nama, k.gaji\nFROM karyawan k, RataGaji r\nWHERE k.gaji > r.avg_g;`,
    explanation: "Hasilnya sama persis dengan Subquery, tapi CTE (WITH) membuat kode jauh lebih mudah dibaca, terutama jika querynya panjang.",
    visualType: 'cte',
    beforeData1: { title: 'Tabel Asli', columns: ['nama', 'gaji'], rows: [['A', 9000], ['B', 5000]] },
    beforeData2: { title: 'CTE (RataGaji)', columns: ['avg_g'], rows: [[7000]] },
    afterData: { title: 'Hasil Akhir', columns: ['nama', 'gaji'], rows: [['A', 9000]] }
  },
  {
    id: 'a3', level: 'Mahir', title: '3. Window Function (RANK)', icon: <ArrowDownUp size={18} />,
    theory: `<p><strong>RANK()</strong> memberi peringkat. <code>PARTITION BY</code> berarti peringkat di-reset per kategori tertentu (misal: per departemen).</p>`,
    query: `SELECT nama, dept_id, gaji,\n  RANK() OVER(PARTITION BY dept_id ORDER BY gaji DESC) as rank\nFROM karyawan;`,
    explanation: "Bagi data per dept_id. Urutkan gaji terbesar ke terkecil di tiap dept. Berikan nomor peringkat.",
    visualType: 'table-window',
    beforeData: { columns: ['nama', 'dept_id', 'gaji'], rows: [['Andi', 'IT', 9000], ['Budi', 'IT', 8000], ['Desi', 'HR', 7500]] },
    afterData: { columns: ['nama', 'dept_id', 'gaji', 'rank'], rows: [['Andi', 'IT', 9000, 1], ['Budi', 'IT', 8000, 2], ['Desi', 'HR', 7500, 1]] },
    highlightCells: [{row: 0, col: 3}, {row: 1, col: 3}, {row: 2, col: 3}]
  },
  {
    id: 'a4', level: 'Mahir', title: '4. Window Function (LAG)', icon: <ArrowDownUp size={18} />,
    theory: `<p><strong>LAG()</strong> mengintip/mengambil nilai dari baris <em>sebelumnya</em>. Sangat berguna untuk menghitung MoM (Month-over-Month) Growth.</p>`,
    query: `SELECT bulan, pendapatan,\n  LAG(pendapatan) OVER(ORDER BY bulan) as pdt_bln_lalu\nFROM sales;`,
    explanation: "Ambil nilai pendapatan dari bulan sebelumnya, letakkan di kolom baru di baris yang sama.",
    visualType: 'table-window-lag',
    beforeData: { columns: ['bulan', 'pdt'], rows: [['Jan', 100], ['Feb', 150]] },
    afterData: { columns: ['bulan', 'pdt', 'pdt_bln_lalu'], rows: [['Jan', 100, 'NULL'], ['Feb', 150, 100]] },
    highlightCells: [{row: 1, col: 2}]
  },
  {
    id: 'a5', level: 'Mahir', title: '5. CASE WHEN', icon: <Code2 size={18} />,
    theory: `<p><strong>CASE WHEN</strong> adalah versi IF-ELSE di dalam SQL untuk membuat logika percabangan pada kolom baru.</p>`,
    query: `SELECT nama, gaji,\n  CASE \n    WHEN gaji >= 8000000 THEN 'Senior'\n    ELSE 'Junior'\n  END as level_karyawan\nFROM karyawan;`,
    explanation: "Jika gaji 8jt atau lebih, tulis 'Senior', selain itu tulis 'Junior' di kolom baru bernama level_karyawan.",
    visualType: 'table-insert',
    beforeData: { columns: ['nama', 'gaji'], rows: [['Andi', 9000000], ['Siti', 5000000]] },
    afterData: { columns: ['nama', 'gaji', 'level_karyawan'], rows: [['Andi', 9000000, 'Senior'], ['Siti', 5000000, 'Junior']] },
    highlightCells: [{row: 0, col: 2}, {row: 1, col: 2}]
  }
];

const EXERCISES = [
  // PEMULA
  {
    id: 'e_b1', level: 'Pemula', title: 'Latihan 1: Membuat Tabel Buku',
    task: "Buatlah sebuah tabel bernama <code>buku</code> yang memiliki 3 kolom: <code>id</code> (tipe INT), <code>judul</code> (tipe VARCHAR), dan <code>harga</code> (tipe INT).",
    initialCode: "CREATE \n",
    solutionHints: [
      { regex: /CREATE\s+TABLE/i, msg: "Anda belum menggunakan perintah CREATE TABLE." },
      { regex: /CREATE\s+TABLE\s+buku/i, msg: "Nama tabel harus 'buku'." },
      { regex: /id\s+INT/i, msg: "Pastikan ada kolom 'id' dengan tipe INT." },
      { regex: /judul\s+VARCHAR/i, msg: "Pastikan ada kolom 'judul' dengan tipe VARCHAR." },
      { regex: /harga\s+INT/i, msg: "Pastikan ada kolom 'harga' dengan tipe INT." }
    ]
  },
  {
    id: 'e_b2', level: 'Pemula', title: 'Latihan 2: Memasukkan Data',
    task: "Masukkan sebuah data ke tabel <code>buku</code>. Isi nilai id dengan 1, judul dengan 'SQL Dasar', dan harga dengan 50000.",
    initialCode: "-- Tulis query INSERT di sini\n",
    solutionHints: [
      { regex: /INSERT\s+INTO/i, msg: "Gunakan perintah INSERT INTO." },
      { regex: /INSERT\s+INTO\s+buku/i, msg: "Pastikan Anda memasukkan data ke tabel 'buku'." },
      { regex: /VALUES/i, msg: "Anda lupa kata kunci VALUES." },
      { regex: /1/i, msg: "Nilai id harus 1." },
      { regex: /'SQL Dasar'/i, msg: "Judul harus 'SQL Dasar' (gunakan tanda kutip tunggal)." },
      { regex: /50000/i, msg: "Harga harus 50000." }
    ]
  },
  {
    id: 'e_b3', level: 'Pemula', title: 'Latihan 3: Membaca & Memfilter',
    task: "Tampilkan SEMUA kolom (*) dari tabel <code>buku</code>, tapi HANYA untuk buku yang harganya di atas 40000.",
    initialCode: "SELECT \n",
    solutionHints: [
      { regex: /SELECT\s+\*/i, msg: "Gunakan SELECT * untuk mengambil semua kolom." },
      { regex: /FROM\s+buku/i, msg: "Ambil data DARI tabel 'buku' (FROM buku)." },
      { regex: /WHERE/i, msg: "Anda butuh klausa WHERE untuk memfilter." },
      { regex: /harga\s*>\s*40000/i, msg: "Kondisi filter harus harga lebih besar dari (>) 40000." }
    ]
  },
  {
    id: 'e_b4', level: 'Pemula', title: 'Latihan 4: Mengubah Data',
    task: "Ubah (Update) data di tabel <code>buku</code>. Set kolom <code>harga</code> menjadi 60000 khusus untuk buku yang memiliki <code>id</code> = 1.",
    initialCode: "-- Tulis query UPDATE di sini\n",
    solutionHints: [
      { regex: /UPDATE\s+buku/i, msg: "Gunakan UPDATE diikuti nama tabel 'buku'." },
      { regex: /SET/i, msg: "Gunakan klausa SET untuk menentukan nilai baru." },
      { regex: /SET\s+harga\s*=\s*60000/i, msg: "Set nilai kolom harga menjadi 60000." },
      { regex: /WHERE/i, msg: "AWAS! Anda belum menggunakan WHERE. Semua data bisa berubah." },
      { regex: /id\s*=\s*1/i, msg: "Kondisi WHERE harus berdasarkan id = 1." }
    ]
  },
  {
    id: 'e_b5', level: 'Pemula', title: 'Latihan 5: Menghapus Tabel (Drop)',
    task: "Anda tidak lagi membutuhkan tabel <code>buku</code>. Hancurkan/hapus seluruh tabel tersebut dari database.",
    initialCode: "-- Hapus tabel di sini\n",
    solutionHints: [
      { regex: /DROP\s+TABLE/i, msg: "Gunakan perintah DROP TABLE (bukan DELETE)." },
      { regex: /DROP\s+TABLE\s+buku/i, msg: "Pastikan Anda menghapus tabel yang bernama 'buku'." }
    ]
  },

  // MENENGAH
  {
    id: 'e_i1', level: 'Menengah', title: 'Latihan 6: Menggabungkan (INNER JOIN)',
    task: "Ada tabel <code>siswa</code> (id, nama) dan <code>nilai</code> (siswa_id, skor). Tampilkan <code>nama</code> siswa dan <code>skor</code>-nya menggunakan INNER JOIN.",
    initialCode: "SELECT siswa.nama, nilai.skor\nFROM siswa\n-- Tulis JOIN di sini\n",
    solutionHints: [
      { regex: /INNER\s+JOIN/i, msg: "Gunakan perintah INNER JOIN." },
      { regex: /INNER\s+JOIN\s+nilai/i, msg: "Gabungkan dengan tabel 'nilai'." },
      { regex: /ON/i, msg: "Anda lupa klausa ON untuk menentukan kunci relasinya." },
      { regex: /siswa\.id\s*=\s*nilai\.siswa_id/i, msg: "Kunci relasinya adalah siswa.id = nilai.siswa_id" }
    ]
  },
  {
    id: 'e_i2', level: 'Menengah', title: 'Latihan 7: LEFT JOIN',
    task: "Ubah query sebelumnya menjadi LEFT JOIN agar siswa yang belum memiliki nilai tetap muncul di hasil pencarian.",
    initialCode: "SELECT siswa.nama, nilai.skor\nFROM siswa\n-- Ganti dengan LEFT JOIN\n",
    solutionHints: [
      { regex: /LEFT\s+JOIN/i, msg: "Gunakan perintah LEFT JOIN." },
      { regex: /LEFT\s+JOIN\s+nilai/i, msg: "Gabungkan dengan tabel 'nilai'." },
      { regex: /ON\s+siswa\.id\s*=\s*nilai\.siswa_id/i, msg: "Kunci relasinya tetap siswa.id = nilai.siswa_id" }
    ]
  },
  {
    id: 'e_i3', level: 'Menengah', title: 'Latihan 8: Pengelompokan (GROUP BY)',
    task: "Dari tabel <code>karyawan</code> (nama, departemen). Hitung ada berapa jumlah karyawan (COUNT) di masing-masing departemen.",
    initialCode: "SELECT departemen, COUNT(*) \nFROM karyawan\n-- Tulis GROUP BY di sini\n",
    solutionHints: [
      { regex: /GROUP\s+BY/i, msg: "Gunakan klausa GROUP BY." },
      { regex: /GROUP\s+BY\s+departemen/i, msg: "Anda harus mengelompokkan berdasarkan kolom 'departemen'." }
    ]
  },
  {
    id: 'e_i4', level: 'Menengah', title: 'Latihan 9: Filter Grup (HAVING)',
    task: "Lanjutkan query sebelumnya, tambahkan filter agar hanya menampilkan departemen yang memiliki lebih dari 5 karyawan (> 5).",
    initialCode: "SELECT departemen, COUNT(*) \nFROM karyawan\nGROUP BY departemen\n-- Tulis HAVING di sini\n",
    solutionHints: [
      { regex: /HAVING/i, msg: "Gunakan klausa HAVING untuk memfilter hasil agregasi." },
      { regex: /HAVING\s+COUNT\(\*\)\s*>\s*5/i, msg: "Kondisinya harus COUNT(*) > 5." }
    ]
  },
  {
    id: 'e_i5', level: 'Menengah', title: 'Latihan 10: Subquery Sederhana',
    task: "Tampilkan <code>nama</code> dari tabel <code>produk</code> yang harganya lebih kecil ( < ) dari harga rata-rata (AVG) semua produk.",
    initialCode: "SELECT nama\nFROM produk\nWHERE harga < (\n  -- Tulis Subquery di sini\n);",
    solutionHints: [
      { regex: /SELECT\s+AVG\(harga\)/i, msg: "Subquery harus mengambil nilai rata-rata (AVG) dari harga." },
      { regex: /FROM\s+produk/i, msg: "Subquery harus mengambil data dari tabel 'produk'." },
      { regex: /\(\s*SELECT\s+AVG\(harga\)\s+FROM\s+produk\s*\)/i, msg: "Pastikan Subquery ditulis utuh di dalam tanda kurung setelah WHERE harga <" }
    ]
  },

  // MAHIR
  {
    id: 'e_a1', level: 'Mahir', title: 'Latihan 11: CTE (WITH)',
    task: "Buat CTE bernama <code>TotalSales</code> yang isinya <code>SELECT SUM(harga) FROM sales</code>. Lalu di query utama, SELECT * dari TotalSales tersebut.",
    initialCode: "-- Mulai dengan WITH\n",
    solutionHints: [
      { regex: /^WITH/i, msg: "Query CTE harus diawali dengan kata WITH." },
      { regex: /WITH\s+TotalSales\s+AS/i, msg: "Nama CTE harus TotalSales diikuti AS." },
      { regex: /AS\s*\(\s*SELECT\s+SUM\(harga\)\s+FROM\s+sales\s*\)/i, msg: "Isi di dalam kurung AS harus query SELECT SUM yang diminta." },
      { regex: /SELECT\s+\*\s+FROM\s+TotalSales/i, msg: "Query utamanya di bawah CTE harus SELECT * FROM TotalSales." }
    ]
  },
  {
    id: 'e_a2', level: 'Mahir', title: 'Latihan 12: Window Function (RANK)',
    task: "Dari tabel <code>peserta</code> (nama, nilai). Tampilkan nama, nilai, dan berikan peringkat (RANK) berdasarkan nilai tertinggi ke terendah.",
    initialCode: "SELECT nama, nilai,\n  -- Tulis fungsi RANK() di sini\nFROM peserta;",
    solutionHints: [
      { regex: /RANK\(\)\s+OVER/i, msg: "Gunakan fungsi RANK() OVER( ... )" },
      { regex: /OVER\s*\(\s*ORDER\s+BY\s+nilai\s+DESC\s*\)/i, msg: "Di dalam OVER, Anda harus mengurutkan (ORDER BY) berdasarkan nilai secara descending (DESC)." }
    ]
  },
  {
    id: 'e_a3', level: 'Mahir', title: 'Latihan 13: Partisi RANK (PARTITION BY)',
    task: "Modifikasi query sebelumnya. Berikan peringkat dari tabel <code>peserta</code> (nama, kelas, nilai). Peringkat harus di-reset per <code>kelas</code>.",
    initialCode: "SELECT nama, kelas, nilai,\n  RANK() OVER(\n    -- Tambahkan PARTITION BY sebelum ORDER BY\n    ORDER BY nilai DESC\n  ) as juara\nFROM peserta;",
    solutionHints: [
      { regex: /PARTITION\s+BY\s+kelas/i, msg: "Gunakan PARTITION BY kelas agar peringkat dihitung per kelas." }
    ]
  },
  {
    id: 'e_a4', level: 'Mahir', title: 'Latihan 14: Mengintip Baris (LAG)',
    task: "Dari tabel <code>cuaca</code> (tanggal, suhu). Ambil suhu hari ini, dan suhu kemarin menggunakan fungsi LAG() diurutkan berdasarkan tanggal.",
    initialCode: "SELECT tanggal, suhu,\n  -- Gunakan LAG() di sini\nFROM cuaca;",
    solutionHints: [
      { regex: /LAG\(suhu\)\s+OVER/i, msg: "Gunakan fungsi LAG() mengambil kolom suhu, diikuti OVER( ... )." },
      { regex: /OVER\s*\(\s*ORDER\s+BY\s+tanggal\s*\)/i, msg: "Di dalam OVER, pastikan diurutkan (ORDER BY) berdasarkan tanggal." }
    ]
  },
  {
    id: 'e_a5', level: 'Mahir', title: 'Latihan 15: Logika Bersyarat (CASE WHEN)',
    task: "Dari tabel <code>ujian</code> (nama, skor). Buat kolom 'status'. Jika skor >= 75 tulis 'Lulus', ELSE tulis 'Gagal'.",
    initialCode: "SELECT nama, skor,\n  CASE \n    -- Tulis kondisi WHEN di sini\n  END as status\nFROM ujian;",
    solutionHints: [
      { regex: /CASE/i, msg: "Gunakan perintah CASE." },
      { regex: /WHEN\s+skor\s*>=\s*75/i, msg: "Kondisinya adalah WHEN skor >= 75" },
      { regex: /THEN\s+'Lulus'/i, msg: "Gunakan THEN 'Lulus' (kutip tunggal)." },
      { regex: /ELSE\s+'Gagal'/i, msg: "Gunakan ELSE 'Gagal' (kutip tunggal)." },
      { regex: /END/i, msg: "Tutup blok CASE dengan END." }
    ]
  }
];

const DataTable = ({ data, title, highlightCols = [], highlightCells = [], deletedRows = [], highlightRows = [] }) => {
  if (!data || !data.columns) return null;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-sm w-full">
      {title && (
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-slate-700">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {data.columns.map((col, idx) => (
                <th key={idx} className={`px-4 py-2 border-b-2 border-slate-200 bg-slate-50 text-slate-600 font-semibold ${highlightCols.includes(idx) ? 'bg-indigo-50 text-indigo-700' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0 ? (
              <tr>
                <td colSpan={data.columns.length} className="px-4 py-8 text-center text-slate-400 italic">
                  Tabel Kosong (0 baris)
                </td>
              </tr>
            ) : (
              data.rows.map((row, rowIdx) => {
                const isDeleted = deletedRows.includes(rowIdx);
                const isRowHighlighted = highlightRows.includes(rowIdx);
                return (
                  <tr 
                    key={rowIdx} 
                    className={`
                      border-b border-slate-100 last:border-0 
                      ${isDeleted ? 'bg-rose-50 opacity-60 line-through text-rose-500' : 'hover:bg-slate-50 text-slate-700'}
                      ${isRowHighlighted ? 'bg-emerald-50' : ''}
                    `}
                  >
                    {row.map((cell, cellIdx) => {
                      const isCellHighlighted = highlightCells.some(c => c.row === rowIdx && c.col === cellIdx);
                      const isColHighlighted = highlightCols.includes(cellIdx);
                      
                      return (
                        <td 
                          key={cellIdx} 
                          className={`
                            px-4 py-2.5 
                            ${(isCellHighlighted || isColHighlighted) && !isDeleted ? 'bg-indigo-100 font-bold text-indigo-900 ring-1 ring-indigo-300 shadow-inner rounded-sm transition-all' : ''}
                            ${cell === 'NULL' || cell === null ? 'italic text-slate-400 font-mono text-xs' : ''}
                          `}
                        >
                          {cell === 'NULL' || cell === null ? 'NULL' : cell}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Visualizer = ({ lesson, isExecuted }) => {
  if (!isExecuted) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 min-h-[300px]">
        <Database size={48} className="mb-4 opacity-50" />
        <p className="text-lg font-medium text-center max-w-md">Klik <strong className="text-indigo-500">"Jalankan Query"</strong> di atas untuk melihat bagaimana data berubah.</p>
      </div>
    );
  }

  const { visualType, beforeData, afterData, beforeData1, beforeData2, highlightCells, deletedRows, highlightRows } = lesson;

  switch (visualType) {
    case 'schema-create':
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
          <div className="flex items-center gap-4 text-emerald-600 mb-4 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-200">
            <CheckCircle2 size={20} />
            <span className="font-bold">Berhasil! Tabel Dibuat.</span>
          </div>
          <div className="w-full max-w-3xl ring-2 ring-emerald-500 rounded-xl shadow-lg bg-white overflow-hidden">
             <div className="bg-emerald-500 text-white px-4 py-2 font-bold uppercase tracking-wider flex items-center gap-2">
                <Database size={16}/> Schema Tabel Baru
             </div>
             <DataTable data={afterData} />
          </div>
        </div>
      );

    case 'schema-relation':
       return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center gap-8 w-full">
          <div className="flex flex-col md:flex-row items-stretch justify-center w-full gap-8 relative">
            
            {afterData.tables.map((table, idx) => (
              <div key={idx} className={`w-full max-w-sm ring-2 ${idx === 0 ? 'ring-blue-500' : 'ring-purple-500'} rounded-xl shadow-lg bg-white overflow-hidden z-10`}>
                <div className={`${idx === 0 ? 'bg-blue-500' : 'bg-purple-500'} text-white px-4 py-2 font-bold uppercase tracking-wider text-center`}>
                    {table.name}
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <tbody>
                      {table.columns.map((col, cIdx) => (
                        <tr key={cIdx} className={`border-b border-slate-100 ${col.includes('(PK)') ? 'bg-amber-50 font-bold' : ''} ${col.includes('(FK)') ? 'bg-emerald-50 font-bold' : ''}`}>
                          <td className="px-4 py-2 text-sm text-slate-700 flex items-center gap-2">
                            {col.includes('(PK)') && <Key size={14} className="text-amber-500"/>}
                            {col.includes('(FK)') && <Key size={14} className="text-emerald-500"/>}
                            {col}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-emerald-600 bg-white px-4 py-1 rounded-full border-2 border-emerald-200 z-20 shadow-md">
               <span className="text-xs font-bold">Relasi (FK)</span>
               <Network size={16} />
            </div>
          </div>
        </div>
      );

    case 'table-insert':
    case 'table-update':
    case 'table-delete':
    case 'table-filter':
    case 'table-group':
    case 'table-window':
    case 'table-window-lag':
      return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 items-start">
          <div className="flex-1 w-full">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Database size={14}/> Sebelum Query
            </h4>
            <div className="opacity-70 grayscale-[30%]">
              <DataTable data={beforeData} deletedRows={isExecuted ? deletedRows : []} />
            </div>
          </div>
          
          <div className="hidden lg:flex pt-12 items-center justify-center text-indigo-500">
            <ChevronRight size={32} />
          </div>
          
          <div className="flex-1 w-full relative">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-2">
              <CheckCircle2 size={14}/> Hasil Sesudah
            </h4>
            <div className="ring-2 ring-indigo-500 rounded-xl shadow-xl bg-white overflow-hidden">
              {visualType === 'table-delete' && !afterData.columns.includes('id') ? (
                  <div className="p-8 text-center bg-rose-50 text-rose-600 font-bold flex flex-col items-center justify-center">
                      <Trash2 size={48} className="mb-4 opacity-50"/>
                      {afterData.rows[0][0]}
                  </div>
              ) : (
                <DataTable 
                  data={afterData} 
                  highlightCells={highlightCells} 
                  highlightRows={highlightRows} 
                />
              )}
            </div>
          </div>
        </div>
      );
    
    case 'join':
    case 'join-left':
      return (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="opacity-80">
              <DataTable data={beforeData1} />
            </div>
            <div className="opacity-80">
              <DataTable data={beforeData2} />
            </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="bg-indigo-100 text-indigo-800 px-6 py-2 rounded-full text-sm font-bold mb-4 shadow-sm border border-indigo-200">
                MENGGABUNGKAN (ON ...) ↓
             </div>
             <div className="w-full ring-2 ring-indigo-500 rounded-xl shadow-xl">
               <DataTable data={afterData} highlightCells={highlightCells} />
             </div>
          </div>
        </div>
      );

    case 'cte':
      return (
        <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="opacity-80">
              <DataTable data={beforeData1} />
            </div>
            <div className="border-2 border-dashed border-amber-400 rounded-xl p-3 bg-amber-50 shadow-inner">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Code2 size={14}/> Virtual Tabel / Hasil Sementara
              </h4>
              <DataTable data={beforeData2} />
            </div>
          </div>
          
          <div className="flex flex-col items-center pt-2">
             <ChevronRight size={24} className="text-indigo-400 rotate-90 lg:rotate-0 mb-2" />
             <div className="w-full ring-2 ring-indigo-600 rounded-xl shadow-xl">
                <DataTable data={afterData} />
             </div>
          </div>
        </div>
      );

    default:
      return <div>Visualisasi tidak tersedia.</div>;
  }
};

export default function App() {
  const [mode, setMode] = useState('theory'); // 'theory' or 'exercise'
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id);
  const [activeExerciseId, setActiveExerciseId] = useState(EXERCISES[0].id);
  
  // Theory state
  const [isExecuted, setIsExecuted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  
  // Exercise state
  const [userQuery, setUserQuery] = useState(EXERCISES[0].initialCode);
  const [validationResult, setValidationResult] = useState(null); // {status: 'success'|'error', errors: []}
  const [completedExercises, setCompletedExercises] = useState([]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];
  const activeExercise = EXERCISES.find(e => e.id === activeExerciseId) || EXERCISES[0];

  // Reset logic when switching items
  useEffect(() => { setIsExecuted(false); }, [activeLessonId]);
  
  useEffect(() => { 
    if(mode === 'exercise') {
      setUserQuery(activeExercise.initialCode);
      setValidationResult(null);
    }
  }, [activeExerciseId, mode]);

  const handleRunTheoryQuery = () => {
    setIsExecuted(true);
    if (!completedLessons.includes(activeLessonId)) setCompletedLessons([...completedLessons, activeLessonId]);
  };

  const handleCheckExercise = () => {
    if(!userQuery.trim()) return;

    const errors = [];
    let passed = true;

    // Check against all regex hints defined in the exercise
    activeExercise.solutionHints.forEach(hint => {
      if (!hint.regex.test(userQuery)) {
        errors.push(hint.msg);
        passed = false;
      }
    });

    if (passed) {
      setValidationResult({ status: 'success', errors: [] });
      if (!completedExercises.includes(activeExerciseId)) {
        setCompletedExercises([...completedExercises, activeExerciseId]);
      }
    } else {
      setValidationResult({ status: 'error', errors: errors });
    }
  };

  const levels = ['Pemula', 'Menengah', 'Mahir'];

  const renderSidebar = () => (
    <div className={`
      ${sidebarOpen ? 'w-full md:w-72' : 'w-0 md:w-0 overflow-hidden'} 
      bg-slate-900 text-slate-300 md:min-h-screen flex flex-col shadow-2xl z-20 transition-all duration-300 shrink-0
    `}>
      <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
          <Database className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">SQL MasterClass</h1>
          <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Zero to Hero</p>
        </div>
      </div>

      <div className="flex p-2 bg-slate-900 gap-1 border-b border-slate-800">
        <button 
          onClick={() => setMode('theory')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'theory' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <BookOpen size={16}/> Teori
        </button>
        <button 
          onClick={() => setMode('exercise')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${mode === 'exercise' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
        >
          <Code2 size={16}/> Latihan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {levels.map(level => (
          <div key={level} className="mb-6 px-3">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-3 border-b border-slate-800 pb-1">
              {mode === 'theory' ? `Modul ${level}` : `Tantangan ${level}`}
            </h3>
            <ul className="space-y-1 mt-2">
              {(mode === 'theory' ? LESSONS : EXERCISES).filter(item => item.level === level).map(item => {
                const isCompleted = mode === 'theory' ? completedLessons.includes(item.id) : completedExercises.includes(item.id);
                const isActive = mode === 'theory' ? activeLessonId === item.id : activeExerciseId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if(mode === 'theory') setActiveLessonId(item.id);
                        else setActiveExerciseId(item.id);
                        if(window.innerWidth < 768) setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group ${
                        isActive 
                          ? (mode === 'theory' ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/50' : 'bg-emerald-600/90 text-white shadow-md shadow-emerald-900/50')
                          : 'hover:bg-slate-800 hover:text-slate-100'
                      }`}
                    >
                      <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                         {mode === 'theory' ? item.icon : <BrainCircuit size={16} />}
                      </span>
                      <span className="flex-1 text-sm font-medium line-clamp-2 leading-tight">{item.title}</span>
                      {isCompleted && (
                        <CheckCircle2 size={16} className={isActive ? 'text-white' : 'text-emerald-500'} />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Progress Bar Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 font-medium">
            {mode === 'theory' ? 'Progress Teori' : 'Progress Latihan'}
          </span>
          <span className="text-xs font-bold text-white">
            {Math.round(((mode === 'theory' ? completedLessons.length : completedExercises.length) / (mode === 'theory' ? LESSONS.length : EXERCISES.length)) * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5">
          <div 
            className={`${mode === 'theory' ? 'bg-indigo-500' : 'bg-emerald-500'} h-1.5 rounded-full transition-all duration-500`} 
            style={{ width: `${((mode === 'theory' ? completedLessons.length : completedExercises.length) / (mode === 'theory' ? LESSONS.length : EXERCISES.length)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800 selection:bg-indigo-200">
      
      {renderSidebar()}

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-slate-200"
            >
              <Database size={20} />
            </button>
            <div>
              <div className={`flex items-center gap-2 text-xs font-bold mb-1 tracking-wider uppercase ${mode === 'theory' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                {mode === 'theory' ? <BookOpen size={14} /> : <BrainCircuit size={14} />}
                <span>{mode === 'theory' ? `Modul ${activeLesson.level}` : `Tantangan ${activeExercise.level}`}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {mode === 'theory' ? activeLesson.title : activeExercise.title}
              </h2>
            </div>
          </div>
          
          {mode === 'theory' ? (
            <button 
              onClick={handleRunTheoryQuery}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 ${
                isExecuted 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/30'
              }`}
            >
              {isExecuted ? <CheckCircle2 size={18} /> : <Play size={18} fill="currentColor" />}
              {isExecuted ? 'Query Berhasil' : 'Jalankan Query'}
            </button>
          ) : (
            <button 
              onClick={handleCheckExercise}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play size={18} fill="currentColor" /> Cek Jawaban
            </button>
          )}
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          <div className="max-w-6xl mx-auto space-y-8 pb-12">
            
            {/* VIEW MODE: THEORY */}
            {mode === 'theory' && (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <BookOpen className="text-indigo-500" size={20} />
                      Pembahasan Teori
                    </h3>
                    <div 
                      className="text-slate-600 text-sm md:text-base leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: activeLesson.theory }} 
                    />
                  </div>

                  <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-700/50 h-full">
                    <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#404040] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="ml-3 text-xs text-slate-400 font-mono tracking-wider">workspace.sql</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">PostgreSQL</span>
                    </div>
                    
                    <div className="p-6 flex-1 overflow-x-auto">
                      <pre className="font-mono text-[13px] md:text-[15px] leading-relaxed text-slate-50">
                        <code dangerouslySetInnerHTML={{
                          __html: activeLesson.query
                            .replace(/(CREATE TABLE|INSERT INTO|VALUES|SELECT|FROM|WHERE|UPDATE|SET|DELETE FROM|DROP TABLE|ALTER TABLE|ADD COLUMN|ADD FOREIGN KEY|REFERENCES|INNER JOIN|LEFT JOIN|ON|GROUP BY|HAVING|WITH|AS|OVER|PARTITION BY|ORDER BY|DESC|ASC|PRIMARY KEY|CASE|WHEN|THEN|ELSE|END)/g, '<span class="text-pink-400 font-bold">$1</span>')
                            .replace(/(INT|VARCHAR|DATE|COUNT|SUM|AVG|RANK|LAG|LEAD)/g, '<span class="text-blue-300">$1</span>')
                            .replace(/('(?:[^'\\]|\\.)*')/g, '<span class="text-emerald-300">$1</span>')
                            .replace(/(\b\d+\b)/g, '<span class="text-purple-300">$1</span>')
                            .replace(/(NULL)/g, '<span class="text-amber-400 font-bold">$1</span>')
                            .replace(/(--.*)/g, '<span class="text-slate-500 italic">$1</span>')
                        }} />
                      </pre>
                    </div>
                    
                    <div className={`transition-all duration-500 overflow-hidden ${isExecuted ? 'max-h-48 border-t border-indigo-500/30' : 'max-h-0'}`}>
                      <div className="bg-indigo-900/80 p-5">
                        <p className="text-sm md:text-base text-indigo-100 flex items-start gap-3">
                          <Database className="shrink-0 mt-0.5 text-indigo-400" size={18} />
                          <span className="leading-relaxed">{activeLesson.explanation}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 mt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <LayoutTemplate className="text-indigo-500" size={20} />
                    Visualisasi Eksekusi Data
                  </h3>
                  <div className="w-full">
                    <Visualizer lesson={activeLesson} isExecuted={isExecuted} />
                  </div>
                </div>
              </>
            )}

            {/* VIEW MODE: EXERCISE */}
            {mode === 'exercise' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 animate-in fade-in">
                
                {/* Left Panel: Task & Validation Result */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Code2 className="text-emerald-500" size={20} />
                      Instruksi Tugas
                    </h3>
                    <div 
                      className="text-slate-700 text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100"
                      dangerouslySetInnerHTML={{ __html: activeExercise.task }} 
                    />
                    
                    <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100">
                      <Lightbulb className="shrink-0 mt-0.5 text-blue-500" size={18} />
                      <p>Ketik query Anda di editor sebelah kanan, lalu klik <strong>"Cek Jawaban"</strong> di pojok kanan atas untuk memeriksa kebenarannya.</p>
                    </div>
                  </div>

                  {/* Validation Feedback Panel */}
                  {validationResult && (
                    <div className={`p-6 rounded-2xl shadow-sm border animate-in slide-in-from-bottom-2 ${validationResult.status === 'success' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                      {validationResult.status === 'success' ? (
                        <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Trophy size={32} />
                          </div>
                          <h4 className="text-xl font-bold text-emerald-800 mb-2">Jawaban Benar!</h4>
                          <p className="text-emerald-600 text-sm mb-4">Luar biasa, query yang Anda tulis sudah sesuai dengan instruksi.</p>
                          <button 
                            onClick={() => {
                              // Move to next exercise if available
                              const currentIndex = EXERCISES.findIndex(e => e.id === activeExerciseId);
                              if(currentIndex < EXERCISES.length - 1) {
                                setActiveExerciseId(EXERCISES[currentIndex + 1].id);
                              }
                            }}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors"
                          >
                            Lanjut ke Latihan Berikutnya
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-lg font-bold text-rose-800 mb-3 flex items-center gap-2">
                            <XCircle size={20} className="text-rose-500" />
                            Oops, Masih Ada yang Kurang
                          </h4>
                          <p className="text-sm text-rose-600 mb-4">Sistem kami mendeteksi beberapa kesalahan pada query Anda berdasarkan pengecekan struktur dasar:</p>
                          <ul className="space-y-2">
                            {validationResult.errors.map((err, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-rose-700 bg-white p-3 rounded-lg border border-rose-100 shadow-sm">
                                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                                {err}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-rose-400 mt-4 italic">*Pengecekan menggunakan Regex sederhana, perhatikan spasi, tanda kutip, dan penamaan tabel/kolom secara teliti.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Panel: Interactive Editor */}
                <div className="lg:col-span-3 flex flex-col h-full min-h-[400px]">
                  <div className="bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-slate-700/50 flex-1">
                    <div className="bg-[#2d2d2d] px-4 py-3 border-b border-[#404040] flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-emerald-400 font-mono font-bold tracking-wider flex items-center gap-2">
                           <TerminalSquare size={14}/> exercise.sql
                        </span>
                      </div>
                      <button 
                        onClick={() => setUserQuery(activeExercise.initialCode)}
                        className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors p-1"
                        title="Reset Code"
                      >
                        <RefreshCw size={12}/> Reset
                      </button>
                    </div>
                    
                    <div className="flex-1 relative bg-[#1e1e1e]">
                      {/* We use a standard textarea but style it to look like a code editor. 
                          True syntax highlighting in an editable textarea without external heavy libraries is complex, 
                          so we provide a clean, monospace dark-mode textarea. */}
                      <textarea
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
                        className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-50 font-mono text-[14px] md:text-[16px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 custom-scrollbar"
                        spellCheck="false"
                        placeholder="Ketik query SQL Anda di sini..."
                      />
                    </div>
                    
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #64748b;
        }
      `}} />
    </div>
  );
}