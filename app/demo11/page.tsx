'use client'

import { useEffect, useMemo } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import { m4 } from './m4'
import { useControls } from 'leva'

export default function Home() {

   // define the leva UI
   const {objAngle} = useControls("Obj", {
    objAngle: {value:-360, min:-360, max:360, step:1},
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
    var normalLocation = gl.getAttribLocation(program, "a_normal")
    //var matrixLocation = gl.getUniformLocation(program, "u_matrix")
    var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
    //var worldLocation = gl.getUniformLocation(program, "u_world");
    var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
    var colorLocation = gl.getUniformLocation(program, "u_color");
    var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

    // Setup position buffer
    var positionBuffer = gl.createBuffer();
    var vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    Render.setGeometry(gl)

    var size = 3;          // 3 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset)

    // Setup normal buffer
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    Render.setNormals(gl)
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
 
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }
  
    function degToRad(d) {
      return d * Math.PI / 180;
    }

   
    drawScene()

    function drawScene(){
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
      var fRotationRadians = degToRad(objAngle);
  

      // Compute the matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var zNear = 1;
      var zFar = 2000;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

      // Compute the camera's matrix
      var camera = [100, 150, 200];
      var target = [0, 35, 0];
      var up = [0, 1, 0];
      var cameraMatrix = m4.lookAt(camera, target, up);

      // Make a view matrix from the camera matrix
      var viewMatrix = m4.inverse(cameraMatrix);

      // move the projection space to view space 
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      // Draw a F at the origin with rotation
      var worldMatrix = m4.yRotation(fRotationRadians);
      var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix,worldMatrix);
      var worldInverseMatrix = m4.inverse(worldMatrix);
      var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

      //var matrix = m4.yRotate(viewProjectionMatrix, fRotationRadians);
      
      // Set the matrix.
      //gl.uniformMatrix4fv(matrixLocation, false, matrix);
      gl.uniformMatrix4fv(worldViewProjectionLocation, false,worldViewProjectionMatrix);
      //gl.uniformMatrix4fv(worldLocation, false, worldMatrix);
      gl.uniformMatrix4fv(worldInverseTransposeLocation, false,worldInverseTransposeMatrix);

      // Set the color to use
      gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // green

      // set the light direction.
      gl.uniform3fv(reverseLightDirectionLocation, m4.normalize([0.5, 0.7, 1]));

      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = 16 * 6;
      gl.drawArrays(primitiveType, offset, count);
      
    }
    
  }
  
  useEffect(() => {
    main()
  },[objAngle])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
