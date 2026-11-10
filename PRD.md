# PRD – Landing Page Personal Dark Fantasy

Product Requirements Document · Versi 1.0 · Status: Draft

## 1. Ringkasan Produk

Website landing page personal untuk menampilkan identitas, biodata, keahlian, dan portofolio pemilik dengan tema **dark fantasy** dan aset **pixel art**. Halaman utama berupa satu halaman yang di-scroll ke bawah (navbar tab, profil, skill, kartu portofolio, kontak). Setiap portofolio dapat dibuka di halaman detail tersendiri. Pemilik dapat menambah dan mengubah foto, biodata, dan portofolio sendiri melalui panel admin.

## 2. Latar Belakang dan Tujuan

**Masalah:** Portofolio yang tersebar (Behance, GitHub, Figma, dsb.) tidak memberi kesan personal yang konsisten, dan CV statis sulit memperlihatkan karya secara visual.

**Tujuan:**

1. Memiliki satu tempat resmi yang menampilkan siapa saya, apa keahlian saya, dan karya saya.
2. Memberi kesan visual yang kuat dan unik lewat tema dark fantasy pixel art.
3. Mengelola konten (foto, biodata, portofolio) sendiri tanpa mengubah kode.
4. Memudahkan calon klien, rekruter, atau kolaborator menghubungi saya.

**Indikator keberhasilan:**

- Seluruh section utama tampil dan berfungsi di desktop dan mobile.
- Pemilik dapat menambah satu portofolio baru (judul, deskripsi, gambar, detail) dalam waktu kurang dari 3 menit.
- Skor Lighthouse Performance ≥ 85 dan Accessibility ≥ 90 pada halaman utama.
- Waktu muat halaman utama (LCP) ≤ 2,5 detik pada koneksi 4G.

## 3. Target Pengguna

| Pengguna | Kebutuhan |
| --- | --- |
| Pengunjung (rekruter, klien, dosen, rekan) | Cepat memahami profil, melihat skill, menjelajahi karya, dan menghubungi pemilik |
| Pemilik (admin) | Menambah/mengubah foto, biodata, skill, dan portofolio dengan mudah dan aman |

## 4. Ruang Lingkup

**Termasuk (In Scope):**

- Landing page satu halaman dengan navbar tab, profil, skill, preview portofolio, dan kontak.
- Halaman daftar portofolio dan halaman detail portofolio.
- Panel admin (login) untuk CRUD portofolio, ubah foto dan biodata, serta kelola skill dan kontak.
- Tema dark fantasy pixel art (UI, ikon, ornamen, animasi ringan).

**Tidak termasuk (Out of Scope, v1):**

- Sistem komentar atau akun pengunjung.
- Blog dengan editor rich text penuh.
- Multi-bahasa (Indonesia/Inggris) dan multi-admin.
- Pembayaran atau toko online.

## 5. Struktur Halaman dan Alur Pengguna

### 5.1 Peta Halaman

| Rute | Halaman | Akses |
| --- | --- | --- |
| `/` | Landing page utama | Publik |
| `/posts` | Daftar seluruh portofolio | Publik |
| `/posts/[slug]` | Detail portofolio | Publik |
| `/admin/login` | Login admin | Publik (terproteksi kredensial) |
| `/admin` | Dashboard: kelola profil, skill, kontak, portofolio | Admin |

### 5.2 Susunan Landing Page (urutan scroll)

1. **Navbar / Tab (paling atas, sticky):** tab **Contact**, **Information**, **Posts**. Klik tab melakukan smooth scroll ke section terkait; tab aktif ditandai sesuai posisi scroll.
2. **Section Information:** container berisi foto, biodata, dan daftar skill.
3. **Section Posts:** card view beberapa portofolio terbaru/unggulan dengan tombol *View More*.
4. **Section Contact (paling bawah / footer):** informasi dan tautan kontak.

### 5.3 Alur Utama

- **Pengunjung:** membuka `/` → melihat profil dan skill → scroll ke kartu portofolio → klik kartu (detail) atau *View More* (daftar lengkap `/posts`) → membaca detail → kembali atau menghubungi lewat Contact.
- **Admin:** login → dashboard → tambah/ubah/hapus portofolio, ganti foto, ubah biodata/skill/kontak → simpan → perubahan langsung tampil di situs publik.

## 6. Kebutuhan Fungsional

### FR-1 Navbar / Tab

- Tiga tab: Contact, Information, Posts. Navbar sticky saat scroll.
- Smooth scroll ke section; indikator tab aktif mengikuti posisi scroll.
- Di mobile berubah menjadi menu hamburger bergaya pixel.

### FR-2 Section Information (Profil)

- **Foto profil** dalam bingkai pixel art (misalnya bingkai batu/emas bergaya relik). Foto dapat diunggah dan diganti admin.
- **Biodata:** nama, gelar/peran, deskripsi singkat (bio), lokasi, dan data tambahan opsional (pendidikan, pengalaman). Semua dapat diedit admin.
- **Skill:** grid ikon logo **Photoshop, Illustrator, Figma, VS Code, Next.js, Node.js, Kotlin**, masing-masing dengan label nama. Efek hover (glow/tooltip). Admin dapat menambah, menghapus, dan mengurutkan skill.

