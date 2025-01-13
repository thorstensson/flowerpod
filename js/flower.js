class Flower {

    #canvas
    #ctx
    #dpr
    #petal

    //TODO Should make Tweakpane vars/methods private too
    fSel = "lighten"
    cSel = "#ffd500"
    aSel = 100
    degSel = 18
    degRng
    amgRng
    fPane
    cPane

    pane = new Pane()

    constructor() {
        this.#setupTweakPane()
        this.#setupCanvas()
        this.#definePetal()
    }

    #setupTweakPane() {
        this.fPane = this.pane.addBlade({
            view: 'list',
            label: 'Filter',
            options: [
                { text: 'dodge', value: 'dodge' },
                { text: 'multiply', value: 'multiply' },
                { text: 'overlay', value: 'overlay' },
                { text: 'screen', value: 'screen' },
                { text: 'lighten', value: 'lighten' },
            ],
            value: 'lighten',
        })

        this.cPane = this.pane.addBlade({
            view: 'list',
            label: 'Color',
            options: [
                { text: 'purple', value: '#ff00d0' },
                { text: 'red', value: '#ff001e' },
                { text: 'blue', value: '#0048ff' },
                { text: 'yellow', value: '#ffd500' },
                { text: 'cyan', value: '#43e6f2' },
            ],
            value: '#ffd500',
        })

        this.degRng = this.pane.addBlade({
            view: 'slider',
            label: 'Degrees',
            min: 2,
            max: 18,
            value: 18,
        })

        this.ampRng = this.pane.addBlade({
            view: 'slider',
            label: 'Amplitude',
            min: 50,
            max: 100,
            value: 100,
        })

        //Events
        this.fPane.on('change', function (ev) {
            this.fSel = ev.value
            this.drawArc()
        }.bind(this))

        this.cPane.on('change', function (ev) {
            this.cSel = ev.value
            this.drawArc()
        }.bind(this))

        this.degRng.on('change', function (ev) {
            this.degSel = ev.value
            this.drawArc()
        }.bind(this))

        this.ampRng.on('change', function (ev) {
            this.aSel = ev.value
            this.drawArc()
        }.bind(this))

    }

    #setupCanvas() {
        this.canvas = document.getElementById("the-canvas")
        this.ctx = this.canvas.getContext('2d')
        this.dpr = window.devicePixelRatio || 1
    }


    #definePetal(nSteps) {
        let self = this
        this.petal = {
            cp1: 100,
            cp2: -100,
            x: 200,
            y: 0,
            palette: ['#ff00d0', '#ff001e', '#0048ff', '#ffd500', '#ff7b00', '#43e6f2'],

            // Draw me a petal
            draw(nSteps, nDegree) {
                let linGrad = self.ctx.createLinearGradient(0, 0, 0, 150)
                linGrad.addColorStop(0, self.cSel)
                linGrad.addColorStop(0.5, "#fff")
                linGrad.addColorStop(0.5, "#26C000")
                linGrad.addColorStop(1, "#fff")

                self.ctx.beginPath()
                self.ctx.moveTo(0 + nSteps, 0)
                self.ctx.quadraticCurveTo(this.cp1 + nSteps, this.cp2, this.x + nSteps, this.y)
                self.ctx.moveTo(0 + nSteps, 0)
                self.ctx.quadraticCurveTo(this.cp1 + nSteps, Math.abs(this.cp2), this.x + nSteps, this.y)

                self.ctx.closePath()
                self.ctx.fillStyle = linGrad
                self.ctx.fill()
                self.ctx.rotate(nDegree * (Math.PI / 180)) // Degree to radians, rotate canvas 
            }
        }
    }

    resizeCanvas() {
        let rect = this.canvas.getBoundingClientRect()
        let w = this.canvas.width = rect.width * this.dpr
        let h = this.canvas.height = rect.height * this.dpr
        // Center
        this.ctx.translate(w / 2, h / 2)
    }

    drawArc() {
        this.resizeCanvas();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.lineWidth = 1
        this.ctx.globalAlpha = 0.5
        this.ctx.globalCompositeOperation = this.fSel

        let degree = Math.ceil(this.degSel)
        // We do enough petals to fill a 360 circle based on what degree they come at
        let numPetals = Math.ceil(360 / degree)
        let steps = 0

        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < numPetals; k++) {
                this.petal.draw(steps, degree)
            }
            steps += this.aSel;
        }
    }

}

let flower
window.onload = () => {
    flower = new Flower()
    flower.resizeCanvas()
    flower.drawArc()
}

window.onresize = () => {
    flower.resizeCanvas()
    flower.drawArc()
}