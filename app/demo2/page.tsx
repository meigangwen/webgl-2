// this demo draws a small rectangle
// the points are defined in pixel units

'use client'

import { useEffect,useMemo, useRef } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import {createShader, createProgram, resizeCanvasToDisplaySize, setRectangle} from './render'
import { useControls } from "leva"

export default function Home() {

  const {x,y} = useControls("Translation", {
    x: { value:0, min:0, max:2000, step: 1},
    y: { value:0, min:0, max:1000, step: 1},
  })

  // define some constants and variables
  var translation = [x, y];
  const width = 100;
  const height = 30;
  const color = useMemo(() => [Math.random(), Math.random(), Math.random(), 1],[]);

  function main() {
    // access gl
    var canvas = document.querySelector("#c")
    var gl = canvas.getContext("webgl2");

    // load the shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
   
    // look up attr and uniforms
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer 
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl,translation[0],translation[1],width,height);

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

    // End of preparing the data
    // The following code will draw the scene
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

    // Set a random color.
    gl.uniform4fv(colorLocation, color);

    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }

  useEffect(() => {
    main();
  },[x,y])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
