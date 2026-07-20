import * as THREE from 'three';
import gsap from 'gsap';

export class ThemeController {
  constructor(material, scene) {
    this.material = material;
    this.scene = scene;
    
    // Read current theme
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    this.material.uniforms.uThemeMix.value = isLight ? 1.0 : 0.0;
    
    // We will set fog based on theme too
    this.darkFog = new THREE.Color(0x02040A);
    this.lightFog = new THREE.Color(0xE9EFF6);
    this.scene.fog.color.copy(isLight ? this.lightFog : this.darkFog);

    this.onThemeChange = this.onThemeChange.bind(this);
    window.addEventListener('themechanged', this.onThemeChange);
  }

  onThemeChange(e) {
    const isLight = e.detail.theme === 'light';
    const targetMix = isLight ? 1.0 : 0.0;
    const targetFog = isLight ? this.lightFog : this.darkFog;

    // Use GSAP to interpolate uniforms smoothly
    gsap.to(this.material.uniforms.uThemeMix, {
      value: targetMix,
      duration: 1.0,
      ease: "power2.inOut"
    });

    gsap.to(this.scene.fog.color, {
      r: targetFog.r,
      g: targetFog.g,
      b: targetFog.b,
      duration: 1.0,
      ease: "power2.inOut"
    });
  }

  dispose() {
    window.removeEventListener('themechanged', this.onThemeChange);
  }
}
