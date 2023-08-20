'use client'

import { useEffect} from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'

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
      var colorLocation = gl.getUniformLocation(program, "u_color")
      var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
      var matrixLocation = gl.getUniformLocation(program, "u_matrix");

      // Create a buffer and put three 2d clip space points in it
      var positionBuffer = gl.createBuffer();

      // Create a vertex array object (attribute state)
      var vao = gl.createVertexArray()
      gl.bindVertexArray(vao)

      // setup attributes
      gl.enableVertexAttribArray(positionLocation)
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

      Render.setGeometry(gl)

      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

      var translation = [0, 0];
      var rotationInRadians = [0,0];
      var scale = [1,1];
      var color = [Math.random(), Math.random(), Math.random(), 1];

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

        // Set the color
        gl.uniform4fv(colorLocation, color)

        // Compute the matrices
        var translationMatrix = m3.translation(translation[0], translation[1]);
        var rotationMatrix = m3.rotation(rotationInRadians);
        var scaleMatrix = m3.scaling(scale[0], scale[1]);
    
        // Multiply the matrices.
        var matrix = m3.multiply(translationMatrix, rotationMatrix);
        matrix = m3.multiply(matrix, scaleMatrix);
    
        // Set the matrix.
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        // Draw the rectangle
        var primitiveType = gl.TRIANGLES;
        var offset = 0
        var count = 18
        gl.drawArrays(primitiveType, offset, count);

      }
    }

    var m3 = {
      translation: function translation(tx, ty) {
        return [
          1, 0, 0,
          0, 1, 0,
          tx, ty, 1,
        ];
      },
    
      rotation: function rotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
          c, -s, 0,
          s, c, 0,
          0, 0, 1,
        ];
      },
    
      scaling: function scaling(sx, sy) {
        return [
          sx, 0, 0,
          0, sy, 0,
          0, 0, 1,
        ];
      },
    
      multiply: function multiply(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [
          b00 * a00 + b01 * a10 + b02 * a20,
          b00 * a01 + b01 * a11 + b02 * a21,
          b00 * a02 + b01 * a12 + b02 * a22,
          b10 * a00 + b11 * a10 + b12 * a20,
          b10 * a01 + b11 * a11 + b12 * a21,
          b10 * a02 + b11 * a12 + b12 * a22,
          b20 * a00 + b21 * a10 + b22 * a20,
          b20 * a01 + b21 * a11 + b22 * a21,
          b20 * a02 + b21 * a12 + b22 * a22,
        ];
      },
    }

    main()
  },[])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