### FR-3 Section Posts (Preview Portofolio)

- Menampilkan 3–6 kartu portofolio terbaru atau yang ditandai *featured*.
- Tiap kartu: gambar thumbnail, judul, deskripsi singkat (dipotong), tag/kategori opsional, dan tanggal.
- Klik kartu membuka halaman detail.
- Tombol **View More** mengarah ke `/posts`.

### FR-4 Halaman Daftar Portofolio (`/posts`)

- Grid kartu seluruh portofolio, urut terbaru.
- Filter berdasarkan kategori/tag dan pencarian judul (nice-to-have).
- Pagination atau *load more* bila lebih dari 12 item.

### FR-5 Halaman Detail Portofolio (`/posts/[slug]`)

- Judul, tanggal, tag, gambar utama, dan galeri gambar tambahan.
- Deskripsi lengkap (teks dengan paragraf, daftar, dan tautan).
- Informasi tambahan: peran, tools yang dipakai, dan tautan eksternal (demo, repo, Behance, dsb.).
- Navigasi *Previous/Next post* dan tombol kembali ke daftar.

### FR-6 Section Contact

- Email, nomor/WhatsApp (opsional), dan tautan sosial (GitHub, LinkedIn, Instagram, Behance, dsb.) dengan ikon pixel art.
- Tombol *copy email*.
- Formulir kontak sederhana (nama, email, pesan) adalah *nice-to-have* v1.1.

### FR-7 Panel Admin

- **Autentikasi:** login email + password (atau OAuth); hanya satu akun admin. Rute `/admin` terproteksi.
- **Profil:** unggah/ganti foto, edit biodata, kelola daftar skill, edit data kontak.
- **Portofolio (CRUD):** tambah, edit, hapus; field judul, slug (otomatis), deskripsi singkat, deskripsi lengkap, thumbnail, galeri gambar, tag, tautan eksternal, status (draft/published), dan flag *featured*.
- Pratinjau sebelum publish; validasi form (judul wajib, ukuran dan tipe gambar dibatasi).

## 7. Desain dan Gaya Visual (Dark Fantasy Pixel Art)

### 7.1 Palet Warna

| Peran | Warna | Hex (usulan) |
| --- | --- | --- |
| Latar utama | Hitam keunguan | `#0B0A10` |
| Permukaan / kartu | Ungu arang | `#15121C` |
| Border / garis | Ungu keabuan | `#2A2236` |
| Aksen utama | Merah darah | `#8B1E2D` |
| Aksen sekunder | Emas kusam | `#C9A24B` |
| Aksen magis | Ungu gelap | `#4B2E6F` |
| Teks utama | Krem tulang | `#D9D2C3` |
| Teks sekunder | Abu ungu | `#8A8397` |

Rasio kontras teks terhadap latar minimal WCAG AA (4,5:1).

### 7.2 Tipografi

- **Judul/heading:** font pixel (usulan: *Press Start 2P* atau *Pixelify Sans*).
- **Body:** font pixel yang mudah dibaca (usulan: *VT323* atau *Pixelify Sans*) dengan ukuran dan line-height cukup untuk keterbacaan.
- Fallback font sistem untuk memastikan teks tetap terbaca.

### 7.3 Aset Pixel Art

- Bingkai foto (batu/besi berukir), border kartu, divider antar-section (rantai, tengkorak, atau obor), dan ornamen sudut.
- Ikon skill dan sosial dalam gaya pixel art seragam.
- Latar bertekstur (kabut, bintang, atau dinding kastil) dengan *parallax* ringan.
- Elemen dekoratif: obor menyala, kelelawar, api, atau runes sebagai animasi sprite sederhana.
- Sumber aset: dibuat sendiri (Aseprite/Photoshop), aset berlisensi bebas (misalnya OpenGameArt, itch.io), atau dibuat dengan bantuan AI; lisensi wajib dicek dan dicatat.
- Render dengan `image-rendering: pixelated` agar tetap tajam.

### 7.4 Interaksi dan Animasi

- Hover kartu: glow merah/emas dan sedikit naik.
- Transisi antar-section ringan; animasi sprite (obor, api) dengan frame rendah.
- Hormati preferensi `prefers-reduced-motion`.
- Opsional: efek suara atau musik latar dengan tombol mute (default mati).

## 8. Data Model (Usulan)

**Profile**

- `id`, `name`, `title`, `bio`, `location`, `photoUrl`, `updatedAt`

**Skill**

- `id`, `name`, `iconUrl`, `order`

**Post (Portofolio)**

- `id`, `title`, `slug` (unik), `summary`, `content`, `thumbnailUrl`, `images[]`, `tags[]`, `links[]`, `role`, `tools`, `status` (draft/published), `featured`, `createdAt`, `updatedAt`

