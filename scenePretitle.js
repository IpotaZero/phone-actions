const scenePretitle = new (class {
    constructor() {
        this.isSmartPhone = isSmartPhone()
    }

    loop() {
        Irect(ctxMain, "#111", 0, 0, width, height, { line_width: 0 })

        Itext(ctxMain, "azure", "anzu", 32, width / 2, height / 2, "Presented by MCR", {
            text_align: "center",
            baseline: "middle",
        })

        if (!this.isSmartPhone) {
            Itext(ctxMain, "azure", "anzu", 24, width / 2, height / 2 + 100, "このげーむはスマホ用にゃ!", {
                text_align: "center",
                baseline: "middle",
            })
        }

        if (touch.justTouches.length > 0) {
            changeScene(sceneMain, 2500)
        }
    }
})()
