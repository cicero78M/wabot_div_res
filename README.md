# Cicero_V2 Backend (Node.js)

Kerangka backend Node.js untuk refactor Cicero_V2 dengan fokus pada:
- Cron job rekap pengiriman tugas
- Rekap laporan harian, mingguan, dan bulanan
- Respon pesan komplain dengan basis data dan mekanisme serupa Cicero_V2

## Struktur Folder

```
src/
  config/         # Inisialisasi env
  cron/           # Jadwal cron untuk rekap & komplain
  db/             # Koneksi database
  modules/        # Modul domain (WA Gateway, rekap, komplain)
  services/       # Integrasi eksternal (WA client) dan outbox
  utils/          # Logger, helper
```

## Menjalankan Aplikasi

```bash
cp .env.example .env
export DATABASE_URL=postgres://cicero_user:secret@db-host:5432/Cicero_V2
npm install
npm run start
```

Variabel lingkungan yang didukung didokumentasikan di `.env.example`.

### Cron tambahan untuk WA Gateway

- **Polling outbox WA**: cron baru menjalankan `waGateway.dispatchPendingMessages()` secara periodik.
- **Default**: setiap 2 menit.
- **Konfigurasi**: atur `WA_GATEWAY_POLL_CRON` untuk mengubah interval tanpa perubahan kode (format cron `node-cron`).
- **Cron lain**: jadwal laporan/rekap/komplain dapat diubah lewat `DAILY_REPORT_CRON`, `WEEKLY_REPORT_CRON`, `MONTHLY_REPORT_CRON`, `TASK_DELIVERY_RECAP_CRON`, `COMPLAINT_RESPONSE_CRON`.

## WhatsApp Web Gateway (wwebjs)

- **Pairing (QR)**: saat pertama kali dijalankan, log akan menampilkan QR code (ASCII). Scan dengan aplikasi WhatsApp untuk menghubungkan perangkat.
- **Penyimpanan session**: session disimpan di disk via `LocalAuth` pada path `WA_AUTH_PATH` dengan nama `WA_SESSION_NAME`.
- **Dependency runtime**: `whatsapp-web.js` memakai Chromium/Puppeteer. Pastikan host memiliki dependency system untuk Chromium/Chrome (mis. `libnss3`, `libxss1`, `libasound2`, `libatk1.0-0`, `libgtk-3-0`). Jika diperlukan, set `WA_PUPPETEER_ARGS` untuk `--no-sandbox` atau argumen lainnya.

## Catatan Integrasi

- Tabel utama: `wa_outbox`, `complaint_queue`
- View laporan: `task_delivery_recap_view`, `daily_report_view`, `weekly_report_view`, `monthly_report_view`

Detail arsitektur ada di `docs/architecture.md`.

## Koneksi ke DB Cicero_V2

Aplikasi ini bergantung pada tabel dan view berikut:

- **Tabel**: `wa_outbox`, `complaint_queue`
- **View**: `task_delivery_recap_view`, `daily_report_view`, `weekly_report_view`, `monthly_report_view`

Pastikan DSN `DATABASE_URL` mengarah ke database Cicero_V2 dan akses user memiliki izin SELECT/INSERT/UPDATE sesuai kebutuhan modul.

## Menjalankan sebagai Service

### Contoh systemd

1. Buat file `/etc/systemd/system/cicero-v2.service`:
   ```
   [Unit]
   Description=Cicero_V2 Backend
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/opt/cicero-v2
   EnvironmentFile=/opt/cicero-v2/.env
   ExecStart=/usr/bin/npm run start
   Restart=always
   User=node

   [Install]
   WantedBy=multi-user.target
   ```
2. Jalankan:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now cicero-v2
   ```

### Contoh PM2

```bash
pm2 start npm --name cicero-v2 -- run start
pm2 save
pm2 startup
```

## Catatan Cron (Proses Node)

Cron berjalan di dalam proses Node aplikasi ini (menggunakan `node-cron`), bukan cron OS. Jika ingin menjalankan via cron OS, nonaktifkan proses aplikasi (atau jalankan task terpisah) dan buat entry crontab yang memanggil script Node yang menjalankan modul rekap/komplain sesuai kebutuhan.
