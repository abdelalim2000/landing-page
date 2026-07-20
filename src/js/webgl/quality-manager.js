export class QualityManager {
  constructor() {
    this.quality = this.determineQuality();
  }

  determineQuality() {
    const isMobile = window.innerWidth <= 768;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = window.devicePixelRatio || 1;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;

    if (reducedMotion || isMobile || cores < 4 || memory < 4) {
      return 'LOW';
    } else if (dpr > 2 || cores < 8) {
      return 'MEDIUM';
    } else {
      return 'HIGH';
    }
  }

  getParticleCount() {
    switch (this.quality) {
      case 'LOW': return 800;
      case 'MEDIUM': return 2500;
      case 'HIGH': return 5000;
      default: return 2500;
    }
  }

  getPixelRatio() {
    // Cap pixel ratio to save fill rate
    return Math.min(window.devicePixelRatio || 1, this.quality === 'HIGH' ? 2 : 1.5);
  }

  getRingCount() {
    return this.quality === 'LOW' ? 1 : (this.quality === 'MEDIUM' ? 2 : 3);
  }
}
