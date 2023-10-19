function createShader(gl, type, source) {
    var shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (success) {
    return shader
    }
    
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
    return program;
    }

    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    return undefined;
}

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

// Returns a random integer from 0 to range - 1.
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl,x,y,width,height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

// Set a very specific triangle
function setTriangle(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
             0, -100,
           150,  125,
          -175,  100]),
      gl.STATIC_DRAW);
}

function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          // left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,
      ]),
      gl.STATIC_DRAW);
}

function setColors(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Uint8Array([
           // left column front
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
   
             // top rung front
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
   
             // middle rung front
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
           200,  70, 120,
   
             // left column back
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
   
             // top rung back
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
   
             // middle rung back
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
           80, 70, 200,
   
             // top
           70, 200, 210,
           70, 200, 210,
           70, 200, 210,
           70, 200, 210,
           70, 200, 210,
           70, 200, 210,
   
             // top rung right
           200, 200, 70,
           200, 200, 70,
           200, 200, 70,
           200, 200, 70,
           200, 200, 70,
           200, 200, 70,
   
             // under top rung
           210, 100, 70,
           210, 100, 70,
           210, 100, 70,
           210, 100, 70,
           210, 100, 70,
           210, 100, 70,
   
             // between top rung and middle
           210, 160, 70,
           210, 160, 70,
           210, 160, 70,
           210, 160, 70,
           210, 160, 70,
           210, 160, 70,
   
             // top of middle rung
           70, 180, 210,
           70, 180, 210,
           70, 180, 210,
           70, 180, 210,
           70, 180, 210,
           70, 180, 210,
   
             // right of middle rung
           100, 70, 210,
           100, 70, 210,
           100, 70, 210,
           100, 70, 210,
           100, 70, 210,
           100, 70, 210,
   
             // bottom of middle rung.
           76, 210, 100,
           76, 210, 100,
           76, 210, 100,
           76, 210, 100,
           76, 210, 100,
           76, 210, 100,
   
             // right of bottom
           140, 210, 80,
           140, 210, 80,
           140, 210, 80,
           140, 210, 80,
           140, 210, 80,
           140, 210, 80,
   
             // bottom
           90, 130, 110,
           90, 130, 110,
           90, 130, 110,
           90, 130, 110,
           90, 130, 110,
           90, 130, 110,
   
             // left side
           160, 160, 220,
           160, 160, 220,
           160, 160, 220,
           160, 160, 220,
           160, 160, 220,
           160, 160, 220,
      ]),
      gl.STATIC_DRAW);
}

export {createShader, createProgram, resizeCanvasToDisplaySize, randomInt, setRectangle, setTriangle, setColors, setGeometry}