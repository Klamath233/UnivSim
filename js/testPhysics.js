var gl;
var canvas;
var program;
var model;
var view;
var projection;
var vertices;
var normals;
var ambientProd;
var diffuseProd;
var specularProd;
var lightPos;
var shininess;
var rotation;
var translation;
var omega;
var positionBuffer;
var normalBuffer;

var timer = new Timer();
var cd = true;

var sphere1 = {};
var sphere2 = {};

window.onload = function init() {

  canvas = document.getElementById("main-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.useProgram(program);

  initModels();
  initMaterial();
  initLight();
  initObjects();

  positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.enableVertexAttribArray(vPosition);

  var vNormal = gl.getAttribLocation(program, "vNormal");
  gl.enableVertexAttribArray(vNormal);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);

  tick();
}

function tick() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  dt = timer.getElapsedTime() / 1000;

  sphere1.x[0] += sphere1.v[0] * dt;
  sphere1.x[1] += sphere1.v[1] * dt;
  sphere1.x[2] += sphere1.v[2] * dt;
  sphere1.v[0] += sphere1.a[0] * dt;
  sphere1.v[1] += sphere1.a[1] * dt;
  sphere1.v[2] += sphere1.a[2] * dt;

  sphere2.x[0] += sphere2.v[0] * dt;
  sphere2.x[1] += sphere2.v[1] * dt;
  sphere2.x[2] += sphere2.v[2] * dt;
  sphere2.v[0] += sphere2.a[0] * dt;
  sphere2.v[1] += sphere2.a[1] * dt;
  sphere2.v[2] += sphere2.a[2] * dt;

  var dist2 = (sphere1.x[0] - sphere2.x[0]) * (sphere1.x[0] - sphere2.x[0]) +
              (sphere1.x[1] - sphere2.x[1]) * (sphere1.x[1] - sphere2.x[1]) +
              (sphere1.x[2] - sphere2.x[2]) * (sphere1.x[2] - sphere2.x[2]);

  var R2 = (sphere1.r + sphere2.r) * (sphere1.r + sphere2.r);

  if (dist2 <= R2 && cd == true) {
    var dist = Math.sqrt(dist2);
    var R = sphere1.r + sphere2.r;
    var dr = vec3(sphere2.x[0] - sphere1.x[0], sphere2.x[1] - sphere1.x[1], sphere2.x[2] - sphere1.x[2]);
    var dv = vec3(sphere2.v[0] - sphere1.v[0], sphere2.v[1] - sphere1.v[1], sphere2.v[2] - sphere1.v[2]);
    var J = 2 * sphere1.m * sphere2.m * dot(dr, dv) / (dist * (sphere1.m + sphere2.m));
    var j = vec3(J * dr[0] / dist, J * dr[1] / dist, J * dr[2] / dist);
    sphere1.v[0] = sphere1.v[0] + j[0] / sphere1.m;
    sphere1.v[1] = sphere1.v[1] + j[1] / sphere1.m;
    sphere1.v[2] = sphere1.v[2] + j[2] / sphere1.m;
    sphere2.v[0] = sphere2.v[0] - j[0] / sphere2.m;
    sphere2.v[1] = sphere2.v[1] - j[1] / sphere2.m;
    sphere2.v[2] = sphere2.v[2] - j[2] / sphere2.m;
    cd = false;
  } else if (dist2 > R2 && cd == false) {
    cd = true;
  }

  model = scaleMat(sphere1.r, sphere1.r, sphere1.r);
  model = mult(translate(sphere1.x), model);
  projection = perspective(90, 1, 0.001, 1000);
  view = lookAt(vec3(0.0, 0.0, 50.0),
                vec3(0.0, 0.0, 0.0),
                vec3(0.0, 1.0, 0.0));

  var lp = gl.getUniformLocation(program, "lp");
  var ap = gl.getUniformLocation(program, "ap");
  var dp = gl.getUniformLocation(program, "dp");
  var sp = gl.getUniformLocation(program, "sp");
  var m = gl.getUniformLocation(program, "m");
  var v = gl.getUniformLocation(program, "v");
  var pj = gl.getUniformLocation(program, "pj");
  var sn = gl.getUniformLocation(program, "sn");

  diffuseProd = vec4(0.3, 0.6, 0.9, 1.0);
  specularProd = vec4(0.3, 0.6, 0.9, 1.0);

  gl.uniform4fv(lp, flatten(lightPos));
  gl.uniform4fv(ap, flatten(ambientProd));
  gl.uniform4fv(dp, flatten(diffuseProd));
  gl.uniform4fv(sp, flatten(specularProd));
  gl.uniformMatrix4fv(m, false, flatten(model));
  gl.uniformMatrix4fv(v, false, flatten(view));
  gl.uniformMatrix4fv(pj, false, flatten(projection));
  gl.uniform1f(sn, shininess);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

  model = scaleMat(sphere2.r, sphere2.r, sphere2.r);
  model = mult(translate(sphere2.x), model);
  projection = perspective(90, 1, 0.001, 1000);
  view = lookAt(vec3(0.0, 0.0, 50.0),
                vec3(0.0, 0.0, 0.0),
                vec3(0.0, 1.0, 0.0));

  diffuseProd = vec4(0.9, 0.6, 0.3, 1.0);
  specularProd = vec4(0.9, 0.6, 0.3, 1.0);

  gl.uniform4fv(lp, flatten(lightPos));
  gl.uniform4fv(ap, flatten(ambientProd));
  gl.uniform4fv(dp, flatten(diffuseProd));
  gl.uniform4fv(sp, flatten(specularProd));
  gl.uniformMatrix4fv(m, false, flatten(model));
  gl.uniformMatrix4fv(v, false, flatten(view));
  gl.uniformMatrix4fv(pj, false, flatten(projection));
  gl.uniform1f(sn, shininess);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

  window.requestAnimationFrame(tick);
}

