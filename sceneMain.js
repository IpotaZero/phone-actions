const sceneMain = new (class {
    constructor() {}

    start() {
        this.t = tricks()
        this.next()
        this.darkenEnd = true

        this.effects = []
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

        touch.touches.forEach((t) => {
            this.effects.push({
                life: 12,
                p: t.p,
            })
        })

        this.effects.forEach((e) => {
            Iarc(ctxMain, "#f0ffff80", e.p.x, e.p.y, e.life * 4)
            e.life--
        })

        this.effects = this.effects.filter((e) => e.life > 0)

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
        text: "うずまき(時計回り)",
        loop: () => {
            if (touch.circle == -1) {
                return true
            }
        },
    }

    yield {
        text: "うずまき(反時計回り)",
        loop: () => {
            if (touch.circle == 1) {
                return true
            }
        },
    }

    yield {
        text: "左に傾ける",
        loop: () => {
            if (300 < orientation.alpha && orientation.alpha < 360) return true

            if (orientation.alpha == 0 && orientation.beta == 0 && orientation.gamma == 0) {
                Itext(
                    ctxMain,
                    "azure",
                    "anzu",
                    48,
                    width / 2,
                    height / 2 + 200,
                    "たぶんジャイロセンサーが;入ってないにゃ",
                    {
                        text_align: "center",
                    },
                )

                const { clicked } = Ibutton(
                    ctxMain,
                    "azure",
                    "sans-serif",
                    48,
                    width / 2 - 100,
                    height / 2 + 500,
                    200,
                    50,
                    "すすむ",
                    {
                        text_align: "center",
                    },
                )

                if (clicked) {
                    return true
                }
            }
        },
    }

    yield {
        text: "奥に傾ける",
        loop: () => {
            if (-45 < orientation.beta && orientation.beta < 0) return true

            if (orientation.alpha == 0 && orientation.beta == 0 && orientation.gamma == 0) {
                Itext(
                    ctxMain,
                    "azure",
                    "anzu",
                    48,
                    width / 2,
                    height / 2 + 200,
                    "たぶんジャイロセンサーが;入ってないにゃ",
                    {
                        text_align: "center",
                    },
                )

                const { clicked } = Ibutton(
                    ctxMain,
                    "azure",
                    "sans-serif",
                    48,
                    width / 2 - 100,
                    height / 2 + 500,
                    200,
                    50,
                    "すすむ",
                    {
                        text_align: "center",
                    },
                )

                if (clicked) {
                    return true
                }
            }
        },
    }

    yield {
        text: "振る",
        loop: () => {
            if (acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2 > 20) {
                console.log("sdsdfd")
                return true
            }

            if (acceleration.x == 0 && acceleration.y == 0 && acceleration.z == 0) {
                Itext(
                    ctxMain,
                    "azure",
                    "anzu",
                    48,
                    width / 2,
                    height / 2 + 200,
                    "たぶん加速度センサーが;入ってないにゃ",
                    {
                        text_align: "center",
                    },
                )

                const { clicked } = Ibutton(
                    ctxMain,
                    "azure",
                    "sans-serif",
                    48,
                    width / 2 - 100,
                    height / 2 + 500,
                    200,
                    50,
                    "すすむ",
                    {
                        text_align: "center",
                    },
                )

                if (clicked) {
                    return true
                }
            }
        },
    }
}
