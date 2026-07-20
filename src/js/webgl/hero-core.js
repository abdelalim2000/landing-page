import * as THREE from 'three';
import { gsap } from '../core/gsap-register.js';
import { QualityManager } from './quality-manager.js';
import { ThemeController } from './theme-controller.js';
import vertShader from '../../shaders/particles.vert.glsl?raw';
import fragShader from '../../shaders/particles.frag.glsl?raw';

export class HeroWebGL {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector('#hero-canvas') ?? document.getElementById('hero-canvas');
    this.qualityManager = new QualityManager();
    this.isRunning = false;
    this.isVisible = true;
    this.isDocumentVisible = !document.hidden;
    this.rings = [];

    if (!this.canvas) {
      throw new Error('[NEXUS] The authored #hero-canvas element is missing.');
    }
    if (typeof vertShader !== 'string' || !vertShader.trim() || typeof fragShader !== 'string' || !fragShader.trim()) {
      throw new Error('[NEXUS] Hero GLSL shaders failed to load.');
    }

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040a, 0.025);

    const { width, height } = this.getSize();
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 38);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: this.qualityManager.quality !== 'LOW',
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(this.qualityManager.getPixelRatio());
    this.renderer.setSize(width, height, false);

    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);
    this.createParticles();
    this.createOrbitArchitecture();

    this.themeController = new ThemeController(this.material, this.scene);

    this.pointer = new THREE.Vector2();
    this.targetPointer = new THREE.Vector2();
    this.clock = new THREE.Clock();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.onWindowResize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry?.isIntersecting ?? true;
        this.updateLoopState();
      },
      { threshold: 0.01 },
    );
    this.intersectionObserver.observe(this.container);

    this.positionCore();
    this.isRunning = true;
    this.animationFrame = requestAnimationFrame(this.animate);

    if (import.meta.env.DEV) {
      console.log('[NEXUS] Hero WebGL initialized.', {
        canvas: `${width}×${height}`,
        particles: this.qualityManager.getParticleCount(),
        rings: this.rings.length,
      });
    }
  }

  getSize() {
    const rect = this.container.getBoundingClientRect();
    return {
      width: Math.max(1, Math.round(rect.width || window.innerWidth)),
      height: Math.max(1, Math.round(rect.height || window.innerHeight)),
    };
  }

  positionCore() {
    const desktop = window.innerWidth >= 900;
    this.coreGroup.position.x = desktop ? 11 : 0;
    this.coreGroup.position.y = desktop ? 0.5 : -3;
    this.coreGroup.scale.setScalar(desktop ? 1 : 0.78);
  }

  playAssembly() {
    if (!this.material?.uniforms?.uAssembly) return;
    return gsap.to(this.material.uniforms.uAssembly, {
      value: 1,
      duration: 3,
      ease: 'power3.out',
    });
  }

  setAssemblyProgress(progress) {
    if (this.material?.uniforms?.uAssembly) {
      this.material.uniforms.uAssembly.value = progress;
    }
  }

  setScrollProgress(progress) {
    if (this.material?.uniforms?.uScroll) {
      this.material.uniforms.uScroll.value = progress;
    }
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
  }

  resume() {
    if (this.isRunning || !this.isVisible || !this.isDocumentVisible) return;
    this.isRunning = true;
    this.clock.getDelta();
    this.animationFrame = requestAnimationFrame(this.animate);
  }

  updateLoopState() {
    if (this.isVisible && this.isDocumentVisible) this.resume();
    else this.pause();
  }

  createParticles() {
    const count = this.qualityManager.getParticleCount();
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);
    const colorsDark = new Float32Array(count * 3);
    const colorsLight = new Float32Array(count * 3);

    const darkCore = new THREE.Color(0xbdebff);
    const darkOuter = new THREE.Color(0x18e0ff);
    const lightCore = new THREE.Color(0x063a4a);
    const lightOuter = new THREE.Color(0x007e9b);

    for (let i = 0; i < count; i += 1) {
      const density = Math.random();
      const radius = Math.pow(density, 1.85) * 14 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      depths[i] = Math.random();
      sizes[i] = Math.random() * 1.65 + 0.45;

      const distanceRatio = Math.min(1, radius / 15.5);
      const darkColor = darkCore.clone().lerp(darkOuter, distanceRatio);
      const lightColor = lightCore.clone().lerp(lightOuter, distanceRatio);

      colorsDark.set([darkColor.r, darkColor.g, darkColor.b], i * 3);
      colorsLight.set([lightColor.r, lightColor.g, lightColor.b], i * 3);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depths, 1));
    geometry.setAttribute('aColorDark', new THREE.BufferAttribute(colorsDark, 3));
    geometry.setAttribute('aColorLight', new THREE.BufferAttribute(colorsLight, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertShader,
      fragmentShader: fragShader,
      uniforms: {
        uTime: { value: 0 },
        uThemeMix: { value: 0 },
        uAssembly: { value: 0 },
        uPointer: { value: new THREE.Vector2() },
        uScroll: { value: 0 },
        uPixelRatio: { value: this.qualityManager.getPixelRatio() },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    this.points = new THREE.Points(geometry, this.material);
    this.coreGroup.add(this.points);
  }

  createOrbitArchitecture() {
    const ringCount = Math.max(2, this.qualityManager.getRingCount());
    const ringColor = new THREE.Color(0x8b5cf6);

    for (let index = 0; index < ringCount; index += 1) {
      const radius = 16.5 + index * 2.8;
      const points = [];
      const segments = 160;
      for (let segment = 0; segment <= segments; segment += 1) {
        const angle = (segment / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.18 - index * 0.025,
      });
      const ring = new THREE.LineLoop(geometry, material);
      ring.rotation.x = Math.PI * (0.2 + index * 0.16);
      ring.rotation.y = Math.PI * (0.08 + index * 0.1);
      ring.userData.speed = (index % 2 ? -1 : 1) * (0.035 + index * 0.012);
      this.rings.push(ring);
      this.coreGroup.add(ring);
    }
  }

  onWindowResize() {
    const { width, height } = this.getSize();
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(this.qualityManager.getPixelRatio());
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uPixelRatio.value = this.qualityManager.getPixelRatio();
    this.positionCore();
  }

  onPointerMove(event) {
    this.targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  onVisibilityChange() {
    this.isDocumentVisible = !document.hidden;
    this.updateLoopState();
  }

  animate() {
    if (!this.isRunning) return;
    this.animationFrame = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = time;
    this.pointer.lerp(this.targetPointer, 0.045);
    this.material.uniforms.uPointer.value.copy(this.pointer);

    this.coreGroup.rotation.y = time * 0.035 + this.pointer.x * 0.14;
    this.coreGroup.rotation.x = this.pointer.y * 0.1;
    this.rings.forEach((ring) => {
      ring.rotation.z += ring.userData.speed * 0.01;
    });

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.pause();
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.intersectionObserver?.disconnect();
    this.themeController?.dispose();

    this.points?.geometry.dispose();
    this.material?.dispose();
    this.rings.forEach((ring) => {
      ring.geometry.dispose();
      ring.material.dispose();
    });
    this.renderer?.dispose();
  }
}
