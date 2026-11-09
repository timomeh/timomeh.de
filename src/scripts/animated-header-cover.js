// by nimitz, CC BY-NC-SA 3.0
const auroraShader = `#version 300 es
precision highp float;

uniform highp vec2 u_resolution;
uniform highp float u_time;

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}

float triNoise2d(in vec2 p, float spd) {
  float z = 1.8;
  float invZ2 = 0.4;
  float rz = 0.0;
  p *= mm2(p.x * 0.06);
  vec2 bp = p;
  mat2 timeRotation = mm2(u_time * spd);
  for (int i = 0; i < 5; i++) {
    vec2 tp = bp * 1.85;
    float tx = tri(tp.x);
    float ty = tri(tp.y);
    vec2 dg = vec2(tx + ty, tri(tp.y + tx)) * 0.75;
    dg *= timeRotation;
    p -= dg * invZ2;
    bp *= 1.3;
    invZ2 *= 2.2222222;
    z *= 0.42;
    p *= 1.21 + (rz - 1.0) * 0.02;
    rz += tri(p.x + tri(p.y)) * z;
    p*= -m2;
  }
  return clamp(1.0 / pow(rz * 29.0, 1.3), 0.0, 0.55);
}

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

vec4 aurora(vec3 ro, vec3 rd) {
  vec4 col = vec4(0);
  vec4 avgCol = vec4(0);
  float fragHash = hash21(gl_FragCoord.xy);
  float sampleScale = 1.0 / (rd.y * 2.0 + 0.4);
  float sampleWeight = exp2(-2.5);
  float sampleWeightDecay = exp2(-0.065);

  vec3 colorSin = sin(1.0 - vec3(2.15, -0.5, 1.2));
  vec3 colorCos = cos(1.0 - vec3(2.15, -0.5, 1.2));
  float colorStepSin = sin(0.043);
  float colorStepCos = cos(0.043);

  for (int i = 0; i < 50; i++) {
    float fi = float(i);
    float of = 0.006 * fragHash * smoothstep(0., 15., fi);
    float pt = ((0.8 + pow(fi, 1.4) * 0.002) - ro.y) * sampleScale;
    pt -= of;
    vec3 bpos = ro + pt * rd;
    vec2 p = bpos.zx;
    float rzt = triNoise2d(p, 0.06);
    vec3 baseColor = colorSin * 0.5 + 0.5;
    vec4 col2 = vec4(baseColor * rzt, rzt);

    vec3 nextColorSin = colorSin * colorStepCos + colorCos * colorStepSin;
    colorCos = colorCos * colorStepCos - colorSin * colorStepSin;
    colorSin = nextColorSin;

    avgCol = (avgCol + col2) * 0.5;
    col += avgCol * sampleWeight * smoothstep(0., 5., fi);
    sampleWeight *= sampleWeightDecay;
  }
  col *= (clamp(rd.y*15.0 + 0.4, 0.0, 1.0));
  return col * 1.8;
}

out vec4 fragColor;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 q = fragCoord / u_resolution.xy;
  vec2 p = q - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  // camera position
  vec3 ro = vec3(3.0, 0.0, -6.7);

  // camera direction
  vec3 rd = normalize(vec3(p, 1.3));
  rd.yz *= mm2(0.25);
  rd.xz *= mm2(sin(u_time * 0.01) * 0.02 + u_time * 0.003);

  // draw the aurora
  float fade = smoothstep(0., 0.01, abs(rd.y)) * 0.3 + 0.9;
  vec4 aur = smoothstep(0., 1.4, aurora(ro, rd)) * fade;

  fragColor = aur;
}
`;

