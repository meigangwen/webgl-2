'use client'

import { useEffect, useMemo } from "react"
import vertexShaderSource from './shaders/vertex.glsl'
import fragmentShaderSource from './shaders/fragment.glsl'
import * as m4 from './m4'
import * as twgl from "twgl.js"

export default function Home() {

  function main() {
    // access the canvas
    var canvas = document.querySelector("#c")
    var gl = canvas.getContext("webgl2");

    twgl.setAttributePrefix("a_");

    // declare functions to create flattened primitives
    function createFlattenedVertices(gl, vertices, vertsPerColor) {
      let last;
      return twgl.createBufferInfoFromArrays(
          gl,
          twgl.primitives.makeRandomVertexColors(
              twgl.primitives.deindexVertices(vertices),
              {
                vertsPerColor: vertsPerColor || 1,
                rand: function(ndx, channel) {
                  if (channel === 0) {
                    last = 128 + Math.random() * 128 | 0;
                  }
                  return channel < 3 ? last : 255;
                },
              })
        );
    }
  
    function createFlattenedFunc(createVerticesFunc, vertsPerColor) {
      return function(gl) {
        const arrays = createVerticesFunc.apply(null,  Array.prototype.slice.call(arguments, 1));
        return createFlattenedVertices(gl, arrays, vertsPerColor);
      };
    }


    var sphereBufferInfo = createFlattenedFunc(twgl.primitives.createSphereVertices, 6);
    //var cubeBufferInfo   = flattenedPrimitives.createCubeBufferInfo(gl, 20);
    //var coneBufferInfo   = flattenedPrimitives.createTruncatedConeBufferInfo(gl, 10, 0, 20, 12, 1, true, false);
    
    // setup GLSL program
    var program = twgl.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    var uniformSetters = twgl.createUniformSetters(gl, program);
    var attribSetters  = twgl.createAttributeSetters(gl, program);

    var sphereVAO = twgl.createVAOFromBufferInfo(gl, attribSetters, sphereBufferInfo);
    //var cubeVAO   = twgl.createVAOFromBufferInfo(gl, attribSetters, cubeBufferInfo);
    //var coneVAO   = twgl.createVAOFromBufferInfo(gl, attribSetters, coneBufferInfo);

    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var fieldOfViewRadians = degToRad(60);

    // Uniforms foor each object
    var sphereUniforms = {
      u_colorMult: [0.5, 1, 0.5, 1],
      u_matrix: m4.identity(),
    };
    var cubeUniforms = {
      u_colorMult: [1, 0.5, 0.5, 1],
      u_matrix: m4.identity(),
    };
    var coneUniforms = {
      u_colorMult: [0.5, 0.5, 1, 1],
      u_matrix: m4.identity(),
    };
    var sphereTranslation = [  0, 0, 0];
    var cubeTranslation   = [-40, 0, 0];
    var coneTranslation   = [ 40, 0, 0];
  
    function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation) {
      var matrix = m4.translate(viewProjectionMatrix,
          translation[0],
          translation[1],
          translation[2]);
      matrix = m4.xRotate(matrix, xRotation);
      return m4.yRotate(matrix, yRotation);
    }
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      time = time * 0.0005;
  
      twgl.resizeCanvasToDisplaySize(gl.canvas);
  
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
      // Compute the camera's matrix using look at.
      var cameraPosition = [0, 0, 100];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      var cameraMatrix = m4.lookAt(cameraPosition, target, up);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
  
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

      var sphereXRotation =  time;
      var sphereYRotation =  time;
      var cubeXRotation   = -time;
      var cubeYRotation   =  time;
      var coneXRotation   =  time;
      var coneYRotation   = -time;
  
      gl.useProgram(program);
  
      // ------ Draw the sphere --------

      // Setup all the needed attributes.
      gl.bindVertexArray(sphereVAO);

      sphereUniforms.u_matrix = computeMatrix(
          viewProjectionMatrix,
          sphereTranslation,
          sphereXRotation,
          sphereYRotation);
      
      // Set the uniforms we just computed
      twgl.setUniforms(uniformSetters, sphereUniforms);
      twgl.drawBufferInfo(gl, sphereBufferInfo);

      requestAnimationFrame(drawScene);
    }
    
  }
  
  useEffect(() => {
    main()
  },[])

  return (
    <>
      <canvas id="c"></canvas>
    </>
  )
}
