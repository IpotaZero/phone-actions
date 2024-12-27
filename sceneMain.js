const sceneMain = new (class {
    constructor() {}

    start() {
        this.t = tricks()
        this.next()
        this.darkenEnd = true
    }

    next() {
        this.trick = this.t.next().value
    }

    loop() {
        ctxMain.clearRect(0, 0, width, height)

        if (!this.trick) {
            changeScene(scenePretitle, 500)
            return
        }

        Itext(ctxMain, "azure", "anzu", 64, width / 2, height / 2 + 32, this.trick.text, {
            text_align: "center",
        })

        if (this.darkenEnd) {
            if (this.trick.loop()) {
                this.darkenEnd = false
                darken(1000).then(() => {
                    this.darkenEnd = true
                    this.next()
                })
            }
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

    yield {
        text: "時計回り",
        loop: () => {
            if (touch.circle == -1) {
                return true
            }
        },
    }

    yield {
        text: "反時計回り",
        loop: () => {
            if (touch.circle == 1) {
                return true
            }
        },
    }

    yield {
        text: "左に傾ける",
        loop: () => {
            Itext(
                ctxMain,
                "azure",
                "anzu",
                24,
                width / 2,
                height / 2 + 100,
                `
                    ${orientation.alpha};
                    ${orientation.beta};
                    ${orientation.gamma}
                `,
                {
                    text_align: "center",
                },
            )
        },
    }
}
