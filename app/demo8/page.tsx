'use client'

import { useEffect, useMemo } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import {m4} from './m4'
import {useControls} from 'leva'

export default function Home() {

   // define the leva UI
   const {x,y,z,angleX,angleY,angleZ,scaleX,scaleY,scaleZ} = useControls("2D Transformation", {
    x: { value:45, min:0, max:2000, step: 1},
    y: { value:150, min:0, max:1000, step: 1},
    z: { value:0, min:0, max:1000, step: 1},
    angleX: {value:40, min:0,max:360,step:1},
    angleY: {value:25, min:0,max:360,step:1},
    angleZ: {value:325, min:0,max:360,step:1},
    scaleX: {value:1,min:-5.0,max:5.0,step:0.1},
    scaleY: {value:1,min:-5.0,max:5.0,step:0.1},
    scaleZ: {value:1,min:-5.0,max:5.0,step:0.1},
  })

  var translation = [x, y, z];
  var scale = [scaleX, scaleY,scaleZ];
  const color = useMemo(() => [Math.random(), Math.random(), Math.random(), 1],[]);

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

    //var translation = [45, 150, 0]
    var rotation = [degToRad(angleX), degToRad(angleY), degToRad(angleZ)]
    //var scale = [1,1,1]
    //var color = [Math.random(), Math.random(), Math.random(), 1]
    //console.log(color)

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

      // Set the color
      //gl.uniform4fv(colorLocation, color)


      // Compute the matrices

      // try the new projection
      var left = 0;
      var right = gl.canvas.clientWidth;
      var bottom = gl.canvas.clientHeight;
      var top = 0;
      var near = 400;
      var far = -400;
      var matrix = m4.orthographic(left, right, bottom, top, near, far);

      //var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
      matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
      matrix = m4.xRotate(matrix, rotation[0]);
      matrix = m4.yRotate(matrix, rotation[1]);
      matrix = m4.zRotate(matrix, rotation[2]);
      matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);
      
  
      // Set the matrix
      gl.uniformMatrix4fv(matrixLocation, false, matrix)

      // Draw the rectangle
      var primitiveType = gl.TRIANGLES
      var offset = 0
      var count = 16 * 6
      gl.drawArrays(primitiveType, offset, count)
    }
    
  }
  
  useEffect(() => {
    main()
  },[x,y,z,angleX,angleY,angleZ,scaleX,scaleY,scaleZ])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
