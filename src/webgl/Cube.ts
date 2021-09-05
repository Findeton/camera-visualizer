import * as THREE from "three";

export default class Shape {
	mesh: THREE.Mesh;

    constructor(parentScene: THREE.Scene) {
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color: 0x9033ff, specular: 0x555555, shininess: 30 } );
        const cube = new THREE.Mesh( geometry, material );
        parentScene.add( cube );
    }
}
