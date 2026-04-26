/* =============================================
   script.js — Digital CV Interactivity
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. "BACK TO TOP" BUTTON
  // =============================================
  const btnTop = document.getElementById('btnTop');

  // Show/hide button based on scroll position
  const handleScrollBtn = () => {
    if (window.scrollY > 400) {
      btnTop.classList.add('btn-top--visible');
    } else {
      btnTop.classList.remove('btn-top--visible');
    }
  };

  // On click: smooth scroll to page top
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =============================================
  // 2. NAVBAR — Scroll effect
  // =============================================
  const navbar = document.getElementById('navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  };

  // =============================================
  // 3. UNIFIED SCROLL LISTENER (performance)
  // =============================================
  window.addEventListener('scroll', () => {
    handleScrollBtn();
    handleNavbarScroll();
    // Trigger skill bar animation when section enters the viewport
    animateSkillBars();
  }, { passive: true });

  // Run once on load in case the page is already scrolled
  handleScrollBtn();
  handleNavbarScroll();

  // =============================================
  // 4. INTERSECTION OBSERVER — Entrance animations
  // =============================================
  const revealElements = document.querySelectorAll(
    '.stat-card, .timeline__card, .skill-category, .contact__form-wrapper, .contact__info, .about__text-block, .about__stats'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Staggered delay so elements don't all appear at once
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));

  // =============================================
  // 5. SKILL BAR ANIMATION
  // =============================================
  let skillsAnimated = false;

  const animateSkillBars = () => {
    if (skillsAnimated) return;

    const skillsSection = document.getElementById('habilidades');
    if (!skillsSection) return;

    const rect = skillsSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight - 100;

    if (inView) {
      skillsAnimated = true;
      const fills = document.querySelectorAll('.skill-item__fill');
      fills.forEach((fill, i) => {
        fill.style.animationDelay = `${i * 0.12}s`;
        fill.style.animationDuration = '1.3s';
      });
    }
  };

  // Check on load if the section is already in view
  animateSkillBars();

  // =============================================
  // 6. CONTACT FORM — Validation and feedback
  // =============================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('btnEnviar');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent real submission (demo CV)

    const name = document.getElementById('inputNombre').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const message = document.getElementById('inputMensaje').value.trim();

    // Clear previous feedback
    formFeedback.className = 'contact-form__feedback';
    formFeedback.textContent = '';

    // Basic validation
    if (!name || !email || !message) {
      showFeedback('❌ Por favor completá todos los campos antes de enviar.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showFeedback('❌ El formato del email no es válido.', 'error');
      return;
    }

    // Simulate submission with loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      // Simulated success
      showFeedback(`✅ ¡Gracias, ${name}! Tu mensaje fue enviado correctamente. Te respondo pronto.`, 'success');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }, 1800);
  });

  /**
   * Displays a feedback message in the form
   * @param {string} message - Text to display
   * @param {'success'|'error'} type - Feedback type
   */
  function showFeedback(message, type) {
    formFeedback.textContent = message;
    formFeedback.classList.add(`contact-form__feedback--${type}`);
  }

  /**
   * Validates that an email address has the correct format
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // =============================================
  // 7. SMOOTH SCROLL for navigation links
  // =============================================
  const navLinks = document.querySelectorAll('.navbar__link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  });

  // =============================================
  // 8. TYPING EFFECT on hero subtitle
  // =============================================
  const subtitleEl = document.querySelector('.hero__subtitle');
  if (subtitleEl) {
    const texts = [
      'Backend · Cloud · Arquitectura de Microservicios',
      'Java · Spring Boot · AWS · Docker',
      'Open Source · Clean Code · TDD',
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        subtitleEl.textContent = currentText.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
          // Pause before deleting
          setTimeout(() => { isDeleting = true; typeWriter(); }, 2800);
          return;
        }
      } else {
        subtitleEl.textContent = currentText.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      const speed = isDeleting ? 40 : 65;
      setTimeout(typeWriter, speed);
    };

    // Start with a delay
    setTimeout(typeWriter, 1200);
  }

});