// by Shane
const contoursShader = `#version 300 es
precision highp float;

uniform highp float u_time;
uniform highp vec2 u_resolution;

// Variable to a keep a copy of the noise value prior to palettization.
float ns;

// Smooth "fract" function with smoothing factor.
float sFract(float x, float sm) {
  const float sf = 1.0;  // Extra smoothing factor.
  vec2 u = vec2(x, fwidth(x) * sf * sm);
  u.x = fract(u.x);
  u += (1.0 - 2.0 * u) * step(u.y, u.x);
  return clamp(1.0 - u.x / u.y, 0.0, 1.0);
}

// Smooth floor function
float sFloor(float x) { return x - sFract(x, 1.0); }

// Simple hash function for generating random values
vec3 hash33(vec3 p) {
  float n = sin(dot(p, vec3(7.0, 157.0, 113.0)));
  return fract(vec3(2097152.0, 262144.0, 32768.0) * n) * 2.0 - 1.0;
}

// TetraNoise function for generating smooth noise
float tetraNoise(in vec3 p){
  // Reduce noise frequency by scaling down p
  p *= 0.6; // Lower frequency for fewer peaks

  // Skewing the cubic grid, then determining the first vertice and fractional position.
  vec3 i = floor(p + dot(p, vec3(1./3.)) );  p -= i - dot(i, vec3(1./6.));

  // Breaking the skewed cube into tetrahedra with partitioning planes
  vec3 i1 = step(p.yzx, p), i2 = max(i1, 1. - i1.zxy); i1 = min(i1, 1. - i1.zxy);

  // Calculate the vertices of the tetrahedron
  vec3 p1 = p - i1 + 1./6.;
  vec3 p2 = p - i2 + 1./3.;
  vec3 p3 = p - 0.5;

  // Simplex falloff
  vec4 v = max(.5 - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.);

  // Weighted contributions from random vectors at vertices
  vec4 d = vec4(dot(p, hash33(i)), dot(p1, hash33(i + i1)), dot(p2, hash33(i + i2)), dot(p3, hash33(i + 1.)));

  // Return smoothed noise
  return clamp(dot(d, v*v*v*8.)*1.732 + .5, 0., 1.);
}

float func(vec2 p){
  // Lower spatial frequency for larger contours
  float n = tetraNoise(vec3(p.x * 2.0, p.y * 2.0, 0) - vec3(0, .25, .25) * u_time * 0.04); // Slow down motion

  float taper = .1 + dot(p, p * vec2(.12, 1));
  n = max(n - taper, 0.) / max(1. - taper, .0001);
  ns = n;

  const float palNum = 7.; // amount of levels
  return n * 0.25 + clamp(sFloor(n * (palNum - .001)) / (palNum - 1.), 0., 1.) * .85;
}

out vec4 fragColor;

// Main entry point of the fragment shader
void main() {
  vec2 u = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;

  // Padding to ensure contours stay within bounds
  float padding = 0.01; // Reduced padding for less extreme effect
  float aspect = u_resolution.x / u_resolution.y;
  vec2 bounds = vec2(0.5 - padding * vec2(aspect, 1.0));

  u /= bounds;

  // Function value
  float f = func(u);
  float ssd = ns;

  // Sample values around the original for edging and highlighting
  vec2 e = vec2(1.5 / u_resolution.y, 0) / bounds;
  float fxl = func(u + e.xy);
  float fxr = func(u - e.xy);
  float fyt = func(u + e.yx);
  float fyb = func(u - e.yx);

  vec3 col = pow(min(vec3(1.5, 1.0, 1.0) * (f * 0.7 + ssd * 0.35), 1.0), vec3(1.0, 2.0, 10.0) * 2.0) + 0.01;

  col *= max(1.0 - (abs(fxl - fxr) + abs(fyt - fyb)) * 5.0, 0.0);

  // Highlighting with resampling
  fxl = func(u + e.xy * 1.5);
  fyt = func(u + e.yx * 1.5);
  col += vec3(0.5, 0.7, 1.0) * max(f - fyt, 0.0) * ssd * 10.0;

  // Output the color with rough gamma correction
  float fadeThreshold = 0.35; // Adjust this value for smoother fade
  float alpha = smoothstep(0.0, fadeThreshold, f);
  fragColor = vec4(sqrt(clamp(col, 0.0, 1.0)), alpha);
}`;

const reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");

class AnimatedHeaderCover extends HTMLElement {
  connectedCallback() {
    const canvas = this.querySelector("canvas");
    if (!canvas) return;

    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2", { alpha: true });
    this.state = {
      frame: null,
      buffer: null,
      program: null,
      isVisible: true,
      startTime: Math.random() * -10000000,
    };

    this.setupListeners();
    this.initialize();
  }

  setupListeners() {
    new ResizeObserver(() => {
      if (this.state.program) {
        this.setCanvasSize();
        this.draw();
      }
    }).observe(this.canvas);

    new IntersectionObserver(([entry]) => {
      this.state.isVisible = entry.isIntersecting;
      this.draw();
    }).observe(this.canvas);

    window.addEventListener("theme:change", () => this.initialize());
    reducedMotionQuery.addEventListener("change", () => this.draw());
    document.addEventListener("visibilitychange", () => this.draw());
    this.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      cancelAnimationFrame(this.state.frame);
      this.canvas.dataset.ready = true;
    });
    this.canvas.addEventListener("webglcontextrestored", () => this.initialize());
  }

  initialize() {
    cancelAnimationFrame(this.state.frame);
    this.canvas.dataset.ready = true;

    try {
      if (this.gl.isContextLost()) return;

      const shaderSource = getCurrentShader();
      const vertexShader = this.compileShader(
        this.gl.VERTEX_SHADER,
        `#version 300 es
        in vec2 a_position;
        void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`,
      );
      const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, shaderSource);
      const newProgram = this.gl.createProgram();

      this.gl.attachShader(newProgram, vertexShader);
      this.gl.attachShader(newProgram, fragmentShader);
      this.gl.linkProgram(newProgram);
      this.gl.deleteShader(vertexShader);
      this.gl.deleteShader(fragmentShader);

      if (!this.gl.getProgramParameter(newProgram, this.gl.LINK_STATUS)) {
        this.gl.deleteProgram(newProgram);
        throw new Error("Could not link header shader");
      }

      if (this.state.program) this.gl.deleteProgram(this.state.program);
      if (this.state.buffer) this.gl.deleteBuffer(this.state.buffer);

      this.state.program = newProgram;
      this.gl.useProgram(this.state.program);

      this.state.buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.state.buffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        this.gl.STATIC_DRAW,
      );

      const position = this.gl.getAttribLocation(this.state.program, "a_position");
      this.gl.enableVertexAttribArray(position);
      this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.setCanvasSize();
      this.draw();

      this.canvas.dataset.ready = true;
    } catch (error) {
      console.warn("Header effect unavailable:", error);
    }
  }

  setCanvasSize() {
    const bounds = this.canvas.getBoundingClientRect();
    const scale = isDark() ? 0.2 : 1;
    this.canvas.width = Math.max(1, Math.round(bounds.width * scale));
    this.canvas.height = Math.max(1, Math.round(bounds.height * scale));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    cancelAnimationFrame(this.state.frame);

    if (
      !this.state.program ||
      this.gl.isContextLost() ||
      !this.state.isVisible ||
      document.hidden
    ) {
      return;
    }

    this.gl.useProgram(this.state.program);
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.state.program, "u_time"),
      (this.state.startTime + performance.now()) * 0.002,
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.state.program, "u_resolution"),
      this.canvas.width,
      this.canvas.height,
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    if (!reducedMotionQuery.matches) {
      this.state.frame = requestAnimationFrame(() => this.draw());
    }
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      throw new Error("Could not compile header shader");
    }

    return shader;
  }
}

customElements.define("animated-header-cover", AnimatedHeaderCover);

function getCurrentShader() {
  return isDark() ? auroraShader : contoursShader;
}

function isDark() {
  return document.documentElement.dataset.colorScheme === "dark";
}
