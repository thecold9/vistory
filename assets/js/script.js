// assets/js/script.js (Versi Final dengan Logika RSVP)

function jalankanAnimasiKustom() {
    console.log("Menjalankan semua animasi kustom GSAP...");

    // --- REGISTRASI PLUGIN ---
    gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Physics2DPlugin);
    
    // --- FUNGSI-FUNGSI ANIMASI ANDA (TETAP SAMA) ---
    

    // WORD REVEAL TEXT
    document.querySelectorAll("[data-word-reveal='true']").forEach((text) => {
        // ... (kode ini tetap sama)
    });

    // IMAGE REVEAL ANIMATION
    document.querySelectorAll("[data-image-reveal='true']").forEach((image) => {
        // ... (kode ini tetap sama)
    });
    
    // HERO SCROLL-IN
    document.querySelectorAll(".wrap_scrolly-bottom").forEach((section) => {
        // ... (kode ini tetap sama)
    });

    // GENERAL DRAGGABLE ITEMS (Galeri)
    Draggable.create("[data-drag='true']", {
        inertia: true,
    });

 

    // --- Inisialisasi awal sebelum animasi ---
    gsap.set(".story-title", { y: 50, scale: 0.9 });

    // =================================================================
    // == BAGIAN BARU: LOGIKA UNTUK FORM RSVP ==
    // =================================================================

    const rsvpForm = document.getElementById('rsvp-form');

    if (rsvpForm) {
        // --- 1. Logika Menyembunyikan Kolom 'Jumlah Tamu' ---
        const attendanceRadios = rsvpForm.querySelectorAll('input[name="attendance"]');
        const guestsGroup = document.getElementById('jumlah-tamu-group');
        const guestsInput = document.getElementById('jumlah_tamu');

        const toggleGuestsField = (isAttending) => {
            if (guestsGroup && guestsInput) { // Pastikan elemen ada
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
            event.preventDefault();

            const myForm = event.target;
            const formData = new FormData(myForm);
            const submitButton = myForm.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...';

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                const formContainer = myForm.parentElement;
                formContainer.innerHTML = '<h2>Thank You!</h2><p>Your RSVP has been received.</p>';
            })
            .catch(error => {
                alert('Sorry, an error occurred. Please try again.');
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send RSVP <i class="fa-solid fa-paper-plane"></i>';
                console.error(error);
            });
        });
    }

    // --- ANIMASI UNTUK HERO STORY BARU (TERPISAH PER KATA) ---
    // Membuat timeline baru untuk animasi berurutan
    let storyTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero-story",
            start: "top center+=100",
            toggleActions: "play none none reset" // Tetap terpicu ulang
            // markers: true // Hapus comment ini untuk debug ScrollTrigger
        }
    });

    // Inisialisasi awal sebelum animasi
    gsap.set(".word-our", { y: 30, opacity: 0 });
    gsap.set(".word-story", { y: 30, opacity: 0 });

    // Animasi untuk "Our"
    storyTimeline.to(".word-our", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    })
    // Animasi untuk "Story", dimulai setelah "Our" selesai
    .to(".word-story", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
    }, "-=0.4"); // Dimulai 0.4 detik sebelum animasi sebelumnya selesai (overlap)



    // --- REFRESH SCROLLTRIGGER (TETAP DI AKHIR) ---
    ScrollTrigger.refresh();
    console.log("Animasi kustom GSAP dan logika form telah diaktifkan.");
}