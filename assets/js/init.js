document.addEventListener('DOMContentLoaded', () => {

    // Mencegah browser mengembalikan posisi scroll secara otomatis
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    const loader = document.getElementById('loader');

    /**
     * Memuat konten dari file HTML komponen ke dalam elemen placeholder.
     * @param {string} path - Path ke file komponen.
     * @param {string} placeholderId - ID dari elemen div placeholder.
     */
    async function loadComponent(path, placeholderId) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const content = await response.text();
            document.getElementById(placeholderId).innerHTML = content;
        } catch (error) {
            console.error(`Gagal memuat komponen: ${path}`, error);
        }
    }

    /**
     * Fungsi utama untuk merakit halaman: memuat semua komponen lalu menjalankan logika utama.
     */
    async function buildAndRun() {
        await Promise.all([
            loadComponent('./components/cover.html', 'cover-placeholder'),
            loadComponent('./components/scrolly-hero.html', 'scrolly-hero-placeholder'),
            loadComponent('./components/hero-story.html', 'hero-story-placeholder'),
            loadComponent('./components/gallery.html', 'gallery-placeholder'),
            loadComponent('./components/profile.html', 'profile-placeholder'),
            loadComponent('./components/event-details.html', 'event-details-placeholder'),
            // loadComponent('./components/countdown.html', 'countdown-placeholder'),
            // loadComponent('./components/map.html', 'map-placeholder'),
            loadComponent('./components/rsvp.html', 'rsvp-placeholder'),
            loadComponent('./components/footer.html', 'footer-placeholder')
        ]);
        
        loader.style.display = 'none';
        runAppLogic();
    }

    /**
     * Menjalankan logika interaktif awal setelah HTML dirakit.
     */
    /**
 * Menjalankan logika interaktif awal setelah HTML dirakit. (VERSI BARU DENGAN KONTROL MUSIK)
 */
