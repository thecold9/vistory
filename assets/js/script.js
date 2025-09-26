// assets/js/script.js (Versi Final Lengkap dengan semua animasi)

function jalankanAnimasiKustom() {
    console.log("Menjalankan semua animasi kustom GSAP...");

    // --- REGISTRASI PLUGIN ---
    gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin);
    
    // =================================================================
    // == BAGIAN YANG DIKEMBALIKAN: ANIMASI UNTUK GALERI FOTO ==
    // =================================================================

    // 1. MEMBUAT FOTO DI GALERI BISA DI-DRAG
    Draggable.create("[data-drag='true']", {
        inertia: true, // Memberi efek lempar setelah drag dilepas
    });

    // 2. EFEK FOTO MUNCUL SAAT DI-SCROLL
    document.querySelectorAll("[data-image-reveal='true']").forEach((image) => {
        const startRotation = Math.random() * 10 - 5; // Rotasi acak di awal
        
        // Atur kondisi awal (sembunyi)
        gsap.set(image, { 
            opacity: 0, 
            scale: 1.05, 
            rotation: startRotation 
        });

        // Animasikan saat masuk ke layar
        gsap.to(image, {
            scrollTrigger: {
                trigger: image,
                start: "top 90%",
                toggleActions: "play none none reverse" // Muncul saat masuk, hilang saat keluar
            },
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.1,
        });
        
        gsap.set(image, { visibility: "visible" });
    });


    // =================================================================
    // == ANIMASI LAINNYA YANG SUDAH ADA ==
    // =================================================================

    // --- ANIMASI UNTUK HERO STORY (TERPISAH PER KATA) ---
    const storyTitle = document.querySelector(".story-title");
    if(storyTitle) {
        let storyTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-story",
                start: "top center+=100",
                toggleActions: "play none none reset"
            }
        });

        gsap.set(".word-our, .word-story", { y: 30, opacity: 0 });

        storyTimeline.to(".word-our", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        })
        .to(".word-story", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.4");
    }

    // --- ANIMASI UNTUK PROFILE SECTION ---
    const profileSection = document.querySelector(".profile-section");
    if (profileSection) {
        gsap.to(".bride", {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: profileSection,
                start: "top center",
                toggleActions: "play none none reverse"
            }
        });

        gsap.to(".groom", {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
                trigger: profileSection,
                start: "top center",
                toggleActions: "play none none reverse"
            }
        });
        
        const unitingSymbol = document.querySelector(".uniting-symbol");
        if (unitingSymbol) {
            gsap.to(unitingSymbol, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".profile-section",
                    start: "top center",
                    toggleActions: "play none none reverse"
                }
            });
        }

        
    }
    
    // --- LOGIKA UNTUK FORM RSVP ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        // ... (seluruh kode logika RSVP Anda tetap di sini, tidak perlu diubah) ...
    }

    

    // --- REFRESH SCROLLTRIGGER (WAJIB DI AKHIR) ---
    ScrollTrigger.refresh();
    console.log("Animasi kustom GSAP dan logika form telah diaktifkan.");
}