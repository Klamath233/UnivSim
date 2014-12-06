var canvas;
var gl;
var points;
var normals;
var uv;
var indices;
var myTexture;
var time = 0.0;
var timer = new Timer();
var omega = 40;

var UNIFORM_mvpMatrix;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var viewMatrix;
var projectionMatrix;
var mvpMatrix;

var shininess = 50;
var lightPosition = vec3(0.0, 0.0, 0.0);

var eye = vec3(0, 1.0, 1.8);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

var positionBuffer;
var normalBuffer;
var uvBuffer;
var indexBuffer;

window.onload = function init() {
  canvas = document.getElementById('main-canvas');
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert('WebGL isn\'t available.');
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  sphere = sphereMesh(36);

  points = sphere.points;
  normals = sphere.normals;
  uv = sphere.texCoords;
  indices = sphere.indices;

  myTexture = gl.createTexture();
  myTexture.image = new Image();
  myTexture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, myTexture);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  myTexture.image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture.image.src = 'res/img/earthmap1k.jpg';

  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);

  indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  ATTRIBUTE_position = gl.getAttribLocation(program, 'vPosition');
  gl.enableVertexAttribArray(ATTRIBUTE_position);

  ATTRIBUTE_normal = gl.getAttribLocation(program, 'vNormal');
  gl.enableVertexAttribArray(ATTRIBUTE_normal);

  ATTRIBUTE_uv = gl.getAttribLocation(program, 'vUV');
  gl.enableVertexAttribArray(ATTRIBUTE_uv);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.vertexAttribPointer(ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0);

  UNIFORM_mvMatrix = gl.getUniformLocation(program, 'mvMatrix');
  UNIFORM_pMatrix = gl.getUniformLocation(program, 'pMatrix');
  UNIFORM_lightPosition = gl.getUniformLocation(program, 'lightPosition');
  UNIFORM_shininess = gl.getUniformLocation(program, 'shininess');
  UNIFORM_sampler = gl.getUniformLocation(program, 'uSampler');

  viewMatrix = lookAt(eye, at, up);
  projectionMatrix = perspective(90, 1, 0.001, 1000);

  timer.reset();
  gl.enable(gl.DEPTH_TEST);

  render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    time += timer.getElapsedTime() / 1000;

    mvMatrix = mult(viewMatrix, rotate(time * omega, [0, 1, 0]));

    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.uniform3fv(UNIFORM_lightPosition, flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess, shininess);
    gl.uniform1i(UNIFORM_sampler, 0);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    window.requestAnimFrame(render);
}

// Generate mesh for a unit sphere.
function sphereMesh(numBands) {
  var pointArray = new Array(); // point data. [x, y, z, x, y, z...]
  var normalArray = new Array(); // normal data. [x, y, z, x, y, z...]
  var texArray = new Array(); // texture coordinate data. [u, v, u, v...]
  var indexArray = new Array(); // index data. [i, i, i ,i...]

  // The function will generate the mesh using spherical coorditates.
  // x, y, z is functions of phi and theta.
  // phi is defined from 0 to PI and theta from 0 to 2PI.
  // z = sin(phi) cos(theta)
  // x = sin(phi) sin(theta)
  // y = cos(phi)

  // Texture coordinates can also be represented by phi and theta.
  // s = phi / PI
  // t = theta / 2PI

  var x, y, z;
  var s, t;
  var phi, theta;
  for (var i = 0; i <= numBands; i++) {
    phi = i * Math.PI / numBands;
    for (var j = 0; j <= numBands; j++) {
      theta = j * 2.0 * Math.PI / numBands;

      z = Math.sin(phi) * Math.cos(theta);
      x = Math.sin(phi) * Math.sin(theta);
      y = Math.cos(phi);

      pointArray.push(x);
      pointArray.push(y);
      pointArray.push(z);

      normalArray.push(x);
      normalArray.push(y);
      normalArray.push(z);

      t = phi / Math.PI;
      s = theta / (2 * Math.PI);

      texArray.push(s);
      texArray.push(t);
    }
  }

  // Then the function generate indices for drawing triangles.
  // Each quad will be drawn as two triangles, top-left and bottom-right.
  for (var i = 0; i < numBands; i++) {
    for (var j = 0; j < numBands; j++) {

      // index for top-left, top-right, bot-left and bot-right points.
      var tl = (i * (numBands + 1)) + j;
      var tr = tl + 1;
      var bl = tl + numBands + 1;
      var br = bl + 1;

      indexArray.push(tl);
      indexArray.push(bl);
      indexArray.push(br);

      indexArray.push(tl);
      indexArray.push(br);
      indexArray.push(tr);
    }
  }

  return {
    points: new Float32Array(pointArray),
    normals: new Float32Array(normalArray),
    texCoords: new Float32Array(texArray),
    indices: new Uint16Array(indexArray)
  };
}

