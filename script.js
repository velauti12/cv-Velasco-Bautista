/* =============================================
   script.js — Interactividad del CV Digital
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. BOTÓN "VOLVER ARRIBA"
  // =============================================
  const btnTop = document.getElementById('btnTop');

  // Mostrar/ocultar el botón según el scroll
  const handleScrollBtn = () => {
    if (window.scrollY > 400) {
      btnTop.classList.add('btn-top--visible');
    } else {
      btnTop.classList.remove('btn-top--visible');
    }
  };

  // Acción al hacer clic: scroll suave al inicio de la página
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =============================================
  // 2. NAVBAR — Efecto al hacer scroll
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
  // 3. LISTENER DE SCROLL UNIFICADO (performance)
  // =============================================
  window.addEventListener('scroll', () => {
    handleScrollBtn();
    handleNavbarScroll();
    // Disparar la animación de barras de habilidades al entrar en el viewport
    animateSkillBars();
  }, { passive: true });

  // Ejecutar una vez al cargar por si ya estamos en medio de la página
  handleScrollBtn();
  handleNavbarScroll();

  // =============================================
  // 4. INTERSECTION OBSERVER — Animaciones de entrada
  // =============================================
  const revealElements = document.querySelectorAll(
    '.stat-card, .timeline__card, .skill-category, .contact__form-wrapper, .contact__info, .about__text-block, .about__stats'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado para que los elementos no aparezcan todos juntos
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
  // 5. ANIMACIÓN DE BARRAS DE HABILIDADES
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

  // Verificar al cargar si ya está en vista
  animateSkillBars();

  // =============================================
  // 6. FORMULARIO DE CONTACTO — Validación y feedback
  // =============================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const btnEnviar = document.getElementById('btnEnviar');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir envío real (CV ficticio)

    const nombre = document.getElementById('inputNombre').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const mensaje = document.getElementById('inputMensaje').value.trim();

    // Limpiar feedback previo
    formFeedback.className = 'contact-form__feedback';
    formFeedback.textContent = '';

    // Validación básica
    if (!nombre || !email || !mensaje) {
      mostrarFeedback('❌ Por favor completá todos los campos antes de enviar.', 'error');
      return;
    }

    if (!validarEmail(email)) {
      mostrarFeedback('❌ El formato del email no es válido.', 'error');
      return;
    }

    // Simular envío con estado de carga
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    setTimeout(() => {
      // Éxito simulado
      mostrarFeedback(`✅ ¡Gracias, ${nombre}! Tu mensaje fue enviado correctamente. Te respondo pronto.`, 'success');
      contactForm.reset();
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar mensaje';
    }, 1800);
  });

  /**
   * Muestra el mensaje de feedback en el formulario
   * @param {string} mensaje - Texto a mostrar
   * @param {'success'|'error'} tipo - Tipo de feedback
   */
  function mostrarFeedback(mensaje, tipo) {
    formFeedback.textContent = mensaje;
    formFeedback.classList.add(`contact-form__feedback--${tipo}`);
  }

  /**
   * Valida que el email tenga formato correcto
   * @param {string} email
   * @returns {boolean}
   */
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // =============================================
  // 7. SMOOTH SCROLL para links de navegación
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
  // 8. EFECTO TYPING en el subtítulo del hero
  // =============================================
  const subtitleEl = document.querySelector('.hero__subtitle');
  if (subtitleEl) {
    const textos = [
      'Backend · Cloud · Arquitectura de Microservicios',
      'Java · Spring Boot · AWS · Docker',
      'Open Source · Clean Code · TDD',
    ];
    let textoIndex = 0;
    let charIndex = 0;
    let borrando = false;

    const typeWriter = () => {
      const textoActual = textos[textoIndex];

      if (!borrando) {
        subtitleEl.textContent = textoActual.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === textoActual.length) {
          // Pausa antes de borrar
          setTimeout(() => { borrando = true; typeWriter(); }, 2800);
          return;
        }
      } else {
        subtitleEl.textContent = textoActual.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          borrando = false;
          textoIndex = (textoIndex + 1) % textos.length;
        }
      }

      const velocidad = borrando ? 40 : 65;
      setTimeout(typeWriter, velocidad);
    };

    // Iniciar con delay
    setTimeout(typeWriter, 1200);
  }

});