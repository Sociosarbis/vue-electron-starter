import { createGLHelpers, GLHelpers } from './index'
import quadVertShaderSource from './quad.vert'
import quadFragShaderSource from './quad.frag'
import frameVertShaderSource from './frame.vert'
import frameFragShaderSource from './frame.frag'

type Quad = {
  x: number
  y: number
  width: number
  height: number
}

export default function main(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2')!
  const helpers = createGLHelpers(gl)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  let texture: WebGLTexture
  let frameBuffer: WebGLFramebuffer
  const QUAD_COUNT = 1000
  const quadPositions = new Float32Array(QUAD_COUNT * 2);
  const quadProgram = new GLHelpers(gl, quadVertShaderSource, quadFragShaderSource)!
  let quadVertexArrayObj: WebGLVertexArrayObject
  const frameProgram = new GLHelpers(gl, frameVertShaderSource, frameFragShaderSource)!
  let frameVertextArrayObj: WebGLVertexArrayObject
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  canvas.style.setProperty('background-color', '#000')
  requestAnimationFrame(updateFrame)

  const enablePostProcessing = true
  function updateFrame(time: number) {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0.2, 0.2, 0.2, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    if (enablePostProcessing) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
    quadProgram.use()
    gl.bindVertexArray(quadVertexArrayObj)
    quadProgram.setUniform('u_time', time / 1000)
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, QUAD_COUNT)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    if (enablePostProcessing) {
      frameProgram.use()
      frameProgram.setUniform('u_texture', texture)
      gl.bindVertexArray(frameVertextArrayObj)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }
    gl.useProgram(null)
    gl.bindVertexArray(null)
    gl.bindTexture(gl.TEXTURE_2D, null)
    requestAnimationFrame(updateFrame)
  }

  function resizeCanvas() {
    const dpr = devicePixelRatio > 2 ? 2 : devicePixelRatio
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    canvas.style.setProperty('width', `${innerWidth}px`)
    canvas.style.setProperty('height', `${innerHeight}px`)
    if (texture) {
      gl.deleteTexture(texture)
    }
    texture = helpers.createTexture({
      pixels: null,
      width: canvas.width,
      height: canvas.height,
      internalFormat: gl.RGBA
    })
    gl.bindTexture(gl.TEXTURE_2D, null)
    if (frameBuffer) {
      gl.deleteFramebuffer(frameBuffer)
    }
    frameBuffer = makeFrameBuffer(texture)
    for (let i = 0;i < QUAD_COUNT;i++) {
      quadPositions[i * 2] = innerWidth * 2 * Math.random()
      quadPositions[i * 2 + 1] = innerHeight * 2 * Math.random()
    }
    if (quadVertexArrayObj) {
      gl.deleteVertexArray(quadVertexArrayObj)
    }
    if (frameVertextArrayObj) {
      gl.deleteVertexArray(frameVertextArrayObj)
    }
    quadVertexArrayObj = makeQuad({ positions: quadPositions, width: 400, height: 400, isInstanced: true, program: quadProgram! })
    frameVertextArrayObj = makeQuad({ positions: new Float32Array([
      innerWidth * 0.5, innerHeight * 0.5
    ]), width: innerWidth, height: innerHeight, program: frameProgram! })
  }

  function makeFrameBuffer(texture: WebGLTexture) {
    const frameBuffer = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return frameBuffer
  }

  function makeQuad({ positions, width = 70, height = 70, program, drawType = gl.STATIC_DRAW, isInstanced = false } = {} as Partial<Quad & { positions: Float32Array, drawType: typeof gl.STATIC_DRAW, isInstanced: boolean, program: GLHelpers }>) {
    const halfWidth = width * 0.5
    const halfHeight = height * 0.5
    const vertexArray = new Float32Array([
      -halfWidth, -halfHeight,
      halfWidth, -halfHeight,
      halfWidth, halfHeight,
      -halfWidth, -halfHeight,
      halfWidth, halfHeight,
      -halfWidth, halfHeight
    ])

    if (!isInstanced) {
      for (let i = 0;i < vertexArray.length;i +=2 ) {
        vertexArray[i] += positions![0]
        vertexArray[i + 1] += positions![1]
      }
    }

    const vertexArrayObj = gl.createVertexArray()!

    const vertexAttr = helpers.createVertexAttrib({
      data: vertexArray,
      usage: drawType,
      size: 2
    })

    gl.bindVertexArray(vertexArrayObj)


    program!.setAttrib('a_position', vertexAttr)

    const uvArray = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 0,
      1, 1,
      0, 1
    ])

    const uvAttr = helpers.createVertexAttrib({
      data: uvArray,
      usage: drawType,
      size: 2
    })

    program!.setAttrib('a_uv', uvAttr)

    if (isInstanced) {
      const posAttr = helpers.createVertexAttrib({
        data: positions,
        usage: drawType,
        size: 2
      })

      program!.setAttrib('a_offset', posAttr)
      gl.vertexAttribDivisor(program!.getAttribLoc('a_offset'), 1)
    }

    gl.bindVertexArray(null)

    const projectionMatrix = new Float32Array([
      2 / innerWidth, 0, 0, 0,
      0, -2 / innerHeight, 0, 0,
      0, 0, 0, 0,
      -1, 1, 0, 1
    ])

    program!.use()
  
    program!.setUniform('u_projectionMatrix', projectionMatrix, false)

    program!.use(null)

    return vertexArrayObj
  }
}
