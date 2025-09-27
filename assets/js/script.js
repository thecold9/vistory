// assets/js/script.js (Versi Final Lengkap dengan semua animasi & logika)

// Fungsi bantuan untuk keamanan (mencegah user memasukkan kode berbahaya)
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// -- FUNGSI BARU UNTUK MEMBERSIHKAN NAMA --
function normalizeName(nameStr) {
    if (!nameStr) return '';
    // Mengubah ke huruf kecil, mengganti '+' dengan spasi, dan menghapus spasi berlebih
    return nameStr.replace(/\+/g, ' ').trim().toLowerCase();
}

// -- FUNGSI UNTUK VALIDASI RSVP YANG SUDAH ADA (VERSI BARU) --
async function checkExistingRsvp() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');

    if (!guestNameParam) return;

    // Gunakan fungsi normalisasi yang baru
    const normalizedGuestName = normalizeName(guestNameParam);
    
    const rsvpContainer = document.getElementById('rsvp-container');
    if (!rsvpContainer) return;

    try {
        const response = await fetch('rsvps.json?cachebust=' + new Date().getTime());
        if (!response.ok) return;
        
        const rsvps = await response.json();

        // Bandingkan nama yang sudah dinormalisasi
        const submissionExists = rsvps.some(
            rsvp => normalizeName(rsvp.name) === normalizedGuestName
        );

        if (submissionExists) {
            rsvpContainer.innerHTML = '<h2>Thank You!</h2><p>Your RSVP has been previously recorded.</p>';
        }
    } catch (error) {
        console.error("Could not check existing RSVPs:", error);
    }
}


// -- FUNGSI UNTUK MEMUAT UCAPAN DARI JSON (TIDAK PERLU DIUBAH, TAPI DISERTAKAN UNTUK KELENGKAPAN) --

