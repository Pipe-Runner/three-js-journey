precision mediump float;

varying float newVarying;
varying vec2 varyingUv;
varying float varyingElevation;

uniform sampler2D newUniformTexture;

void main(){
  vec4 textureColor = texture2D(newUniformTexture, varyingUv);
  textureColor.rgb *= varyingElevation * 2.0 + 0.5;
  // gl_FragColor=vec4(0.5,newVarying,1.,1.);
  gl_FragColor = textureColor;
}
