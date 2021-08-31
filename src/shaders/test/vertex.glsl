uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

// adding custom uniform passed from ThreeJS
uniform vec2 newUniform;
uniform float newUniformTime;

attribute vec3 position;
// adding a new attribute in order to consume the attribue passed by threeJS (must have same name)
attribute float newAttribute;
attribute vec2 uv;

// creating a varying variable to be passed to fragment shader
varying float newVarying;
varying vec2 varyingUv;
varying float varyingElevation;

void main(){
  vec4 modelPosition=modelMatrix*vec4(position,1.);
  
  // adding wave nature using vertex shader by altering modelPosition based on position x
  modelPosition.z=sin(position.x*newUniform.x + newUniformTime)*.05;
  modelPosition.z+=sin(position.y*newUniform.y + newUniformTime)*.05;

  // using custom attribute to modify vertex positoins
  modelPosition.z += newAttribute * 0.1;
  
  vec4 viewPosition=viewMatrix*modelPosition;
  
  vec4 projectPosition=projectionMatrix*viewPosition;
  
  gl_Position=projectPosition;

  // setting varying equal to the attribute to be consumed by fragment shader
  newVarying = newAttribute;
  varyingUv = uv;
  varyingElevation = modelPosition.z;
}
