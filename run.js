let currentScene = scenePretitle
currentScene.start?.()

let BGM = null

const mainloop = () => {
    container.style.cursor = ""

    currentScene.loop()

    inputHandler.updateInput()
}

let interval

window.addEventListener("DOMContentLoaded", () => {
    interval = setInterval(mainloop, 1000 / 60)
})
