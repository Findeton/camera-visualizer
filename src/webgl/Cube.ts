import * as THREE from "three";

class Cube {
	mesh: THREE.Mesh;
    arrow: THREE.ArrowHelper;

    constructor(parentScene: THREE.Scene, color: number = 0x9033ff, size: number = 1) {
        const geometry = new THREE.BoxGeometry( size, size, size );
        const material = new THREE.MeshPhongMaterial( { color, specular: 0x555555, shininess: 30 } );
        const cube = new THREE.Mesh( geometry, material );
        this.mesh = cube
        parentScene.add( cube );

        const dir = new THREE.Vector3( 1, 0, 0 );
        //normalize the direction vector (convert to vector of length 1)
        dir.normalize();
        const origin = new THREE.Vector3( 0, 0, 0 );
        const length = 2 * size;
        const hex = 0xffff00;
        this.arrow = new THREE.ArrowHelper( dir, origin, length, hex );
        parentScene.add( this.arrow );
    }

    public setPosition(x: number, y: number, z: number): void {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z

        this.arrow.position.x = x
        this.arrow.position.y = y
        this.arrow.position.z = z
    }

    public dispose(): void {
        this.mesh.parent.remove(this.mesh)
        this.arrow.parent.remove(this.arrow)
    }
}

export default Cube
