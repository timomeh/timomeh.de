import { ShaderCanvas } from './shader-canvas'

export function Contours() {
  return (
    <div
      className="block h-full w-full opacity-10 mix-blend-soft-light
        brightness-125 saturate-[0.3] dark:hidden"
    >
      <ShaderCanvas fragmentShaderSource={fragmentShaderSource} />
    </div>
  )
}

// taken and adapted from: https://www.shadertoy.com/view/ldscWH
// original by Shane 2017
const fragmentShaderSource = `#version 300 es
precision highp float;

uniform highp float u_time;
uniform highp vec2 u_resolution;

// Variable to a keep a copy of the noise value prior to palettization.
float ns;

// Smooth "fract" function with smoothing factor.
float sFract(float x, float sm) {
    const float sf = 1.0;  // Extra smoothing factor.
    vec2 u = vec2(x, fwidth(x) * sf * sm);
    u.x = fract(u.x);
    u += (1.0 - 2.0 * u) * step(u.y, u.x);
    return clamp(1.0 - u.x / u.y, 0.0, 1.0);
}

// Smooth floor function
float sFloor(float x) { return x - sFract(x, 1.0); }

// Simple hash function for generating random values
vec3 hash33(vec3 p) {
    float n = sin(dot(p, vec3(7.0, 157.0, 113.0)));
    return fract(vec3(2097152.0, 262144.0, 32768.0) * n) * 2.0 - 1.0;
}

// TetraNoise function for generating smooth noise
float tetraNoise(in vec3 p){
    // Reduce noise frequency by scaling down p
    p *= 0.6; // Lower frequency for fewer peaks

    // Skewing the cubic grid, then determining the first vertice and fractional position.
    vec3 i = floor(p + dot(p, vec3(1./3.)) );  p -= i - dot(i, vec3(1./6.));
    
    // Breaking the skewed cube into tetrahedra with partitioning planes
    vec3 i1 = step(p.yzx, p), i2 = max(i1, 1. - i1.zxy); i1 = min(i1, 1. - i1.zxy);
    
    // Calculate the vertices of the tetrahedron
    vec3 p1 = p - i1 + 1./6.;
    vec3 p2 = p - i2 + 1./3.;
    vec3 p3 = p - 0.5;

    // Simplex falloff
    vec4 v = max(.5 - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.);
    
    // Weighted contributions from random vectors at vertices
    vec4 d = vec4(dot(p, hash33(i)), dot(p1, hash33(i + i1)), dot(p2, hash33(i + i2)), dot(p3, hash33(i + 1.)));
     
    // Return smoothed noise
    return clamp(dot(d, v*v*v*8.)*1.732 + .5, 0., 1.);
}


float func(vec2 p){
    // Lower spatial frequency for larger contours
    float n = tetraNoise(vec3(p.x * 2.0, p.y * 2.0, 0) - vec3(0, .25, .25) * u_time * 0.04); // Slow down motion

    float taper = .1 + dot(p, p * vec2(.12, 1));
    n = max(n - taper, 0.) / max(1. - taper, .0001);
    ns = n; 

    const float palNum = 7.; // amount of levels
    return n * 0.25 + clamp(sFloor(n * (palNum - .001)) / (palNum - 1.), 0., 1.) * .85;
}

out vec4 fragColor;

// Main entry point of the fragment shader
void main() {
    vec2 u = (gl_FragCoord.xy - u_resolution.xy * 0.5) / u_resolution.y;

    // Padding to ensure contours stay within bounds
    float padding = 0.01; // Reduced padding for less extreme effect
    float aspect = u_resolution.x / u_resolution.y;
    vec2 bounds = vec2(0.5 - padding * vec2(aspect, 1.0));

    u /= bounds;

    // Function value
    float f = func(u);
    float ssd = ns;

    // Sample values around the original for edging and highlighting
    vec2 e = vec2(1.5 / u_resolution.y, 0) / bounds;
    float fxl = func(u + e.xy);
    float fxr = func(u - e.xy);
    float fyt = func(u + e.yx);
    float fyb = func(u - e.yx);

    vec3 col = pow(min(vec3(1.5, 1.0, 1.0) * (f * 0.7 + ssd * 0.35), 1.0), vec3(1.0, 2.0, 10.0) * 2.0) + 0.01;

    col *= max(1.0 - (abs(fxl - fxr) + abs(fyt - fyb)) * 5.0, 0.0);

    // Highlighting with resampling
    fxl = func(u + e.xy * 1.5);
    fyt = func(u + e.yx * 1.5);
    col += vec3(0.5, 0.7, 1.0) * max(f - fyt, 0.0) * ssd * 10.0;

    // Output the color with rough gamma correction
    float fadeThreshold = 0.35; // Adjust this value for smoother fade
    float alpha = smoothstep(0.0, fadeThreshold, f);
    fragColor = vec4(sqrt(clamp(col, 0.0, 1.0)), alpha);
}

`
