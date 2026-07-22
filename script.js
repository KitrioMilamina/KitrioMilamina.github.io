/* ================================================================
   PORTFOLIO — RABEARISON Minohenintsoa Fitiavana
   Script principal : navbar, animations, filtres, lightbox, etc.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. PRÉCHARGEUR
     ============================================================ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 900);
  });

  /* ============================================================
     2. NAVBAR AU SCROLL + SCROLL PROGRESS BAR
     ============================================================ */
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    const scrollY = window.scrollY;

    // Navbar transparente -> noire
    header.classList.toggle('scrolled', scrollY > 60);

    // Barre de progression
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Bouton retour en haut
    backToTop.classList.toggle('show', scrollY > 500);

    updateActiveNav();
    revealOnScroll();
  }
  window.addEventListener('scroll', onScroll);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top:0, behavior:'smooth' });
  });

  /* ============================================================
     3. MENU HAMBURGER (MOBILE)
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    });
  });

  /* ============================================================
     4. NAVIGATION ACTIVE SELON LA SECTION VISIBLE
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav(){
    let current = '';
    const offset = 140;
    sections.forEach(sec => {
      const top = sec.offsetTop - offset;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  /* ============================================================
     5. EFFET MACHINE À ÉCRIRE (HERO)
     ============================================================ */
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'Étudiant en Master Communication Multimédia',
    'Développeur Web',
    'Designer Graphique',
    'Créateur Multimédia'
  ];
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function typeLoop(){
    const current = phrases[phraseIndex];

    if (!deleting){
      typewriterEl.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length){
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
    } else {
      typewriterEl.textContent = current.slice(0, --charIndex);
      if (charIndex === 0){
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();

  /* ============================================================
     6. SCROLL REVEAL (remplace AOS - basé sur IntersectionObserver)
     ============================================================ */
  const aosElements = document.querySelectorAll('[data-aos]');

  function revealOnScroll(){
    const triggerPoint = window.innerHeight * 0.88;
    aosElements.forEach(el => {
      if (el.classList.contains('aos-animate')) return;
      const delay = el.getAttribute('data-aos-delay');
      if (delay) el.style.setProperty('--aos-delay', delay);
      const top = el.getBoundingClientRect().top;
      if (top < triggerPoint) el.classList.add('aos-animate');
    });
  }

  /* ============================================================
     7. COMPTEURS ANIMÉS (STATISTIQUES)
     ============================================================ */
  const counters = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function animateCounters(){
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      let count = 0;
      const step = Math.max(target / 60, 1);
      const update = () => {
        count += step;
        if (count < target){
          counter.textContent = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };
      update();
    });
  }

  /* ============================================================
     8. BARRES DE PROGRESSION DES COMPÉTENCES
     ============================================================ */
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsStarted = false;

  function animateSkills(){
    skillFills.forEach(fill => {
      fill.style.width = fill.getAttribute('data-percent') + '%';
    });
  }

  /* Observer pour déclencher compteurs + compétences une seule fois */
  const statsSection = document.querySelector('.apropos-stats');
  const skillsSection = document.querySelector('.skills-grid');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (entry.target === statsSection && !countersStarted){
        countersStarted = true;
        animateCounters();
      }
      if (entry.target === skillsSection && !skillsStarted){
        skillsStarted = true;
        animateSkills();
      }
    });
  }, { threshold:.35 });

  if (statsSection) io.observe(statsSection);
  if (skillsSection) io.observe(skillsSection);

  /* ============================================================
     9. FILTRE GALERIE DE PROJETS
     ============================================================ */
  const filterBtns = document.querySelectorAll('.projets-filter .filter-btn');
  const projetCards = document.querySelectorAll('.projet-card');

  function applyProjetFilter(filter){
    projetCards.forEach(card => {
      const match = filter === 'all' || card.getAttribute('data-category') === filter;
      card.classList.toggle('show', match);
    });
  }
  applyProjetFilter('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyProjetFilter(btn.getAttribute('data-filter'));
    });
  });

  /* ============================================================
     10. LIGHTBOX (PROJETS - image en plein écran)
     ============================================================ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger img');
  const viewButtons = document.querySelectorAll('.btn-view');

  function openLightbox(img){
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Clic direct sur l'image
  lightboxTriggers.forEach(img => {
    img.addEventListener('click', () => openLightbox(img));
  });

  // Clic sur le bouton "Voir" -> ouvre l'image du même projet en plein écran
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.projet-card');
      const img = card ? card.querySelector('.projet-image img') : null;
      if (img) openLightbox(img);
    });
  });

  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ============================================================
     12. FORMULAIRE DE CONTACT (SIMULATION D'ENVOI)
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.classList.add('sending');

    // Simulation d'envoi (à remplacer par un vrai appel API / mailer)
    setTimeout(() => {
      contactForm.classList.remove('sending');
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1400);
  });

  /* ============================================================
     13. ANNÉE DYNAMIQUE DANS LE FOOTER
     ============================================================ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============================================================
     14. PREMIER RENDU
     Appelé en dernier, une fois que toutes les fonctions et
     variables ci-dessus sont déclarées (évite les erreurs de
     référence sur les éléments encore non initialisés).
     ============================================================ */
  onScroll();

});
