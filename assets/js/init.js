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
            loadComponent('./components/gallery.html', 'gallery-placeholder'),
            //  loadComponent('./components/quote.html', 'quote-placeholder'),
            loadComponent('./components/countdown.html', 'countdown-placeholder'),
            loadComponent('./components/map.html', 'map-placeholder'),
            loadComponent('./components/rsvp.html', 'rsvp-placeholder'),
            // loadComponent('./components/wishes.html', 'wishes-placeholder'),
            loadComponent('./components/footer.html', 'footer-placeholder')
        ]);
        
        loader.style.display = 'none';
        runAppLogic();
    }

    /**
     * Menjalankan logika interaktif awal setelah HTML dirakit.
     */
    function runAppLogic() {
        const body = document.body;
        const cover = document.getElementById('cover-undangan');
        const tombolMasuk = document.getElementById('tombol-masuk');
        const kontenUtama = document.getElementById('konten-utama');
        const musik = document.getElementById('musik-latar');
        const namaTamuPlaceholder = document.getElementById('nama-tamu');
        
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
            inputNamaRSVP.value = namaFormatted; // Isi input
            inputNamaRSVP.disabled = true;     // Nonaktifkan input
        }

        // Event listener untuk tombol masuk
        tombolMasuk.addEventListener('click', () => {
            // Paksa scroll ke paling atas halaman
            window.scrollTo(0, 0);
            
            // Putar musik
            musik.play().catch(e => console.error("Autoplay musik gagal:", e));
            musik.volume = 0.5;

            // Transisi dari cover ke konten utama
            cover.style.opacity = '0';
            setTimeout(() => { 
                cover.style.display = 'none'; 
            }, 1200);

            pageWrapper.style.visibility = 'visible';
            kontenUtama.style.opacity = '1';
            
            // Buka kembali kunci scroll
            body.classList.remove('scroll-lock');
            
            // Panggil fungsi untuk menginisialisasi semua plugin dan animasi
            initializeAllPlugins();
        });
        
        // Jalankan countdown timer (bisa berjalan di belakang cover)
        startCountdown();
    }
    
    /**
     * Menginisialisasi semua plugin (Lenis, Webflow, GSAP kustom)
     * Fungsi ini HANYA dipanggil setelah pengguna mengklik tombol masuk.
     */
    function initializeAllPlugins() {
        console.log("Mulai inisialisasi semua plugin...");

        // 1. Inisialisasi Lenis Smooth Scroll
        const lenis = new Lenis({ lerp: 0.1 });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        
        // 2. "Bangunkan" kembali Webflow
        if (window.Webflow) {
            window.Webflow.destroy();
            window.Webflow.ready();
            window.Webflow.require('ix2').init();
            console.log("Animasi Webflow diinisialisasi ulang.");
        }

        // 3. Panggil fungsi dari script.js untuk menjalankan Draggable dan animasi GSAP kustom
        if (typeof jalankanAnimasiKustom === 'function') {
            jalankanAnimasiKustom();
        } else {
            console.error("Fungsi jalankanAnimasiKustom() tidak ditemukan di script.js");
        }
        
        // 4. Panggil fungsi untuk menampilkan ucapan
        tampilkanUcapan();
    }

    /**
     * Menjalankan logika untuk countdown timer.
     */
    function startCountdown() {
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