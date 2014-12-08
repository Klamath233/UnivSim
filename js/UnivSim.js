var UnivSim = new Object(); // UnivSim is our program.
var UnivSimTest = new Object(); // test functions for our program.

UnivSim.init = function() {
  UnivSim.canvas = document.getElementById('canvas'); // get the canvas.
  UnivSim.gl = WebGLUtils.setupWebGL(UnivSim.canvas); // generate gl object.
  var gl = UnivSim.gl;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // WebGL support check.
  if (!UnivSim.gl) {
    alert("WebGL isn't available");
  }

  // Init navigation system.
  UnivSim.keys = new Object();
  UnivSim.keys.w = false; // 镜头前进
  UnivSim.keys.s = false; // 镜头后退
  UnivSim.keys.a = false; // 镜头左平移
  UnivSim.keys.d = false; // 镜头右平移
  UnivSim.keys.up = false; // 镜头上抬
  UnivSim.keys.down = false; // 镜头下摆
  UnivSim.keys.left = false; // 镜头左转
  UnivSim.keys.right = false; // 镜头右转

  // Init interaction system.
  UnivSim.pickedStar = null;
  var confirmButton = document.getElementById('cfm');
  confirmButton.addEventListener('click', function(e) {
    var x0 = document.getElementById('x0i').value.length == 0 ?
             parseFloat(document.getElementById('x0l').innerHTML) :
             parseFloat(document.getElementById('x0i').value);
    if (isNaN(x0)) {
      x0 = Math.random() * 20 - 10;
    }

    var x1 = document.getElementById('x1i').value.length == 0 ?
             parseFloat(document.getElementById('x1l').innerHTML) :
             parseFloat(document.getElementById('x1i').value);
    if (isNaN(x1)) {
      x1 = Math.random() * 20 - 10;
    }

    var x2 = document.getElementById('x2i').value.length == 0 ?
             parseFloat(document.getElementById('x2l').innerHTML) :
             parseFloat(document.getElementById('x2i').value);
    if (isNaN(x2)) {
      x2 = Math.random() * 20 - 10;
    }

    var v0 = document.getElementById('v0i').value.length == 0 ?
             parseFloat(document.getElementById('v0l').innerHTML) :
             parseFloat(document.getElementById('v0i').value);
    if (isNaN(v0)) {
      v0 = 0;
    }

    var v1 = document.getElementById('v1i').value.length == 0 ?
             parseFloat(document.getElementById('v1l').innerHTML) :
             parseFloat(document.getElementById('v1i').value);
    if (isNaN(v1)) {
      v1 = 0;
    }

    var v2 = document.getElementById('v2i').value.length == 0 ?
             parseFloat(document.getElementById('v2l').innerHTML) :
             parseFloat(document.getElementById('v2i').value);
    if (isNaN(v2)) {
      v2 = 0;
    }

    var a0 = document.getElementById('a0i').value.length == 0 ?
             parseFloat(document.getElementById('a0l').innerHTML) :
             parseFloat(document.getElementById('a0i').value);
    if (isNaN(a0)) {
      a0 = 0;
    }

    var a1 = document.getElementById('a1i').value.length == 0 ?
             parseFloat(document.getElementById('a1l').innerHTML) :
             parseFloat(document.getElementById('a1i').value);
    if (isNaN(a1)) {
      a1 = 0;
    }

    var a2 = document.getElementById('a2i').value.length == 0 ?
             parseFloat(document.getElementById('a2l').innerHTML) :
             parseFloat(document.getElementById('a2i').value);
    if (isNaN(a2)) {
      a2 = 0;
    }

    var m = document.getElementById('mi').value.length == 0 ?
             parseFloat(document.getElementById('ml').innerHTML) :
             parseFloat(document.getElementById('mi').value);
    if (isNaN(m)) {
      m = Math.random() * 100;
    }

    var r = document.getElementById('ri').value.length == 0 ?
             parseFloat(document.getElementById('rl').innerHTML) :
             parseFloat(document.getElementById('ri').value);
    if (isNaN(r)) {
      r = Math.random() * 5;
    }

    var x = new vec3(x0, x1, x2);
    var v = new vec3(v0, v1, v2);
    var a = new vec3(a0, a1, a2);

    if (!UnivSim.pickedStar) {
      var star = new Object();

      star.position = x;
      star.velocity = v;
      star.acceleration = a;
      star.mass = m == 0 ? Math.random() * 500 : m;
      star.radius = r == 0 ? Math.random() * 20 : r;
      star.texture = Math.round(Math.random() * (UnivSim.textures.length - 2));
      star.theta = 0.0;
      star.omega = Math.random() * 100;
      star.shininess = Math.random() * 500;
      star.axis = new vec3(Math.random() * 2 - 1,
                           Math.random() * 2 - 1,
                           Math.random() * 2 - 1);
      star.isLightSource = false;
      star.pickingColor = new vec4(0.0, 0.0,
                                   (UnivSim.stars.length + 1) / 255.0,
                                   1.0);

      UnivSim.stars.push(star);
      UnivSim.pickedStar = star;
    } else {
      UnivSim.pickedStar.position = x;
      UnivSim.pickedStar.velocity = v;
      UnivSim.pickedStar.acceleration = a;
      UnivSim.pickedStar.mass = m == 0 ? Math.random() * 500 : m;
      UnivSim.pickedStar.radius = r == 0 ? Math.random() * 20 : r;
    }


  });

  window.addEventListener('keydown', function(e) {

    switch (e.keyCode) {
      case 87:
        UnivSim.keys.w = true; // set the related key to true.
        break;
      case 83:
        UnivSim.keys.s = true; // set the related key to true.
        break;
      case 65:
        UnivSim.keys.a = true; // set the related key to true.
        break;
      case 68:
        UnivSim.keys.d = true; // set the related key to true.
        break;
      case 38:
        UnivSim.keys.up = true; // set the related key to true.
        break;
      case 40:
        UnivSim.keys.down = true; // set the related key to true.
        break;
      case 37:
        UnivSim.keys.left = true; // set the related key to true.
        break;
      case 39:
        UnivSim.keys.right = true; // set the related key to true.
        break;
      default:
    }
  }, false);

  window.addEventListener('keyup', function(e) {
    switch (e.keyCode) {
      case 87:
        UnivSim.keys.w = false;
        break;
      case 83:
        UnivSim.keys.s = false; // set the related key to true.
        break;
      case 65:
        UnivSim.keys.a = false; // set the related key to true.
        break;
      case 68:
        UnivSim.keys.d = false; // set the related key to true.
        break;
      case 38:
        UnivSim.keys.up = false; // set the related key to true.
        break;
      case 40:
        UnivSim.keys.down = false; // set the related key to true.
        break;
      case 37:
        UnivSim.keys.left = false; // set the related key to true.
        break;
      case 39:
        UnivSim.keys.right = false; // set the related key to true.
        break;
      default:
    }
  }, false);

  // Init WebGL programs.
  UnivSim.programs = new Object();
  UnivSim.programs.rendering = initShaders(gl,
                                           'vertex-shader',
                                           'fragment-shader');

  // Init stars data.
  UnivSim.stars = new Array(); // array for storing stars.
  UnivSimTest.fillStarsWithExample(UnivSim.stars); // fill in test data.
  // UnivSim.G = 0.00000000006673;
  UnivSim.G = 0.0001;

  // Init geometries.
  UnivSim.geometries = new Object();
  UnivSim.geometries.sphere = UnivSim.createSphereMesh(36);
  UnivSim.geometries.background = new Object();
  UnivSim.geometries.background.points = new Float32Array(
                                           [-1.0, 1.0, 0.0,
                                            -1.0, -1.0, 0.0,
                                            1.0, -1.0, 0.0,
                                            1.0, 1.0, 0.0]);
  UnivSim.geometries.background.normals = new Float32Array(
                                            [0.0, 0.0, 1.0,
                                             0.0, 0.0, 1.0,
                                             0.0, 0.0, 1.0,
                                             0.0, 0.0, 1.0]);
  UnivSim.geometries.background.texCoords = new Float32Array(
                                              [0.0, 1.0,
                                               0.0, 0.0,
                                               1.0, 0.0,
                                               1.0, 1.0]);
  UnivSim.geometries.background.indices = new Uint16Array(
                                              [0,
                                               1,
                                               2,
                                               0,
                                               2,
                                               3]);


  // Init texture data.
  UnivSim.textures = new Array();
  UnivSim.loadTexture();

  // Buffer data.
  UnivSim.buffers = new Object();
  UnivSim.buffers.positionBuffer = gl.createBuffer();
  UnivSim.buffers.normalBuffer = gl.createBuffer();
  UnivSim.buffers.uvBuffer = gl.createBuffer();
  UnivSim.buffers.indexBuffer = gl.createBuffer();
  UnivSim.buffers.bgPositionBuffer = gl.createBuffer();
  UnivSim.buffers.bgNormalBuffer = gl.createBuffer();
  UnivSim.buffers.bgUVBuffer = gl.createBuffer();
  UnivSim.buffers.bgIndexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.sphere.points,
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.sphere.normals,
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.sphere.texCoords,
                gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, UnivSim.buffers.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                UnivSim.geometries.sphere.indices,
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.background.points,
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.background.normals,
                gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgUVBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, UnivSim.geometries.background.texCoords,
                gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, UnivSim.buffers.bgIndexBuffer);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                UnivSim.geometries.background.indices,
                gl.STATIC_DRAW);

  // Init vertex attribute pointers.
  var program = UnivSim.programs.rendering;

  UnivSim.attributes = new Object();
  UnivSim.attributes.position = gl.getAttribLocation(program, 'vPosition');
  gl.enableVertexAttribArray(UnivSim.attributes.position);
  UnivSim.attributes.normal = gl.getAttribLocation(program, 'vNormal');
  gl.enableVertexAttribArray(UnivSim.attributes.normal);
  UnivSim.attributes.uv = gl.getAttribLocation(program, 'vUV');
  gl.enableVertexAttribArray(UnivSim.attributes.uv);


  // Init uniforms pointers.
  UnivSim.uniforms = new Object();
  UnivSim.uniforms.mMatrix = gl.getUniformLocation(program, 'mMatrix');
  UnivSim.uniforms.vMatrix = gl.getUniformLocation(program, 'vMatrix');
  UnivSim.uniforms.pMatrix = gl.getUniformLocation(program, 'pMatrix');
  UnivSim.uniforms.lightPosition = gl.getUniformLocation(program,
                                                         'lightPosition');
  UnivSim.uniforms.shininess = gl.getUniformLocation(program, 'shininess');
  UnivSim.uniforms.sampler = gl.getUniformLocation(program, 'uSampler');
  UnivSim.uniforms.isLight = gl.getUniformLocation(program, 'isLight');
  UnivSim.uniforms.isBackground = gl.getUniformLocation(program,
                                                        'isBackground');
  UnivSim.uniforms.isPicking = gl.getUniformLocation(program, 'isPicking');
  UnivSim.uniforms.pickingColor = gl.getUniformLocation(program,
                                                        'pickingColor');

  // Init camera.
  UnivSim.camera = new Object();
  UnivSim.camera.eye = new vec3(0.0, 0.0, 1.8);
  UnivSim.camera.at = new vec3(0.0, 0.0, 0.0);
  UnivSim.camera.up = new vec3(0.0, 1.0, 0.0);
  UnivSim.camera.viewMatrix = lookAt(UnivSim.camera.eye,
                                     UnivSim.camera.at,
                                     UnivSim.camera.up);
  UnivSim.camera.projectionMatrix = perspective(90, 1, 0.001, 1000);

  // Init timer;
  UnivSim.timer = new Timer();
  UnivSim.timer.reset();

  // Init Picking
  var pickingTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, pickingTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height,
                0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.generateMipmap(gl.TEXTURE_2D);
  UnivSim.pickingFBO = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, UnivSim.pickingFBO);
  var renderbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16,
                         canvas.width, canvas.height);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                          gl.TEXTURE_2D, pickingTexture, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                             gl.RENDERBUFFER, renderbuffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  UnivSim.canvas.addEventListener('mousedown', UnivSim.pickingHandler);

  console.log(UnivSim);
  UnivSim.tick();

};

