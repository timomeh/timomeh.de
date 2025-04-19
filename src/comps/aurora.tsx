import { ShaderCanvas } from './shader-canvas'

export function Aurora() {
  return (
    <div className="absolute -z-10 hidden h-full w-full opacity-70 dark:block">
      <ShaderCanvas fragmentShaderSource={fragmentShaderSource} />
    </div>
  )
}

// taken and adapted from: https://www.shadertoy.com/view/XtGGRt
// by nimitz 2017 (twitter: @stormoid)
// license: CC BY-NC-SA 3.0
const fragmentShaderSource = `#version 300 es
precision highp float;

uniform highp vec2 u_resolution;
uniform highp float u_time;

mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

float triNoise2d(in vec2 p, float spd) {
  float z = 1.8;
  float z2 = 2.5;
  float rz = 0.0;
  p *= mm2(p.x * 0.06);
  vec2 bp = p;
  for (float i = 0.0; i < 5.0; i++) {
    vec2 dg = tri2(bp * 1.85) * 0.75;
    dg *= mm2(u_time * spd);
    p -= dg / z2;
    bp *= 1.3;
    z2 *= 0.45;
    z *= 0.42;
    p *= 1.21 + (rz - 1.0) * 0.02;
    rz += tri(p.x + tri(p.y)) * z;
    p*= -m2;
  }
  return clamp(1.0 / pow(rz * 29.0, 1.3), 0.0, 0.55);
}

float hash21(in vec2 n){ return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

vec4 aurora(vec3 ro, vec3 rd) {
  vec4 col = vec4(0);
  vec4 avgCol = vec4(0);

  for(float i = 0.0; i < 50.0; i++) {
    float of = 0.006 * hash21(gl_FragCoord.xy) * smoothstep(0.,15., i);
    float zoom = 0.4;
    float pt = ((0.8 + pow(i,1.4) * 0.002) - ro.y) / (rd.y * 2. + zoom);
    pt -= of;
    vec3 bpos = ro + pt * rd;
    vec2 p = bpos.zx;
    float speed = 0.06;
    float rzt = triNoise2d(p, speed);
    vec4 col2 = vec4(0,0,0, rzt);

    vec3 green = sin(1.0 - vec3(2.15, -0.5, 1.2) + i * 0.043) * 0.5 + 0.5;
    vec3 baseColor = green;
    col2.rgb = baseColor * rzt;

    avgCol = mix(avgCol, col2, .5);
    col += avgCol * exp2(-i * 0.065 - 2.5) * smoothstep(0.,5., i);
  }
  col *= (clamp(rd.y*15.0 + 0.4, 0.0, 1.0));
  return col * 1.8;
}

out vec4 fragColor;

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 q = fragCoord / u_resolution.xy;
  vec2 p = q - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  // camera position
  vec3 ro = vec3(3.0, 0.0, -6.7);

  // camera direction
  vec3 rd = normalize(vec3(p, 1.3));
  rd.yz *= mm2(0.25);
  rd.xz *= mm2(sin(u_time * 0.01) * 0.02 + u_time * 0.003);

  // draw the aurora
  vec3 col = vec3(0.);
  vec3 brd = rd;
  float fade = smoothstep(0., 0.01, abs(brd.y)) * 0.3 + 0.9;
  vec4 aur = smoothstep(0., 1.4, aurora(ro, rd)) * fade;
  col = col * (1. - aur.a) + aur.rgb;

  fragColor = vec4(col, aur.a);
}`
