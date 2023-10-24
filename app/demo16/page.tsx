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

    // create some triangles
    /*
    var arrays = {
      position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
      //texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
      normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
      indices:  { numComponents: 3, data: [0, 2, 1, 1, 2, 3],                       },     //the indices needs to run in clockwise direction
    };
    */
    var arrays = {
      position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
      normal:   [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      indices:  [0, 2, 1, 1, 2, 3],
    };
    var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    // setup GLSL program
    var program = twgl.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    var uniformSetters = twgl.createUniformSetters(gl, program);
    var attribSetters  = twgl.createAttributeSetters(gl, program);

    //var programInfo = twgl.createProgramInfo(gl, ["vertexshader", "fragmentshader"]);

    //var vao = twgl.createVAOAndSetAttributes(gl, attribSetters, attribs, buffers.indices);
    //var vao = twgl.createVAOFromBufferInfo(gl, attribSetters, bufferInfo);
    var vao = twgl.createVAOFromBufferInfo(gl, attribSetters, bufferInfo);

    function degToRad(d) {
      return d * Math.PI / 180;
    }
  
    var fieldOfViewRadians = degToRad(60);
  
    var uniformsThatAreTheSameForAllObjects = {
      u_lightWorldPos:         [-50, 30, 100],
      u_viewInverse:           m4.identity(),
      u_lightColor:            [1, 1, 1, 1],
    };
  
    var uniformsThatAreComputedForEachObject = {
      u_worldViewProjection:   m4.identity(),
      u_world:                 m4.identity(),
      u_worldInverseTranspose: m4.identity(),
    };
  
    var rand = function(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return min + Math.random() * (max - min);
    };
  
    var randInt = function(range) {
      return Math.floor(Math.random() * range);
    };
  
    var objects = [];
    var numObjects = 300;
    var baseColor = rand(240);
    for (var ii = 0; ii < numObjects; ++ii) {
      objects.push({
        radius: rand(0,150),
        xRotation: rand(0,Math.PI * 2),
        yRotation: rand(0,Math.PI),
        materialUniforms: {
          //u_colorMult:             chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
          u_diffuse:               [1, 0 ,0, 1],
          u_specular:              [1, 1, 1, 1],
          u_shininess:             rand(0,500),
          u_specularFactor:        rand(0,1),
        },
      });
    }
  
    requestAnimationFrame(drawScene);
  
    // Draw the scene.
    function drawScene(time) {
      time = 5 + time * 0.0001;
  
      twgl.resizeCanvasToDisplaySize(gl.canvas);
  
      // Tell WebGL how to convert from clip space to pixels
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);
  
      // Compute the projection matrix
      var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      var projectionMatrix =
          m4.perspective(fieldOfViewRadians, aspect, 1, 2000);
  
      // Compute the camera's matrix using look at.
      var cameraPosition = [0, 0, 100];
      var target = [0, 0, 0];
      var up = [0, 1, 0];
      var cameraMatrix = m4.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);
  
      // Make a view matrix from the camera matrix.
      var viewMatrix = m4.inverse(cameraMatrix);
  
      var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
  
      gl.useProgram(program);
  
      // Setup all the needed attributes.
      gl.bindVertexArray(vao);
  
      // Set the uniforms that are the same for all objects.
      twgl.setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);
  
      // Draw objects
      objects.forEach(function(object) {
  
        // Compute a position for this object based on the time.
        var worldMatrix = m4.identity();
        worldMatrix = m4.yRotate(worldMatrix, object.yRotation * time);
        worldMatrix = m4.xRotate(worldMatrix, object.xRotation * time);
        worldMatrix = m4.translate(worldMatrix, 0, 0, object.radius,uniformsThatAreComputedForEachObject.u_world);
  
        // Multiply the matrices.
        m4.multiply(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
        m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);
  
        // Set the uniforms we just computed
        twgl.setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);
  
        // Set the uniforms that are specific to the this object.
        twgl.setUniforms(uniformSetters, object.materialUniforms);
  
        // Draw the geometry.
        gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
      });
  
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
