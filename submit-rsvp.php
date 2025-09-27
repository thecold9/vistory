<?php
// --- Konfigurasi ---
// Ganti dengan alamat email Anda untuk menerima notifikasi
$notification_email = 'v.arijanto@gmail.com'; 
// Nama file untuk menyimpan data RSVP
$save_file = 'rsvps.json';

// Hanya proses jika data dikirim dengan metode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Ambil dan bersihkan data dari form
    $name = trim($_POST['name'] ?? 'Tidak diisi');
    $attendance = trim($_POST['attendance'] ?? 'Tidak diisi');
    $guests = trim($_POST['guests'] ?? '');
    $wish = trim($_POST['wish'] ?? 'Tidak ada ucapan.');
    $timestamp = date('Y-m-d H:i:s');

    // Siapkan data baru yang akan disimpan
    $new_submission = [
        'name' => $name,
        'attendance' => $attendance,
        'guests' => $guests,
        'wish' => $wish,
        'timestamp' => $timestamp
    ];

    // Baca data lama, tambahkan data baru, lalu simpan kembali ke file JSON
    $rsvps = file_exists($save_file) ? json_decode(file_get_contents($save_file), true) : [];
    $rsvps[] = $new_submission;
    file_put_contents($save_file, json_encode($rsvps, JSON_PRETTY_PRINT));

    // Kirim notifikasi email ke Anda
    $subject = "Konfirmasi RSVP Baru dari: " . $name;
    $body = "Anda menerima RSVP baru!\n\n";
    $body .= "Nama: " . $name . "\n";
    $body .= "Kehadiran: " . $attendance . "\n";
    if (!empty($guests)) {
        $body .= "Jumlah Tamu: " . $guests . "\n";
    }
    $body .= "Ucapan: " . $wish . "\n";
    $headers = 'From: no-reply@thevistory.love' . "\r\n"; // Anda bisa ganti email pengirim
    
    mail($notification_email, $subject, $body, $headers);

    // Kirim respons sukses kembali ke JavaScript
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Success']);
    exit();
}

// Jika file diakses langsung, alihkan ke halaman utama
header('Location: /');
exit();
?>