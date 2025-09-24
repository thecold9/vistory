// assets/js/script.js (Versi Baru yang Sudah Dirapikan)

function jalankanAnimasiKustom() {
  console.log("Menjalankan semua animasi kustom (GSAP Draggable, Webflow, dll)...");

  // --- REGISTRASI PLUGIN (Cukup sekali di atas) ---
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, Physics2DPlugin);
  
  // --- FUNGSI-FUNGSI ANIMASI ---

  // WORD REVEAL TEXT
  document.querySelectorAll("[data-word-reveal='true']").forEach((text) => {
    const split = SplitText.create(text, { type: "words, chars", mask: "words", wordsClass: "word", charsClass: "char" });
    gsap.from(split.words, {
      scrollTrigger: { trigger: text, start: "top 85%", toggleActions: "play none none reset" },
      yPercent: 120, delay: 0.2, duration: 0.8, stagger: { amount: 0.5 },
    });
    gsap.set(text, { visibility: "visible" });
  });

  // IMAGE REVEAL ANIMATION
  document.querySelectorAll("[data-image-reveal='true']").forEach((image) => {
    const startRotation = Math.random() * 10 - 5;
    gsap.set(image, { opacity: 0, scale: 1.05, rotation: startRotation });
    gsap.to(image, {
      scrollTrigger: { trigger: image, start: "top 90%", toggleActions: "play none none reset" },
      opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: "power2.out", delay: 0.1,
    });
    gsap.set(image, { visibility: "visible" });
  });
  
  // HERO SCROLL-IN
  document.querySelectorAll(".wrap_scrolly-bottom").forEach((section) => {
    const heading = section.querySelector(".text-giant");
    const hillLeft = section.querySelector("#hill-left");
    const hillRight = section.querySelector("#hill-right");
    const bottle = section.querySelector(".contains_bottle");

    if (!heading || !hillLeft || !hillRight || !bottle) return;

    const split = SplitText.create(heading, { type: "words, chars", mask: "words", wordsClass: "word", charsClass: "char" });
    gsap.set([bottle, hillLeft, hillRight, split.words], { clearProps: "all" }); // Reset
    gsap.set(bottle, { yPercent: 50 });
    gsap.set(hillLeft, { xPercent: -80 });
    gsap.set(hillRight, { xPercent: 80 });
    gsap.set(split.words, { yPercent: 112 });
    
    gsap.timeline({ scrollTrigger: { trigger: section, start: "top 60%", end: "bottom 20%", toggleActions: "play none none reverse" } })
      .to(bottle, { yPercent: 0, duration: 0.8, ease: "power2.out" })
      .to(hillLeft, { xPercent: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .to(hillRight, { xPercent: 0, duration: 0.8, ease: "power2.out" }, "-=0.7")
      .to(split.words, { yPercent: 0, duration: 0.8, ease: "power2.out", stagger: 0.05 }, "-=0.1");
  });

  // GENERAL DRAGGABLE ITEMS (Galeri)
  Draggable.create("[data-drag='true']", {
    inertia: true,
  });

  // Refresh ScrollTrigger sekali di akhir untuk memastikan semua trigger ter-update
  ScrollTrigger.refresh();
  console.log("Animasi kustom GSAP telah diaktifkan.");
}