function runAppLogic() {
    const body = document.body;
    const cover = document.getElementById('cover-undangan');
    const tombolMasuk = document.getElementById('tombol-masuk');
    const kontenUtama = document.getElementById('konten-utama');
    const namaTamuPlaceholder = document.getElementById('nama-tamu');
    
    // -- Variabel Baru untuk Musik --
    const musik = document.getElementById('musik-latar');
    const tombolMusik = document.getElementById('tombol-musik');
    const iconPlay = tombolMusik.querySelector('.icon-play');
    const iconPause = tombolMusik.querySelector('.icon-pause');
    
    body.classList.add('scroll-lock');

    // Personalisasi nama tamu dari URL
    const urlParams = new URLSearchParams(window.location.search);
    let namaTamu = urlParams.get('to') || "Tamu Undangan";
    const namaFormatted = formatNama(namaTamu);

    // Tampilkan nama di cover
    namaTamuPlaceholder.innerText = namaFormatted;
    
    // Isi otomatis form RSVP
    const inputNamaRSVP = document.getElementById('nama');
    if (inputNamaRSVP && namaTamu !== "Tamu Undangan") {
        inputNamaRSVP.value = namaFormatted;
        inputNamaRSVP.disabled = true;
    }

    // Event listener untuk tombol masuk
    tombolMasuk.addEventListener('click', () => {
        window.scrollTo(0, 0);
        
        // Putar musik & tampilkan tombol kontrol
        musik.play().catch(e => console.error("Autoplay musik gagal:", e));
        musik.volume = 0.5;
        tombolMusik.classList.add('show'); // <-- Tampilkan tombol musik

        // Transisi dari cover ke konten utama
        cover.style.opacity = '0';
        setTimeout(() => { 
            cover.style.display = 'none'; 
        }, 1200);

        pageWrapper.style.visibility = 'visible';
        kontenUtama.style.opacity = '1';
        
        body.classList.remove('scroll-lock');
        
        initializeAllPlugins();
    });

    // -- Event Listener BARU untuk Tombol Musik --
    tombolMusik.addEventListener('click', () => {
        if (musik.paused) {
            musik.play();
            iconPlay.style.display = 'inline-block';
            iconPause.style.display = 'none';
        } else {
            musik.pause();
            iconPlay.style.display = 'none';
            iconPause.style.display = 'inline-block';
        }
    });
    
    startCountdown();
    }
    
    // =========================================================================
    // == REVISI UTAMA: FUNGSI INITIALIZEALLPLUGINS() DENGAN SINKRONISASI GSAP ==
    // =========================================================================
    /**
     * Menginisialisasi semua plugin (Lenis, Webflow, GSAP kustom) setelah pengguna masuk.
     * Termasuk sinkronisasi antara Lenis (smooth scroll) dan GSAP (animasi).
     */
    function initializeAllPlugins() {
        console.log("Mulai inisialisasi semua plugin dan sinkronisasi scroll...");
    
        // 1. Inisialisasi Lenis Smooth Scroll (dengan pengaturan mobile)
        const lenis = new Lenis({
            lerp: 0.1,
            smoothTouch: true,
            touchMultiplier: 1.5,
        });
    
        // 2. SINKRONISASI LENIS & GSAP SCROLLTRIGGER
        // Memberitahu ScrollTrigger untuk mengupdate animasinya setiap kali Lenis melakukan scroll.
        lenis.on('scroll', ScrollTrigger.update);
    
        // Mengintegrasikan Lenis ke dalam "ticker" (loop animasi) milik GSAP 
        // yang lebih efisien daripada requestAnimationFrame manual.
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
    
        // 3. "Bangunkan" kembali Webflow
        if (window.Webflow) {
            window.Webflow.destroy();
            window.Webflow.ready();
            window.Webflow.require('ix2').init();
            console.log("Animasi Webflow diinisialisasi ulang.");
        }
    
        // 4. Panggil fungsi dari script.js untuk menjalankan Draggable dan animasi GSAP kustom
        if (typeof jalankanAnimasiKustom === 'function') {
            jalankanAnimasiKustom();
        } else {
            console.error("Fungsi jalankanAnimasiKustom() tidak ditemukan di script.js");
        }

        // 5. Efek Fade-in untuk Halaman Quotes (Expert Touch)
        // Pastikan Anda sudah mengimpor GSAP dan ScrollTrigger!
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.to("#quote-page", {
                opacity: 1,
                ease: "power2.out",
                duration: 1.5, // Durasi fade-in
                scrollTrigger: {
                    trigger: "#quote-page",
                    start: "top center+=20%", // Kapan animasi dimulai (saat 20% dari bagian atas halaman quotes terlihat di tengah layar)
                    toggleActions: "play none none none", // Mainkan hanya sekali saat masuk
                    // markers: true // Hapus atau komentar ini di produksi
                }
            });
            console.log("Animasi fade-in halaman quotes diinisialisasi.");
        } else {
            console.warn("GSAP atau ScrollTrigger tidak dimuat, efek fade-in quotes tidak akan berjalan.");
        }

        // ... (kode initializeAllPlugins() lainnya) ...

        // 6. FUNGSI UNTUK "ADD TO CALENDAR"
        const calendarBtn = document.getElementById('add-to-calendar-btn');
        const calendarLinks = document.getElementById('calendar-links');
        const icsLink = document.getElementById('ics-link');

        if (calendarBtn && calendarLinks && icsLink) {
            // Data untuk file .ics (Apple & Outlook)
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'SUMMARY:Pernikahan Victor & Inge',
                'DTSTART;TZID=Asia/Jakarta:20251018T190000',
                'DTEND;TZID=Asia/Jakarta:20251018T220000',
                'LOCATION:Aroem Resto & Cafe Jakarta, Jl. Abdul Muis No.14, Jakarta Pusat',
                'DESCRIPTION:Acara pernikahan Victor & Inge. Jangan lupa hadir!',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n');

            // Set link untuk file .ics menggunakan Data URI
            icsLink.href = 'data:text/calendar;charset=utf8,' + encodeURIComponent(icsData);

            // Tampilkan/sembunyikan menu saat tombol diklik
            calendarBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Mencegah klik menyebar ke window
                calendarLinks.classList.toggle('show');
            });
            
            // Sembunyikan menu saat mengklik di luar
            window.addEventListener('click', () => {
                if (calendarLinks.classList.contains('show')) {
                    calendarLinks.classList.remove('show');
                }
            });
        }
 

        
        // 6. Panggil fungsi untuk menampilkan ucapan
        tampilkanUcapan();
    }

    /**
     * Menjalankan logika untuk countdown timer.
     */
    function startCountdown() {
        // Menggunakan tanggal sekarang, 24 September 2025, sebagai contoh
        const tanggalAcara = new Date("2025-10-18T19:00:00").getTime();
        const countdownElement = document.getElementById("countdown");
        if (!countdownElement) return;

        const interval = setInterval(() => {
            const sekarang = new Date().getTime();
            const selisih = tanggalAcara - sekarang;

            if (selisih < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "<h2>Acara Telah Berlangsung</h2>";
                return;
            }

            document.getElementById("hari").innerText = Math.floor(selisih / (1000 * 60 * 60 * 24));
            document.getElementById("jam").innerText = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("menit").innerText = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("detik").innerText = Math.floor((selisih % (1000 * 60)) / 1000);
        }, 1000);
    }
    
    /**
     * Mengambil dan menampilkan data ucapan dari Netlify Function.
     */
    async function tampilkanUcapan() {
        const wishesList = document.getElementById('wishes-list');
        if (!wishesList) return;

        try {
            const response = await fetch('/.netlify/functions/get-wishes');
            const wishes = await response.json();

            if (wishes.length === 0) {
                wishesList.innerHTML = "<p>Jadilah yang pertama memberikan ucapan!</p>";
                return;
            }

            wishesList.innerHTML = ""; // Kosongkan tulisan "memuat..."
            
            wishes.forEach(wish => {
                const wishElement = document.createElement('div');
                wishElement.className = 'wish-card';
                wishElement.innerHTML = `
                    <h4>${wish.nama}</h4>
                    <p>"${wish.ucapan}"</p>
                `;
                wishesList.appendChild(wishElement);
            });

        } catch (error) {
            wishesList.innerHTML = "<p>Gagal memuat ucapan.</p>";
            console.error("Error saat mengambil ucapan:", error);
        }
    }

    /**
     * Fungsi helper untuk memformat nama tamu.
     * @param {string} nama - Nama dari URL parameter.
     * @returns {string} Nama yang sudah diformat.
     */
    function formatNama(nama) {
        const namaDibersihkan = nama.replace(/[+]/g, ' ');
        return namaDibersihkan.split(' ').map(kata => kata.charAt(0).toUpperCase() + kata.slice(1)).join(' ');
    }

    // Mulai proses perakitan halaman!
    buildAndRun();
});