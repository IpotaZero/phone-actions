const sceneMain = new (class {
    constructor() {}

    start() {
        this.t = tricks()
        this.trick = this.t.next().value
    }

    loop() {
        ctxMain.clearRect(0,0,width,height)

        if(!this.trick){
            changeScene(scenePretitle,500)
            return
        }
        
        Itext(ctxMain, "azure", "anzu", 32, width / 2, height / 2, this.trick.text, {
            text_align: "center",
            baseline: "middle",
        })

        if (this.trick.loop()) {
            this.trick = this.t.next().value
        }
    }
})()

const tricks = function* () {
    yield {
        text: "タッチ",
        loop: () => {
            if (touch.justTouches.length > 0) {
                return true
            }
        },
    }

    yield {
        text: "2本タッチ",
        loop: () => {
            if (touch.justTouches.length == 2) {
                return true
            }
        },
    }

     yield {
        text: "3本タッチ",
        loop: () => {
            if (touch.justTouches.length == 3) {
                return true
            }
        },
    }
}
