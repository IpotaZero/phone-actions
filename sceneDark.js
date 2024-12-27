const changeScene = (scene, ms = 500) => {
    currentScene = sceneDark

    inputHandler.canInput = false

    container.ontransitionend = async () => {
        container.ontransitionend = null
        ctxMain.clearRect(0, 0, width, height)

        await scene.start?.()

        container.style.transition = `all ${ms}ms`
        container.style.opacity = 1

        currentScene = scene
        inputHandler.canInput = true
    }

    container.style.transition = `all ${ms}ms`
    container.style.opacity = 0
}

const sceneDark = new (class {
    constructor() {}
    loop() {}
})()

const darken = (ms) => {
    inputHandler.canInput = false

    container.style.transition = `all ${ms}ms`
    container.style.opacity = 0

    return new Promise((resolve) => {
        container.ontransitionend = () => {
            container.style.transition = `all ${ms}ms`
            container.style.opacity = 1

            inputHandler.canInput = true
            resolve()
        }
    })
}
