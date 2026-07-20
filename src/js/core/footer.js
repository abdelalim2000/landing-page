export function initFooter() {
  const backToTopBtn = document.getElementById('back-to-top');
  const yearSpan = document.getElementById('current-year');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', handleBackToTop);
  }

  return () => {
    if (backToTopBtn) {
      backToTopBtn.removeEventListener('click', handleBackToTop);
    }
  };
}
