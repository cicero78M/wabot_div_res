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
export DATABASE_URL=postgres://user:pass@host:5432/dbname
npm install
npm run start
```

Variabel lingkungan yang didukung didokumentasikan di `.env.example`.

### Cron tambahan untuk WA Gateway

- **Polling outbox WA**: cron baru menjalankan `waGateway.dispatchPendingMessages()` secara periodik.
- **Default**: setiap 2 menit.
- **Konfigurasi**: atur `WA_GATEWAY_POLL_CRON` untuk mengubah interval tanpa perubahan kode (format cron `node-cron`).

## WhatsApp Web Gateway (wwebjs)

- **Pairing (QR)**: saat pertama kali dijalankan, log akan menampilkan QR code (ASCII). Scan dengan aplikasi WhatsApp untuk menghubungkan perangkat.
- **Penyimpanan session**: session disimpan di disk via `LocalAuth` pada path `WA_AUTH_PATH` dengan nama `WA_SESSION_NAME`.
- **Dependency runtime**: `whatsapp-web.js` memakai Chromium/Puppeteer. Pastikan host memiliki dependency system untuk Chromium/Chrome (mis. `libnss3`, `libxss1`, `libasound2`, `libatk1.0-0`, `libgtk-3-0`). Jika diperlukan, set `WA_PUPPETEER_ARGS` untuk `--no-sandbox` atau argumen lainnya.

## Catatan Integrasi

- Tabel utama: `wa_outbox`, `complaint_queue`
- View laporan: `task_delivery_recap_view`, `daily_report_view`, `weekly_report_view`, `monthly_report_view`

Detail arsitektur ada di `docs/architecture.md`.
