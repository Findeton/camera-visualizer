import * as THREE from "three"
import Cube from "./Cube"

class CameraArray {
    private camerasInput: HTMLTextAreaElement
    public cubes: Array<Cube> = []
    public parentScene: THREE.Scene

    constructor (parentScene: THREE.Scene) {
        this.parentScene = parentScene

		this.camerasInput = document.getElementById("cameras-input") as HTMLTextAreaElement

        const that = this
		this.camerasInput.addEventListener("keyup", function(event) {
			that.processText(that.camerasInput.value)
		});

        const button = document.getElementById("reset-btn")
		button.addEventListener("click", function(event) {
			that.reset()
		});
    }

    private processText(text: string): void {
        try {
            const parsedJson = JSON.parse(text)

            if (!Array.isArray(parsedJson)) {
                console.log('Invalid JSON: not an array')
                return
            }

            const newPoints: Array<THREE.Vector3> = []

            const cubesLen = this.cubes.length
            for (let i = cubesLen - 1; i >= parsedJson.length; i-- ) {
                this.cubes[i].dispose()
                delete this.cubes[i]
            }

            for (let i = 0; i < parsedJson.length; i++ ) {
                const el = parsedJson[i]

                if (!Array.isArray(el)) {
                    console.log('Invalid JSON: element not an array')
                    return
                }
                if (el.length !== 3) {
                    console.log('Invalid JSON: element should have 3 dimensions')
                    return
                }

                if (el.some(Number.isNaN)) {
                    console.log('Invalid JSON: element dimensions should be numbers')
                    return
                }

                if (this.cubes.length <= i) {
                    const cube = new Cube(this.parentScene)
                    this.cubes.push(cube)
                }
                this.cubes[i].setPosition( Number(el[0]), Number(el[1]), Number(el[2]) )
            }
        } catch (e) {
            //console.log(e)
        }
    }

    private reset(): void {
        console.log("reset")
        this.camerasInput.value = ""
        this.cubes.map(c => c.dispose())
        this.cubes = []
    }
}

export default CameraArray