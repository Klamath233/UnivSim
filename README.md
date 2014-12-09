#UnivSim
===

##Team Members
Xi Han (504136747)  
Shuyuan Wang (104517904)   
Yige Li (604426464)

##Introduction
A universe simulator with WebGL, as the CS 174 term project.

##Running the Program
To run the program correctly, you should establish a local server.

```
python -m SimpleHTTPServer 8080
```
Then visit the following page to run the program.
```
http://127.0.0.1:8080/UnivSim.html
```

Originally, there is a stellar (the sun) in the center of the system, all planets will almost only be affected by its gravity because we make the mass of the sun very large. However, there exists gravitational force among planets.

Firstly, You can create a planet and decide its parameters. You should fill in the blank as follows: Position( x, y, z), Velocity( x, y, z), Mass and Radius. if you leave anyone blank, it will be filled in a random number. The texture of the planet is also random.

Secondly, after creating the planet, you can also change the parameters of it in order to observe the changes caused by them. You can pick one of the existed planet and the parameters will appear after selecting a certain planet, then you can change them. If you pick nothing, you will be just ready create a new planet. Note that it is better to move the camera closer to the planet that you want to change so that you can select it more easily.

Finally, you can change the view by "w", "s", "a", "d", "up", "down", "left" and "right", which helps you look clearly. Additonally, we add background music from the movie Interstellar, which will certainly bring you into a mystery space.

##Example Data
1. If you want to create a steady system, there are some test sets which will help you.   
Velocity =(0, 0.8165, 0), Position = (1.5, 0, 0)  
Velocity =(0, 0.4472, 0), Position = (5, 0, 0)  
Velocity =(0, 1, 0), Position = (1, 0, 0)  
Velocity =(0, 1.118, 0), Position = (0.8, 0, 0)  
Radius = 0.2 and Mass = 1 for all stars.

2. If you want to create a non-steady system, there are also some test sets.  
Velocity = (0, 0, 0), Position = (3, 0, 0), Mass = 1, Radius = 0.2  
Velocity = (0, -1, 0), Position = (1, 0, 0), Mass = 1.5, Radius = 0.2  
Velocity = (0, -0.1, 0), Position = (2, 0, 0), Mass = 0.8, Radius = 0.2  
Once you have created a non-steady system, you will see collision effect among planets, simulating the space phenomena which you can hardly see in real life.

##Credits
We work together to establish the main structure of our program and then each of us contributes to some parts of our program specifically.   
###Xi Han 
1.	Implementing Physics, including Newton’s second law, Gravitational forces and conservation of momentum.  
2.	Designing the architecture of the program.  
3.	Designing and implementing data structures for objects in the program.
4.  Designing and implementing the user interface of the program.  

###Shuyuan Wang
1.	Picking module, register picking handler, get transformation matrices and then pass matrices and other uniforms to shaders.
2.	Use an infinite sphere to draw the background.
3.	Calculate the test data to establish a stable and a non-stable system.
4.	Collect the materials such as textures and adjust them to appropriate size.

###Yige Li
1.	Develop the algorithm of Longitude-Latitude Mesh to make model procedurally.
2.	Initiate the navigation system to control the view.
3.	Separate the picking and rendering into two programs respectively.( not applied in the final vision of the program)
4.	Load textures into the program.

## Epilogue
Exploring the space is a long-cherished human dream, and the mystery of space never fails to fascinate us. Hope our demo will let you experience the space and bring you a dierent feeling!
