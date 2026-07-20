uniform float uThemeMix;
uniform sampler2D uTexture; // Optional for soft particles

varying vec3 vColor;
varying float vOpacity;
varying float vDepth;

void main() {
  // Circular soft particle
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  
  // Soft edge
  float alpha = smoothstep(0.5, 0.1, dist) * vOpacity;
  
  // Higher opacity in light mode for visibility
  alpha = mix(alpha, alpha * 1.5, uThemeMix);
  
  gl_FragColor = vec4(vColor, alpha);
}
