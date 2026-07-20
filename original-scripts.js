<script>
    (function() {
      try {
        const storedTheme = localStorage.getItem('nexus_theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = storedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        document.getElementById('meta-theme-color').content = theme === 'dark' ? '#02040A' : '#F4F7FB';
      } catch (e) {}
    })();
  </script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>

<script src="https://cdn.tailwindcss.com/3.4.1"></script>

<script>
    tailwind.config = {
      darkMode: ['class', '[data-theme="dark"]'],
      theme: {
        extend: {
          colors: {
            page: "rgb(var(--page-bg) / <alpha-value>)",
            surface: "rgb(var(--surface) / <alpha-value>)",
            elevated: "rgb(var(--surface-elevated) / <alpha-value>)",
            soft: "rgb(var(--surface-soft) / <alpha-value>)",
            primary: "rgb(var(--text-primary) / <alpha-value>)",
            secondary: "rgb(var(--text-secondary) / <alpha-value>)",
            muted: "rgb(var(--text-muted) / <alpha-value>)",
            nd: {
              cyan: "rgb(var(--cyan) / <alpha-value>)",
              violet: "rgb(var(--violet) / <alpha-value>)",
              lime: "rgb(var(--lime) / <alpha-value>)",
              border: "rgba(var(--border-color), var(--border-alpha))"
            }
          },
          fontFamily: {
            display: ['Syne', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
          }
        }
      }
    }
  </script>

<script>
    // CORE INITIALIZATION
    let appInitialized = false;
    let webglResources = { renderer: null, scene: null, camera: null, animationId: null, geometries: [], materials: [], fog: null };

    document.addEventListener('DOMContentLoaded', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const loader = document.getElementById('loader');

      function initializeApplication() {
        if (appInitialized) return;
        appInitialized = true;
        
        document.querySelectorAll('.js-hidden').forEach(el => el.classList.remove('js-hidden'));
        if (window.gsap) {
          gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, CustomEase);
          CustomEase.create("cinematic", "0.25, 1, 0.5, 1");
          CustomEase.create("ui", "0.4, 0, 0.2, 1");
          
          initThemeToggle();
          initNavigation();
          initHero(prefersReducedMotion);
          
          if (!prefersReducedMotion) {
            initCursor();
            initStoryContinuity();
            initExpertiseDesktop();
            initApproachSequence();
            initTechMap();
            initDiagnostic();
          }
          
          initExpertiseMobile();
          initTestimonials();
          initContactForm();
        }
      }

      if (prefersReducedMotion || sessionStorage.getItem('nexus_loaded')) {
        if(loader) gsap.set(loader, { display: 'none' });
        initializeApplication();
      } else {
        // If loader existed (removed for brevity, assuming already loaded for dev speed, or wrap this block)
        sessionStorage.setItem('nexus_loaded', 'true'); 
        initializeApplication();
      }

      window.addEventListener('beforeunload', () => {
        if(webglResources.animationId) cancelAnimationFrame(webglResources.animationId);
        webglResources.geometries.forEach(g => g.dispose());
        webglResources.materials.forEach(m => m.dispose());
        if(webglResources.renderer) webglResources.renderer.dispose();
      });
    });

    // --- THEME SYSTEM ---
    function initThemeToggle() {
      const btnDesktop = document.getElementById('theme-toggle-desktop');
      const btnMobile = document.getElementById('theme-toggle-mobile');
      
      function updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
        localStorage.setItem('nexus_theme', theme);
        document.getElementById('meta-theme-color').content = theme === 'dark' ? '#02040A' : '#F4F7FB';
        
        const isDark = theme === 'dark';
        if(btnDesktop) btnDesktop.setAttribute('aria-pressed', !isDark);
        
        // Update WebGL if active without restarting
        if(webglResources.scene && webglResources.fog) {
          webglResources.fog.color.setHex(isDark ? 0x02040A : 0xF4F7FB);
          webglResources.scene.background = new THREE.Color(isDark ? 0x02040A : 0xF4F7FB);
        }
      }

      function toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        updateTheme(current === 'dark' ? 'light' : 'dark');
      }

      if(btnDesktop) btnDesktop.addEventListener('click', toggle);
      if(btnMobile) btnMobile.addEventListener('click', toggle);
    }

    function initNavigation() {
      const header = document.getElementById('site-header');
      const container = document.getElementById('nav-container');
      const btn = document.getElementById('mobile-menu-btn');
      const menu = document.getElementById('mobile-menu');
      const links = document.querySelectorAll('.mobile-link');
      let isScrolled = false;
      let menuOpen = false;

      let scrollTimeout;
      window.addEventListener('scroll', () => {
        if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
        scrollTimeout = requestAnimationFrame(() => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          const currentScroll = window.scrollY;
          if (currentScroll > 50 && !isScrolled) {
            isScrolled = true;
            // Removed fixed rgba colors to allow CSS variables to inherit from body scroll
            container.style.backgroundColor = 'var(--surface-soft)';
            container.style.backdropFilter = 'blur(12px)';
            container.style.border = '1px solid var(--border-color)';
            gsap.to(container, { paddingTop: '12px', paddingBottom: '12px', paddingLeft: '24px', paddingRight: '24px', borderRadius: '999px', marginTop: '16px', maxWidth: '1024px', duration: 0.4, ease: "ui" });
            gsap.to(header, { paddingTop: 0, duration: 0.4 });
          } else if (currentScroll <= 50 && isScrolled) {
            isScrolled = false;
            container.style.backgroundColor = 'transparent';
            container.style.backdropFilter = 'blur(0px)';
            container.style.border = '1px solid transparent';
            gsap.to(container, { paddingTop: '0px', paddingBottom: '0px', paddingLeft: '20px', paddingRight: '20px', borderRadius: '0px', marginTop: '0px', maxWidth: '1440px', duration: 0.4, ease: "ui" });
            gsap.to(header, { paddingTop: '24px', duration: 0.4 });
          }
        });
      }, { passive: true });

      function toggleMenu() {
        menuOpen = !menuOpen;
        btn.setAttribute('aria-expanded', menuOpen);
        if (menuOpen) {
          document.body.style.overflow = 'hidden';
          gsap.to(menu, { opacity: 1, pointerEvents: 'auto', duration: 0.4 });
          gsap.fromTo(links, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, delay: 0.2, duration: 0.4 });
          gsap.to(btn.querySelector('.line-1'), { y: 8, rotate: 45, duration: 0.3 });
          gsap.to(btn.querySelector('.line-2'), { opacity: 0, duration: 0.3 });
          gsap.to(btn.querySelector('.line-3'), { y: -8, rotate: -45, duration: 0.3 });
          menu.focus();
        } else {
          document.body.style.overflow = '';
          gsap.to(menu, { opacity: 0, pointerEvents: 'none', duration: 0.4 });
          gsap.to(btn.querySelector('.line-1'), { y: 0, rotate: 0, duration: 0.3 });
          gsap.to(btn.querySelector('.line-2'), { opacity: 1, duration: 0.3 });
          gsap.to(btn.querySelector('.line-3'), { y: 0, rotate: 0, duration: 0.3 });
        }
      }

      btn.addEventListener('click', toggleMenu);
      links.forEach(l => l.addEventListener('click', toggleMenu));
      window.addEventListener('keydown', e => { if(e.key === 'Escape' && menuOpen) toggleMenu(); });
    }

    function initCursor() {
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      if (isTouch) return;
      
      const cursor = document.getElementById('custom-cursor');
      gsap.set(cursor, { xPercent: -50, yPercent: -50 });
      const xTo = gsap.quickTo(cursor, "x", {duration: 0.4, ease: "power3"}), yTo = gsap.quickTo(cursor, "y", {duration: 0.4, ease: "power3"});

      window.addEventListener("mousemove", e => { xTo(e.clientX); yTo(e.clientY); if(!cursor.classList.contains('active')) cursor.classList.add('active'); }, {passive:true});
      document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => { const state = el.getAttribute('data-cursor'); cursor.setAttribute('data-state', state); cursor.innerText = state === 'view' ? 'VIEW' : ''; });
        el.addEventListener('mouseleave', () => { cursor.removeAttribute('data-state'); cursor.innerText = ''; });
      });
    }

    function initHero(reducedMotion) {
      if (!window.THREE || reducedMotion) return;
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) return;

      try {
        const scene = new THREE.Scene();
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const fogColor = isDark ? 0x02040A : 0xF4F7FB;
        scene.background = new THREE.Color(fogColor);
        scene.fog = new THREE.FogExp2(fogColor, 0.02);
        webglResources.scene = scene;
        webglResources.fog = scene.fog;
        
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30; camera.position.x = window.innerWidth > 768 ? 15 : 0;
        webglResources.camera = camera;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        webglResources.renderer = renderer;

        const pCount = window.innerWidth < 768 ? 1000 : 2500;
        const geoCore = new THREE.BufferGeometry();
        const posCore = new Float32Array(pCount * 3);
        const origCore = new Float32Array(pCount * 3);
        
        for(let i=0; i < pCount; i++) {
          posCore[i*3] = (Math.random() - 0.5) * 100;
          posCore[i*3+1] = (Math.random() - 0.5) * 100;
          posCore[i*3+2] = (Math.random() - 0.5) * 100;
          const phi = Math.acos(-1 + (2 * i) / pCount), theta = Math.sqrt(pCount * Math.PI) * phi;
          const r = 8 + (Math.random() * 4);
          origCore[i*3] = r * Math.cos(theta) * Math.sin(phi);
          origCore[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
          origCore[i*3+2] = r * Math.cos(phi);
        }
        geoCore.setAttribute('position', new THREE.BufferAttribute(posCore, 3));
        const matCore = new THREE.PointsMaterial({ color: 0x18E0FF, size: window.innerWidth < 768 ? 0.08 : 0.12, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
        const pointsCore = new THREE.Points(geoCore, matCore);
        scene.add(pointsCore);
        webglResources.geometries.push(geoCore); webglResources.materials.push(matCore);

        const ringGeo1 = new THREE.RingGeometry(18, 18.1, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 2;
        scene.add(ring1);
        webglResources.geometries.push(ringGeo1); webglResources.materials.push(ringMat1);

        let time = 0, isRendering = true, mouseX = 0, mouseY = 0;
        if(!('ontouchstart' in window)) window.addEventListener('mousemove', (e) => { mouseX = (e.clientX / window.innerWidth) * 2 - 1; mouseY = -(e.clientY / window.innerHeight) * 2 + 1; }, { passive: true });

        const obj = { progress: 0 };
        gsap.to(obj, {
          progress: 1, duration: 2.5, ease: "power3.inOut",
          onUpdate: () => {
            const pa = geoCore.attributes.position;
            for(let i=0; i<pCount*3; i++) pa.array[i] = posCore[i] + (origCore[i] - posCore[i]) * obj.progress;
            pa.needsUpdate = true;
          }
        });

        gsap.to(camera.position, {
          z: 15, y: -5,
          scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
        });

        function render() {
          if(!isRendering) return;
          time += 0.005;
          pointsCore.rotation.y = time * 0.5 + (mouseX * 0.1);
          pointsCore.rotation.x = (mouseY * 0.1);
          ring1.rotation.y = -time * 0.8; ring1.rotation.x = Math.PI/2 + (mouseY * 0.2);
          
          renderer.render(scene, camera);
          webglResources.animationId = requestAnimationFrame(render);
        }
        render();

        document.addEventListener('visibilitychange', () => { isRendering = !document.hidden; if(isRendering) render(); });
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
          if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
          resizeTimeout = requestAnimationFrame(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
        });

      } catch (e) { console.warn('WebGL Init failed:', e); }
    }

    function initStoryContinuity() {
      gsap.to("#intro-line-1", { strokeDashoffset: 0, scrollTrigger: { trigger: "#introduction", start: "top 80%", end: "center center", scrub: 1 } });
      gsap.to("#intro-line-2", { strokeDashoffset: 0, scrollTrigger: { trigger: "#introduction", start: "top 70%", end: "center center", scrub: 1 } });
      gsap.to(".word-illum", { opacity: 1, stagger: 0.1, scrollTrigger: { trigger: ".intro-text", start: "top 70%", end: "center center", scrub: true } });
      gsap.to(".diagnostic-scanner", { width: "100%", scrollTrigger: { trigger: ".intro-metrics", start: "top 80%", once: true, duration: 1 } });

      document.querySelectorAll('.counter').forEach(c => {
        const t = parseFloat(c.getAttribute('data-target')), f = c.getAttribute('data-float') === 'true';
        gsap.to(c, { innerHTML: t, duration: 2, ease: "power2.out", snap: { innerHTML: f ? 0.1 : 1 }, scrollTrigger: { trigger: ".intro-metrics", start: "top 80%", once: true } });
      });
    }

    function initExpertiseMobile() {
      const items = document.querySelectorAll('.accordion-item');
      items.forEach(item => {
        const btn = item.querySelector('button');
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          items.forEach(i => { i.classList.remove('active'); i.querySelector('button').setAttribute('aria-expanded', 'false'); });
          if (!isActive) { item.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); }
        });
      });
    }

    function initExpertiseDesktop() {
      const triggers = document.querySelectorAll('.expertise-trigger');
      const states = document.querySelectorAll('.expertise-state');
      if(triggers.length === 0 || states.length === 0) return;

      triggers.forEach((trigger, idx) => {
        ScrollTrigger.create({
          trigger: trigger,
          start: "top center",
          end: "bottom center",
          onEnter: () => activateState(idx, trigger),
          onEnterBack: () => activateState(idx, trigger)
        });
      });

      function activateState(idx, triggerEl) {
        // Fade previous text triggers (do not let them sit at full opacity under heading)
        triggers.forEach(t => gsap.to(t, { opacity: 0.2, duration: 0.3 }));
        gsap.to(triggerEl, { opacity: 1, duration: 0.3 });

        // Fade visual states purely (fixes layout overlap/flip bugs for completely distinct SVGs)
        states.forEach((s, i) => {
          if (i === idx) {
             s.classList.add('is-active');
             gsap.fromTo(s, { autoAlpha: 0, scale: 0.95 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power2.out" });
          } else {
             gsap.to(s, { autoAlpha: 0, scale: 1.05, duration: 0.3, onComplete: () => s.classList.remove('is-active') });
          }
        });
      }
    }

    function initApproachSequence() {
      const container = document.getElementById('approach-scroll-container');
      if(!container) return;

      const texts = document.querySelectorAll('.approach-text');
      const stages = document.querySelectorAll('.approach-stage');
      if(stages.length < 4) return;

      const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top top", end: "bottom bottom", scrub: true } });

      function setStage(idx) {
        stages.forEach((s, i) => {
           if(i === idx) {
              s.classList.add('is-active');
              gsap.to(s, { autoAlpha: 1, duration: 0.1 });
           } else {
              s.classList.remove('is-active');
              gsap.to(s, { autoAlpha: 0, duration: 0.1 });
           }
        });
      }

      // 0-22%: Discover
      tl.to(texts[0], {opacity: 1, duration: 0.5})
        .to({}, {duration: 1}) // Hold
        .to(texts[0], {opacity: 0, duration: 0.5})
        .call(() => setStage(1))
        
      // 22-47%: Architect
        .to(texts[1], {opacity: 1, duration: 0.5})
        .to({}, {duration: 1}) // Hold
        .to(texts[1], {opacity: 0, duration: 0.5})
        .call(() => setStage(2))

      // 47-72%: Engineer
        .to(texts[2], {opacity: 1, duration: 0.5})
        .to({}, {duration: 1}) // Hold
        .to(texts[2], {opacity: 0, duration: 0.5})
        .call(() => setStage(3))

      // 72-100%: Optimize
        .to(texts[3], {opacity: 1, duration: 0.5})
        .to({}, {duration: 1}); // Hold to end
        
      // Backwards scrolling callbacks (simplistic for scrub)
      // Because scrub timelines evaluate forward/back automatically, 
      // direct DOM manipulation calls inside scrub timelines need careful positioning.
      // Better approach for absolute reliability with scrub is to animate autoAlpha directly on the timeline.
      
      tl.clear(); // Reset to build purely declarative timeline
      
      // Init all to 0 except first
      gsap.set(stages[0], { autoAlpha: 1 });
      gsap.set([stages[1], stages[2], stages[3]], { autoAlpha: 0 });

      // 0 -> 25% (Discover -> Architect)
      tl.to({}, {duration: 1}) // Hold 1
        .to(texts[0], {opacity: 0, duration: 0.5}, "trans1")
        .to(stages[0], {autoAlpha: 0, duration: 0.5}, "trans1")
        .to(stages[1], {autoAlpha: 1, duration: 0.5}, "trans1")
        .to(texts[1], {opacity: 1, duration: 0.5}, "trans1")
        
      // 25 -> 50% (Architect -> Engineer)
        .to({}, {duration: 1}) // Hold 2
        .to(texts[1], {opacity: 0, duration: 0.5}, "trans2")
        .to(stages[1], {autoAlpha: 0, duration: 0.5}, "trans2")
        .to(stages[2], {autoAlpha: 1, duration: 0.5}, "trans2")
        .to(texts[2], {opacity: 1, duration: 0.5}, "trans2")

      // 50 -> 75% (Engineer -> Optimize)
        .to({}, {duration: 1}) // Hold 3
        .to(texts[2], {opacity: 0, duration: 0.5}, "trans3")
        .to(stages[2], {autoAlpha: 0, duration: 0.5}, "trans3")
        .to(stages[3], {autoAlpha: 1, duration: 0.5}, "trans3")
        .to(texts[3], {opacity: 1, duration: 0.5}, "trans3")
        
      // 75 -> 100%
        .to({}, {duration: 1}); // Hold 4
    }

    function initTechMap() {
      const container = document.getElementById('tech-map-container');
      if(!container) return;

      const tl = gsap.timeline({ scrollTrigger: { trigger: container, start: "top 60%", once: true } });
      tl.fromTo("#tech-core", {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.5)"})
        .fromTo("#tech-network-svg path", {strokeDasharray: 1000, strokeDashoffset: 1000}, {strokeDashoffset: 0, duration: 1, stagger: 0.1}, "-=0.2")
        .to(".tech-node", {scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)"}, "-=0.5");
        
        gsap.to("#sig-product", { display: "block", motionPath: {path: "#path-product", align: "#path-product", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, ease: "none"});
        gsap.to("#sig-cloud", { display: "block", motionPath: {path: "#path-cloud", align: "#path-cloud", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 0.5, ease: "none"});
        gsap.to("#sig-intel", { display: "block", motionPath: {path: "#path-intel", align: "#path-intel", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 1, ease: "none"});
        gsap.to("#sig-growth", { display: "block", motionPath: {path: "#path-growth", align: "#path-growth", alignOrigin: [0.5, 0.5]}, duration: 2, repeat: -1, delay: 1.5, ease: "none"});

      gsap.to(".diagnostic-signal", { display: "block", y: "100%", duration: 1, scrollTrigger: { trigger: ".diagnostic-signal", start: "top 60%", once: true } });
    }

    function initDiagnostic() {
      const tl = gsap.timeline({ scrollTrigger: { trigger: "#diagnostic", start: "top 60%", once: true } });
      tl.to(".diag-scanner", { opacity: 1, top: "100%", duration: 1.5, ease: "power1.inOut" })
        .to(".diag-scanner", { opacity: 0, duration: 0.2 })
        .to(".diag-bar", { width: "100%", duration: 1, stagger: 0.2 }, "-=1")
        .to(".diag-status", { text: "[VERIFIED]", color: "rgb(var(--lime))", duration: 0.5, stagger: 0.2 }, "-=0.8")
        .to(".diag-text", { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");
    }

    function initTestimonials() {
      const slides = document.querySelectorAll('.test-slide');
      const counter = document.getElementById('test-counter');
      const btnPrev = document.getElementById('test-prev');
      const btnNext = document.getElementById('test-next');
      if(!slides.length || !btnNext) return;

      let current = 0;
      function showSlide(idx) {
        gsap.to(slides[current], { opacity: 0, pointerEvents: 'none', duration: 0.4 });
        current = idx;
        gsap.to(slides[current], { opacity: 1, pointerEvents: 'auto', duration: 0.4, delay: 0.2 });
        counter.innerText = `${current + 1} / ${slides.length}`;
      }

      btnNext.addEventListener('click', () => showSlide((current + 1) % slides.length));
      btnPrev.addEventListener('click', () => showSlide((current - 1 + slides.length) % slides.length));
    }

    function initContactForm() {
      const form = document.getElementById('inquiry-form');
      const steps = document.querySelectorAll('.form-step');
      const container = document.getElementById('form-steps-container');
      const progress = document.getElementById('form-progress');
      const feedback = document.getElementById('form-feedback');
      
      if (!form || !steps.length) return;

      function goToStep(newIdx, currentIdx) {
        // Validate current step before proceeding
        const currentStepEl = steps[currentIdx];
        let isValid = true;
        currentStepEl.querySelectorAll('[required]').forEach(req => {
          const errMsg = req.nextElementSibling;
          if(!req.value.trim() || (req.type === 'email' && !req.value.includes('@'))) { 
             isValid = false; 
             req.classList.add('input-error'); 
             if(errMsg) errMsg.classList.remove('hidden');
             req.setAttribute('aria-invalid', 'true');
          } else { 
             req.classList.remove('input-error'); 
             if(errMsg) errMsg.classList.add('hidden');
             req.setAttribute('aria-invalid', 'false');
          }
        });

        if(newIdx > currentIdx && !isValid) {
           const firstInvalid = currentStepEl.querySelector('.input-error');
           if(firstInvalid) firstInvalid.focus();
           return;
        }

        // Animate out
        gsap.to(currentStepEl, { opacity: 0, duration: 0.3, onComplete: () => {
           currentStepEl.classList.add('hidden');
           currentStepEl.classList.remove('is-active');
           
           // Animate in
           const nextStepEl = steps[newIdx];
           nextStepEl.classList.remove('hidden');
           nextStepEl.classList.add('is-active');
           gsap.fromTo(nextStepEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
           
           // Resize container
           gsap.to(container, { height: nextStepEl.offsetHeight, duration: 0.3 });
           
           const focusTarget = nextStepEl.querySelector('h3, input, select');
           if(focusTarget) focusTarget.focus();
        }});

        gsap.to(progress, { width: `${((newIdx + 1) / steps.length) * 100}%`, duration: 0.4 });
      }

      form.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const currentStepEl = e.target.closest('.form-step');
          const currentIdx = parseInt(currentStepEl.getAttribute('data-step')) - 1;
          if (currentIdx < steps.length - 1) goToStep(currentIdx + 1, currentIdx);
        });
      });

      form.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const currentStepEl = e.target.closest('.form-step');
          const currentIdx = parseInt(currentStepEl.getAttribute('data-step')) - 1;
          if (currentIdx > 0) goToStep(currentIdx - 1, currentIdx);
        });
      });

      // Clear errors on input
      form.querySelectorAll('[required]').forEach(req => {
         req.addEventListener('input', () => {
            req.classList.remove('input-error');
            const errMsg = req.nextElementSibling;
            if(errMsg) errMsg.classList.add('hidden');
         });
      });

      // Initial container height
      gsap.set(container, { height: steps[0].offsetHeight });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentIdx = 2; // Step 3
        const currentStepEl = steps[currentIdx];
        let isValid = true;
        
        currentStepEl.querySelectorAll('[required]').forEach(req => {
          const errMsg = req.nextElementSibling;
          if(!req.value.trim() || (req.type === 'email' && !req.value.includes('@'))) { 
             isValid = false; 
             req.classList.add('input-error'); 
             if(errMsg) errMsg.classList.remove('hidden');
          }
        });

        if(isValid) {
          document.getElementById('form-steps-container').style.display = 'none';
          feedback.classList.remove('hidden');
          feedback.innerHTML = `
            <div class="p-6 border border-nd-cyan/30 bg-nd-cyan/5 rounded-lg text-nd-cyan flex items-start gap-4">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3"/></svg>
              <div>
                <h4 class="font-bold text-lg mb-2">Protocol Initialized</h4>
                <p class="text-primary opacity-80">Your parameters have been logged. <br><br><em>Note: This is a frontend demonstration interface. No network transmission occurred.</em></p>
              </div>
            </div>
          `;
        } else {
           const firstInvalid = currentStepEl.querySelector('.input-error');
           if(firstInvalid) firstInvalid.focus();
        }
      });
    }
  </script>