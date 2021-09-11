import * as THREE from "three"
import Cube from "./Cube"

class CameraArray {
    private camerasInput: HTMLTextAreaElement
    public cubes: Array<Cube> = []
    public cubeSize: number = 1
    public parentScene: THREE.Scene

    constructor (parentScene: THREE.Scene) {
        this.parentScene = parentScene

		this.camerasInput = document.getElementById("cameras-input") as HTMLTextAreaElement

        this.readQueryParams()
        const that = this
		this.camerasInput.addEventListener("keyup", function(event) {
			that.processText(that.camerasInput.value)
		});

        const resetButton = document.getElementById("reset-btn")
		resetButton.addEventListener("click", function(event) {
			that.reset()
		});

        const urlButton = document.getElementById("url-btn")
		urlButton.addEventListener("click", function(event) {
			that.createURL()
		});
    }

    private readQueryParams(): void {
        const params = new URLSearchParams(window.location.search)
        // read input or use a default
        const text = params.get('input') || '[[0,0,0], [0,0,1], [0,1,0], [0,1,1]]'
        
        this.camerasInput.value = text
        this.processText(text)
    }

    private createURL(): void {
        console.log("create url")
        const params = new URLSearchParams(window.location.search)
        params.set("input", this.camerasInput.value)
        const location = window.location.toString()
        window.location.replace(location.substring(0, location.length - window.location.search.length) + '?' + params.toString())
    }

    private parseTextToPositions(text: string): Array<THREE.Vector3> | null {
        try {
            const parsedJson = JSON.parse(text)

            if (!Array.isArray(parsedJson)) {
                console.log('Invalid JSON: not an array')
                return null
            }

            const newPoints: Array<THREE.Vector3> = []

            for (let i = 0; i < parsedJson.length; i++ ) {
                const el = parsedJson[i]

                if (!Array.isArray(el)) {
                    console.log('Invalid JSON: element not an array')
                    return null
                }
                if (el.length !== 3) {
                    console.log('Invalid JSON: element should have 3 dimensions')
                    return null
                }

                if (el.some(Number.isNaN)) {
                    console.log('Invalid JSON: element dimensions should be numbers')
                    return null
                }

                newPoints.push(new THREE.Vector3(Number(el[0]), Number(el[1]), Number(el[2])))
            }

            return newPoints
        } catch (e) {
            //console.log(e)
            return null
        }
    }

    private calculateAverageMinDistance(points: Array<THREE.Vector3>): number {
        if (points.length <= 1) {
            return 3
        }
        
        // get avg min dist
        const distances = points.map((v, i) =>
            Math.min(...points.map((w, j) => i === j? null: v.distanceTo(w)).filter(r => r !== null))
        )

        return distances.reduce((a, b) => a+b, 0)/distances.length
        
    }

    private processText(text: string): void {
        const newPoints = this.parseTextToPositions(text)

        if (text === null) {
            return
        }

        if (this.cubes.length < newPoints.length) {
            this.reset(false)
        }

        if (this.cubes.length === 0) {
            const avgMin = this.calculateAverageMinDistance(newPoints)
            console.log('avgMin ' + avgMin)

            this.cubeSize = avgMin/3
        }

        for (let i = this.cubes.length - 1; i >= newPoints.length; i-- ) {
            console.log('Dispose ' + i)
            this.cubes[i].dispose()
            delete this.cubes[i]
        }

        for (let i = 0; i < newPoints.length; i++ ) {
            const el = newPoints[i]

            if (this.cubes.length <= i) {
                const cube = new Cube(this.parentScene, 0x9033ff, this.cubeSize)
                this.cubes.push(cube)
            }
            this.cubes[i].setPosition( el.x, el.y, el.z )
            console.log(`Cube ${i}, x ${this.cubes[i].mesh.position.x}, y ${this.cubes[i].mesh.position.x}, z ${this.cubes[i].mesh.position.x}`)
        }
    }

    private reset(resetText: boolean = true): void {
        console.log("reset")
        if (resetText) {
            this.camerasInput.value = ""
        }
        this.cubes.map(c => c.dispose())
        this.cubes = []
    }
}

export default CameraArray