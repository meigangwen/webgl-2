'use client'

import { useEffect , useMemo } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as Render from './render'
import {m3} from "./m3"
import {useControls} from 'leva'

export default function Home() {

  // define the leva UI
  const {x,y,angle,scaleX,scaleY} = useControls("2D Transformation", {
    x: { value:150, min:0, max:2000, step: 1},
    y: { value:100, min:0, max:1000, step: 1},
    angle: {value:0, min:0,max:360,step:1},
    scaleX: {value:1,min:-5.0,max:5.0,step:0.1},
    scaleY: {value:1,min:-5.0,max:5.0,step:0.1},
  })

  var translation = [x, y];
  var rotation = [0, 1];
  var scale = [scaleX, scaleY];
  const color = useMemo(() => [Math.random(), Math.random(), Math.random(), 1],[]);


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
    //var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
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

      // Set the color
      gl.uniform4fv(colorLocation, color)


      // Compute the matrices
      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
  
      const angleInDegrees = 360 - angle;
      const rotationInRadians = angleInDegrees * Math.PI / 180;
    
      for (var i = 0; i < 5; ++i) {
        // Apply the matrix
        matrix = m3.translate(matrix, translation[0], translation[1])
        matrix = m3.rotate(matrix, rotationInRadians )
        matrix = m3.scale(matrix, scale[0], scale[1])

        // Set the matrix
        gl.uniformMatrix3fv(matrixLocation, false, matrix)

        // Draw the rectangle
        var primitiveType = gl.TRIANGLES
        var offset = 0
        var count = 18
        gl.drawArrays(primitiveType, offset, count)
      }
    }
  }
  
  useEffect(() => {
    main()
  },[x,y,angle,scaleX,scaleY])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
