import { cameraForward, cameraRight, cameraUp } from "./utils/Geometry";
import * as THREE from "three";

enum KEYS {
	W = 'w',
	S = 's',
	A = 'a',
	D = 'd',
	R = 'r',
	F = 'f',
}

export default class FreeCamera {
	private renderer: THREE.WebGLRenderer;
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private cameraPos: THREE.Vector3;
	private cameraRDA: THREE.Vector3; // x: Radius, y: Polar, z: Azimuth
	private mouseMoving: boolean;
	private delta_azimuth: number;
	private delta_polar: number;
	private initialMouse: THREE.Vector2 | null;
	private showLog: boolean = false
	private lastSec: number = 0
	private cameraType: 'FREE' | 'ORIGIN' = 'ORIGIN'
    private keyPressed: KEYS | null = null

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.renderer = renderer;
		this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
		this.camera.updateProjectionMatrix();
		this.resetCam(this.cameraType);

		// Set initial sizes
		this.onWindowResize(window.innerWidth, window.innerHeight);
		this.addListeners();
    }

	private resetCam(cameraType: 'FREE' | 'ORIGIN'):void {
		if (cameraType === 'FREE') {
			this.camera.up.set(0, 0, 1);
			this.cameraPos = new THREE.Vector3(0, 10, 0);
			this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.y);
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			this.cameraRDA = new THREE.Vector3(10, 90, 270.0); // radius, polar, azimuth
			this.mouseMoving = false;
			this.delta_azimuth = 0;
			this.delta_polar = 0;
			this.initialMouse = null;
			this.setPose();
		} else if (cameraType === 'ORIGIN') {
			this.camera.up.set(0, 0, 1);
			this.cameraPos = new THREE.Vector3(0, 10, 0);
			this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.y);
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			this.cameraRDA = new THREE.Vector3(10, 90, 90); // radius, polar, azimuth
			this.mouseMoving = false;
			this.delta_azimuth = 0;
			this.delta_polar = 0;
			this.initialMouse = null;
			this.setPose();
		}
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.renderer.setSize(vpW, vpH);
		this.camera.aspect = vpW / vpH;
		this.camera.updateProjectionMatrix();
	}

	public update(secs: number): void {
		if (this.showLog) {
			//console.log(secs);
		}

		this.updateCamera(secs)
		this.setPose();
		this.renderer.render(this.scene, this.camera);
	}

	private updateCamera(secs: number): void {
		if (this.keyPressed === null) {
			return
		}

		const lastSec = this.lastSec
		this.lastSec = secs

		if (lastSec === null) {
			return
		}

		const scalar = 1.0 * (secs - lastSec)

		if (this.cameraType === 'FREE') {
			switch (this.keyPressed) {
				case 's':
					this.cameraPos.add(cameraUp(this.camera.matrixWorld).multiplyScalar(scalar))
					break;
				case 'w':
					this.cameraPos.sub(cameraUp(this.camera.matrixWorld).multiplyScalar(scalar))
					break;
				case 'd':
					this.cameraPos.sub(cameraRight(this.camera.matrixWorld).multiplyScalar(scalar))
					break
				case'a':
					this.cameraPos.add(cameraRight(this.camera.matrixWorld).multiplyScalar(scalar))
					break
				case 'r':
					this.cameraPos.add(cameraForward(this.camera.matrixWorld).multiplyScalar(scalar))
					break
				case 'f':
					this.cameraPos.sub(cameraForward(this.camera.matrixWorld).multiplyScalar(scalar))
					break
			}
		}
	}


	private setPose() {
		const radius = this.cameraRDA.x;
		const polar = this.cameraRDA.y;
		const azimuth = this.cameraRDA.z;
		const cameraLookAt = new THREE.Vector3(
			radius * Math.sin((polar + this.delta_polar) * Math.PI / 180) * Math.cos((azimuth + this.delta_azimuth) * Math.PI / 180),
			radius * Math.sin((polar + this.delta_polar) * Math.PI / 180) * Math.sin((azimuth + this.delta_azimuth) * Math.PI / 180),
			radius * Math.cos((polar + this.delta_polar) * Math.PI / 180) ,
		);

		if (this.cameraType === 'FREE') {
			cameraLookAt.add(this.cameraPos);
			this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
			this.camera.lookAt(cameraLookAt);

			if (this.showLog || 0) {
				console.log(`radius ${radius}, polar ${polar}, delta_polar ${this.delta_polar}, azimuth ${azimuth}, delta_azimuth${this.delta_azimuth})`);
				console.log(`cameraPos at ${this.cameraPos.x}, ${this.cameraPos.y}, ${this.cameraPos.z}`);
				console.log(`cameraLookAt at ${cameraLookAt.x}, ${cameraLookAt.y}, ${cameraLookAt.z}`);
			}
		} else if (this.cameraType === 'ORIGIN') {
			this.cameraPos = cameraLookAt
			this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z);
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));

			if (this.showLog || 0) {
				console.log(`radius ${radius}, polar ${polar}, delta_polar ${this.delta_polar}, azimuth ${azimuth}, delta_azimuth${this.delta_azimuth})`);
				console.log(`cameraPos at ${this.camera.position.x}, ${this.camera.position.y}, ${this.camera.position.z}`);
				const realRadius = Math.sqrt(this.camera.position.x*this.camera.position.x + this.camera.position.y*this.camera.position.y + this.camera.position.z*this.camera.position.z);
				console.log(`real radius ${realRadius}`);
			}
		}
	}


	private addListeners(): void {
		window.addEventListener( 'mousemove', this.onTouchMove.bind(this) );
		window.addEventListener( 'touchmove', this.onTouchMove.bind(this) );

		const that = this;
		window.addEventListener( 'mousedown', function () {
			if (that.mouseMoving === false) {
				that.mouseMoving = true;
			}

		}, false );

		window.addEventListener( 'mouseup', function () {
			that.cameraRDA.z += that.delta_azimuth; // azimuth
			that.cameraRDA.y += that.delta_polar; // polar
			that.delta_azimuth = 0;
			that.delta_polar = 0;
			that.mouseMoving = false;
            that.initialMouse = null;

		} );

		window.addEventListener( 'wheel', function (event: WheelEvent) {
			event.preventDefault();

			if (that.cameraType === 'ORIGIN') {
				that.cameraRDA.x -= event.deltaY * 0.01;
			}

		} );

		window.addEventListener( 'keydown', function (event: KeyboardEvent) {
			if (Object.values(KEYS).includes(event.key as any)) {
				that.keyPressed = event.key as any
				that.lastSec = null
			}
		})

		window.addEventListener( 'keyup', function (event: KeyboardEvent) {
            const scalar = 0.1

			that.keyPressed = null
			that.lastSec = null


		} );
	}

	private onTouchMove( event: TouchEvent & MouseEvent ) {
		
		if (!this.mouseMoving) {
			return;
		}
		var x, y;

		if ( event.changedTouches ) {

			x = event.changedTouches[ 0 ].pageX;
			y = event.changedTouches[ 0 ].pageY;

		} else {

			x = event.clientX;
			y = event.clientY;

		}
		const scale = this.cameraType === 'FREE'? 90 : 180
		x = (( x / window.innerWidth ) * 2 - 1) * scale;
		y = - (( y / window.innerHeight ) * 2 + 1) * scale;
		if (this.initialMouse == null) {
			this.initialMouse = new THREE.Vector2(x, y);
			return;
		}
		this.delta_azimuth = x - this.initialMouse.x;
		this.delta_polar = y - this.initialMouse.y;

		//console.log('delta_azimuth ' + this.delta_azimuth + ' delta_polar ' + this.delta_polar);

		this.setPose();
	}
}
