import * as THREE from 'three';
import { gsap } from '../core/gsap-register.js';
import { QualityManager } from './quality-manager.js';
import { ThemeController } from './theme-controller.js';
import vertShader from '../../shaders/particles.vert.glsl?raw';
import fragShader from '../../shaders/particles.frag.glsl?raw';

export class HeroWebGL {
  constructor(container) {
    this.container = container;
    this.qualityManager = new QualityManager();
    this.isRunning = true;
    
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040A, 0.03); // Base color, updated by ThemeController

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: this.qualityManager.quality !== 'LOW',
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(this.qualityManager.getPixelRatio());
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.createParticles();
    this.themeController = new ThemeController(this.material, this.scene);

    this.pointer = new THREE.Vector2();
    this.targetPointer = new THREE.Vector2();

    this.onWindowResize = this.onWindowResize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onPointerMove);

    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    this.animationFrame = requestAnimationFrame(this.animate);

  }

  playAssembly() {
    gsap.to(this.material.uniforms.uAssembly, {
      value: 1.0,
      duration: 3.0,
      ease: "power3.out"
    });
  }

  setAssemblyProgress(progress) {
    this.material.uniforms.uAssembly.value = progress;
  }

  setScrollProgress(progress) {
    this.material.uniforms.uScroll.value = progress;
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  createParticles() {
    const count = this.qualityManager.getParticleCount();
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const depths = new Float32Array(count);
    const colorsDark = new Float32Array(count * 3);
    const colorsLight = new Float32Array(count * 3);

    const darkCore = new THREE.Color(0xBDEBFF);
    const darkOuter = new THREE.Color(0x18E0FF);
    const lightCore = new THREE.Color(0x063A4A);
    const lightOuter = new THREE.Color(0x007E9B);

    for (let i = 0; i < count; i++) {
      // Create a dense core and sparse outer field
      const r = Math.pow(Math.random(), 1.5) * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i*3+2] = r * Math.cos(phi);

      depths[i] = Math.random();
      sizes[i] = Math.random() * 2.0 + 0.5;

      // Color mapping based on distance from center
      const distRatio = r / 20.0;
      
      const cd = darkCore.clone().lerp(darkOuter, distRatio);
      colorsDark[i*3] = cd.r; colorsDark[i*3+1] = cd.g; colorsDark[i*3+2] = cd.b;
      
      const cl = lightCore.clone().lerp(lightOuter, distRatio);
      colorsLight[i*3] = cl.r; colorsLight[i*3+1] = cl.g; colorsLight[i*3+2] = cl.b;
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
        uThemeMix: { value: 0.0 }, // 0 = dark, 1 = light
        uAssembly: { value: 0.0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uPixelRatio: { value: this.qualityManager.getPixelRatio() }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending // Additive can wash out light mode
    });

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    // Add Orbit Rings if quality allows
    const ringCount = this.qualityManager.getRingCount();
    for(let i = 0; i < ringCount; i++) {
       // Minimal ring representation to avoid full code bloat for now
       // In full version, use THREE.Line geometry here.
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material.uniforms.uPixelRatio.value = this.qualityManager.getPixelRatio();
  }

  onPointerMove(event) {
    this.targetPointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetPointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  animate() {
    if (!this.isRunning) return;
    this.animationFrame = requestAnimationFrame(this.animate);

    const time = this.clock.getElapsedTime();
    this.material.uniforms.uTime.value = time;
    
    // Smooth pointer interpolation
    this.pointer.lerp(this.targetPointer, 0.05);
    this.material.uniforms.uPointer.value.copy(this.pointer);

    this.points.rotation.y = time * 0.05 + (this.pointer.x * 0.2);
    this.points.rotation.x = this.pointer.y * 0.2;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onPointerMove);
    this.themeController.dispose();
    
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    if(this.container.contains(this.renderer.domElement)) {
       this.container.removeChild(this.renderer.domElement);
    }
  }
}
