const scenePretitle = new (class {
    constructor() {
        this.isSmartPhone = isSmartPhone()
    }

    loop() {
        Irect(ctxMain, "#111", 0, 0, width, height, { line_width: 0 })

        Itext(ctxMain, "azure", "anzu", 48, width / 2, height / 2 - 100, "スマホの機能を試してみよう", {
            text_align: "center",
            baseline: "middle",
        })

        Itext(ctxMain, "azure", "anzu", 64, width / 2, height / 2, "Presented by MCR", {
            text_align: "center",
            baseline: "middle",
        })

        if (!this.isSmartPhone) {
            Itext(ctxMain, "azure", "anzu", 48, width / 2, height / 2 + 100, "このげーむはすまほ用にゃ!", {
                text_align: "center",
                baseline: "middle",
            })
        }

        if (touch.justTouches.length > 0) {
            changeScene(sceneMain, 2500)
        }
    }
})()
