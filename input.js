const InputHandler = class {
    constructor(container) {
        this.canInput = true
        this.container = container
        this.cvsStyle = getComputedStyle(container)

        // Keyboard state
        this.keyboard = {
            pressed: new Set(),
            longPressed: new Set(),
            pushed: new Set(),
            upped: new Set(),
        }

        // Mouse state
        this.mouse = {
            clicking: false,
            rightClicking: false,
            middleClicking: false,
            clicked: false,
            rightClicked: false,
            middleClicked: false,
            p: vec(0, 0),
            moved: false,
            angle: 0,
            deltaX: 0,
            deltaY: 0,
        }

        // Touch state
        this.touch = {
            touches: [],
            justTouches: [],
            circle: 0,
        }

        // Focus state
        this.focusState = {
            isFocused: true,
            justFocused: false,
            justBlurred: false,
        }

        // Visibility state
        this.visibilityState = {
            isVisible: true,
            justHidden: false,
            justVisible: false,
        }

        this.orientation = {
            alpha: 0,
            beta: 0,
            gamma: 0,
        }
        this.acceleration = { x: 0, y: 0, z: 0 }
        this.rotationRate = { alpha: 0, beta: 0, gamma: 0 }

        this.#initializeEventListeners()
    }

    #initializeEventListeners() {
        // Keyboard events
        document.addEventListener("keydown", this.#handleKeyDown.bind(this))
        document.addEventListener("keyup", this.#handleKeyUp.bind(this))

        // Mouse events
        this.container.addEventListener("mousemove", this.#handleMouseMove.bind(this))
        this.container.addEventListener("mousedown", this.#handleMouseDown.bind(this))
        this.container.addEventListener("mouseup", this.#handleMouseUp.bind(this))
        this.container.addEventListener("mouseleave", this.#handleMouseUp.bind(this))
        this.container.addEventListener("wheel", this.#handleWheel.bind(this))
        this.container.addEventListener("contextmenu", this.#handleContextMenu.bind(this))

        // Touch events
        this.container.addEventListener("touchmove", this.#handleTouchMove.bind(this))
        this.container.addEventListener("touchstart", this.#handleTouchStart.bind(this))
        this.container.addEventListener("touchend", this.#handleTouchEnd.bind(this))

        // 検出器の初期化
        const detector = new CircleGestureDetector(container, {
            minRadius: 10, // より小さい円を許容
            requiredDegrees: 270, // 完全な円でなくても許容
            timeThreshold: 3000, // より長い時間を許容
        })

        // ジェスチャー検出時のイベントリスナー
        container.addEventListener("circlegesture", (e) => {
            this.touch.circle = e.detail.clockwise ? -1 : 1
        })

        // Window focus events
        window.addEventListener("blur", this.#handleBlur.bind(this))
        window.addEventListener("focus", this.#handleFocus.bind(this))

        window.addEventListener("visibilitychange", this.#handleVisibility.bind(this))

        window.addEventListener("deviceorientation", this.#handleOrientation.bind(this))

        window.addEventListener("devicemotion", this.#handleAcceleration.bind(this), true)
    }

    #handleKeyDown(e) {
        if (!this.canInput) return

        if (!this.keyboard.pressed.has(e.code)) {
            this.keyboard.pushed.add(e.code)

            if (["KeyZ", "Enter", "Space"].includes(e.code)) {
                this.keyboard.pushed.add("ok")
            }
            if (["KeyX", "Escape", "Backspace"].includes(e.code)) {
                this.keyboard.pushed.add("cancel")
            }
        }

        this.keyboard.pressed.add(e.code)
        this.keyboard.longPressed.add(e.code)
    }

    #handleKeyUp(e) {
        if (!this.canInput) return

        this.keyboard.pressed.delete(e.code)
        this.keyboard.upped.add(e.code)
    }

    #handleMouseMove(e) {
        if (!this.canInput) return

        const rect = e.target.getBoundingClientRect()
        const center = vec(rect.width / 2, rect.height / 2)

        const cvsWidth = +this.cvsStyle.width.slice(0, -2)
        const cvsHeight = +this.cvsStyle.height.slice(0, -2)
        const cvsCenter = vec(cvsWidth, cvsHeight).mlt(1 / 2)

        this.mouse.p = vec(e.clientX - rect.x, e.clientY - rect.y)
            .sub(center)
            .rot(-this.mouse.angle)
            .add(cvsCenter)
            .mlt(width / cvsWidth)

        this.mouse.moved = true
    }

    #handleMouseDown(e) {
        if (!this.canInput) return

        switch (e.button) {
            case 0:
                this.mouse.clicked = true
                this.mouse.clicking = true
                break
            case 1:
                this.mouse.middleClicked = true
                this.mouse.middleClicking = true
                break
            case 2:
                this.mouse.rightClicked = true
                this.mouse.rightClicking = true
                break
        }
    }

    #handleMouseUp(e) {
        if (!this.canInput) return

        switch (e.button) {
            case 0:
                this.mouse.clicking = false
                break
            case 1:
                this.mouse.middleClicking = false
                break
            case 2:
                this.mouse.rightClicking = false
                break
        }
    }

    #handleWheel(e) {
        if (!this.canInput) return

        this.mouse.deltaX = e.deltaX
        this.mouse.deltaY = e.deltaY
    }

    #handleContextMenu(e) {
        e.preventDefault()

        if (!this.canInput) return

        this.mouse.rightClicked = true
    }

    #handleTouchStart(e) {
        this.#handleTouchMove(e)

        this.mouse.clicked = true

        const rect = e.target.getBoundingClientRect()
        const center = vec(rect.width / 2, rect.height / 2)

        const cvsWidth = +this.cvsStyle.width.slice(0, -2)
        const cvsHeight = +this.cvsStyle.height.slice(0, -2)
        const cvsCenter = vec(cvsWidth, cvsHeight).mlt(1 / 2)

        ;[...e.changedTouches].forEach((t) => {
            this.touch.justTouches[t.identifier] = {
                p: vec(t.clientX - rect.x, t.clientY - rect.y)
                    .sub(center)
                    .rot(-this.mouse.angle)
                    .add(cvsCenter)
                    .mlt(width / cvsWidth),
            }
        })
    }

    #handleTouchEnd(e) {
        ;[...e.changedTouches].forEach((t) => {
            delete this.touch.touches[t.identifier]
        })
    }

    #handleTouchMove(e) {
        const rect = e.target.getBoundingClientRect()
        const center = vec(rect.width / 2, rect.height / 2)

        const cvsWidth = +this.cvsStyle.width.slice(0, -2)
        const cvsHeight = +this.cvsStyle.height.slice(0, -2)
        const cvsCenter = vec(cvsWidth, cvsHeight).mlt(1 / 2)

        ;[...e.changedTouches].forEach((t) => {
            this.mouse.p = vec(t.clientX - rect.x, t.clientY - rect.y)
                .sub(center)
                .rot(-this.mouse.angle)
                .add(cvsCenter)
                .mlt(width / cvsWidth)

            this.touch.touches[t.identifier] = {
                p: this.mouse.p,
            }
        })
    }

    #handleBlur() {
        console.log("よそ見するにゃ!")
        this.focusState.isFocused = false
        this.focusState.justBlurred = true
    }

    #handleFocus() {
        console.log("こっち見んにゃ!")
        this.focusState.isFocused = true
        this.focusState.justFocused = true
    }

    #handleVisibility() {
        this.visibilityState.isVisible = document.visibilityState === "visible"

        if (this.visibilityState.isVisible) {
            this.visibilityState.justVisible = true
        } else {
            this.visibilityState.justHidden = true
            console.log("どこ見てんにゃ!")
        }
    }

    #handleOrientation(e) {
        this.orientation.alpha = e.alpha
        this.orientation.beta = e.beta
        this.orientation.gamma = e.gamma
    }

    #handleAcceleration(e) {
        this.acceleration = e.accelerationIncludingGravity
        this.rotationRate = e.rotationRate
    }

    updateInput() {
        this.keyboard.longPressed.clear()
        this.keyboard.pushed.clear()
        this.keyboard.upped.clear()

        this.mouse.deltaY = 0
        this.mouse.clicked = false
        this.mouse.rightClicked = false
        this.mouse.middleClicked = false
        this.mouse.moved = false

        this.touch.justTouches = []
        this.touch.circle = 0

        this.focusState.justFocused = false
        this.focusState.justBlurred = false

        this.visibilityState.justVisible = false
        this.visibilityState.justHidden = false

        if (!this.canInput) {
            this.keyboard.pressed.clear()
            this.mouse.clicking = false
            this.mouse.rightClicking = false
            this.mouse.middleClicking = false
        }
    }
}

const inputHandler = new InputHandler(container)

const { keyboard, mouse, touch, orientation, acceleration } = inputHandler