async function loadWishes() {
    const swiperWrapper = document.querySelector('.wishes-slider .swiper-wrapper');
    if (!swiperWrapper) return;

    try {
        const response = await fetch('rsvps.json?cachebust=' + new Date().getTime());
        if (!response.ok) throw new Error('File rsvps.json tidak ditemukan.');
        
        const rsvps = await response.json();
        
        const validWishes = rsvps
            .filter(rsvp => rsvp.wish && rsvp.wish.trim() !== '')
            .reverse(); // Terbaru di atas

        if (!validWishes || validWishes.length === 0) {
            swiperWrapper.innerHTML = '<div class="swiper-slide"><p>Jadilah yang pertama memberikan ucapan!</p></div>';
            return;
        }

        const wishesPerPage = 10; // Menampilkan 10 ucapan per halaman
        let slidesHtml = '';

        // KUNCI: Memecah data menjadi beberapa halaman (chunks)
        for (let i = 0; i < validWishes.length; i += wishesPerPage) {
            const chunk = validWishes.slice(i, i + wishesPerPage);
            
            const cardsHtml = chunk.map(rsvp => `
                <div class="wish-card">
                    <h4>${escapeHtml(rsvp.name)}</h4>
                    <p>"${escapeHtml(rsvp.wish)}"</p>
                </div>
            `).join('');

            slidesHtml += `<div class="swiper-slide"><div class="wishes-grid">${cardsHtml}</div></div>`;
        }

        // Masukkan semua slide yang sudah dibuat ke dalam wrapper
        swiperWrapper.innerHTML = slidesHtml;

        // Inisialisasi Swiper SETELAH HTML siap
        new Swiper('.wishes-slider', {
            loop: false, // Jangan loop jika hanya ada beberapa halaman
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

    } catch (error) {
        console.error('Gagal memuat ucapan:', error);
        swiperWrapper.innerHTML = '<div class="swiper-slide"><p>Tidak dapat memuat ucapan saat ini.</p></div>';
    }
}

function jalankanAnimasiKustom() {
    console.log("Menjalankan semua animasi kustom GSAP...");
      // =================================================================
    // == PANGGIL FUNGSI VALIDASI & UCAPAN (INI YANG HILANG) ==
    // =================================================================
    checkExistingRsvp();
    loadWishes();
    // =================================================================
    

    // --- REGISTRASI PLUGIN ---
    gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
    
    // --- ANIMASI GALERI ---
    Draggable.create("[data-drag='true']", { inertia: true });

    document.querySelectorAll("[data-image-reveal='true']").forEach((image) => {
        const startRotation = Math.random() * 10 - 5;
        gsap.set(image, { opacity: 0, scale: 1.05, rotation: startRotation });
        gsap.to(image, {
            scrollTrigger: { trigger: image, start: "top 90%", toggleActions: "play none none reverse" },
            opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "power2.out", delay: 0.1,
        });
        gsap.set(image, { visibility: "visible" });
    });

    // --- ANIMASI UNTUK HERO STORY ---
    const storyTitle = document.querySelector(".story-title");
    if(storyTitle) {
        let storyTimeline = gsap.timeline({
            scrollTrigger: { trigger: ".hero-story", start: "top center+=100", toggleActions: "play none none reset" }
        });
        gsap.set(".word-our, .word-story", { y: 30, opacity: 0 });
        storyTimeline.to(".word-our", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })
        .to(".word-story", { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.4");
    }

    // --- ANIMASI UNTUK PROFILE SECTION ---
    const profileSection = document.querySelector(".profile-section");
    if (profileSection) {
        gsap.to(".bride", { x: 0, opacity: 1, duration: 1.0, ease: "power3.out", scrollTrigger: { trigger: profileSection, start: "top center", toggleActions: "play none none reverse" } });
        gsap.to(".groom", { x: 0, opacity: 1, duration: 1.0, ease: "power3.out", scrollTrigger: { trigger: profileSection, start: "top center", toggleActions: "play none none reverse" } });
        const unitingSymbol = document.querySelector(".uniting-symbol");
        if (unitingSymbol) {
            gsap.to(unitingSymbol, { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)", scrollTrigger: { trigger: ".profile-section", start: "top center", toggleActions: "play none none reverse" } });
        }
    }
    
    // =================================================================
    // == BAGIAN LOGIKA UNTUK FORM RSVP ==
    // =================================================================
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        // --- 1. Logika Menyembunyikan Kolom 'Jumlah Tamu' ---
        const attendanceRadios = rsvpForm.querySelectorAll('input[name="attendance"]');
        const guestsGroup = document.getElementById('jumlah-tamu-group');
        const guestsInput = document.getElementById('jumlah_tamu');

        const toggleGuestsField = (isAttending) => {
            if (guestsGroup && guestsInput) {
                if (isAttending) {
                    guestsGroup.style.display = 'block';
                    guestsInput.required = true;
                    guestsInput.value = guestsInput.value || '1';
                } else {
                    guestsGroup.style.display = 'none';
                    guestsInput.required = false;
                    guestsInput.value = '';
                }
            }
        };
        const initialAttendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
        toggleGuestsField(initialAttendance === 'Accept');
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', (event) => {
                toggleGuestsField(event.target.value === 'Accept');
            });
        });

        // --- 2. Logika Mengirim Form Tanpa Reload (AJAX) ---
        rsvpForm.addEventListener('submit', event => {
            // KODE DI DALAM BLOK INI HANYA BERJALAN SAAT TOMBOL SUBMIT DIKLIK
            event.preventDefault();

            const myForm = event.target;
            const formData = new FormData(myForm); // <-- formData DIBUAT DI SINI
            const submitButton = myForm.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            // KODE FETCH HARUS BERADA DI DALAM SINI
            fetch('submit-rsvp.php', {
                method: 'POST',
                body: formData // <-- formData sekarang PASTI ada
            })
            .then(response => response.json()) // Ambil respons JSON dari PHP
            .then(data => {
                if (data.message === 'Success') {
                    const formContainer = myForm.parentElement;
                    formContainer.innerHTML = '<h2>Thank You!</h2><p>Your RSVP has been received.</p>';
                } else {
                    throw new Error('Server response was not successful.');
                }
            })
            .catch(error => {
                alert('Sorry, an error occurred. Please try again.');
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send RSVP <i class="fa-solid fa-paper-plane"></i>';
                console.error(error);
            });
        });
    }

    

    // --- REFRESH SCROLLTRIGGER (WAJIB DI AKHIR) ---
    ScrollTrigger.refresh();
    console.log("Animasi kustom GSAP dan logika form telah diaktifkan.");
}