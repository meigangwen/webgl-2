'use client'

import { useEffect, useMemo } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import {m4} from './m4'
import {useControls} from 'leva'

export default function Home() {

   // define the leva UI
   const {cameraAngle} = useControls("Camera", {
    cameraAngle: {value:-360, min:-360, max:360, step:1},
  })


  function main() {
    var canvas = document.querySelector("#c")
    var gl = canvas.getContext("webgl2");

    // create GLSL shaders, upload the GLSL source, compile the shaders
    var vertexShader = Render.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = Render.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = Render.createProgram(gl, vertexShader, fragmentShader);



    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position")
    var colorLocation = gl.getAttribLocation(program, "a_color")
    var matrixLocation = gl.getUniformLocation(program, "u_matrix")
    //var fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");

    // Create a buffer and put three 2d clip space points in it
    var positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    // setup attributes
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    Render.setGeometry(gl)

    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

    // create the color buffer, make it the current ARRAY_BUFFER
    // and copy in the color values
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    Render.setColors(gl);

    // Turn on the attribute
    gl.enableVertexAttribArray(colorLocation);

    // Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 3;          // 3 components per iteration
    var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
    var normalize = true;  // convert from 0-255 to 0.0-1.0
    var stride = 0;        // 0 = move forward size * sizeof(type) each
                          // iteration to get the next color
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }

   
    drawScene()

    function drawScene(){
      // define some constants
      const numFs = 5;
      const radius = 200;

      Render.resizeCanvasToDisplaySize(gl.canvas)
      
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

      // Clear the canvas
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      

      // turn on depth testing
      gl.enable(gl.DEPTH_TEST);

      // tell webgl to cull faces
      gl.enable(gl.CULL_FACE);


      // Tell it to use our program (pair of shaders)
      gl.useProgram(program);

      // Bind the attribute/buffer set we want.
      gl.bindVertexArray(vao);

      var fieldOfViewRadians = degToRad(60);
      var cameraAngleRadians = degToRad(cameraAngle);
  

      // Compute the matrices
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

      var cameraMatrix = m4.yRotation(cameraAngleRadians);
      cameraMatrix = m4.translate(cameraMatrix,0,0,radius * 1.5);

      // Make a view matrix from the camera matrix
      var viewMatrix = m4.inverse(cameraMatrix);

      // move the projection space to view space 
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      // Draw 'F's in a circle
      
      for (var ii = 0; ii < numFs; ++ii) {
        var angle = ii * Math.PI * 2 / numFs;
  
        var x = Math.cos(angle) * radius;
        var z = Math.sin(angle) * radius;
        var matrix = m4.translate(viewProjectionMatrix, x, 0, z);
  
        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 16 * 6;
        gl.drawArrays(primitiveType, offset, count);
      }
      
    }
    
  }
  
  useEffect(() => {
    main()
  },[cameraAngle])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
