/**
 * Elegant Emahe Style - Vanilla JavaScript Interactive Controller
 * Pure Vanilla JS - No external runtime frameworks
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCreationFilters();
  initCustomOrderBuilder();
  initLightbox();
  initQuickViewModal();
  initScrollSpy();
  initBackToTop();
  initAnnouncementDismiss();
});

// Toast notification helper
function showToast(message: string, duration: number = 3000) {
  let toast = document.getElementById('brand-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'brand-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 transform transition-all duration-300 translate-y-8 opacity-0 pointer-events-none bg-[#2C2424] text-[#FAF7F2] text-xs font-medium px-4 py-3 rounded-lg shadow-xl border border-[#C67C74]/30 flex items-center gap-2';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg class="w-4 h-4 text-[#C67C74] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <span>${message}</span>
  `;

  // Show
  toast.classList.remove('translate-y-8', 'opacity-0', 'pointer-events-none');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast?.classList.add('translate-y-8', 'opacity-0', 'pointer-events-none');
    toast?.classList.remove('translate-y-0', 'opacity-100');
  }, duration);
}

// 1. Navbar scroll state
function initNavbar() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-[#FAF7F2]/95', 'backdrop-blur-md', 'shadow-xs', 'border-b', 'border-[#E8DFD4]');
      header.classList.remove('bg-transparent', 'border-transparent');
    } else {
      header.classList.remove('bg-[#FAF7F2]/95', 'backdrop-blur-md', 'shadow-xs', 'border-[#E8DFD4]');
      header.classList.add('bg-[#FAF7F2]', 'border-b', 'border-[#E8DFD4]/50');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// 2. Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  const backdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100', 'pointer-events-auto');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.add('translate-x-full');
    drawer.classList.remove('translate-x-0');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    backdrop.classList.remove('opacity-100', 'pointer-events-auto');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
      closeDrawer();
    }
  });
}

// 3. Category Filter Tabs for Featured Creations
function initCreationFilters() {
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.creation-filter-btn');
  const cards = document.querySelectorAll<HTMLElement>('.creation-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-filter') || 'all';

      // Update button styling
      filterBtns.forEach((b) => {
        if (b === btn) {
          b.classList.remove('bg-transparent', 'text-[#6E6160]', 'hover:text-[#2C2424]');
          b.classList.add('bg-[#2C2424]', 'text-[#FAF7F2]', 'shadow-xs');
          b.setAttribute('aria-selected', 'true');
        } else {
          b.classList.remove('bg-[#2C2424]', 'text-[#FAF7F2]', 'shadow-xs');
          b.classList.add('bg-transparent', 'text-[#6E6160]', 'hover:text-[#2C2424]');
          b.setAttribute('aria-selected', 'false');
        }
      });

      // Filter cards with smooth opacity transition
      cards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCat === targetCategory) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.97)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

// 4. Custom Order Builder & DM Generator
function initCustomOrderBuilder() {
  const typeSelect = document.getElementById('order-type') as HTMLSelectElement | null;
  const nameInput = document.getElementById('order-name') as HTMLInputElement | null;
  const sizeInput = document.getElementById('order-size') as HTMLInputElement | null;
  const colorInput = document.getElementById('order-palette') as HTMLInputElement | null;
  const notesInput = document.getElementById('order-notes') as HTMLTextAreaElement | null;
  const dateInput = document.getElementById('order-date') as HTMLInputElement | null;
  const previewBox = document.getElementById('order-preview-text');
  const copyBtn = document.getElementById('copy-order-btn');
  const dmBtn = document.getElementById('send-dm-btn');

  if (!previewBox) return;

  const updatePreview = () => {
    const type = typeSelect?.value || 'Custom Bracelet';
    const name = nameInput?.value.trim() || 'Custom Piece';
    const size = sizeInput?.value.trim() || 'Standard / Flexible';
    const palette = colorInput?.value.trim() || 'Pastel Blush & Ivory Pearls';
    const date = dateInput?.value.trim() || 'Standard timeframe';
    const notes = notesInput?.value.trim() || 'None specified';

    const message = `Salam / Hello Elegant Emahe Style! 🌸

I would love to place a custom order inquiry:
• Item Category: ${type}
• Name / Personalization: ${name}
• Size / Dimensions: ${size}
• Color Palette / Theme: ${palette}
• Target Occasion / Date: ${date}
• Custom Requests: ${notes}

Could you please share availability and custom pricing details? Thank you! ✨`;

    previewBox.textContent = message;
  };

  const inputs = [typeSelect, nameInput, sizeInput, colorInput, notesInput, dateInput];
  inputs.forEach((input) => {
    input?.addEventListener('input', updatePreview);
    input?.addEventListener('change', updatePreview);
  });

  updatePreview();

  // Copy to clipboard
  copyBtn?.addEventListener('click', () => {
    const textToCopy = previewBox.textContent || '';
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Custom inquiry copied to clipboard! Ready to paste into Instagram DM 🎀');
    }).catch(() => {
      showToast('Copied text!');
    });
  });

  // Open Instagram DM
  dmBtn?.addEventListener('click', () => {
    const textToCopy = previewBox.textContent || '';
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    showToast('Inquiry text copied! Opening Instagram...');
    setTimeout(() => {
      window.open('https://www.instagram.com/elegant_emahe_style_5/', '_blank', 'noopener,noreferrer');
    }, 400);
  });
}

// 5. Lightbox for Visual Gallery & Creations
function initLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-image') as HTMLImageElement | null;
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const triggers = document.querySelectorAll<HTMLElement>('.lightbox-trigger');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (src: string, alt: string, caption: string) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || alt;
    }
    lightbox.classList.remove('hidden');
    setTimeout(() => {
      lightbox.classList.remove('opacity-0');
      lightbox.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      lightboxImg.src = '';
    }, 200);
    document.body.style.overflow = '';
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-full-src') || '';
      const alt = trigger.getAttribute('data-alt') || 'Handmade Creation';
      const caption = trigger.getAttribute('data-caption') || alt;
      if (src) openLightbox(src, alt, caption);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || (e.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
}

// 6. Quick View / Creation Inquiry Modal
function initQuickViewModal() {
  const modal = document.getElementById('quickview-modal');
  const closeBtn = document.getElementById('quickview-close');
  const modalImg = document.getElementById('quickview-img') as HTMLImageElement | null;
  const modalCategory = document.getElementById('quickview-category');
  const modalTitle = document.getElementById('quickview-title');
  const modalDesc = document.getElementById('quickview-desc');
  const modalDetails = document.getElementById('quickview-details');
  const modalInquireBtn = document.getElementById('quickview-inquire-btn');
  const triggers = document.querySelectorAll<HTMLElement>('.quickview-trigger');

  if (!modal) return;

  const openModal = (data: {
    category: string;
    title: string;
    desc: string;
    details: string;
    imgSrc: string;
  }) => {
    if (modalCategory) modalCategory.textContent = data.category;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalDesc) modalDesc.textContent = data.desc;
    if (modalDetails) modalDetails.textContent = data.details;
    if (modalImg) modalImg.src = data.imgSrc;

    modal.classList.remove('hidden');
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modal.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 200);
    document.body.style.overflow = '';
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const category = trigger.getAttribute('data-category') || 'Handmade Creation';
      const title = trigger.getAttribute('data-title') || 'Custom Piece';
      const desc = trigger.getAttribute('data-desc') || '';
      const details = trigger.getAttribute('data-details') || '';
      const imgSrc = trigger.getAttribute('data-img') || '';

      openModal({ category, title, desc, details, imgSrc });
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || (e.target as HTMLElement).classList.contains('quickview-backdrop')) {
      closeModal();
    }
  });

  modalInquireBtn?.addEventListener('click', () => {
    closeModal();
    const customSection = document.getElementById('custom');
    if (customSection) {
      customSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

// 7. ScrollSpy for Active Nav Link
function initScrollSpy() {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const desktopLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link-desktop');

  if (!sections.length || !desktopLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('text-[#2C2424]', 'font-semibold');
              link.classList.remove('text-[#6E6160]');
            } else {
              link.classList.remove('text-[#2C2424]', 'font-semibold');
              link.classList.add('text-[#6E6160]');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// 8. Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. Announcement bar dismiss
function initAnnouncementDismiss() {
  const banner = document.getElementById('top-announcement');
  const dismissBtn = document.getElementById('announcement-dismiss');
  if (!banner || !dismissBtn) return;

  dismissBtn.addEventListener('click', () => {
    banner.style.display = 'none';
  });
}
