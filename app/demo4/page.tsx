'use client'

import { useEffect} from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import m3 from './m3'
import webglLessonsUI from './webgl-lessons-ui'

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
      var matrixLocation = gl.getUniformLocation(program, "u_matrix");

      // Create a buffer and put three 2d clip space points in it
      //var positionBuffer = gl.createBuffer();

      // Create a vertex array object (attribute state)
      var vao = gl.createVertexArray()
      gl.bindVertexArray(vao)

      // Create a buffer.
      var buffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

      // Set the triangle
      Render.setTriangle(gl);


      gl.enableVertexAttribArray(positionLocation)
      var size = 2;          // 2 components per iteration
      var type = gl.FLOAT;   // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

      var translation = [200,150];
      var angleInRadians = 0;
      var scale = [1,1];

      drawScene()

      // Setup a ui.
      webglLessonsUI.setupSlider("#x",      {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
      webglLessonsUI.setupSlider("#y",      {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
      webglLessonsUI.setupSlider("#angle",  {slide: updateAngle, max: 360});
      webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
      webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

      function updatePosition(index) {
        return function(event, ui) {
          translation[index] = ui.value;
          drawScene();
        };
      }

      function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        angleInRadians = angleInDegrees * Math.PI / 180;
        drawScene();
      }

      function updateScale(index) {
        return function(event, ui) {
          scale[index] = ui.value;
          drawScene();
        };
      }

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
        var count = 3;
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
