/*
 * View.ts
 * ===========
 * Topmost Three.js class. 
 * Controls scene, cam, renderer, and objects in scene.
 */

import FreeCamera from "../FreeCamera";
import * as THREE from "three";
import Cube from "./Cube";
import CameraArray from "./CameraArray"

export default class View {
	private renderer: THREE.WebGLRenderer;
	private scene: THREE.Scene;
	private camera: FreeCamera;
	private cameraArray: CameraArray
	private cube: Cube;

	constructor(canvasElem: HTMLCanvasElement) {
		this.renderer = new THREE.WebGLRenderer({
			canvas: canvasElem,
			antialias: true,
		});
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.TextureLoader().load("./textures/bgnd.png");
		this.cube = new Cube(this.scene);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		const pointLight = new THREE.PointLight(0xffffff, 0.5);
		pointLight.position.set( 2, 7, 4 );
		ambientLight.position.set( 2, 7, 4 );
		this.scene.add( ambientLight, pointLight );
		this.camera = new FreeCamera(this.scene, this.renderer);
		this.cameraArray = new CameraArray(this.scene)

		// Set initial sizes
		this.onWindowResize(window.innerWidth, window.innerHeight);
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.camera.onWindowResize(vpW, vpH);
	}

	public update(secs: number): void {
		this.camera.update(secs);
	}
}