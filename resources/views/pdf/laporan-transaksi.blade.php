<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <style>
        @page {
            margin: 30px 32px 64px;
        }

        body {
            color: #1f2937;
            font-family: "DejaVu Sans", sans-serif;
            font-size: 9px;
        }

        .header {
            border-bottom: 2px solid #c5a059;
            margin-bottom: 14px;
            padding-bottom: 12px;
            width: 100%;
        }

        .logo {
            height: 58px;
            width: 58px;
        }

        .title {
            color: #0a192f;
            font-size: 18px;
            font-weight: bold;
            margin: 0 0 5px;
        }

        .muted {
            color: #6b7280;
        }

        .meta {
            text-align: right;
        }

        .meta p {
            margin: 3px 0;
        }

        .report {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
        }

        .report th,
        .report td {
            border: 1px solid #d1d5db;
            padding: 6px 5px;
            vertical-align: top;
            word-wrap: break-word;
        }

        .report th {
            background: #0a192f;
            color: #fff;
            font-size: 8px;
            text-align: center;
        }

        .report tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .numeric {
            text-align: right;
            white-space: nowrap;
        }

        .empty {
            color: #6b7280;
            padding: 20px;
            text-align: center;
        }

        .signature {
            margin: 28px 0 0 auto;
            page-break-inside: avoid;
            text-align: center;
            width: 190px;
        }

        .signature-place {
            text-align: center;
        }

        .signature-space {
            height: 58px;
        }

        .footer {
            border-top: 1px solid #cbd5e1;
            bottom: -42px;
            color: #6b7280;
            font-size: 8px;
            left: 0;
            padding-top: 7px;
            position: fixed;
            right: 0;
        }

        .footer .note {
            margin-top: 4px;
        }

        tr {
            page-break-inside: avoid;
        }
    </style>
</head>
<body>
    <table class="header">
        <tr>
            <td style="width: 70px;">
                <img class="logo" src="{{ $logo }}" alt="Boesa Fashion">
            </td>
            <td>
                <h1 class="title">Laporan Transaksi Bulanan</h1>
                <div class="muted">Jalan DI. Panjaitan No. 39 Medan</div>
                <div class="muted">Rentang tanggal: {{ $startDate }} - {{ $endDate }}</div>
                @if ($status)
                    <div class="muted">Status: {{ ucfirst($status) }}</div>
                @endif
            </td>
            <td class="meta" style="width: 170px;">
                <p><strong>Nomor dokumen</strong></p>
                <p>{{ $documentNumber }}</p>
            </td>
        </tr>
    </table>

    <table class="report">
        <thead>
            <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 16%;">Kode Transaksi</th>
                <th style="width: 19%;">Pelanggan</th>
                <th style="width: 11%;">Tgl Sewa</th>
                <th style="width: 11%;">Tgl Kembali</th>
                <th style="width: 13%;">Total</th>
                <th style="width: 10%;">DP</th>
                <th style="width: 10%;">Denda</th>
                <th style="width: 6%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($transaksis as $index => $transaksi)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $transaksi['kode_transaksi'] }}</td>
                    <td>{{ $transaksi['pelanggan'] }}</td>
                    <td>{{ $transaksi['tgl_sewa'] }}</td>
                    <td>{{ $transaksi['tgl_kembali'] }}</td>
                    <td class="numeric">Rp {{ number_format($transaksi['total_harga'], 0, ',', '.') }}</td>
                    <td class="numeric">Rp {{ number_format($transaksi['dp'], 0, ',', '.') }}</td>
                    <td class="numeric">Rp {{ number_format($transaksi['denda'], 0, ',', '.') }}</td>
                    <td>{{ ucfirst($transaksi['status']) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="empty">Tidak ada transaksi pada rentang tanggal ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature">
        <div class="signature-place">Medan, {{ $printedDate }}</div>
        <div class="signature-space"></div>
        <div><strong>Budiman Sanjaya</strong></div>
        <div class="muted">Owner</div>
    </div>

    <div class="footer">
        <div>Waktu cetak: {{ $printedAt }}</div>
        <div class="note">Dokumen ini dihasilkan oleh sistem sah tanpa tanda tangan basah</div>
    </div>
</body>
</html>
