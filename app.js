document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM ready – checking portfolioAssets...");
  
  if (typeof portfolioAssets === 'undefined') {
    console.error("ERROR: portfolioAssets is not defined! Check if assets.js loaded correctly.");
    document.getElementById('portfolio-grid').innerHTML = '<p style="color: red; text-align: center;">Error: Portfolio data not loaded. Please check console.</p>';
    return;
  }
  
  console.log(`portfolioAssets found! ${portfolioAssets.length} items.`);
  
  initHeader();
  initTypingAnimation();
  renderGallery();
  initGalleryFilters();
  initLightbox();
  initScrollAnimations();
  initImageObserver();
});

/* Header Scroll Effect & Active Section Highlight */
function initHeader() {
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentSection = 'home';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Typing Animation */
function initTypingAnimation() {
  const roles = ["UI/UX Designer", "3D Artist", "Motion Designer", "Brand Designer", "Web Designer"];
  const target = document.getElementById('typed-roles');
  if (!target) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* Render Portfolio Grid */
function renderGallery() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) {
    console.error("Portfolio grid element not found!");
    return;
  }

  console.log("Rendering gallery with", window.portfolioAssets.length, "items");

  grid.innerHTML = window.portfolioAssets.map(asset => {
    const isVideo = asset.type === 'video';
    const mediaTag = isVideo 
      ? `<video src="${encodeURI(asset.path)}" muted loop playsinline></video>`
      : `<img src="${asset.path}" alt="${asset.name}" loading="lazy">`;

    const badgeText = isVideo ? 'Video Reel' : 'Graphic';

    return `
      <div class="gallery-item glass-panel" data-category="${asset.category}" data-id="${asset.id}">
        ${mediaTag}
        <div class="gallery-overlay">
          <span class="item-category">${asset.category.replace('-', ' ')}</span>
          <h3 class="item-title">${asset.name}</h3>
          <span class="item-badge">${badgeText}</span>
        </div>
      </div>
    `;
  }).join('');

  // Mark images/videos as loaded when ready
  const mediaElements = grid.querySelectorAll('.gallery-item img, .gallery-item video');
  mediaElements.forEach(media => {
    const markLoaded = () => media.classList.add('loaded');
    if (media.tagName === 'IMG') {
      if (media.complete) markLoaded();
      else media.addEventListener('load', markLoaded);
    } else if (media.tagName === 'VIDEO') {
      if (media.readyState >= 2) markLoaded();
      else media.addEventListener('canplay', markLoaded);
    }
  });

  // Hover play for videos
  const gridVideos = grid.querySelectorAll('.gallery-item video');
  gridVideos.forEach(vid => {
    const parent = vid.closest('.gallery-item');
    parent.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    parent.addEventListener('mouseleave', () => {
      vid.pause();
      vid.currentTime = 0;
    });
  });
}

function initImageObserver() {
  const lazyImages = document.querySelectorAll('.gallery-item img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) observer.unobserve(entry.target);
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  }
}

/* Filtering */
function initGalleryFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

/* Lightbox */
function initLightbox() {
  const lightbox = document.getElementById('portfolio-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const items = document.querySelectorAll('.gallery-item');
  const mediaContainer = document.getElementById('lightbox-media-container');
  const lbCategory = document.getElementById('lightbox-category');
  const lbTitle = document.getElementById('lightbox-title');
  const lbCritique = document.getElementById('lightbox-critique');
  const lbSwatches = document.getElementById('lightbox-swatches');

  if (!lightbox) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const asset = window.portfolioAssets.find(a => a.id === id);
      if (!asset) return;

      if (asset.type === 'video') {
        mediaContainer.innerHTML = `<video src="${encodeURI(asset.path)}" controls autoplay loop style="width: 100%; height: 100%; object-fit: contain;"></video>`;
      } else {
        mediaContainer.innerHTML = `<img src="${asset.path}" alt="${asset.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
      }

      lbCategory.textContent = asset.category.replace('-', ' ');
      lbTitle.textContent = asset.name;
      lbCritique.textContent = asset.critique;

      lbSwatches.innerHTML = asset.colors.map(c => `
        <div class="swatch-item">
          <div class="swatch-color" style="background-color: ${c.hex};" data-hex="${c.hex}"></div>
          <span class="swatch-hex">${c.hex}</span>
          <span class="swatch-hex" style="font-size: 0.65rem; font-weight: normal; color: var(--text-muted);">${c.name}</span>
        </div>
      `).join('');

      const swatches = lbSwatches.querySelectorAll('.swatch-color');
      swatches.forEach(sw => {
        sw.addEventListener('click', () => {
          const hex = sw.getAttribute('data-hex');
          navigator.clipboard.writeText(hex).then(() => {
            const hexSpan = sw.nextElementSibling;
            const originalText = hexSpan.textContent;
            hexSpan.textContent = 'COPIED!';
            hexSpan.style.color = 'var(--accent-cyan)';
            setTimeout(() => {
              hexSpan.textContent = originalText;
              hexSpan.style.color = '';
            }, 1000);
          });
        });
      });

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    const video = mediaContainer.querySelector('video');
    if (video) video.pause();
    mediaContainer.innerHTML = '';
  };

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

/* Scroll Animations */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const skillBars = entry.target.querySelectorAll('.skill-level-bar');
        skillBars.forEach(bar => {
          const level = bar.getAttribute('data-level');
          if (level) bar.style.width = level;
        });
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(reveal => revealObserver.observe(reveal));
}