UnivSim.pickingHandler = function(event) {
  UnivSim.timer.pause();
  var gl = UnivSim.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, UnivSim.pickingFBO);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for (var i = 0; i < UnivSim.stars.length; i++) {
    var star = UnivSim.stars[i];
    gl.uniform1i(UnivSim.uniforms.isPicking, 1);

    var model = scaleMat(star.radius, star.radius, star.radius);
    model = mult(rotate(star.theta, star.axis), model);
    model = mult(translate(star.position), model);
    var view = UnivSim.camera.viewMatrix;
    var projection = UnivSim.camera.projectionMatrix;

    gl.uniformMatrix4fv(UnivSim.uniforms.mMatrix,
                        false,
                        flatten(model));
    gl.uniformMatrix4fv(UnivSim.uniforms.vMatrix,
                        false,
                        flatten(view));
    gl.uniformMatrix4fv(UnivSim.uniforms.pMatrix,
                        false,
                        flatten(projection));
    gl.uniform4fv(UnivSim.uniforms.pickingColor,
                  flatten(star.pickingColor));

    gl.drawElements(gl.TRIANGLES,
                    UnivSim.geometries.sphere.indices.length,
                    gl.UNSIGNED_SHORT,
                    0);

  }
  var x = event.clientX;
  var y = canvas.height - event.clientY;
  var color = new Uint8Array(4);
  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, color);
  UnivSim.pickedStar = UnivSim.stars[Math.round(color[2]) - 1];
  UnivSim.timer.unpause();
};

