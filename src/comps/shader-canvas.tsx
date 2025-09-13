'use client'

type Props = {
  fragmentShaderSource: string
}

export function ShaderCanvas({ fragmentShaderSource }: Props) {
  return (
    <canvas
      className="h-full w-full transition-opacity duration-700"
      style={{ opacity: 0 }}
      ref={(canvas) => {
        if (!canvas) return

        const gl = canvas.getContext('webgl2', { alpha: true })
        if (!gl) return

        gl.clearColor(0.0, 0.0, 0.0, 0.0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        let { width, height } = canvas.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)

        const vs = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
        const fs = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
        if (!vs || !fs) return

        const program = gl.createProgram()
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        // biome-ignore lint/correctness/useHookAtTopLevel: this is not a hook
        gl.useProgram(program)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

        const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

        const pos = gl.getAttribLocation(program, 'a_position')
        gl.enableVertexAttribArray(pos)
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

        const timeUniform = gl.getUniformLocation(program, 'u_time')
        const resolutionUniform = gl.getUniformLocation(program, 'u_resolution')

        let started = false
        let frameId = 0

        const startTime = Math.random() * -10000000

        let lastFrame = performance.now()
        let slowFrames = 0

        const render = () => {
          const now = performance.now()
          const renderDuration = now - lastFrame
          lastFrame = now

          // detect slow performance and pause if it doesn't render smoothly
          if (renderDuration > 50) {
            // a slow frame is considered below 20fps
            slowFrames++
          } else {
            slowFrames = Math.max(0, slowFrames - 1)
          }

          if (slowFrames > 10) {
            stop()
            return
          }

          gl.uniform1f(timeUniform, (startTime + performance.now()) * 0.002)
          gl.uniform2f(resolutionUniform, width, height)
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
          if (started) frameId = requestAnimationFrame(render)
        }

        const start = () => {
          started = true
          render()
        }

        const stop = () => {
          started = false
          cancelAnimationFrame(frameId)
        }

        start()
        canvas.style.opacity = '1'

        const resizeObserver = new ResizeObserver(([entry]) => {
          width = entry.contentRect.width
          height = entry.contentRect.height
          canvas.width = width
          canvas.height = height
          gl.viewport(0, 0, width, height)
        })
        resizeObserver.observe(canvas)

        const inViewObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !started) {
                start()
              } else if (!entry.isIntersecting) {
                stop()
              }
            })
          },
          { threshold: 0 },
        )
        inViewObserver.observe(canvas)

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (mediaQuery.matches) stop()
        const onReducedMotionChange = (event: MediaQueryListEvent) => {
          if (event.matches) stop()
          else start()
        }
        mediaQuery.addEventListener('change', onReducedMotionChange)

        return () => {
          stop()
          resizeObserver.disconnect()
          inViewObserver.disconnect()
          mediaQuery.removeEventListener('change', onReducedMotionChange)
          cleanupWebGL(gl, program, [buffer])
        }
      }}
    />
  )
}

const vertexShaderSource = `#version 300 es
precision highp float;
in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

function compileShader(
  gl: WebGLRenderingContext,
  source: string,
  type: GLenum,
) {
  const shader = gl.createShader(type)
  if (!shader) return
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }
  return shader
}

function cleanupWebGL(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  buffers: WebGLBuffer[],
) {
  // Delete shaders and program
  // biome-ignore lint/correctness/useHookAtTopLevel: not a hook
  gl.useProgram(null)
  gl.deleteProgram(program)

  // Delete buffers
  if (buffers) {
    buffers.forEach((buffer) => {
      gl.deleteBuffer(buffer)
    })
  }

  // Delete textures if any
  const numTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
  for (let i = 0; i < numTextures; i++) {
    const texture = gl.getParameter(gl.TEXTURE_BINDING_2D)
    if (texture) {
      gl.deleteTexture(texture)
    }
  }

  // Delete framebuffers (if used)
  const fb = gl.getParameter(gl.FRAMEBUFFER_BINDING)
  if (fb) {
    gl.deleteFramebuffer(fb)
  }

  // Delete vertex array (if using WebGL2)
  if (gl instanceof WebGL2RenderingContext) {
    const vao = gl.getParameter(gl.VERTEX_ARRAY_BINDING)
    if (vao) {
      gl.deleteVertexArray(vao)
    }
  }

  // Clear WebGL state
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)
}
