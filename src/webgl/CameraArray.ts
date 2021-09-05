import * as THREE from "three"

class CameraArray {
    private camerasInput: HTMLTextAreaElement
    public points: Array<THREE.Vector3> = []

    constructor (parentScene: THREE.Scene) {

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
            for (const el of parsedJson) {
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

                newPoints.push(new THREE.Vector3(Number(el[0]), Number(el[1]), Number(el[2]) ))
            }
            this.points = newPoints
        } catch (e) {
            //console.log(e)
        }
    }

    private reset(): void {
        console.log("reset")
        this.camerasInput.value = ""
        this.points = []
    }
}

export default CameraArray