UnivSim.tick = function() {

  var dt = UnivSim.timer.getElapsedTime() / 1000.0;
  var gl = UnivSim.gl;

  // Update UI information.
  if (UnivSim.pickedStar) {
    document.getElementById('x0l').innerHTML =
                                   UnivSim.pickedStar.position[0];
    document.getElementById('x1l').innerHTML =
                                   UnivSim.pickedStar.position[1];
    document.getElementById('x2l').innerHTML =
                                   UnivSim.pickedStar.position[2];
    document.getElementById('v0l').innerHTML =
                                   UnivSim.pickedStar.velocity[0];
    document.getElementById('v1l').innerHTML =
                                   UnivSim.pickedStar.velocity[1];
    document.getElementById('v2l').innerHTML =
                                   UnivSim.pickedStar.velocity[2];
    document.getElementById('a0l').innerHTML =
                                   UnivSim.pickedStar.acceleration[0];
    document.getElementById('a1l').innerHTML =
                                   UnivSim.pickedStar.acceleration[1];
    document.getElementById('a2l').innerHTML =
                                   UnivSim.pickedStar.acceleration[2];
    document.getElementById('ml').innerHTML =
                                   UnivSim.pickedStar.mass;
    document.getElementById('rl').innerHTML =
                                   UnivSim.pickedStar.radius;
  } else {
    document.getElementById('x0l').innerHTML = '';
    document.getElementById('x1l').innerHTML = '';
    document.getElementById('x2l').innerHTML = '';
    document.getElementById('v0l').innerHTML = '';
    document.getElementById('v1l').innerHTML = '';
    document.getElementById('v2l').innerHTML = '';
    document.getElementById('a0l').innerHTML = '';
    document.getElementById('a1l').innerHTML = '';
    document.getElementById('a2l').innerHTML = '';
    document.getElementById('ml').innerHTML = '';
    document.getElementById('rl').innerHTML = '';
  }
  // Update view matrix according to key pressed.
  if (UnivSim.keys.w == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(translate(0.0, 0.0, dt * 10),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.s == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(translate(0.0, 0.0, -dt * 10),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.a == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(translate(dt * 10, 0.0, 0.0),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.d == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(translate(-dt * 10, 0.0, 0.0),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.up == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(rotate(-dt * 30, [1, 0, 0]),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.down == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(rotate(dt * 30, [1, 0, 0]),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.left == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(rotate(-dt * 30, [0, 1, 0]),
                                     UnivSim.camera.viewMatrix);
  }
  if (UnivSim.keys.right == true) {
    console.log('hello');
    UnivSim.camera.viewMatrix = mult(rotate(dt * 30, [0, 1, 0]),
                                     UnivSim.camera.viewMatrix);
  }

  // Update sphere parameters.
  var sphere1 = new Object();
  var sphere2 = new Object();

  for (var i = 0; i < UnivSim.stars.length; i++) {
    sphere1.x = UnivSim.stars[i].position;
    sphere1.v = UnivSim.stars[i].velocity;
    sphere1.a = UnivSim.stars[i].acceleration;
    sphere1.x[0] += sphere1.v[0] * dt;
    sphere1.x[1] += sphere1.v[1] * dt;
    sphere1.x[2] += sphere1.v[2] * dt;
    sphere1.v[0] += sphere1.a[0] * dt;
    sphere1.v[1] += sphere1.a[1] * dt;
    sphere1.v[2] += sphere1.a[2] * dt;

    UnivSim.stars[i].theta += UnivSim.stars[i].omega * dt;
  }

  for (var i = 0; i < UnivSim.stars.length; i++) {
    sphere1.x = UnivSim.stars[i].position;
    sphere1.v = UnivSim.stars[i].velocity;
    sphere1.a = UnivSim.stars[i].acceleration;
    sphere1.m = UnivSim.stars[i].mass;
    sphere1.r = UnivSim.stars[i].radius;
    for (var j = i + 1; j < UnivSim.stars.length; j++) {
      sphere2.x = UnivSim.stars[j].position;
      sphere2.v = UnivSim.stars[j].velocity;
      sphere2.a = UnivSim.stars[j].acceleration;
      sphere2.m = UnivSim.stars[j].mass;
      sphere2.r = UnivSim.stars[j].radius;

      var dist2 = (sphere1.x[0] - sphere2.x[0]) *
                  (sphere1.x[0] - sphere2.x[0]) +
                  (sphere1.x[1] - sphere2.x[1]) *
                  (sphere1.x[1] - sphere2.x[1]) +
                  (sphere1.x[2] - sphere2.x[2]) *
                  (sphere1.x[2] - sphere2.x[2]);

      var R2 = (sphere1.r + sphere2.r) * (sphere1.r + sphere2.r);

      if (dist2 <= R2) {
        var dist = Math.sqrt(dist2);
        var R = sphere1.r + sphere2.r;
        var dr = vec3(sphere2.x[0] - sphere1.x[0],
                      sphere2.x[1] - sphere1.x[1],
                      sphere2.x[2] - sphere1.x[2]);
        var dv = vec3(sphere2.v[0] - sphere1.v[0],
                      sphere2.v[1] - sphere1.v[1],
                      sphere2.v[2] - sphere1.v[2]);
        var J = 2 * sphere1.m * sphere2.m * dot(dr, dv) /
                    (dist * (sphere1.m + sphere2.m));
        var j = vec3(J * dr[0] / dist, J * dr[1] / dist, J * dr[2] / dist);
        sphere1.v[0] = sphere1.v[0] + j[0] / sphere1.m;
        sphere1.v[1] = sphere1.v[1] + j[1] / sphere1.m;
        sphere1.v[2] = sphere1.v[2] + j[2] / sphere1.m;
        sphere2.v[0] = sphere2.v[0] - j[0] / sphere2.m;
        sphere2.v[1] = sphere2.v[1] - j[1] / sphere2.m;
        sphere2.v[2] = sphere2.v[2] - j[2] / sphere2.m;
      }
    }
  }

  // Update the accelerations according to the force on stars.
  for (var i = 0; i < UnivSim.stars.length; i++) {
    var starToUpdate = UnivSim.stars[i];
    starToUpdate.acceleration = new vec3();
    for (var j = 0; j < UnivSim.stars.length; j++) {
      var star = UnivSim.stars[j];
      if (i != j) {
        var dist2 = (starToUpdate.position[0] - star.position[0]) *
                    (starToUpdate.position[0] - star.position[0]) +
                    (starToUpdate.position[1] - star.position[1]) *
                    (starToUpdate.position[1] - star.position[1]) +
                    (starToUpdate.position[2] - star.position[2]) *
                    (starToUpdate.position[2] - star.position[2]);
        var direction = subtract(star.position, starToUpdate.position);
        direction = normalize(direction, false);
        var factor = UnivSim.G * star.mass / dist2;
        direction = scaleVec(factor, direction);
        starToUpdate.acceleration = add(starToUpdate.acceleration, direction);
      }
    }
  }

  // We assume there is always one light source.
  var lightStar;
  for (var i = 0; i < UnivSim.stars.length; i++) {
    if (UnivSim.stars[i].isLightSource) {
      lightStar = UnivSim.stars[i];
      break;
    }
  }

  if (!lightStar) {
    alert('No light!');
  } else {
    gl.useProgram(UnivSim.programs.rendering);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw background.
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgPositionBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.position,
                           3,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgNormalBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.bgUVBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, UnivSim.buffers.bgIndexBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1i(UnivSim.uniforms.isPicking, 0);
    gl.uniform1i(UnivSim.uniforms.isBackground, 1);
    gl.uniform1i(UnivSim.uniforms.sampler, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, UnivSim.textures[0]);
    gl.drawElements(gl.TRIANGLES,
                    UnivSim.geometries.background.indices.length,
                    gl.UNSIGNED_SHORT,
                    0);

    // Draw stars.
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.positionBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.position,
                           3,
                           gl.FLOAT,
                           false,
                           0,
                           0);
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.normalBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.normal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, UnivSim.buffers.uvBuffer);
    gl.vertexAttribPointer(UnivSim.attributes.uv, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, UnivSim.buffers.indexBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.enable(gl.DEPTH_TEST);
    for (var i = 0; i < UnivSim.stars.length; i++) {
      var star = UnivSim.stars[i];
      gl.uniform1i(UnivSim.uniforms.isPicking, 0);
      gl.uniform3fv(UnivSim.uniforms.lightPosition,
                    flatten(lightStar.position));
      gl.uniform1f(UnivSim.uniforms.shininess,
                    star.shininess);
      gl.uniform1i(UnivSim.uniforms.sampler,
                   star.texture);
      gl.uniform1i(UnivSim.uniforms.isBackground, 0);
      if (star.isLightSource) {
        gl.uniform1i(UnivSim.uniforms.isLight,
                     1);
      } else {
        gl.uniform1i(UnivSim.uniforms.isLight,
                     0);
      }

      var model = scaleMat(star.radius, star.radius, star.radius);
      model = mult(rotate(star.theta, star.axis), model);
      model = mult(translate(star.position), model);
      var view = UnivSim.camera.viewMatrix;
      var projection = UnivSim.camera.projectionMatrix;

      gl.uniformMatrix4fv(UnivSim.uniforms.mMatrix,
                          false,
                          flatten(model));
      gl.uniformMatrix4fv(UnivSim.uniforms.vMatrix,
                          false,
                          flatten(view));
      gl.uniformMatrix4fv(UnivSim.uniforms.pMatrix,
                          false,
                          flatten(projection));

      gl.activeTexture(gl.TEXTURE0 + star.texture);
      gl.bindTexture(gl.TEXTURE_2D, UnivSim.textures[star.texture]);
      gl.drawElements(gl.TRIANGLES,
                      UnivSim.geometries.sphere.indices.length,
                      gl.UNSIGNED_SHORT,
                      0);
    }
  }

  window.requestAnimFrame(UnivSim.tick);
};

UnivSimTest.fillStarsWithExample = function(arr) {
  var star1 = new Object();
  var star2 = new Object();
  var star3 = new Object();
  var star4 = new Object();

  star1.position = new vec3(1.0, 1.0, 0.0);
  star1.velocity = new vec3(0.0, 0.0, 0.0);
  star1.acceleration = new vec3(0.0, 0.0, 0.0);
  star1.mass = 10000.0;
  star1.radius = 0.2;
  star1.texture = 1;
  star1.theta = 0.0;
  star1.omega = 40.0;
  star1.shininess = 50;
  star1.axis = new vec3(-1.0, 1.0, 0.0);
  star1.isLightSource = true;
  star1.lightAmbient = new vec4(1.0, 1.0, 1.0, 1.0);
  star1.lightDiffuse = new vec4(1.0, 1.0, 1.0, 1.0);
  star1.lightSpecular = new vec4(1.0, 1.0, 1.0, 1.0);
  star1.pickingColor = new vec4(0.0, 0.0, 1 / 255.0, 1.0);

  star2.position = new vec3(-1.0, 1.0, 0.0);
  star2.velocity = new vec3(0.0, -0.0, 0.0);
  star2.acceleration = new vec3(0.0, 0.0, 0.0);
  star2.mass = 1.0;
  star2.radius = 0.2;
  star2.texture = 2;
  star2.theta = 0.0;
  star2.omega = 5.0;
  star2.shininess = 50;
  star2.axis = new vec3(0.0, 1.0, 0.0);
  star2.isLightSource = false;
  star2.pickingColor = new vec4(0.0, 0.0, 2 / 255.0, 1.0);

  star3.position = new vec3(-1.0, -1.0, 0.0);
  star3.velocity = new vec3(0.2, 0.1, 0.0);
  star3.acceleration = new vec3(0.0, 0.0, 0.0);
  star3.mass = 1.0;
  star3.radius = 0.2;
  star3.texture = 3;
  star3.theta = 0.0;
  star3.omega = 5.0;
  star3.shininess = 50;
  star3.axis = new vec3(0.0, 1.0, 0.0);
  star3.isLightSource = false;
  star3.pickingColor = new vec4(0.0, 0.0, 3 / 255.0, 1.0);

  star4.position = new vec3(1.0, -1.0, 0.0);
  star4.velocity = new vec3(-0.1, 0.2, 0.0);
  star4.acceleration = new vec3(0.0, 0.0, 0.0);
  star4.mass = 1.0;
  star4.radius = 0.2;
  star4.texture = 15;
  star4.theta = 0.0;
  star4.omega = 5.0;
  star4.shininess = 50;
  star4.axis = new vec3(0.0, 1.0, 0.0);
  star4.isLightSource = false;
  star4.pickingColor = new vec4(0.0, 0.0, 4 / 255.0, 1.0);

  arr.push(star1);
  arr.push(star2);
  arr.push(star3);
  arr.push(star4);
};


UnivSimTest.fillTexturesWithExample = function(arr) {
  var gl = UnivSim.gl;

  var myTexture0 = gl.createTexture();
  myTexture0.image = new Image();
  myTexture0.image.onload = function() {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture0);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  myTexture0.image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture0.image.src = 'res/img/pure-milky-way.jpg';
  arr.push(myTexture0);

  var myTexture1 = gl.createTexture();
  myTexture1.image = new Image();
  myTexture1.image.onload = function() {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, myTexture1);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  myTexture1.image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture1.image.src = 'res/img/earthmap1k.jpg';
  arr.push(myTexture1);

  var myTexture2 = gl.createTexture();
  myTexture2.image = new Image();
  myTexture2.image.onload = function() {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, myTexture2);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  myTexture2.image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture2.image.src = 'res/img/jupitermap.jpg';
  arr.push(myTexture2);

  var myTexture3 = gl.createTexture();
  myTexture3.image = new Image();
  myTexture3.image.onload = function() {
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, myTexture3);
    gl.texImage2D(gl.TEXTURE_2D,
                  0,
                  gl.RGBA,
                  gl.RGBA,
                  gl.UNSIGNED_BYTE,
                  myTexture3.image);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture3.image.src = 'res/img/ehlz_1x.jpg';
  arr.push(myTexture3);
};

UnivSim.loadTexture = function() {
  UnivSim.loadTextureHelper('res/img/pure-milky-way.jpg');
  UnivSim.loadTextureHelper('res/img/sunmap.jpg');
  UnivSim.loadTextureHelper('res/img/mercurymap.jpg');
  UnivSim.loadTextureHelper('res/img/venusmap.jpg');
  UnivSim.loadTextureHelper('res/img/earthmap.jpg');
  UnivSim.loadTextureHelper('res/img/jupitermap.jpg');
  UnivSim.loadTextureHelper('res/img/marsmap.jpg');
  UnivSim.loadTextureHelper('res/img/neptunemap.jpg');
  UnivSim.loadTextureHelper('res/img/plutomap.jpg');
  UnivSim.loadTextureHelper('res/img/saturnmap.jpg');
  UnivSim.loadTextureHelper('res/img/uranusmap.jpg');
  UnivSim.loadTextureHelper('res/img/venusmap.jpg');
  UnivSim.loadTextureHelper('res/img/vort.png');
  UnivSim.loadTextureHelper('res/img/dirtysnowtexture.png');
  UnivSim.loadTextureHelper('res/img/papertexture.jpg');
  UnivSim.loadTextureHelper('res/img/walltexture.jpg');
  UnivSim.loadTextureHelper('res/img/metal.jpg');

};

UnivSim.loadTextureHelper = function(name) {
  var gl = UnivSim.gl;
  var myTexture = gl.createTexture();
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  myTexture.image.src = name;
  UnivSim.textures.push(myTexture);
};

// Generate mesh for a unit sphere.
UnivSim.createSphereMesh = function(numBands) {
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

      t = 1 - phi / Math.PI;
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
};

window.onload = UnivSim.init;
