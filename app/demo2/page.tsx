'use client'

import { useEffect} from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import {createShader, createProgram, resizeCanvasToDisplaySize} from './render'

export default function Home() {
  
  useEffect(() => {
  
    function main() {
      var canvas = document.querySelector("#c")
      var gl = canvas.getContext("webgl2");

      // create GLSL shaders, upload the GLSL source, compile the shaders
      var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

      // Link the two shaders into a program
      var program = createProgram(gl, vertexShader, fragmentShader);

      // look up where the vertex data needs to go.
      var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

      // look up uniform locations
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = gl.createBuffer();

      // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

      var positions = [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
      ];
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

      // Create a vertex array object (attribute state)
      var vao = gl.createVertexArray();

      // and make it the one we're currently working with
      gl.bindVertexArray(vao)

      // Turn on the attribute
      gl.enableVertexAttribArray(positionAttributeLocation)

      // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)

      resizeCanvasToDisplaySize(gl.canvas)

      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);

      // Pass in the canvas resolution so we can convert from
      // pixels to clipspace in the shader
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      // draw
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 6;
      gl.drawArrays(primitiveType, offset, count);
    }
    main()
  },[])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
