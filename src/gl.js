// Hero WebGL — domain-warped fbm "molten light" field that reacts to the cursor.

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uIntro;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = r * p * 2.02 + 3.1; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float t = uTime * 0.045;
  p.y += uScroll * 0.35;

  // cursor lens
  float md = length(p - m);
  p += (p - m) * 0.18 * exp(-md * 3.2);

  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 5.2));
  vec2 r = vec2(fbm(p * 1.6 + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.6 + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 3.4 * r);

  vec3 ink    = vec3(0.047, 0.043, 0.039);
  vec3 ember  = vec3(1.0, 0.294, 0.122);
  vec3 amber  = vec3(1.0, 0.62, 0.36);
  vec3 bone   = vec3(0.93, 0.91, 0.88);

  float band = smoothstep(0.38, 0.95, f * f * 1.9 + r.x * 0.4);
  vec3 col = mix(ink, ember * 0.82, band);
  col = mix(col, amber, smoothstep(0.62, 1.0, band + q.y * 0.25) * 0.75);
  col = mix(col, bone, smoothstep(0.86, 1.08, band + r.y * 0.18) * 0.55);

  // keep upper-left calm for copy, glow lower-right
  float mask = smoothstep(-0.1, 1.15, uv.x * 0.8 + (1.0 - uv.y) * 0.55);
  col = mix(ink, col, mask * 0.9 + 0.1);

  // cursor glow
  col += ember * 0.1 * exp(-md * 4.0);

  // fine line contours
  float lines = abs(fract(f * 14.0) - 0.5);
  col += vec3(1.0, 0.6, 0.45) * smoothstep(0.03, 0.0, lines) * 0.05 * band;

  // vignette & intro
  float vig = smoothstep(1.35, 0.25, length(uv - 0.5) * 1.4);
  col *= mix(0.55, 1.0, vig);
  col = mix(ink, col, uIntro);

  // dither
  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

export function initHeroGL(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {};
  ['uRes', 'uTime', 'uMouse', 'uScroll', 'uIntro'].forEach((n) => (u[n] = gl.getUniformLocation(prog, n)));

  const state = { mouse: [0.7, 0.35], target: [0.7, 0.35], scroll: 0, intro: 0, visible: true };
  const DPR = Math.min(window.devicePixelRatio, 1.5) * 0.75; // shader is soft; render under-res for perf

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    state.target[0] = e.clientX / window.innerWidth;
    state.target[1] = 1 - e.clientY / window.innerHeight;
  });

  new IntersectionObserver(([en]) => (state.visible = en.isIntersecting)).observe(canvas);

  const start = performance.now();
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (!state.visible) return;
    state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.05;
    state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.05;
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uTime, (now - start) / 1000 + 20.0);
    gl.uniform2f(u.uMouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(u.uScroll, state.scroll);
    gl.uniform1f(u.uIntro, state.intro);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  requestAnimationFrame(frame);
  return state;
}
