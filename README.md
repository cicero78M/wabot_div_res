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
export DATABASE_URL=postgres://user:pass@host:5432/dbname
npm install
npm run start
```

## Catatan Integrasi

- Tabel utama: `wa_outbox`, `complaint_queue`
- View laporan: `task_delivery_recap_view`, `daily_report_view`, `weekly_report_view`, `monthly_report_view`

Detail arsitektur ada di `docs/architecture.md`.
