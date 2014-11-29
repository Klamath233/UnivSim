var canvas;
var gl;
var length = 0.5;
var time = 0.0;
var timeTexture1 = 0.0;
var timeTexture2 = 0.0;
var timer = new Timer();
var omega = 360;

var UNIFORM_mvpMatrix;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var UNIFORM_tMatrix;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;

var positionBuffer; 
var normalBuffer;

var myTexture;
var myTexture1;

var viewMatrix;
var projectionMatrix;
var mvpMatrix;
var translation;
var textureMatrix;

var shininess = 50;
var lightPosition = vec3(0.0, 0.0, 0.0);

var eye = vec3(0, 1.0, 1.8);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

// for smoother keyboard control.
var sampleRate = 600;
var iKeyDown = false;
var oKeyDown = false;
var rKeyToggle = false;
var tKeyToggle = false;
var sKeyToggle = false;

window.onload = function init() {
  canvas = document.getElementById( "main-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

  gl.enable(gl.DEPTH_TEST);

  vertices = [
      vec3(  length,   length, length ), //vertex 0
      vec3(  length,  -length, length ), //vertex 1
      vec3( -length,   length, length ), //vertex 2
      vec3( -length,  -length, length ),  //vertex 3 
      vec3(  length,   length, -length ), //vertex 4
      vec3(  length,  -length, -length ), //vertex 5
      vec3( -length,   length, -length ), //vertex 6
      vec3( -length,  -length, -length )  //vertex 7   
  ];

  var points = [];
  var normals = [];
  var uv = [];
  Cube(vertices, points, normals, uv);

  myTexture = gl.createTexture();
  myTexture.image = new Image();
  myTexture.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, myTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  myTexture.image.src = "res/img/ehlz_1x.jpg";

  myTexture1 = gl.createTexture();
  myTexture1.image = new Image();
  myTexture1.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, myTexture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myTexture1.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  myTexture1.image.src = "res/img/ehlz_0.5x.jpg";

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

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
  gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

  gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
  gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

  gl.bindBuffer( gl.ARRAY_BUFFER, uvBuffer );
  gl.vertexAttribPointer( ATTRIBUTE_uv, 2, gl.FLOAT, false, 0, 0 );


  UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
  UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
  UNIFORM_tMatrix = gl.getUniformLocation(program, "tMatrix");
  UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
  UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
  UNIFORM_sampler = gl.getUniformLocation(program, "uSampler");

  viewMatrix = lookAt(eye, at, up);
  projectionMatrix = perspective(90, 1, 0.001, 1000);
  translation = mat4();

  timer.reset();
  gl.enable(gl.DEPTH_TEST);

  window.addEventListener("keydown", function (e) {

    switch (e.keyCode) {
      case 73:
        iKeyDown = true;
        break;
      case 79:
        oKeyDown = true;
        break;
      case 82:
        rKeyToggle = !rKeyToggle;
        break;
      case 83:
        sKeyToggle = !sKeyToggle;
        break;
      case 84:
        tKeyToggle = !tKeyToggle;
        break;
      default:
    }
  }, false);

  window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
      case 73:
        iKeyDown = false;
        break;
      case 79:
        oKeyDown = false;
        break;
      default:
    }
  }, false);

  tick();
  render();
}

function tick() {
  if (iKeyDown) {
    translation = mult(translate(0.0, 0.0, 0.025), translation);
  } else if (oKeyDown) {
    translation = mult(translate(0.0, 0.0, -0.025), translation);
  }
  setTimeout(tick, 1/600);
}

function Cube(vertices, points, normals, uv) {
  Quad(vertices, points, normals, uv, 0, 1, 2, 3, vec3(0, 0, 1));
  Quad(vertices, points, normals, uv, 4, 0, 6, 2, vec3(0, 1, 0));
  Quad(vertices, points, normals, uv, 4, 5, 0, 1, vec3(1, 0, 0));
  Quad(vertices, points, normals, uv, 2, 3, 6, 7, vec3(1, 0, 1));
  Quad(vertices, points, normals, uv, 5, 4, 7, 6, vec3(0, 1, 1));
  Quad(vertices, points, normals, uv, 1, 5, 3, 7, vec3(1, 1, 0));
}

