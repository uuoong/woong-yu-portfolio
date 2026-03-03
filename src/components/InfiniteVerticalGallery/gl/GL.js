import { Renderer, Camera, Transform, Plane } from "ogl"
import NormalizeWheel from "https://cdn.jsdelivr.net/npm/normalize-wheel-es@1.2.0/dist/index.min.js"

import Media from "./Media.js"

import { lerp, bind } from "../../../utils/index.js"

class GL {
    constructor() {
        this.images = document.querySelectorAll("img")

        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0,
        }

        this.speed = 2

        bind(this)

        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.createGallery()

        this.onResize()

        this.createGeometry()
        this.createMedias()

        this.update()

        this.addEventListeners()
        this.createPreloader()
    }

    createGallery() {
        this.gallery = document.querySelector(".demo-1__gallery")
    }

    createPreloader() {
        Array.from(this.images).forEach((element) => {
            const image = new Image()

            this.loaded = 0

            image.src = element.src
            image.onload = (_) => {
                this.loaded += 1

                if (this.loaded === this.images.length) {
                    document.documentElement.classList.remove("loading")
                    document.documentElement.classList.add("loaded")
                }
            }
        })
    }

    createRenderer() {
        this.renderer = new Renderer({
            canvas: document.querySelector("#gl"),
            alpha: true,
        })

        this.gl = this.renderer.gl
    }

    createCamera() {
        this.camera = new Camera(this.gl)
        this.camera.fov = 45
        this.camera.position.z = 5
    }

    createScene() {
        this.scene = new Transform()
    }

    createGeometry() {
        this.planeGeometry = new Plane(this.gl, {
            heightSegments: 10,
        })
    }

    createMedias() {
        this.mediasElements = document.querySelectorAll(
            ".demo-1__gallery__figure"
        )
        this.medias = Array.from(this.mediasElements).map((element) => {
            let media = new Media({
                element,
                geometry: this.planeGeometry,
                gl: this.gl,
                height: this.galleryHeight,
                scene: this.scene,
                screen: this.screen,
                viewport: this.viewport,
            })

            return media
        })
    }

    /**
     * Events.
     */
    onTouchDown(event) {
        this.isDown = true

        this.scroll.position = this.scroll.current
        this.start = event.touches ? event.touches[0].clientY : event.clientY
    }

    onTouchMove(event) {
        if (!this.isDown) return

        const y = event.touches ? event.touches[0].clientY : event.clientY
        const distance = (this.start - y) * 2

        this.scroll.target = this.scroll.position + distance
    }

    onTouchUp(event) {
        this.isDown = false
    }

    onWheel(event) {
        const normalized = NormalizeWheel(event)
        const speed = normalized.pixelY

        this.scroll.target += speed * 0.5
    }

    /**
     * Resize.
     */
    onResize() {
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth,
        }

        this.renderer.setSize(this.screen.width, this.screen.height)

        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height,
        })

        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect

        this.viewport = {
            height,
            width,
        }

        this.galleryBounds = this.gallery.getBoundingClientRect()
        this.galleryHeight =
            (this.viewport.height * this.galleryBounds.height) /
            this.screen.height

        if (this.medias) {
            this.medias.forEach((media) =>
                media.onResize({
                    height: this.galleryHeight,
                    screen: this.screen,
                    viewport: this.viewport,
                })
            )
        }
    }

    /**
     * Update.
     */
    update() {
        this.scroll.target += this.speed

        this.scroll.current = lerp(
            this.scroll.current,
            this.scroll.target,
            this.scroll.ease
        )

        if (this.scroll.current > this.scroll.last) {
            this.direction = "down"
            this.speed = 2
        } else if (this.scroll.current < this.scroll.last) {
            this.direction = "up"
            this.speed = -2
        }

        if (this.medias) {
            this.medias.forEach((media) =>
                media.update(this.scroll, this.direction)
            )
        }

        this.renderer.render({
            scene: this.scene,
            camera: this.camera,
        })

        this.scroll.last = this.scroll.current

        window.requestAnimationFrame(this.update)
    }

    /**
     * Listeners.
     */
    addEventListeners() {
        window.addEventListener("resize", this.onResize)

        window.addEventListener("wheel", this.onWheel)
        window.addEventListener("mousewheel", this.onWheel)

        window.addEventListener("mousedown", this.onTouchDown)
        window.addEventListener("mousemove", this.onTouchMove)
        window.addEventListener("mouseup", this.onTouchUp)

        window.addEventListener("touchstart", this.onTouchDown)
        window.addEventListener("touchmove", this.onTouchMove)
        window.addEventListener("touchend", this.onTouchUp)
    }
}

export default GL
