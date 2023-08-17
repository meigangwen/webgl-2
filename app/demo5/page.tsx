'use client'

import { useEffect} from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import m3 from './m3'

export default function Home() {
  
  useEffect(() => {
  
    function main() {
      var canvas = document.querySelector("#c")
      var gl = canvas.getContext("webgl2");

      // create GLSL shaders, upload the GLSL source, compile the shaders
      var vertexShader = Render.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      var fragmentShader = Render.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
      var program = Render.createProgram(gl, vertexShader, fragmentShader);

      // look up where the vertex data needs to go.
      var positionLocation = gl.getAttribLocation(program, "a_position");
      var colorLocation = gl.getAttribLocation(program, "a_color");
      var matrixLocation = gl.getUniformLocation(program, "u_matrix");

      // Create a buffer and put three 2d clip space points in it
      //var positionBuffer = gl.createBuffer();

      // Create a vertex array object (attribute state)
      var vao = gl.createVertexArray()
      gl.bindVertexArray(vao)

      // Create a buffer.
      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

      // Set Geometry
      Render.setRectangle(gl);

      // setup attributes
      gl.enableVertexAttribArray(positionLocation)
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)


      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      // Set the triangle
      Render.setColors(gl);
      //Render.setTriangle(gl);

      
      gl.enableVertexAttribArray(colorLocation)
      var size = 4;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset)

      var translation = [500,350];
      var angleInRadians = 0;
      var scale = [2,2];

      drawScene()

      function drawScene(){
        Render.resizeCanvasToDisplaySize(gl.canvas)
        
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        // Compute the matrix
        var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Set the matrix.
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        // Draw the geometry.
        var offset = 0;
        var count = 6np;
        gl.drawArrays(gl.TRIANGLES, offset, count);

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
