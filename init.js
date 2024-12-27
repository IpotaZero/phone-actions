const getCtx = (id) => {
    const cvs = document.getElementById(id)
    cvs.width = width
    cvs.height = height
    const ctx = cvs.getContext("2d")

    return { cvs, ctx }
}

// aspect-ratio: 9/16
const width = 720
const height = 1280

const container = document.getElementById("canvas-container")

const ctxMain = getCtx("main-canvas").ctx
