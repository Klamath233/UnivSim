var canvas;
var gl;
var points;
var normals;
var uv;
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

window.onload = function init() {
  canvas = document.getElementById("main-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available.");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  points = new Array();
  normals = new Array();
  uv = new Array();

  sphere(2, points, normals, uv);

  myTexture = gl.createTexture();
  myTexture.image = new Image();
  myTexture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, myTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
  myTexture.image.src = "res/img/ehlz_1x.jpg";

  var program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  positionBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  normalBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

  uvBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(uv), gl.STATIC_DRAW );

  ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
  gl.enableVertexAttribArray( ATTRIBUTE_position );

  ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
  gl.enableVertexAttribArray( ATTRIBUTE_normal );

  ATTRIBUTE_uv = gl.getAttribLocation( program, "vUV" );
  gl.enableVertexAttribArray( ATTRIBUTE_uv);

  gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
  gl.vertexAttribPointer( ATTRIBUTE_position, 4, gl.FLOAT, false, 0, 0 );

  gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
  gl.vertexAttribPointer( ATTRIBUTE_normal, 4, gl.FLOAT, false, 0, 0 );

  gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
  gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );

  UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
  UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
  UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
  UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
  UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");

  viewMatrix = lookAt(eye, at, up);
  projectionMatrix = perspective(90, 1, 0.001, 1000);

  timer.reset();
  gl.enable(gl.DEPTH_TEST);

  render();
}

function sphere(d, v, n, t) {
  var va = vec4(0.0, 0.0, -1.0, 1);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);
  tetra(va, vb, vc, vd, d, v, n, t);
}

function tetra(va, vb, vc, vd, d, v, n, t) {
  divideTriangle(va, vb, vc, d, v, n, t);
  divideTriangle(va, vc, vd, d, v, n, t);
  divideTriangle(va, vb, vd, d, v, n, t);
  divideTriangle(vb, vc, vd, d, v, n, t);
}

function divideTriangle(a, b, c, d, v, n, t) {
  if (d < 0) {
    throw "divideTriangle(): wrong argument.";
  } else if (d == 0) {
    triangle(a, b, c, v, n, t);
  } else {

    // We push the bisector to the unit sphere by normalize it.
    var ab = normalize(mix(a, b, 0.5), true);
    var ac = normalize(mix(a, c, 0.5), true);
    var bc = normalize(mix(b, c, 0.5), true);

    divideTriangle(a, ab, ac, d - 1, v, n, t);
    divideTriangle(ab, b, bc, d - 1, v, n, t);
    divideTriangle(ac, bc, c, d - 1, v, n, t);
    divideTriangle(ab, bc, ac, d - 1, v, n, t);
  }
}

function triangle(a, b, c, v, n, t) {
  v.push(a);
  v.push(b);
  v.push(c);

  var na = vec4(a[0], a[1], a[2], 0.0);
  var nb = vec4(b[0], b[1], b[2], 0.0);
  var nc = vec4(c[0], c[1], c[2], 0.0);

  n.push(na);
  n.push(nb);
  n.push(nc);

  tas = 0.5 + 0.5 * Math.atan2(a[2], a[0]) / Math.PI;
  tat = 0.5 + Math.asin(a[1]) / Math.PI;
  t.push(vec2(tas, tat));

  tbs = 0.5 + 0.5 * Math.atan2(b[2], b[0]) / Math.PI;
  tbt = 0.5 + Math.asin(b[1]) / Math.PI;
  t.push(vec2(tbs, tbt));

  tcs = 0.5 + 0.5 * Math.atan2(c[2], c[0]) / Math.PI;
  tct = 0.5 + Math.asin(c[1]) / Math.PI;
  t.push(vec2(tcs, tct));
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    time += timer.getElapsedTime() / 1000;

    mvMatrix = mult(viewMatrix, rotate(time * omega, [0, 1, 0]));

    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);

    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    gl.uniform1i(UNIFORM_sampler, 0)

    gl.drawArrays( gl.TRIANGLES, 0, points.length);

    window.requestAnimFrame( render );
}