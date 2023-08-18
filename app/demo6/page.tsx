'use client'

import { useEffect} from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
//import m3 from './m3'

export default function Home() {
  
  useEffect(() => {
  
    function main() {
      var canvas = document.querySelector("#c")
      var gl = canvas.getContext("webgl2");

      // create GLSL shaders, upload the GLSL source, compile the shaders
      var vertexShader = Render.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      var fragmentShader = Render.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      var program = Render.createProgram(gl, vertexShader, fragmentShader);

      // make some variables to hold the translation data
      var translation = [0,0]
      var width = 100
      var height = 30
      var color = [Math.random(), Math.random(), Math.random(), 1]


      // look up where the vertex data needs to go.
      var positionLocation = gl.getAttribLocation(program, "a_position");
      var colorLocation = gl.getUniformLocation(program, "u_color");
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = gl.createBuffer();

      // Create a vertex array object (attribute state)
      var vao = gl.createVertexArray()
      gl.bindVertexArray(vao)

      // setup attributes
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

      drawScene()

      function drawScene(){
        Render.resizeCanvasToDisplaySize(gl.canvas)
        
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
        // pixels to clip space in the shader
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

        // Update the position buffer with rectangle positions
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        Render.setRectangle(gl, translation[0],translation[1], width, height)

        // Set the color
        gl.uniform4fv(colorLocation, color)
        
        // Draw the rectangle
        var primitiveType = gl.TRIANGLES;
        var offset = 0
        var count = 6
        gl.drawArrays(primitiveType, offset, count);

      }
    }
    main()
  },[])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
