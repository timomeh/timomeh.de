import { auroraShader, contoursShader } from "site/shaders";

class AnimatedHeaderCover extends HTMLElement {
  #reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
  #state = {
    frame: null,
    buffer: null,
    program: null,
    isVisible: true,
    startTime: Math.random() * -10000000,
  };

  connectedCallback() {
    const canvas = this.querySelector("canvas");
    if (!canvas) return;

    this.canvas = canvas;
    this.gl = canvas.getContext("webgl2", { alpha: true });

    this.#setupListeners();
    this.#initialize();
  }

  #setupListeners() {
    new ResizeObserver(() => {
      if (this.#state.program) {
        this.#setCanvasSize();
        this.#draw();
      }
    }).observe(this.canvas);

    new IntersectionObserver(([entry]) => {
      this.#state.isVisible = entry.isIntersecting;
      this.#draw();
    }).observe(this.canvas);

    window.addEventListener("theme:change", () => this.#initialize());
    this.#reducedMotionQuery.addEventListener("change", () => this.#draw());
    document.addEventListener("visibilitychange", () => this.#draw());
    this.canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      cancelAnimationFrame(this.#state.frame);
      this.canvas.dataset.ready = true;
    });
    this.canvas.addEventListener("webglcontextrestored", () => this.#initialize());
  }

  #initialize() {
    cancelAnimationFrame(this.#state.frame);
    this.canvas.dataset.ready = true;

    try {
      if (this.gl.isContextLost()) return;

      const shaderSource = this.#getCurrentShader();
      const vertexShader = this.#compileShader(
        this.gl.VERTEX_SHADER,
        `#version 300 es
        in vec2 a_position;
        void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`,
      );
      const fragmentShader = this.#compileShader(this.gl.FRAGMENT_SHADER, shaderSource);
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

      if (this.#state.program) this.gl.deleteProgram(this.#state.program);
      if (this.#state.buffer) this.gl.deleteBuffer(this.#state.buffer);

      this.#state.program = newProgram;
      this.gl.useProgram(this.#state.program);

      this.#state.buffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.#state.buffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        this.gl.STATIC_DRAW,
      );

      const position = this.gl.getAttribLocation(this.#state.program, "a_position");
      this.gl.enableVertexAttribArray(position);
      this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.#setCanvasSize();
      this.#draw();

      this.canvas.dataset.ready = true;
    } catch (error) {
      console.warn("Header effect unavailable:", error);
    }
  }

  #setCanvasSize() {
    const bounds = this.canvas.getBoundingClientRect();
    const scale = this.#isDark() ? 0.2 : 1;
    this.canvas.width = Math.max(1, Math.round(bounds.width * scale));
    this.canvas.height = Math.max(1, Math.round(bounds.height * scale));
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  #draw() {
    cancelAnimationFrame(this.#state.frame);

    if (
      !this.#state.program ||
      this.gl.isContextLost() ||
      !this.#state.isVisible ||
      document.hidden
    ) {
      return;
    }

    this.gl.useProgram(this.#state.program);
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.#state.program, "u_time"),
      (this.#state.startTime + performance.now()) * 0.002,
    );
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.#state.program, "u_resolution"),
      this.canvas.width,
      this.canvas.height,
    );
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

    if (!this.#isReducedMotion()) {
      this.#state.frame = requestAnimationFrame(() => this.#draw());
    }
  }

  #compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      throw new Error("Could not compile header shader");
    }

    return shader;
  }

  #getCurrentShader() {
    return this.#isDark() ? auroraShader : contoursShader;
  }

  #isDark() {
    return document.documentElement.dataset.colorScheme === "dark";
  }

  #isReducedMotion() {
    return this.#reducedMotionQuery.matches;
  }
}

customElements.define("animated-header-cover", AnimatedHeaderCover);
