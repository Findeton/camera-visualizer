import * as THREE from "three";

export function createMatrix4(pos: THREE.Vector3, lookAt: THREE.Vector3, up: THREE.Vector3): THREE.Matrix4 {
	const forward = lookAt.clone().sub(pos).normalize();
	up.normalize();
	const right = forward.clone().cross(up).normalize();
	const mat = new THREE.Matrix4();
	mat.set(
		right.x, up.x, forward.x, pos.x,
		right.y, up.y, forward.y, pos.y,
		right.z, up.z, forward.z, pos.z,
		0, 0, 0, 1
	);

	return mat;
}

export function cameraUp(cameraWfc: THREE.Matrix4): THREE.Vector3 {
	// note: three js matrix stores the matrix in a weird order, like switching between column and row
	return new THREE.Vector3(
		cameraWfc.elements[4*2 + 0],
		cameraWfc.elements[4*2 + 1],
		cameraWfc.elements[4*2 + 2]
	)
}

export function cameraForward(cameraWfc: THREE.Matrix4): THREE.Vector3 {
	return new THREE.Vector3(
		cameraWfc.elements[4*1 + 0],
		cameraWfc.elements[4*1 + 1],
		cameraWfc.elements[4*1 + 2]
	)
}

export function cameraPosition(cameraWfc: THREE.Matrix4): THREE.Vector3 {
	return new THREE.Vector3(
		cameraWfc.elements[4*3 + 0],
		cameraWfc.elements[4*3 + 1],
		cameraWfc.elements[4*3 + 2]
	)
}

export function cameraRight(cameraWfc: THREE.Matrix4): THREE.Vector3 {
	return new THREE.Vector3(
		cameraWfc.elements[4*0 + 0],
		cameraWfc.elements[4*0 + 1],
		cameraWfc.elements[4*0 + 2]
	)
}