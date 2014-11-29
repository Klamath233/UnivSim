
// Git Basics:
// http://teamtreehouse.com/library/git-basics.rss?feed_token=57f8983b-faf1-4982-acf1-0c661da7a227&hd=true


var confirmButton;
var Timer;

function init() {
  // Setup WebGL context
  // Hook variables with HTML elements (GUI) - Xi
  // Setup timer

  // Picking - Yige & Shuyuan
  // Register picking handler
  // For example:
  // confirmButton = document.getElementById("confirm");
  // confirmButton.addEventListener("click", function() {
  //   alert("Hello world!");
  // });

  // Initiate Scene: - Xi
  //   Naively, use an array to store star objects.
  //   Complexity: for size n: n - 1 + n - 2 + ... + 0
  //               O(n^2)
  // Initial Configuration: customizable.

  // Star objects - Xi
  function Star() {
    return {
      position: vec3
      velocity: vec3
      accleration: vec3
      mass: number
      radius: number
      texture: image
      shininess: number
      rotation: mat4
      axis: vec3
      light: boolean
      lightAmbient: vec3()
      lightDiffuse: vec3()
      lightSpecular: vec3()
      ...
    }
  }

  // Make model procedurally - Longitude-Latitude Mesh - Xi
  // Buffer model data.
  // Buffer textures.

  // Enter main program loop.
  tick();
}

// Main loop.
function tick() {

  var dt; // Get time elapsed.

  // Update the physics attributes of stars. - Xi

  // Picking heavy-lifting stuff. - Yige & Shuyuan

  // Get transformation matrices from - Yige & Shuyuan
  //   1. stars' position attribute.
  //   2. stars' rotation and axis attributes.

  // Passing matrices and other uniforms to shaders. - Yige & Shuyuan
  // Draw the stars.

  window.requestAnimationFrame(tick);
}

// Yige & Shuyuan
function pickingHandler() {
  // Get coordinates clicked on canvas.
  // Get object clicked: stars/space
  // Stop the timer.
  // Unregister itself.
  // if (user clicks on stars) {
  //   display current star attributes in HTML form.
  //   register confirmHandler to buttons' onclick event.
  // }
}

// Xi
function confirmHandler() {
  // Update the picked star's attribute according to
  // user's input.
  // Unregister itself.
  // register pickingHandler to canvas' onclick event.
  // Start the timer again.
}
window.onload = init;