function initObjects() {
  sphere1.m = 3.0;
  sphere1.r = 3.0;
  sphere1.x = vec3(-50.0, 0.0, 0.0);
  sphere1.v = vec3(10.0, 0.0, 0.0);
  sphere1.a = vec3(0.0, 0.0, 0.0);

  sphere2.m = 1.0;
  sphere2.r = 1.0;
  sphere2.x = vec3(50.0, 1.0, 0);
  sphere2.v = vec3(-10.0, 0.0, 0.0);
  sphere2.a = vec3(0.0, 0.0, 0.0);
}

function initModels() {
  sphere(6, vertices, normals);
}

function initMaterial() {
  ambientProd = vec4(0.0, 0.0, 0.0, 1.0);
  diffuseProd = vec4(0.3, 0.6, 0.9, 1.0);
  specularProd = vec4(0.3, 0.6, 0.9, 1.0);
  shininess = 50.0;
}

function initLight() {
  lightPos = vec4(0.0, 0.0, 20.0, 1.0);
}

function sphere(depth) {
  vertices = [];
  normals = [];
  var va = vec4(0.0, 0.0, -1.0, 1.0);
  var vb = vec4(0.0, 0.942809, 0.333333, 1);
  var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
  var vd = vec4(0.816497, -0.471405, 0.333333, 1);

  tetra(va, vb, vc, vd, depth);
}

function tetra(a, b, c, d, n) {
  divideTriangle(a, b, d, n, vertices, normals);
  divideTriangle(b, c, d, n, vertices, normals);
  divideTriangle(a, c, b, n, vertices, normals);
  divideTriangle(a, d, c, n, vertices, normals);
}

function divideTriangle(a, b, c, n) {
  if (n < 0) {
    throw "divideTriangle(): wrong argument.";
  } else if (n == 0) {
    triangle(a, b, c, vertices, normals);
  } else {

    // We push the bisector to the unit sphere by normalize it.
    var ab = normalize(mix(a, b, 0.5), true);
    var ac = normalize(mix(a, c, 0.5), true);
    var bc = normalize(mix(b, c, 0.5), true);

    divideTriangle(a, ab, ac, n - 1, vertices, normals);
    divideTriangle(ab, b, bc, n - 1, vertices, normals);
    divideTriangle(ac, bc, c, n - 1, vertices, normals);
    divideTriangle(ab, bc, ac, n - 1, vertices, normals);
  }
}

function triangle(a, b, c) {
  vertices.push(a);
  vertices.push(b);
  vertices.push(c);

  var na = vec4(a[0], a[1], a[2], 0.0);
  var nb = vec4(b[0], b[1], b[2], 0.0);
  var nc = vec4(c[0], c[1], c[2], 0.0);

  normals.push(na);
  normals.push(nb);
  normals.push(nc);
}