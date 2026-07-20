uniform float uTime;
uniform float uThemeMix;
uniform float uAssembly;
uniform float uScroll;
uniform vec2 uPointer;
uniform float uPixelRatio;

attribute float aSize;
attribute float aDepth;
attribute vec3 aColorDark;
attribute vec3 aColorLight;

varying vec3 vColor;
varying float vOpacity;
varying float vDepth;

void main() {
  // Interpolate color based on theme
  vec3 baseColor = mix(aColorDark, aColorLight, uThemeMix);
  
  // Parallax / Pointer interaction
  vec3 pos = position;
  pos.x += uPointer.x * (aDepth * 0.5);
  pos.y += uPointer.y * (aDepth * 0.5);
  
  // Assembly animation
  float assemblyOffset = (1.0 - uAssembly) * aDepth * 10.0;
  pos.y += assemblyOffset;
  pos.z += sin(uTime * 0.5 + aDepth) * 2.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Size attenuation
  gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
  
  vColor = baseColor;
  vOpacity = mix(0.1, 1.0, uAssembly) * (1.0 - smoothstep(20.0, 50.0, length(pos.xy)));
  vDepth = aDepth;
  
  gl_Position = projectionMatrix * mvPosition;
}
