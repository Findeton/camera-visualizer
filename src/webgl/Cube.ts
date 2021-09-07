import * as THREE from "three";

class Cube {
	mesh: THREE.Mesh;

    constructor(parentScene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color: 0x9033ff, specular: 0x555555, shininess: 30 } );
        const cube = new THREE.Mesh( geometry, material );
        this.mesh = cube
        parentScene.add( cube );
    }

    public setPosition(x: number, y: number, z: number): void {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z
    }

    public dispose(): void {
        this.mesh.parent.remove(this.mesh)
    }
}

export default Cube
