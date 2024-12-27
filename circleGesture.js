class CircleGestureDetector {
    constructor(element, options = {}) {
        this.element = element
        this.options = {
            minRadius: 50, // 最小の円の半径
            maxGapDegrees: 30, // 許容される角度のギャップ
            requiredDegrees: 300, // 必要な角度の合計（完全な円は360度）
            timeThreshold: 2000, // ジェスチャー完了の制限時間（ミリ秒）
            ...options,
        }

        // 状態の初期化
        this.reset()

        // イベントリスナーの設定
        this.bindEvents()
    }

    reset() {
        this.tracking = false // 追跡中かどうか
        this.startTime = null // ジェスチャー開始時間
        this.center = { x: 0, y: 0 } // 円の中心
        this.points = [] // 追跡点の配列
        this.totalAngle = 0 // 累積角度
        this.lastAngle = null // 前回の角度
        this.lastPoint = null // 前回の位置
    }

    bindEvents() {
        this.element.addEventListener("touchstart", this.handleStart.bind(this))
        this.element.addEventListener("touchmove", this.handleMove.bind(this))
        this.element.addEventListener("touchend", this.handleEnd.bind(this))
    }

    handleStart(e) {
        e.preventDefault()
        const touch = e.touches[0]

        this.reset()
        this.tracking = true
        this.startTime = Date.now()
        this.lastPoint = { x: touch.clientX, y: touch.clientY }
        this.center = { ...this.lastPoint }
        this.points.push(this.lastPoint)
    }

    handleMove(e) {
        if (!this.tracking) return
        e.preventDefault()

        const touch = e.touches[0]
        const currentPoint = { x: touch.clientX, y: touch.clientY }

        // 点を追加
        this.points.push(currentPoint)

        // 中心点からの角度を計算
        const angle = this.calculateAngle(currentPoint)

        if (this.lastAngle !== null) {
            // 角度の変化を計算
            let angleDiff = angle - this.lastAngle

            // 角度の変化が180度を超える場合の補正
            if (angleDiff > 180) angleDiff -= 360
            if (angleDiff < -180) angleDiff += 360

            this.totalAngle += angleDiff
        }

        this.lastAngle = angle
        this.lastPoint = currentPoint

        // ジェスチャーの完了をチェック
        this.checkGestureCompletion()
    }

    handleEnd() {
        this.tracking = false
    }

    calculateAngle(point) {
        // 中心点からの角度を計算（ラジアンから度に変換）
        return (Math.atan2(point.y - this.center.y, point.x - this.center.x) * 180) / Math.PI
    }

    calculateRadius(point) {
        // 中心点からの距離を計算
        const dx = point.x - this.center.x
        const dy = point.y - this.center.y
        return Math.sqrt(dx * dx + dy * dy)
    }

    checkGestureCompletion() {
        const currentTime = Date.now()
        const elapsedTime = currentTime - this.startTime

        // 時間制限をチェック
        if (elapsedTime > this.options.timeThreshold) {
            this.reset()
            return
        }

        // 最小半径をチェック
        const radius = this.calculateRadius(this.lastPoint)
        if (radius < this.options.minRadius) {
            return
        }

        // 必要な角度に達したかチェック
        if (Math.abs(this.totalAngle) >= this.options.requiredDegrees) {
            // ジェスチャー完了イベントを発火
            const event = new CustomEvent("circlegesture", {
                detail: {
                    clockwise: this.totalAngle > 0,
                    angle: Math.abs(this.totalAngle),
                    duration: elapsedTime,
                    points: this.points,
                },
            })
            this.element.dispatchEvent(event)

            this.reset()
        }
    }
}
