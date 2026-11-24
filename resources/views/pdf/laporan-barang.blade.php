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
            font-size: 8px;
        }

        .header {
            border-bottom: 2px solid #c5a059;
            margin-bottom: 12px;
            padding-bottom: 10px;
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

        .summary {
            margin: 0 0 10px;
            width: 100%;
        }

        .summary td {
            background: #f8fafc;
            border: 1px solid #d1d5db;
            padding: 6px 8px;
        }

        .summary strong {
            color: #0a192f;
        }

        .report {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
        }

        .report th,
        .report td {
            border: 1px solid #d1d5db;
            padding: 5px 4px;
            vertical-align: top;
            word-wrap: break-word;
        }

        .report th {
            background: #0a192f;
            color: #fff;
            font-size: 7px;
            text-align: center;
        }

        .report tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .center {
            text-align: center;
        }

        .numeric {
            text-align: right;
        }

        .empty {
            color: #6b7280;
            padding: 20px;
            text-align: center;
        }

        .signature {
            margin: 24px 0 0 auto;
            page-break-inside: avoid;
            text-align: center;
            width: 190px;
        }

        .signature-space {
            height: 54px;
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
                <h1 class="title">Laporan Barang</h1>
                <div class="muted">Jalan DI. Panjaitan No. 39 Medan</div>
                <div class="muted">Per tanggal: {{ $printedDate }}</div>
            </td>
            <td class="meta" style="width: 170px;">
                <p><strong>Nomor dokumen</strong></p>
                <p>{{ $documentNumber }}</p>
            </td>
        </tr>
    </table>

    <table class="summary">
        <tr>
            <td><strong>Total barang:</strong> {{ $barangs->count() }}</td>
            <td><strong>Total pendapatan sewa:</strong> Rp {{ number_format($totalPendapatan, 0, ',', '.') }}</td>
        </tr>
    </table>

    <table class="report">
        <thead>
            <tr>
                <th style="width: 4%;">No</th>
                <th style="width: 10%;">Kode</th>
                <th style="width: 15%;">Nama Barang</th>
                <th style="width: 10%;">Kategori</th>
                <th style="width: 7%;">Ukuran</th>
                <th style="width: 7%;">Warna</th>
                <th style="width: 10%;">Harga</th>
                <th style="width: 6%;">Stok</th>
                <th style="width: 8%;">Total Disewa</th>
                <th style="width: 13%;">Pendapatan</th>
                <th style="width: 10%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($barangs as $index => $barang)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td>{{ $barang['kode_barang'] }}</td>
                    <td>{{ $barang['nama_barang'] }}</td>
                    <td>{{ $barang['kategori'] }}</td>
                    <td>{{ $barang['ukuran'] }}</td>
                    <td>{{ $barang['warna'] }}</td>
                    <td class="numeric">Rp {{ number_format($barang['harga_sewa'], 0, ',', '.') }}</td>
                    <td class="center">{{ $barang['stok'] }}</td>
                    <td class="center">{{ $barang['total_disewa'] }}</td>
                    <td class="numeric">Rp {{ number_format($barang['total_pendapatan'], 0, ',', '.') }}</td>
                    <td>{{ ucfirst($barang['status']) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="11" class="empty">Tidak ada data barang untuk filter ini.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="signature">
        <div>Medan, {{ $printedDate }}</div>
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