function Quad( vertices, points, normals, uv, v1, v2, v3, v4, normal) {

  normals.push(normal);
  normals.push(normal);
  normals.push(normal);
  normals.push(normal);
  normals.push(normal);
  normals.push(normal);

  uv.push(vec2(1,0));
  uv.push(vec2(0,0));
  uv.push(vec2(0,1));
  uv.push(vec2(1,0));
  uv.push(vec2(0,1));
  uv.push(vec2(1,1));

  points.push(vertices[v1]);
  points.push(vertices[v3]);
  points.push(vertices[v4]);
  points.push(vertices[v1]);
  points.push(vertices[v4]);
  points.push(vertices[v2]);
}

var SHADING_MODE = Object.freeze({
    FLAT: 0,
    GOURAUD: 1,
    PHONG: 2
});

function sphere(depth, vertices, normals, mode) {
  var va = vec4(0.0, 0.0, -1.0, 1.0);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);
  tetra(va, vb, vc, vd, depth, vertices, normals, mode);
}

function tetra(a, b, c, d, n, vertices, normals, mode) {
  divideTriangle(a, b, c, n, vertices, normals, mode);
  divideTriangle(a, c, d, n, vertices, normals, mode);
  divideTriangle(a, b, d, n, vertices, normals, mode);
  divideTriangle(b, c, d, n, vertices, normals, mode);
}

function divideTriangle(a, b, c, n, vertices, normals, mode) {
  if (n < 0) {
    throw "divideTriangle(): wrong argument.";
  } else if (n == 0) {
    triangle(a, b, c, vertices, normals, mode);
  } else {

    // We push the bisector to the unit sphere by normalize it.
    var ab = normalize(mix(a, b, 0.5), true);
    var ac = normalize(mix(a, c, 0.5), true);
    var bc = normalize(mix(b, c, 0.5), true);

    divideTriangle(a, ab, ac, n - 1, vertices);
    divideTriangle(ab, b, bc, n - 1, vertices);
    divideTriangle(ac, bc, c, n - 1, vertices);
    divideTriangle(ab, bc, ac, n - 1, vertices);
  }
}

function triangle(a, b, c, vertices, normals, mode) {
  vertices.push(a);
  vertices.push(b);
  vertices.push(c);

  if (mode == SHADING_MODE.FLAT) {
    var ab = subtract(b, a);
    var ac = subtract(b, c);
    var normal = cross(ab, ac);
    normal.push(0.0); // Making it homogeneous.
    normalize(normal, true);

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
  } else {
    var na = normalize(a, true);
    var nb = normalize(b, true);
    var nc = normalize(c, true);

    na[3] = 0;
    nb[3] = 0;
    nc[3] = 0;

    normals.push(na);
    normals.push(nb);
    normals.push(nc);
  }
}

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var dt = timer.getElapsedTime();
  if (rKeyToggle) {
    time += dt / 1000;
  }

  if (tKeyToggle) {
    timeTexture1 += dt / 1000;
  }

  if (sKeyToggle) {
    timeTexture2 += dt / 1000;
  }

  mvMatrix = mult(viewMatrix, translate(0.8, 0.0, 0.0));
  mvMatrix = mult(mvMatrix, rotate(time * omega, [0, 1, 0]));
  mvMatrix = mult(translation, mvMatrix);

  textureMatrix = rotate(timeTexture1 * omega, [0, 0, 1]);

  gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(UNIFORM_tMatrix, false, flatten(textureMatrix));

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, myTexture);

  gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
  gl.uniform1f(UNIFORM_shininess,  shininess);
  gl.uniform1i(UNIFORM_sampler, 0)

  gl.drawArrays( gl.TRIANGLES, 0, 36);

  mvMatrix = mult(viewMatrix, translate(-0.8, 0.0, 0.0));
  mvMatrix = mult(mvMatrix, rotate(time * omega / 2, [1, 0, 0]));
  mvMatrix = mult(translation, mvMatrix);

  scrolling = timeTexture2 * 2;
  textureMatrix = translate(0, scrolling, 0);

  gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
  gl.uniformMatrix4fv(UNIFORM_tMatrix, false, flatten(textureMatrix));

  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, myTexture1);

  gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
  gl.uniform1f(UNIFORM_shininess,  shininess);
  gl.uniform1i(UNIFORM_sampler, 1)

  gl.drawArrays( gl.TRIANGLES, 0, 36);

  window.requestAnimFrame( render );
}