**ContactLink**

- `id`, `type` (email/whatsapp/github/linkedin/dll.), `label`, `url`, `order`

**AdminUser**

- `id`, `email`, `passwordHash`

## 9. Usulan Arsitektur dan Tech Stack

| Lapisan | Usulan | Catatan |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Sesuai skill yang dikuasai; mendukung SSR/SSG untuk SEO |
| Styling | Tailwind CSS + CSS kustom untuk pixel art | Token warna dan font disimpan sebagai variabel |
| Backend / API | Route Handlers Next.js (Node.js) | Tanpa server terpisah untuk v1 |
| Database | PostgreSQL (Supabase/Neon) atau SQLite via Prisma | Pilih sesuai kebutuhan hosting |
| Penyimpanan gambar | Supabase Storage, Cloudinary, atau UploadThing | Kompresi dan optimasi otomatis |
| Autentikasi | Auth.js (NextAuth) atau Supabase Auth | Satu akun admin |
| Hosting | Vercel | Domain kustom opsional |

Stack ini adalah usulan awal dan dapat disesuaikan.

## 10. Kebutuhan Non-Fungsional

- **Performa:** LCP ≤ 2,5 dtk; gambar dioptimasi (WebP/AVIF, lazy loading); aset sprite dikompres.
- **Responsif:** desktop, tablet, dan mobile (breakpoint minimal 360 px, 768 px, 1280 px).
- **Aksesibilitas:** navigasi keyboard, teks alternatif gambar, kontras memadai, dukung reduced motion.
- **SEO:** meta title/description per halaman, Open Graph image per portofolio, sitemap, dan URL slug yang bersih.
- **Keamanan:** hash password, proteksi rute admin, validasi dan sanitasi input, batas ukuran dan tipe file unggahan, serta rate limiting pada login.
- **Kompatibilitas browser:** versi terbaru Chrome, Edge, Firefox, dan Safari.

## 11. Acceptance Criteria

1. Navbar menampilkan tab Contact, Information, Posts; klik tab men-scroll halus ke section yang tepat.
2. Section Information menampilkan foto, biodata, dan ketujuh logo skill (Photoshop, Illustrator, Figma, VS Code, Next.js, Node.js, Kotlin).
3. Section Posts menampilkan kartu portofolio dari database dan tombol View More mengarah ke `/posts`.
4. Klik kartu membuka halaman detail dengan judul, deskripsi lengkap, dan gambar.
5. Footer/Contact menampilkan seluruh tautan kontak yang diisi admin.
6. Admin dapat login, menambah portofolio baru, mengubah foto/biodata, dan perubahan tampil di situs publik tanpa deploy ulang.
7. Pengunjung tanpa login tidak dapat mengakses `/admin`.
8. Tampilan bertema dark fantasy pixel art konsisten di seluruh halaman dan terbaca baik di mobile.

## 12. Rencana Pengerjaan (Milestone)

| Fase | Cakupan | Estimasi |
| --- | --- | --- |
| 1. Desain | Moodboard, palet, wireframe, dan kumpulan aset pixel art | 1–2 minggu |
| 2. Frontend statis | Landing page, `/posts`, dan detail dengan data dummy | 1–2 minggu |
| 3. Backend dan admin | Database, autentikasi, CRUD portofolio, upload gambar | 1–2 minggu |
| 4. Polish dan QA | Animasi, responsif, aksesibilitas, SEO, dan optimasi performa | 1 minggu |
| 5. Rilis | Deploy, domain, dan pengisian konten awal | 2–3 hari |

Estimasi bersifat perkiraan dan bergantung pada ketersediaan aset dan waktu pengerjaan.

## 13. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Aset pixel art memakan waktu atau terbentur lisensi | Jadwal mundur, risiko hukum | Mulai dari paket aset berlisensi bebas; catat sumber dan lisensi |
| Animasi dan gambar membuat situs berat | Performa buruk | Sprite ringan, lazy loading, kompresi, dan batas animasi |
| Teks pixel font sulit dibaca | Aksesibilitas turun | Gunakan pixel font hanya untuk heading; body tetap jelas dan kontras tinggi |
| Panel admin rawan disalahgunakan | Konten situs diubah pihak lain | Autentikasi kuat, proteksi rute, rate limiting |

## 14. Pertanyaan Terbuka

1. Apakah situs memerlukan bahasa ganda (Indonesia/Inggris)? Inggris saja
2. Apakah ingin ada formulir kontak yang mengirim email, atau cukup tautan kontak? tautan kontak saja
3. Apakah halaman posts perlu fitur kategori dan pencarian sejak v1? iya perlu kategori saja
4. Apakah akan memakai domain kustom, dan hosting mana yang dipilih? personal saja, saya deploy di vercel
5. Apakah ingin ada musik latar atau efek suara? tidak perlu
6. Siapa yang menyiapkan aset pixel art: dibuat sendiri, aset berlisensi, atau generasi AI? aset gratis dari internet atau generasi AI saja
