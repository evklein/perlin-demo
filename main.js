import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Step 2: Create a square geometry

// Step 3: Create a custom shader material to apply the gradient
const material = new THREE.ShaderMaterial({
    vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
    fragmentShader: `
                varying vec2 vUv;
                void main() {
                    // Combine u and v coordinates for a diagonal gradient
                    float mixFactor = (vUv.x + vUv.y) / 2.0;
                    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), mixFactor);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
    side: THREE.DoubleSide
});

const GRID_SIZE = 5;
const PLANE_WIDTH = 4;

function buildGrid() {
    for (var i = 0; i < GRID_SIZE; i++) {
        for (var j = 0; j < GRID_SIZE; j++) {
            const geometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_WIDTH);
            const square = new THREE.Mesh(geometry, material);
            square.position.set(i * PLANE_WIDTH, j * PLANE_WIDTH, 0);
            scene.add(square);

            insertCenterPointInGridSquare(i, j);
        }
    }
}

function insertCenterPointInGridSquare(x, y) {
    const dotGeometry = new THREE.CircleGeometry(0.1, 64);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const centerX = x * PLANE_WIDTH;
    const centerY = y * PLANE_WIDTH;

    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.set(centerX, centerY, 0.1); // Slightly above the plane to avoid z-fighting
    scene.add(dot);
}

var arrows = [];
var arrowInitialDirections = [];

function buildIntersectionVectors() {
    for (var i = 0; i <= GRID_SIZE; i++) {
        for (var j = 0; j <= GRID_SIZE; j++) {
            // Draw Vectors for corners
            const originRight = new THREE.Vector3(i * PLANE_WIDTH - PLANE_WIDTH / 2, j * PLANE_WIDTH - PLANE_WIDTH / 2, 0);
            var xDir = Math.sin(Math.random() * (Math.random() < 0.5 ? 1 : -1));
            var yDir = Math.cos(Math.random() * (Math.random() < 0.5 ? 1 : -1));
            console.log(xDir);
            const dirRight = new THREE.Vector3(xDir, yDir, 0);
            //normalize the direction vector (convert to vector of length 1)
            dirRight.normalize();
            const bottomArrowHelper = new THREE.ArrowHelper(dirRight, originRight, 1, 0x00ff00, 0.2, 0.2);
            arrows.push(bottomArrowHelper);
            arrowInitialDirections.push(dirRight);
            scene.add(bottomArrowHelper);
        }
    }
}


for (var i = 0; i < GRID_SIZE; i++) {
    for (var j = 0; j < GRID_SIZE; j++) {
        // Draw Vectors for corners
        {
            const origin = new THREE.Vector3(i * PLANE_WIDTH - PLANE_WIDTH / 2, j * PLANE_WIDTH - PLANE_WIDTH / 2, 0);
            const direction = new THREE.Vector3(1, 1, 0);
            //normalize the direction vector (convert to vector of length 1)
            direction.normalize();
            const arrowHelper = new THREE.ArrowHelper(direction, origin, Math.sqrt(8), 0xffff00, 0.2, 0.2);
            scene.add(arrowHelper);
        }
        {
            const origin = new THREE.Vector3(i * PLANE_WIDTH - PLANE_WIDTH / 2, j * PLANE_WIDTH + PLANE_WIDTH / 2, 0);
            const direction = new THREE.Vector3(1, -1, 0);
            //normalize the direction vector (convert to vector of length 1)
            direction.normalize();
            const arrowHelper = new THREE.ArrowHelper(direction, origin, Math.sqrt(8), 0xffff00, 0.2, 0.2);
            scene.add(arrowHelper);
        }
        {
            const origin = new THREE.Vector3(i * PLANE_WIDTH + PLANE_WIDTH / 2, j * PLANE_WIDTH + PLANE_WIDTH / 2, 0);
            const direction = new THREE.Vector3(-1, -1, 0);
            //normalize the direction vector (convert to vector of length 1)
            direction.normalize();
            const arrowHelper = new THREE.ArrowHelper(direction, origin, Math.sqrt(8), 0xffff00, 0.2, 0.2);
            scene.add(arrowHelper);
        }
        {
            const origin = new THREE.Vector3(i * PLANE_WIDTH + PLANE_WIDTH / 2, j * PLANE_WIDTH - PLANE_WIDTH / 2, 0);
            const direction = new THREE.Vector3(-1, 1, 0);
            //normalize the direction vector (convert to vector of length 1)
            direction.normalize();
            const arrowHelper = new THREE.ArrowHelper(direction, origin, Math.sqrt(8), 0xffff00, 0.2, 0.2);
            scene.add(arrowHelper);
        }
    }
}


const origin = new THREE.Vector3(0, 0, 0);
const length = 1;
const hex = 0x00ff00;
const dir = new THREE.Vector3(1, 2, 0);

//normalize the direction vector (convert to vector of length 1)
dir.normalize();


const arrowHelper = new THREE.ArrowHelper(dir, origin, 1, hex, 0.2, 0.2);
scene.add(arrowHelper);


let t = 0;
// Position the camera
camera.position.x = 5;
camera.position.y = 10;
camera.position.z = 30;

// Render the scene
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);

}

animate();
