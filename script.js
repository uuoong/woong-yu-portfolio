const onDesktop = (fn) =>
    gsap
        .matchMedia()
        .add(
            "(min-width: 992px) and (any-hover: hover) and (any-pointer: fine)",
            fn
        )

const onMobile = (fn) =>
    gsap
        .matchMedia()
        .add("(max-width: 1024px) and (hover: none) and (pointer: coarse)", fn)

// const onDesktop = (fn) => gsap.matchMedia().add("(min-width: 992px)", fn);
// const onMobile = (fn) => gsap.matchMedia().add("(max-width: 991px)", fn);

onDesktop(() => {})
onMobile(() => {})

CustomEase.create("ease-1", "M0,0 C0.15,0 0.15,1 1,1")

CustomEase.create(
    "ease-2",
    "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
)

document.addEventListener("click", function (e) {
    if (e.target.closest(".nav-open")) {
        e.target
            .closest("[data-barba='container']")
            .setAttribute("nav-state", "open")
    }

    if (e.target.closest(".nav-close")) {
        e.target
            .closest("[data-barba='container']")
            .setAttribute("nav-state", "")
    }
})

let muteDelay = 75
let audioCtx = null
let sfxBuffer = null
let audioUnlocked = false

async function initAudio() {
    if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (sfxBuffer) return
    const res = await fetch(
        "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68d2ccfb234c903955ace821_sfx-trim.mp3"
    )
    const arr = await res.arrayBuffer()
    sfxBuffer = await audioCtx.decodeAudioData(arr)
}

function unlockAudio() {
    if (audioUnlocked) return
    audioUnlocked = true
    initAudio().catch(() => {})
    if (audioCtx?.state === "suspended") audioCtx.resume()
}

const MIN_SOUND_INTERVAL_MS = 60
let lastSoundAt = 0

function tryPlaySfxWA() {
    const now = performance.now()
    if (!audioCtx || !sfxBuffer) return
    if (now - lastSoundAt < MIN_SOUND_INTERVAL_MS) return

    const src = audioCtx.createBufferSource()
    src.buffer = sfxBuffer
    const gain = audioCtx.createGain()
    gain.gain.value = 1.0
    src.connect(gain).connect(audioCtx.destination)
    src.start()
    lastSoundAt = now
}

// Wrap your mute button code in a function
function initMuteButtons() {
    $(".mute-btn")
        .off("click")
        .on("click", function () {
            $("body").toggleClass("is-muted")
        })
}

function distributeByPosition(vars) {
    var ease = vars.ease && gsap.parseEase(vars.ease),
        from = vars.from || 0,
        base = vars.base || 0,
        axis = vars.axis,
        ratio = { center: 0.5, end: 1, edges: 0.5 }[from] || 0,
        distances
    return function (i, target, a) {
        var l = a.length,
            originX,
            originY,
            x,
            y,
            d,
            j,
            minX,
            maxX,
            minY,
            maxY,
            positions
        if (!distances) {
            distances = []
            minX = minY = Infinity
            maxX = maxY = -minX
            positions = []
            for (j = 0; j < l; j++) {
                d = a[j].getBoundingClientRect()
                x = (d.left + d.right) / 2 //based on the center of each element
                y = (d.top + d.bottom) / 2
                if (x < minX) {
                    minX = x
                }
                if (x > maxX) {
                    maxX = x
                }
                if (y < minY) {
                    minY = y
                }
                if (y > maxY) {
                    maxY = y
                }
                positions[j] = { x: x, y: y }
            }
            originX = isNaN(from)
                ? minX + (maxX - minX) * ratio
                : positions[from].x || 0
            originY = isNaN(from)
                ? minY + (maxY - minY) * ratio
                : positions[from].y || 0
            maxX = 0
            minX = Infinity
            for (j = 0; j < l; j++) {
                x = positions[j].x - originX
                y = originY - positions[j].y
                distances[j] = d = !axis
                    ? Math.sqrt(x * x + y * y)
                    : Math.abs(axis === "y" ? y : x)
                if (d > maxX) {
                    maxX = d
                }
                if (d < minX) {
                    minX = d
                }
            }
            distances.max = maxX - minX
            distances.min = minX
            distances.v = l =
                (vars.amount || vars.each * l || 0) *
                (from === "edges" ? -1 : 1)
            distances.b = l < 0 ? base - l : base
        }
        l = (distances[i] - distances.min) / distances.max
        return distances.b + (ease ? ease(l) : l) * distances.v
    }
}

CustomEase.create("page-transition", "M0,0 C0.9,0 1,1 1,1 ")
CustomEase.create("workItemEase", "M0,0 C0.9,0 1,1 1,1 ")

const globalIcons = [
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b539a58bd56a0bceafb_Vector-8.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b52d5a2d798b05e757b_Vector-13.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51167afa69c3f41379_Vector-19.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51fd2f60af75c30586_Vector-18.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51b5cbcd93e19f7ed5_Vector.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b5147f23eece99f17f7_Vector-20.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51e5cde3d99e316319_Vector-22.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51d9b9320e0b4107e2_Vector-21.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51d2298aafc5b0feb2_Vector-10.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51289da1f6849bb1f1_Vector-16.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51d2298aafc5b0fe9f_Vector-11.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51f65a5c2c5d3d2956_Vector-17.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b514de716309e088dc8_Vector-14.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51475648ecdcd92a47_Vector-12.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b5155e447626777c12b_Vector-15.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b519f20bad3f36cb0af_Vector-9.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b518d9189faecce6d62_Vector-7.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51ac689f715a76a9d8_Vector-3.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b510cd6bd06f5ac00cd_Vector-4.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51ed0a3f5e661e4914_Vector-6.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51c8e19135fc9e70b0_Vector-1.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b51170938c7d37b7217_Vector-2.svg",
    "https://cdn.prod.website-files.com/688b167f96eb413c7eacbe05/68ad5b511a84276a30dba399_Vector-5.svg",
]

CustomEase.create("ease-3", "0.65, 0.01, 0.05, 0.99")

const lenis = new Lenis()

lenis.on("scroll", ScrollTrigger.update)

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// const onDesktop = (fn) => gsap.matchMedia().add("(min-width: 992px)", fn);
// const onMobile = (fn) => gsap.matchMedia().add("(max-width: 991px)", fn);

function singleProjectFunctions() {
    $("[data-barba-namespace='single-project']").each(function () {
        let projectSmallTitle = $(this).find("[project-client_name]")
        let projectSmallTitleTarget = $(this).find("[project-title_small]")
        projectSmallTitleTarget.text(projectSmallTitle.text())
    })

    $(".project-infinite_section").each(function () {
        let projInfSection = $(this)
        let track = projInfSection.find(".project-inf_list")
        let progInfItems = projInfSection.find(".project-inf_item")
        let spacer = projInfSection.find(".project-infinite_spacer")
        let stickyWrapper = projInfSection.find(".project-footer_wrap")

        // -----------------------
        // Remove items linking to current page
        // -----------------------
        const currentPath = window.location.pathname
        const currentUrl = window.location.href

        progInfItems.each(function () {
            const $item = $(this)
            const $link = $item.find(".project-inf_link")

            if ($link.length) {
                const linkHref = $link.attr("href")

                if (linkHref) {
                    // Handle both relative and absolute URLs
                    let linkPath
                    try {
                        if (linkHref.startsWith("http")) {
                            // Absolute URL
                            const linkUrl = new URL(linkHref)
                            linkPath = linkUrl.pathname
                        } else {
                            // Relative URL
                            linkPath = linkHref.split("?")[0].split("#")[0] // Remove query params and hash
                        }

                        // Remove trailing slash for comparison
                        const normalisedCurrentPath =
                            currentPath.replace(/\/$/, "") || "/"
                        const normalisedLinkPath =
                            linkPath.replace(/\/$/, "") || "/"

                        if (normalisedCurrentPath === normalisedLinkPath) {
                            $item.remove()
                        }
                    } catch (e) {
                        // If URL parsing fails, do basic string comparison
                        if (
                            linkHref === currentPath ||
                            linkHref === currentUrl
                        ) {
                            $item.remove()
                        }
                    }
                }
            }
        })

        // Re-select items after removal
        progInfItems = projInfSection.find(".project-inf_item")

        // If no items remain, exit early
        if (progInfItems.length === 0) {
            return
        }

        function updateProjectInfo(item, show = true) {
            const award = item.attr("project-award") || ""
            const name = item.attr("project-name") || ""
            if (show) {
                $(".project-item_award").text(award)
                $(".project-item_title").text(name)
                $(".project-inf_item-info").addClass("active")
            } else {
                $(".project-inf_item-info").removeClass("active")
            }
        }

        // -----------------------
        // Desktop functionality
        // -----------------------
        onDesktop(() => {
            let scrollTriggerInstance = null
            let resizeTimer

            // Function to set up or refresh the scroll animation
            function setupScrollAnimation() {
                // Kill existing ScrollTrigger if it exists
                if (scrollTriggerInstance) {
                    scrollTriggerInstance.kill()
                    scrollTriggerInstance = null
                }

                // Reset track position
                gsap.set(track, { x: 0 })

                // Recalculate dimensions
                const containerWidth = window.innerWidth
                let totalItemsWidth = 0
                progInfItems.each(function () {
                    totalItemsWidth += $(this).outerWidth(true)
                })
                const scrollDistance = Math.max(
                    0,
                    totalItemsWidth - containerWidth
                )

                // If items fit within viewport, no need for scroll
                if (scrollDistance <= 0) {
                    spacer.css("height", "0px")
                    return
                }

                // Define consistent speed: pixels moved per 100vh of scroll
                const SPEED_PX_PER_100VH = 1500 // Adjust this value to set your desired speed

                // Calculate how much scroll height we need based on the track width and desired speed
                const scrollHeightNeeded =
                    (scrollDistance / SPEED_PX_PER_100VH) * window.innerHeight

                // Set the spacer height to create the required scroll distance
                spacer.css("height", scrollHeightNeeded + "px")

                // Create new ScrollTrigger
                scrollTriggerInstance = ScrollTrigger.create({
                    trigger: projInfSection,
                    start: "clamp(top top)",
                    end: "clamp(bottom top)",
                    pin: stickyWrapper,
                    endTrigger: spacer,
                    scrub: 0.4,
                    pinSpacing: false,
                    animation: gsap.to(track, {
                        x: -scrollDistance,
                        ease: "linear",
                    }),
                })
            }

            // Initial setup
            setupScrollAnimation()

            // Handle resize
            window.addEventListener("resize", () => {
                clearTimeout(resizeTimer)
                resizeTimer = setTimeout(() => {
                    setupScrollAnimation()
                    // Also refresh Lenis and ScrollTrigger globally
                    if (window.lenis) {
                        lenis.resize()
                    }
                    ScrollTrigger.refresh()
                }, 250) // Debounce resize events
            })

            // Mouse interactions
            progInfItems.on("mouseenter", function () {
                const $item = $(this)
                $item.addClass("project-highlighted")
                updateProjectInfo($item, true)
            })

            progInfItems.on("mouseleave", function () {
                const $item = $(this)
                $item.removeClass("project-highlighted")
                updateProjectInfo($item, false)
            })

            // Cleanup on destroy
            projInfSection.on("destroy", function () {
                if (scrollTriggerInstance) {
                    scrollTriggerInstance.kill()
                }
                window.removeEventListener("resize", setupScrollAnimation)
            })
        })

        // -----------------------
        // Mobile functionality (slider with snap to items)
        // -----------------------
        onMobile(() => {
            let currentIndex = 0 // logical index 0..n-1
            let isAnimating = false
            let currentHighlighted = null

            // --- Clone originals for infinite loop ---
            const originalItems = progInfItems.clone()
            const cloneBefore = originalItems.clone().addClass("clone-before")
            const cloneAfter = originalItems.clone().addClass("clone-after")
            track.prepend(cloneBefore)
            track.append(cloneAfter)

            // Re-select after cloning
            const allItems = track.find(".project-inf_item")
            const totalOriginalItems = progInfItems.length

            // Helpers
            const norm = (i) =>
                ((i % totalOriginalItems) + totalOriginalItems) %
                totalOriginalItems
            const getViewportCenter = () => {
                const rect = projInfSection[0].getBoundingClientRect()
                return rect.left + rect.width / 2
            }

            // Measure item positions
            let itemPositions = []
            let totalWidth = 0

            const computePositions = () => {
                itemPositions = []
                totalWidth = 0
                allItems.each(function () {
                    const itemWidth = $(this).outerWidth(true)
                    itemPositions.push({
                        element: this,
                        position: totalWidth + itemWidth / 2,
                        width: itemWidth,
                    })
                    totalWidth += itemWidth
                })
            }

            computePositions()

            const getOriginalSetWidth = () => {
                let w = 0
                for (
                    let i = totalOriginalItems;
                    i < totalOriginalItems * 2;
                    i++
                ) {
                    w += itemPositions[i].width
                }
                return w
            }

            let originalSetWidth = getOriginalSetWidth()

            // Wrap x into the middle strip range [-originalSetWidth, 0)
            const wrapX = (x) => {
                const w = originalSetWidth
                let nx = x % w
                if (nx > 0) nx -= w // keep it negative so we always sit on the middle strip
                return nx
            }

            // Quick setter for super-smooth updates
            const setX = gsap.quickSetter(track[0], "x", "px")

            // Start centred on first original item (index 0 in the middle strip)
            const startPosition = -(
                itemPositions[totalOriginalItems].position - getViewportCenter()
            )
            setX(wrapX(startPosition))

            // Highlight helper (always point at middle/original strip)
            function updateHighlight(index) {
                const actualIndex = totalOriginalItems + norm(index)
                const item = itemPositions[actualIndex].element
                if (currentHighlighted !== item) {
                    if (currentHighlighted)
                        $(currentHighlighted).removeClass("project-highlighted")
                    $(item).addClass("project-highlighted")
                    currentHighlighted = item
                    updateProjectInfo($(item), true)
                }
            }

            // Compute the best (nearest) clone for a logical index in {prev, middle, next}
            const bestActualIndexFor = (logicalIndex) => {
                const idx = norm(logicalIndex)
                const candidates = [
                    idx, // before strip
                    totalOriginalItems + idx, // middle strip
                    totalOriginalItems * 2 + idx, // after strip
                ]
                const center = getViewportCenter()
                const current = gsap.getProperty(track[0], "x")
                let best = candidates[0]
                let bestDist = Infinity
                for (const ci of candidates) {
                    const targetPos = -(itemPositions[ci].position - center)
                    const dist = Math.abs(targetPos - current)
                    if (dist < bestDist) {
                        bestDist = dist
                        best = ci
                    }
                }
                return best
            }

            // Snap to logical index using a proxy tween; wrap continuously in onUpdate (no post normalise).
            const proxy = { x: gsap.getProperty(track[0], "x") || 0 }

            const snapToLogicalIndex = (logicalIndex, duration = 0.4) => {
                if (isAnimating) return
                isAnimating = true

                const actualIndex = bestActualIndexFor(logicalIndex)
                const targetPos = -(
                    itemPositions[actualIndex].position - getViewportCenter()
                )

                // Update proxy start from current wrapped x to avoid any start jump
                proxy.x = wrapX(gsap.getProperty(track[0], "x"))

                gsap.to(proxy, {
                    x: targetPos,
                    duration,
                    ease: "power2.inOut",
                    onUpdate: () => setX(wrapX(proxy.x)), // continuous wrapping prevents blank flashes
                    onComplete: () => {
                        currentIndex = norm(logicalIndex)
                        isAnimating = false
                        updateHighlight(currentIndex)
                    },
                })
            }

            // Move by delta (-1 or +1)
            const snapBy = (delta) => snapToLogicalIndex(currentIndex + delta)

            // Touch swipe (horizontal only), move exactly one item
            let touchStartX = 0
            let touchStartY = 0
            let isSwiping = false

            projInfSection.on("touchstart", function (e) {
                if (isAnimating) return
                touchStartX = e.touches[0].clientX
                touchStartY = e.touches[0].clientY
                isSwiping = false
            })

            projInfSection.on("touchmove", function (e) {
                if (isAnimating) return
                const touchCurrentX = e.touches[0].clientX
                const touchCurrentY = e.touches[0].clientY
                const diffX = Math.abs(touchStartX - touchCurrentX)
                const diffY = Math.abs(touchStartY - touchCurrentY)
                if (diffX > diffY && diffX > 10) {
                    isSwiping = true
                    e.preventDefault() // lock vertical scroll while swiping horizontally
                }
            })

            // LEFT swipe = previous (-1). RIGHT swipe = next (+1).
            projInfSection.on("touchend", function (e) {
                if (isAnimating || !isSwiping) return
                const touchEndX = e.changedTouches[0].clientX
                const diff = touchStartX - touchEndX
                if (Math.abs(diff) > 50) {
                    snapBy(diff > 0 ? -1 : +1)
                }
                isSwiping = false
            })

            // Initial highlight
            updateHighlight(0)

            // Handle resize: recompute positions and keep the same logical index (instant)
            let resizeTimer
            const onResize = () => {
                clearTimeout(resizeTimer)
                resizeTimer = setTimeout(() => {
                    computePositions()
                    originalSetWidth = getOriginalSetWidth()
                    const ai = bestActualIndexFor(currentIndex)
                    const pos = -(
                        itemPositions[ai].position - getViewportCenter()
                    )
                    proxy.x = pos // reset proxy
                    setX(wrapX(pos)) // set wrapped x instantly
                    updateHighlight(currentIndex)
                }, 250)
            }
            window.addEventListener("resize", onResize, { passive: true })

            // Cleanup on destroy
            projInfSection.on("destroy", function () {
                gsap.killTweensOf(proxy)
                projInfSection.off("touchstart touchmove touchend")
                window.removeEventListener("resize", onResize)
            })
        })
    })
    setTimeout(() => {
        onDesktop(() => {
            lenis.resize()
            ScrollTrigger.refresh()
        })
    }, 50)
}

function homeFunctions() {
    $(".page-home").each(function () {
        let homePage = $(this)
        let eyeWrap = homePage.find("[eye-toggle]")

        eyeWrap.on("click", function () {
            let workItemBgs = homePage.find(".work-item .work-item_bg")

            let toggleTimeline = gsap.timeline({
                defaults: { duration: 0.8, ease: "expo.inOut" },
            })

            if (homePage.attr("work-items-display") !== "show-thumbs") {
                toggleTimeline
                    .to(workItemBgs, {
                        width: "0%",
                        stagger: distributeByPosition({
                            amount: 0.75,
                            from: "start",
                        }),
                        ease: "expo.out",
                        // stagger: { amount: 0.75, from: "start" },
                    })
                    .call(
                        () =>
                            homePage.attr("work-items-display", "show-thumbs"),
                        null,
                        "<"
                    )
            } else {
                toggleTimeline
                    .to(workItemBgs, {
                        width: "100%",
                        stagger: distributeByPosition({
                            amount: 0.75,
                            from: "start",
                        }),
                        ease: "expo.out",
                    })
                    .call(
                        () => homePage.removeAttr("work-items-display"),
                        null,
                        "<"
                    )
            }
        })
    })
    class InfiniteScroller {
        constructor(container) {
            this.container = container
            this.wrap = container.querySelector(".home-infinite_component")
            this.items = [...container.querySelectorAll(".work-wrap")]
            this.workItems = [...container.querySelectorAll(".work-item")]

            if (!this.wrap || !this.items.length) return

            // State management
            this.state = {
                currentScrollPosition: 0,
                smoothScrollY: 0,
                isScrolling: false,
                currentCenterIndex: -1,
                velocity: 0,
                rafId: null,
                isAnimating: false,
                mouseX: 0,
                mouseY: 0,
                currentHoveredItem: null,
                frameCount: 0,
            }

            this.config = {
                maxScrollSpeed: 40, // Maximum pixels per frame - adjust this value
                scrollMultiplier: 1, // Overall scroll speed multiplier
                smoothness: 0.12, // Interpolation factor (0.05 = smoother, 0.2 = more responsive)
                touchMultiplier: 2, // Touch scroll multiplier
            }

            // Cache dimensions
            this.updateDimensions()

            // Device detection
            this.isMobile =
                "ontouchstart" in window || navigator.maxTouchPoints > 0

            // Bind methods
            this.animate = this.animate.bind(this)
            this.handleWheel = this.handleWheel.bind(this)
            this.handleResize = this.debounce(this.handleResize.bind(this), 50)
            this.updateHoverState = this.updateHoverState.bind(this)

            this.init()
        }

        init() {
            // Set initial positions
            this.adjustItemsPosition(0)

            // Add CSS classes for performance
            this.container.classList.add("infinite-scroll-container")

            // Prevent default scroll behaviour on the container
            this.container.style.overflow = "hidden"
            this.wrap.style.overflow = "visible"

            // Setup event listeners with proper options
            this.setupEventListeners()

            // Setup Intersection Observer for mobile
            if (this.isMobile) {
                this.setupIntersectionObserver()
            }

            // Start animation loop only when needed
            this.startAnimation()
        }

        updateDimensions() {
            this.dimensions = {
                wrapHeight: this.wrap.clientHeight,
                itemHeight: this.items[0]?.clientHeight || 0,
                totalHeight:
                    this.items.length * (this.items[0]?.clientHeight || 0),
            }
        }

        setupEventListeners() {
            // Wheel events with passive flag for better performance
            // Listen on the entire container for scrolling anywhere
            if (!this.isMobile) {
                this.container.addEventListener("wheel", this.handleWheel, {
                    passive: true,
                })
                this.setupDesktopHovers()
                this.setupMouseTracking()
            } else {
                this.setupTouchEvents()
            }

            // Resize observer for better performance than resize event
            const resizeObserver = new ResizeObserver(this.handleResize)
            resizeObserver.observe(this.wrap)
        }

        setupMouseTracking() {
            // Track mouse position for dynamic hover updates while scrolling
            this.container.addEventListener("mousemove", (e) => {
                this.state.mouseX = e.clientX
                this.state.mouseY = e.clientY
            })

            // Clear hover state when mouse leaves container
            this.container.addEventListener("mouseleave", () => {
                this.state.mouseX = 0
                this.state.mouseY = 0
                if (this.state.currentHoveredItem) {
                    this.handleItemLeave()
                    this.state.currentHoveredItem = null
                }
            })
        }

        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: "-50% 0px -50% 0px", // Only trigger when item is near centre
                threshold: 0,
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = this.workItems.indexOf(entry.target)
                        if (index !== -1) {
                            this.updateCenterItem(index)
                        }
                    }
                })
            }, options)

            this.workItems.forEach((item) => this.observer.observe(item))
        }

        setupDesktopHovers() {
            this.workItems.forEach((item, index) => {
                item.addEventListener("mouseenter", (e) => {
                    this.handleItemHover(item, index)
                })

                item.addEventListener("mouseleave", (e) => {
                    const relatedTarget = e.relatedTarget
                    const isLeavingToAnotherWorkItem =
                        relatedTarget?.closest(".work-item")

                    if (
                        !isLeavingToAnotherWorkItem &&
                        !this.state.isScrolling
                    ) {
                        this.handleItemLeave()
                    }
                })
            })

            // Filter items hover functionality
            this.setupFilterHovers()

            // Info panel follow cursor
            this.setupInfoPanelTracking()
        }

        updateHoverState() {
            // Check which element is under the cursor during scrolling
            if (this.state.mouseX === 0 && this.state.mouseY === 0) return

            const elementUnderCursor = document.elementFromPoint(
                this.state.mouseX,
                this.state.mouseY
            )
            const workItem = elementUnderCursor?.closest(".work-item")

            // If we're hovering over a different item (or no item)
            if (workItem !== this.state.currentHoveredItem) {
                // Clear previous hover
                if (this.state.currentHoveredItem) {
                    this.handleItemLeave()
                }

                // Set new hover if over a work item
                if (workItem && this.workItems.includes(workItem)) {
                    const index = this.workItems.indexOf(workItem)
                    this.handleItemHover(workItem, index)
                } else {
                    this.state.currentHoveredItem = null
                }
            }
        }

        setupFilterHovers() {
            const filterItems = document.querySelectorAll(".filter-item")

            filterItems.forEach((filterItem) => {
                filterItem.addEventListener("mouseenter", () => {
                    const filterText = filterItem
                        .querySelector(".filter-text")
                        ?.textContent.trim()
                    if (!filterText) return

                    this.workItems.forEach((workItem) => {
                        const hasCategory = [
                            ...workItem.querySelectorAll(".hidden-filter_item"),
                        ].some(
                            (el) =>
                                el.getAttribute("filter-category") ===
                                filterText
                        )

                        if (hasCategory) {
                            workItem.classList.add("filter-highlight")
                        }
                    })
                })

                filterItem.addEventListener("mouseleave", () => {
                    this.workItems.forEach((workItem) => {
                        workItem.classList.remove("filter-highlight")
                    })
                })
            })
        }

        setupInfoPanelTracking() {
            const infoPanel = document.querySelector(".work-item_info")
            if (!infoPanel) return

            let rafId = null
            let mouseY = 0

            const updatePosition = () => {
                infoPanel.style.transform = `translate(0, ${mouseY}px) translateY(-50%)`
                rafId = null
            }

            this.container.addEventListener("mousemove", (e) => {
                mouseY = e.clientY

                if (!rafId) {
                    rafId = requestAnimationFrame(updatePosition)
                }
            })
        }

        handleItemHover(item, index) {
            // Store the currently hovered item
            this.state.currentHoveredItem = item

            // Remove all classes first
            this.workItems.forEach((el) => {
                el.classList.remove("target-project", "adj-project")
            })

            // Add classes for CSS transitions
            item.classList.add("target-project")

            const totalItems = this.workItems.length
            const nextIndex = (index + 1) % totalItems
            const prevIndex = (index - 1 + totalItems) % totalItems

            this.workItems[nextIndex]?.classList.add("adj-project")
            this.workItems[prevIndex]?.classList.add("adj-project")

            // Update info display
            this.updateWorkItemInfo(item)

            // Show info panel
            const infoPanel = document.querySelector(".work-item_info")
            if (infoPanel) {
                infoPanel.classList.add("visible")
            }
        }

        handleItemLeave() {
            this.state.currentHoveredItem = null

            this.workItems.forEach((item) => {
                item.classList.remove("target-project", "adj-project")
            })

            const infoPanel = document.querySelector(".work-item_info")
            if (infoPanel) {
                infoPanel.classList.remove("visible")
            }

            // Clear info
            this.clearWorkItemInfo()
        }

        setupTouchEvents() {
            let touchStartY = 0
            let lastTouchTime = 0

            // Listen on container for touch anywhere on the component
            this.container.addEventListener(
                "touchstart",
                (e) => {
                    touchStartY = e.touches[0].clientY
                    lastTouchTime = Date.now()
                    this.state.velocity = 0
                },
                { passive: true }
            )

            this.container.addEventListener(
                "touchmove",
                (e) => {
                    e.preventDefault()

                    const currentTime = Date.now()
                    const currentTouchY = e.touches[0].clientY
                    let deltaY = touchStartY - currentTouchY
                    const deltaTime = currentTime - lastTouchTime

                    if (deltaTime > 0) {
                        this.state.velocity = deltaY / deltaTime
                    }

                    // Apply touch multiplier and clamp to max speed
                    let scrollDelta = deltaY * this.config.touchMultiplier
                    scrollDelta = Math.max(
                        -this.config.maxScrollSpeed,
                        Math.min(this.config.maxScrollSpeed, scrollDelta)
                    )

                    this.state.currentScrollPosition -= scrollDelta
                    touchStartY = currentTouchY
                    lastTouchTime = currentTime

                    this.startAnimation()
                },
                { passive: false }
            )

            this.container.addEventListener(
                "touchend",
                () => {
                    this.applyMomentum()
                },
                { passive: true }
            )
        }

        applyMomentum() {
            const decay = () => {
                if (Math.abs(this.state.velocity) > 0.1) {
                    // Apply velocity with speed limit
                    let momentumDelta = this.state.velocity * 10
                    momentumDelta = Math.max(
                        -this.config.maxScrollSpeed,
                        Math.min(this.config.maxScrollSpeed, momentumDelta)
                    )

                    this.state.currentScrollPosition -= momentumDelta
                    this.state.velocity *= 0.95
                    requestAnimationFrame(decay)
                } else {
                    this.state.velocity = 0
                }
            }

            if (Math.abs(this.state.velocity) > 0.5) {
                decay()
            }
        }

        handleWheel(event) {
            // Apply scroll multiplier and clamp to max speed
            let scrollDelta = event.deltaY * this.config.scrollMultiplier

            // Clamp the scroll speed to the maximum
            scrollDelta = Math.max(
                -this.config.maxScrollSpeed,
                Math.min(this.config.maxScrollSpeed, scrollDelta)
            )

            this.state.currentScrollPosition -= scrollDelta
            this.startAnimation()
        }

        handleResize() {
            this.updateDimensions()
            this.adjustItemsPosition(this.state.smoothScrollY)
        }

        adjustItemsPosition(scroll) {
            const { itemHeight, totalHeight } = this.dimensions

            this.items.forEach((item, index) => {
                const baseY = index * itemHeight + scroll
                const wrappedY = this.wrapValue(
                    -itemHeight,
                    totalHeight - itemHeight,
                    baseY
                )
                item.style.transform = `translateY(${wrappedY}px)`
            })
        }

        wrapValue(min, max, value) {
            const range = max - min
            return ((((value - min) % range) + range) % range) + min
        }

        updateCenterItem(index) {
            if (index === this.state.currentCenterIndex) return

            this.state.currentCenterIndex = index

            // Use CSS classes for transitions
            this.workItems.forEach((item) => {
                item.classList.remove("target-project", "adj-project")
            })

            const totalItems = this.workItems.length
            const centerItem = this.workItems[index]
            const prevIndex = (index - 1 + totalItems) % totalItems
            const nextIndex = (index + 1) % totalItems

            centerItem?.classList.add("target-project")
            this.workItems[prevIndex]?.classList.add("adj-project")
            this.workItems[nextIndex]?.classList.add("adj-project")

            this.updateWorkItemInfo(centerItem)
        }

        updateWorkItemInfo(item) {
            if (!item) return

            const award = item.getAttribute("work-award") || ""
            const name = item.getAttribute("work-name") || ""

            const awardEl = document.querySelector(".work-item_award")
            const titleEl = document.querySelector(".work-item_title")

            if (awardEl) awardEl.textContent = award
            if (titleEl) titleEl.textContent = name

            // Update filter categories
            this.updateFilterCategories(item)
        }

        updateFilterCategories(item) {
            const categories = [...item.querySelectorAll(".hidden-filter_item")]
                .map((el) => el.getAttribute("filter-category"))
                .filter(Boolean)

            document.querySelectorAll(".filter-item").forEach((filterItem) => {
                const filterText = filterItem
                    .querySelector(".filter-text")
                    ?.textContent.trim()
                if (categories.includes(filterText)) {
                    filterItem.classList.add("related")
                } else {
                    filterItem.classList.remove("related")
                }
            })
        }

        clearWorkItemInfo() {
            const awardEl = document.querySelector(".work-item_award")
            const titleEl = document.querySelector(".work-item_title")

            if (awardEl) awardEl.textContent = ""
            if (titleEl) titleEl.textContent = ""

            document.querySelectorAll(".filter-item").forEach((item) => {
                item.classList.remove("related")
            })
        }

        startAnimation() {
            if (this.state.isAnimating) return

            this.state.isAnimating = true
            this.animate()
        }

        animate() {
            const diff =
                this.state.currentScrollPosition - this.state.smoothScrollY

            // Check if we're still scrolling
            const wasScrolling = this.state.isScrolling
            this.state.isScrolling = Math.abs(diff) > 0.5

            // Stop animation when movement is minimal
            if (Math.abs(diff) < 0.01) {
                this.state.isAnimating = false
                this.state.isScrolling = false
                this.state.smoothScrollY = this.state.currentScrollPosition
                this.adjustItemsPosition(this.state.smoothScrollY)
                this.state.frameCount = 0

                // Final hover state check when scrolling stops
                if (!this.isMobile && wasScrolling) {
                    this.updateHoverState()
                }

                return
            }

            // Smooth interpolation with configurable smoothness
            this.state.smoothScrollY += diff * this.config.smoothness
            this.adjustItemsPosition(this.state.smoothScrollY)

            // Update hover state while scrolling (desktop only)
            // Check every 3 frames for better performance
            if (!this.isMobile && this.state.isScrolling) {
                this.state.frameCount++
                if (this.state.frameCount % 3 === 0) {
                    this.updateHoverState()
                }
            }

            if (this.state.isAnimating) {
                this.state.rafId = requestAnimationFrame(this.animate)
            }
        }

        disable() {
            // Store current state
            this.wasAnimating = this.state.isAnimating

            // Stop the animation loop
            if (this.state.rafId) {
                cancelAnimationFrame(this.state.rafId)
                this.state.rafId = null
            }
            this.state.isAnimating = false
            this.state.isScrolling = false

            // Remove scroll event listeners
            if (!this.isMobile) {
                this.container.removeEventListener("wheel", this.handleWheel)
            } else {
                this.container.removeEventListener(
                    "touchstart",
                    this.handleTouchStart
                )
                this.container.removeEventListener(
                    "touchmove",
                    this.handleTouchMove
                )
                this.container.removeEventListener(
                    "touchend",
                    this.handleTouchEnd
                )
            }
        }

        enable() {
            // Re-add scroll event listeners
            if (!this.isMobile) {
                this.container.addEventListener("wheel", this.handleWheel, {
                    passive: true,
                })
            } else {
                this.setupTouchEvents()
            }

            // Restart animation if it was previously running
            if (this.wasAnimating) {
                this.startAnimation()
            }
        }

        // Utility function for debouncing
        debounce(func, wait) {
            let timeout
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout)
                    func(...args)
                }
                clearTimeout(timeout)
                timeout = setTimeout(later, wait)
            }
        }

        destroy() {
            // Clean up event listeners and observers
            if (this.observer) {
                this.observer.disconnect()
            }

            if (this.state.rafId) {
                cancelAnimationFrame(this.state.rafId)
            }

            // Remove event listeners
            this.container.removeEventListener("wheel", this.handleWheel)

            // Clean up hover state
            if (this.state.currentHoveredItem) {
                this.handleItemLeave()
            }
        }
    }

    /**
     * Main initialization function
     */
    function initHomeFunctions() {
        const homePages = document.querySelectorAll(".page-home")

        if (!homePages.length) return

        homePages.forEach((page) => {
            // Initialize modules only if required elements exist
            const hasInfiniteScroll = page.querySelector(
                ".home-infinite_component"
            )
            const hasEyeToggle = page.querySelector(".eye-wrap")

            const modules = {}

            if (hasInfiniteScroll) {
                modules.scroller = new InfiniteScroller(page)
            }

            // Store instances for potential cleanup
            if (Object.keys(modules).length > 0) {
                page._homeModules = modules
            }
        })
    }

    initHomeFunctions()
}

function logoLottie() {
    $("[lottie-component]").each(function (index) {
        let lottieFile = $(this).find("[lottie-el]")
        let lottieUrl = lottieFile.attr("lottie-url")

        let lottieAnimation = bodymovin.loadAnimation({
            container: lottieFile[0],
            renderer: "svg",
            autoplay: false,
            loop: false,
            path: lottieUrl,
        })
        $("[lottie-component]").on("mouseenter", function () {
            bodymovin.setDirection(1)
            lottieAnimation.play()
        })

        $("[lottie-component]").on("mouseleave", function () {
            lottieAnimation.setDirection(-1)
            lottieAnimation.play()
        })
    })
}
logoLottie()

function aboutFunctions() {
    $(".page-about").each(function () {
        let aboutPage = $(this)
        const heroElement = aboutPage.find(".about-hero")
        const layoutOptions = [null, "layout-1", "layout-2"]
        const randomLayout =
            layoutOptions[Math.floor(Math.random() * layoutOptions.length)]

        if (randomLayout) {
            heroElement.addClass(randomLayout)
        }

        function getRandomUniqueImages(array, count) {
            const shuffled = [...array].sort(() => 0.5 - Math.random())
            return shuffled.slice(0, count)
        }

        // Get 4 random unique images
        const selectedImages = getRandomUniqueImages(globalIcons, 4)

        // Assign them to the floating image elements
        $(".about-floating_img").each(function (index) {
            if (selectedImages[index]) {
                $(this).attr("src", selectedImages[index])
            }
        })

        function initializeCube(cubeElement) {
            let cube = $(cubeElement)
            let originalFace = cube.find(".title-face").first()
            let cubeWrapper = cube.closest(".title-cube_wrap")

            // Remove any existing cloned faces
            cube.find(".title-face.cloned").remove()

            // Clone the original face 3 times to create all 4 faces
            for (let i = 0; i < 3; i++) {
                let clonedFace = originalFace.clone().addClass("cloned")
                cube.append(clonedFace)
            }

            // Now get all faces (original + cloned)
            let cubeFaces = cube.find(".title-face")

            // Measure face width and calculate depth
            let faceWidth = originalFace[0].offsetWidth
            let depth = faceWidth / 2

            // Set initial positions for all 4 faces
            gsap.set(cubeFaces[0], { transform: `translateZ(${depth}px)` }) // Front (0횂째)
            gsap.set(cubeFaces[1], {
                transform: `rotateY(90deg) translateZ(${depth}px)`,
            }) // Right (90횂째)
            gsap.set(cubeFaces[2], {
                transform: `rotateY(180deg) translateZ(${depth}px)`,
            }) // Back (180횂째)
            gsap.set(cubeFaces[3], {
                transform: `rotateY(-90deg) translateZ(${depth}px)`,
            }) // Left (270횂째)

            return { cube, cubeWrapper }
        }

        // Initialize all cubes within this page-about element
        let cubes = []
        $(this)
            .find(".title-cube")
            .each(function () {
                let { cube, cubeWrapper } = initializeCube(this)

                // Track current rotation
                let currentRotation = 0
                let isAnimating = false

                // Mouse enter event

                cubeWrapper.on("mouseenter", function () {
                    if (!isAnimating) {
                        isAnimating = true
                        currentRotation -= 90

                        // Create new rotation animation
                        gsap.to(cube[0], {
                            rotationY: currentRotation,
                            duration: 0.7,
                            ease: "power2.out",
                            onComplete: function () {
                                isAnimating = false
                            },
                        })
                    }
                })

                // Store cube data for resize handling
                cubes.push({
                    element: this,
                    currentRotation: () => currentRotation,
                })
            })

        // Handle window resize
        // let resizeTimeout;
        // $(window).on("resize", function () {
        //   clearTimeout(resizeTimeout);
        //   resizeTimeout = setTimeout(function () {
        //     cubes.forEach((cubeData) => {
        //       initializeCube(cubeData.element);
        //     });
        //   }, 150);
        // });

        function initializeMouseTriggers() {
            const floatingElements = aboutPage.find(".about-floating_el")
            const cubeElements = aboutPage.find(".title-cube_wrap") // Using cube wrappers as trigger elements
            let elementData = []
            let cubeData = []
            let lastTriggeredElement = null
            let isThrottled = false

            // Initialize floating element data
            floatingElements.each(function (index) {
                const $element = $(this)
                const rect = this.getBoundingClientRect()
                const scrollTop = $(window).scrollTop()

                elementData.push({
                    element: $element,
                    topY: rect.top + scrollTop,
                    bottomY: rect.bottom + scrollTop,
                    hasTriggered: false,
                })
            })

            // Initialize cube data
            cubeElements.each(function (index) {
                const $cube = $(this)
                cubeData.push({
                    element: $cube,
                    index: index,
                })
            })

            // Hover event on cubes

            cubeElements.on("mouseenter.floatingTrigger", function (e) {
                if (isThrottled) return

                const cubeRect = this.getBoundingClientRect()
                const scrollTop = $(window).scrollTop()

                // Get cube's vertical position
                const cubeTopY = cubeRect.top + scrollTop
                const cubeBottomY = cubeRect.bottom + scrollTop

                // Throttle to prevent rapid triggers
                isThrottled = true
                setTimeout(() => {
                    isThrottled = false
                }, 100)

                // Check which floating element this cube is vertically aligned with
                elementData.forEach((data, index) => {
                    const { element, topY, bottomY } = data
                    const tolerance = 20 // Adjust this value to make the trigger area more or less sensitive

                    // Check if cube's Y position is within the Y bounds of the floating element
                    const isWithinVerticalBounds =
                        cubeTopY <= bottomY + tolerance &&
                        cubeBottomY >= topY - tolerance

                    // Trigger if cube is within vertical bounds and hasn't been triggered recently
                    if (
                        isWithinVerticalBounds &&
                        !data.hasTriggered &&
                        lastTriggeredElement !== index
                    ) {
                        triggerFloatingAnimation(element, index + 1, data)
                        lastTriggeredElement = index

                        // Reset trigger state after animation
                        setTimeout(() => {
                            data.hasTriggered = false
                            if (lastTriggeredElement === index) {
                                lastTriggeredElement = null
                            }
                        }, 1200)
                    }
                })
            })

            // Update positions on scroll and resize
            function updateElementPositions() {
                floatingElements.each(function (index) {
                    const rect = this.getBoundingClientRect()
                    const scrollTop = $(window).scrollTop()

                    if (elementData[index]) {
                        elementData[index].topY = rect.top + scrollTop
                        elementData[index].bottomY = rect.bottom + scrollTop
                    }
                })
            }

            // Initial position update
            setTimeout(() => {
                updateElementPositions()
            }, 1)

            $(window).on(
                "mousemove scroll.floatingTrigger resize.floatingTrigger",
                updateElementPositions
            )

            return elementData
        }

        function triggerFloatingAnimation(element, elementNumber, data) {
            data.hasTriggered = true
            const moveDirection =
                elementNumber === 1 || elementNumber === 3 ? "-60%" : "60%"

            // Create timeline for the animation sequence
            const floatingIconTl = gsap.timeline()

            floatingIconTl
                .to(element[0], {
                    x: moveDirection,
                    duration: 0.7,
                    ease: "power2.out",
                })
                .to(element[0], {
                    x: "0%",
                    duration: 0.7,
                    ease: "sine.inOut",
                })
        }

        // Initialize the mouse trigger system
        const elementData = initializeMouseTriggers.call(this)

        // Force an immediate position update after a brief delay
        setTimeout(() => {
            $(this)
                .find(".about-floating_el")
                .each(function (index) {
                    const rect = this.getBoundingClientRect()
                    const scrollTop = $(window).scrollTop()

                    if (elementData[index]) {
                        elementData[index].topY = rect.top + scrollTop
                        elementData[index].bottomY = rect.bottom + scrollTop
                    }
                })
        }, 150)

        // Clean up on page change/unload
        $(window).on("beforeunload", function () {
            $(document).off(".floatingTrigger")
            $(window).off(".floatingTrigger")
        })

        let aboutHero = aboutPage.find(".about-hero")
        let aboutDivider = aboutPage.find(".about-divider")
        let aboutPanels = aboutPage.find(".about-divider_panel")
        let aboutPanelsMobile = aboutPage.find(".about-divider_panel.is-mobile")

        let aboutPanelsTl = gsap.timeline({
            scrollTrigger: {
                trigger: aboutDivider,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.4,
            },
            defaults: { ease: "linear" },
        })
        onDesktop(() => {
            aboutPanelsTl.fromTo(
                aboutPanels,
                {
                    height: "0%",
                },
                {
                    height: "100%",
                    ease: "power1.inOut",
                    stagger: {
                        amount: 1,
                        from: "center",
                        // ease: "power3.out",
                    },
                }
            )
        })

        onMobile(() => {
            aboutPanelsTl.fromTo(
                aboutPanelsMobile,
                {
                    height: "0%",
                },
                {
                    height: "100%",
                    ease: "power1.out",
                    stagger: {
                        each: 0.06,
                        from: "center",
                        // ease: "power3.out",
                    },
                }
            )
        })
        ;(function () {
            const container = document.getElementById("container")
            const scene = document.getElementById("scene")
            const toggleBtn = document.querySelector(".shape-toggle")
            const aboutHero = document.querySelector(".team-section")

            // Config
            const baseRadiusUnits = 100 // logical units
            const particleCountSphere = 50
            const particleCountRings = 30
            const minBrightness = 0.1
            const maxBrightness = 1.0
            const baseRotationSpeed = 0.001
            const dragSensitivity = 0.0025
            const momentumDecay = 0.95
            const minMomentum = 0.001

            // State
            let dotElements = []
            let spherePositions = []
            let ringPositions = []
            let isSpherical = true
            let morphProgress = 0
            let targetMorphProgress = 0
            const morphSpeed = 0.05

            let rotX = 0
            let rotY = 0
            let momentum = { x: 0, y: 0.002 }
            let isDragging = false
            let prevMouse = { x: 0, y: 0 }
            let dragVelocity = { x: 0, y: 0 }

            let outerRingRotation = 0
            let innerRingRotation = 0
            const outerRingSpeed = 0.001
            const innerRingSpeed = -0.001

            let innerRingUserRotX = 0
            let innerRingUserRotY = 0
            let outerRingUserYaw = 0 // user-driven spin around Y
            let ringMomentum = { outerY: 0, innerX: 0, innerY: 0 }

            const innerRingTiltX = Math.PI * 0.9
            const innerRingYawOffset = Math.PI * 0.1

            const ringDragSensitivityX = 0.0022 // horizontal -> inner yaw
            const ringDragSensitivityY = 0.002 // vertical -> pitch

            let pxPerUnit = 2 // responsive scale, recalculated on resize

            // Utilities
            function clamp01(v) {
                return Math.max(0, Math.min(1, v))
            }
            function clamp(v, lo, hi) {
                return Math.max(lo, Math.min(hi, v))
            }
            function lerp(a, b, t) {
                return a + (b - a) * t
            }
            function normalizeAngle(a) {
                const twoPi = Math.PI * 2
                return ((((a + Math.PI) % twoPi) + twoPi) % twoPi) - Math.PI
            }

            function rotatePointXYZ(p, rx, ry, rz = 0) {
                const cosY = Math.cos(ry),
                    sinY = Math.sin(ry)
                const cosX = Math.cos(rx),
                    sinX = Math.sin(rx)
                const cosZ = Math.cos(rz),
                    sinZ = Math.sin(rz)

                let x = p.x,
                    y = p.y,
                    z = p.z

                // Y
                let x1 = x * cosY + z * sinY
                let z1 = -x * sinY + z * cosY
                // X
                let y2 = y * cosX - z1 * sinX
                let z2 = y * sinX + z1 * cosX
                // Z
                let x3 = x1 * cosZ - y2 * sinZ
                let y3 = x1 * sinZ + y2 * cosZ

                return { x: x3, y: y3, z: z2 }
            }

            function fibonacciSphere(count, radius) {
                const pts = []
                const goldenRatio = (1 + Math.sqrt(5)) / 2
                for (let i = 0; i < count; i++) {
                    const theta = (2 * Math.PI * i) / goldenRatio
                    const phi = Math.acos(1 - (2 * i) / count)
                    pts.push({
                        x: radius * Math.sin(phi) * Math.cos(theta),
                        y: radius * Math.sin(phi) * Math.sin(theta),
                        z: radius * Math.cos(phi),
                    })
                }
                return pts
            }

            function generateRings(count, size) {
                const pts = []
                const outerRingCount = Math.ceil(count * 0.6)
                const innerRingCount = count - outerRingCount

                const outerRadius = size * 0.9
                const innerRadius = size * 0.6

                // Outer ring (slightly tilted around X)
                const outerTilt = Math.PI * 0.04

                for (let i = 0; i < outerRingCount; i++) {
                    const angle = (i / outerRingCount) * Math.PI * 2
                    let x = Math.cos(angle) * outerRadius
                    let y = 0
                    let z = Math.sin(angle) * outerRadius

                    // tilt around X
                    const cy = Math.cos(outerTilt),
                        sy = Math.sin(outerTilt)
                    let y2 = y * cy - z * sy
                    let z2 = y * sy + z * cy

                    pts.push({ x, y: y2, z: z2 })
                }

                // Inner ring (steeper tilt + slight Y rotation)
                const innerTilt = innerRingTiltX
                const yRot = innerRingYawOffset
                for (let i = 0; i < innerRingCount; i++) {
                    const angle =
                        (i / innerRingCount) * Math.PI * 2 + Math.PI * 0.3
                    let x = Math.cos(angle) * innerRadius
                    let y = 0
                    let z = Math.sin(angle) * innerRadius

                    // tilt around X
                    const cix = Math.cos(innerTilt),
                        six = Math.sin(innerTilt)
                    let y2 = y * cix - z * six
                    let z2 = y * six + z * cix

                    // small Y rotation
                    const cy = Math.cos(yRot),
                        sy = Math.sin(yRot)
                    let x3 = x * cy + z2 * sy
                    let z3 = -x * sy + z2 * cy

                    pts.push({ x: x3, y: y2, z: z3 })
                }

                return pts
            }

            function setResponsiveScale() {
                const maxSize = Math.min(
                    container.clientWidth,
                    container.clientHeight
                )
                pxPerUnit = (maxSize * 0.4) / baseRadiusUnits
            }

            async function preloadIcons(urls) {
                await Promise.all(
                    urls.map(
                        (src) =>
                            new Promise((resolve) => {
                                const img = new Image()
                                img.onload = img.onerror = resolve
                                img.decoding = "async"
                                img.referrerPolicy = "no-referrer"
                                img.src = src
                            })
                    )
                )
            }

            function rebuildDots() {
                const count = isSpherical
                    ? particleCountSphere
                    : particleCountRings

                spherePositions = fibonacciSphere(count, baseRadiusUnits)
                ringPositions = generateRings(count, baseRadiusUnits * 1.2)

                scene.innerHTML = ""
                dotElements = []
                for (let i = 0; i < count; i++) {
                    const el = document.createElement("div")
                    el.className = "dot"
                    const src = globalIcons[i % globalIcons.length]
                    el.style.backgroundImage = `url("${src}")`
                    scene.appendChild(el)
                    dotElements.push(el)
                }
            }

            function toggleShape() {
                isSpherical = !isSpherical
                targetMorphProgress = isSpherical ? 0 : 1
                aboutHero.classList.toggle("is-rings", !isSpherical)
                aboutHero.classList.toggle("is-spherical", isSpherical)
                toggleBtn.setAttribute("aria-pressed", String(!isSpherical))

                // Dampen momentum so morph doesn창�р꽓t spin many turns
                momentum.x *= 0.3
                momentum.y *= 0.3
                ringMomentum.innerX *= 0.3
                ringMomentum.innerY *= 0.3
                ringMomentum.outerY *= 0.3

                // Normalize all angles to nearest equivalent orientation
                rotX = normalizeAngle(rotX)
                rotY = normalizeAngle(rotY)
                innerRingUserRotX = normalizeAngle(innerRingUserRotX)
                innerRingUserRotY = normalizeAngle(innerRingUserRotY)
                outerRingUserYaw = normalizeAngle(outerRingUserYaw)
                outerRingRotation = normalizeAngle(outerRingRotation)
                innerRingRotation = normalizeAngle(innerRingRotation)
                const maxInnerPitch = Math.PI * 0.5
                innerRingUserRotX = Math.max(
                    -maxInnerPitch,
                    Math.min(maxInnerPitch, innerRingUserRotX)
                )

                rebuildDots()
            }

            function handlePointerDown(x, y) {
                isDragging = true
                prevMouse.x = x
                prevMouse.y = y
                dragVelocity.x = 0
                dragVelocity.y = 0
                container.style.cursor = "grabbing"
            }

            function handlePointerMove(x, y) {
                if (!isDragging) return
                const dx = x - prevMouse.x
                const dy = y - prevMouse.y

                dragVelocity.x = dx * dragSensitivity
                dragVelocity.y = dy * dragSensitivity

                if (morphProgress > 0.1) {
                    // Ring mode:
                    // - Inner ring reacts to both axes
                    innerRingUserRotY += dx * ringDragSensitivityX // inner yaw (Y)
                    innerRingUserRotX += dy * ringDragSensitivityY // inner pitch (X)
                    outerRingUserYaw -= dx * ringDragSensitivityX // outer spin (Y only)
                } else {
                    rotY += dragVelocity.x
                    rotX -= dragVelocity.y
                }

                prevMouse.x = x
                prevMouse.y = y
            }

            function handlePointerUp() {
                if (!isDragging) return
                isDragging = false

                if (morphProgress > 0.1) {
                    // Ring mode momentum
                    ringMomentum.innerY = dragVelocity.x * 1.5
                    ringMomentum.innerX = dragVelocity.y * 1.5
                    ringMomentum.outerY = -dragVelocity.x * 1.2
                } else {
                    momentum.y = dragVelocity.x * 1.5
                    momentum.x = -dragVelocity.y * 1.5
                }

                container.style.cursor = "grab"
            }

            function attachPointer() {
                container.addEventListener("mousedown", (e) =>
                    handlePointerDown(e.clientX, e.clientY)
                )
                container.addEventListener("mousemove", (e) =>
                    handlePointerMove(e.clientX, e.clientY)
                )
                container.addEventListener("mouseup", handlePointerUp)
                container.addEventListener("mouseleave", handlePointerUp)

                const passive = { passive: true }
                container.addEventListener(
                    "touchstart",
                    (e) => {
                        const t = e.touches[0]
                        handlePointerDown(t.clientX, t.clientY)
                    },
                    passive
                )

                container.addEventListener(
                    "touchmove",
                    (e) => {
                        if (e.touches.length) {
                            const t = e.touches[0]
                            handlePointerMove(t.clientX, t.clientY)
                        }
                    },
                    passive
                )

                container.addEventListener("touchend", handlePointerUp)
                container.style.cursor = "grab"
            }

            function render() {
                requestAnimationFrame(render)
                rotX = normalizeAngle(rotX)
                rotY = normalizeAngle(rotY)
                innerRingUserRotX = normalizeAngle(innerRingUserRotX)
                innerRingUserRotY = normalizeAngle(innerRingUserRotY)
                outerRingUserYaw = normalizeAngle(outerRingUserYaw)
                outerRingRotation = normalizeAngle(outerRingRotation)
                innerRingRotation = normalizeAngle(innerRingRotation)

                // Morph progress easing
                if (Math.abs(morphProgress - targetMorphProgress) > 0.001) {
                    morphProgress +=
                        (targetMorphProgress - morphProgress) * morphSpeed
                }

                // Auto spin
                if (morphProgress > 0.1) {
                    outerRingRotation +=
                        outerRingSpeed * (morphProgress * morphProgress)
                    innerRingRotation +=
                        innerRingSpeed * (morphProgress * morphProgress)
                }

                // Momentum
                if (!isDragging) {
                    if (morphProgress > 0.1) {
                        // Inner ring momenta
                        if (Math.abs(ringMomentum.innerY) > minMomentum) {
                            innerRingUserRotY += ringMomentum.innerY
                            ringMomentum.innerY *= momentumDecay
                        } else {
                            ringMomentum.innerY = 0
                        }
                        if (Math.abs(ringMomentum.innerX) > minMomentum) {
                            innerRingUserRotX += ringMomentum.innerX
                            ringMomentum.innerX *= momentumDecay
                        } else {
                            ringMomentum.innerX = 0
                        }
                        // Outer ring X momentum only
                        if (Math.abs(ringMomentum.outerY) > minMomentum) {
                            outerRingUserYaw += ringMomentum.outerY
                            ringMomentum.outerY *= momentumDecay
                        } else {
                            ringMomentum.outerY = 0
                        }
                    } else {
                        // Sphere mode
                        if (Math.abs(momentum.y) > minMomentum) {
                            momentum.y *= momentumDecay
                            if (Math.abs(momentum.y) < baseRotationSpeed * 2) {
                                momentum.y +=
                                    (baseRotationSpeed - momentum.y) * 0.02
                            }
                        } else {
                            momentum.y = baseRotationSpeed
                        }
                        if (Math.abs(momentum.x) > minMomentum) {
                            momentum.x *= momentumDecay
                        } else {
                            momentum.x = 0
                        }
                        rotY += momentum.y
                        rotX += momentum.x
                    }
                }

                // Project and draw
                const count = dotElements.length
                const outerCount = Math.ceil(count * 0.6)
                for (let i = 0; i < count; i++) {
                    const el = dotElements[i]
                    const spherePos = spherePositions[i]
                    const baseRingPos = ringPositions[i]

                    let ringPos
                    if (i < outerCount) {
                        // OUTER RING: auto Y revolution + user X pitch only
                        const baseAng = Math.atan2(baseRingPos.z, baseRingPos.x)
                        const radius = Math.hypot(baseRingPos.x, baseRingPos.z)
                        const angle =
                            baseAng + outerRingRotation + outerRingUserYaw // add user yaw
                        let x = Math.cos(angle) * radius,
                            y = 0,
                            z = Math.sin(angle) * radius

                        // Generation tilt (around X)
                        const t = Math.PI * 0.04
                        ;(ct = Math.cos(t)), (st = Math.sin(t))
                        let y2 = y * ct - z * st,
                            z2 = y * st + z * ct
                        ringPos = { x, y: y2, z: z2 }

                        // Apply user pitch (X) only
                        ringPos = { x, y: y2, z: z2 }
                    } else {
                        // INNER RING: auto Y revolution + user yaw (Y) + user pitch (X)
                        const innerIdx = i - outerCount
                        const innerCount = count - outerCount
                        const innerRadius = baseRadiusUnits * 1.2 * 0.6
                        const originalAngle =
                            (innerIdx / innerCount) * Math.PI * 2 +
                            Math.PI * 0.3

                        let x =
                            Math.cos(
                                originalAngle +
                                    innerRingRotation +
                                    innerRingUserRotY
                            ) * innerRadius
                        let y = 0
                        let z =
                            Math.sin(
                                originalAngle +
                                    innerRingRotation +
                                    innerRingUserRotY
                            ) * innerRadius

                        // Generation tilt (X)
                        const t = innerRingTiltX,
                            ct = Math.cos(t),
                            st = Math.sin(t)
                        let y2 = y * ct - z * st,
                            z2 = y * st + z * ct

                        // Small fixed Y rotation from generation
                        const yR = innerRingYawOffset,
                            cy = Math.cos(yR),
                            sy = Math.sin(yR)
                        let x3 = x * cy + z2 * sy,
                            z3 = -x * sy + z2 * cy
                        ringPos = { x: x3, y: y2, z: z3 }

                        // User pitch (X)
                        ringPos = rotatePointXYZ(
                            ringPos,
                            innerRingUserRotX,
                            0,
                            0
                        )
                    }

                    // Interpolate sphere->ring
                    const tMorph = clamp01(morphProgress)
                    const baseX = lerp(spherePos.x, ringPos.x, tMorph)
                    const baseY = lerp(spherePos.y, ringPos.y, tMorph)
                    const baseZ = lerp(spherePos.z, ringPos.z, tMorph)

                    // Blend out sphere global rotation as rings take over
                    const smooth = tMorph * tMorph * (3 - 2 * tMorph) // smoothstep
                    const sphereBlend = 1 - smooth

                    const final = rotatePointXYZ(
                        { x: baseX, y: baseY, z: baseZ },
                        rotX * sphereBlend,
                        rotY * sphereBlend,
                        0
                    )

                    const xpx = final.x * pxPerUnit
                    const ypx = final.y * pxPerUnit
                    const zpx = final.z * pxPerUnit

                    // 창��밆epth창��� brightness and scaling
                    const maxDepthUnits = baseRadiusUnits * 1.4
                    const normDepth = clamp01(
                        (final.z + maxDepthUnits) / (maxDepthUnits * 2)
                    )
                    const brightness =
                        minBrightness +
                        (maxBrightness - minBrightness) * normDepth
                    const sizeScale = 2 + 0.75 * normDepth
                    const baseDotPx = window.innerWidth > 991 ? 20 : 12

                    const dotPx = baseDotPx * sizeScale
                    el.style.transform = `translate3d(${xpx}px, ${ypx}px, ${zpx}px)` // no scale
                    el.style.width = `${dotPx}px`
                    el.style.height = `${dotPx}px`
                    el.style.backgroundSize = `100% 100%`
                    el.style.filter = `brightness(${brightness})`
                    // el.style.opacity = 0.85 * (0.5 + 0.5 * normDepth);
                }
            }

            function onResize() {
                setResponsiveScale()
            }

            async function init() {
                await preloadIcons(globalIcons)
                setResponsiveScale()
                aboutHero.classList.add("is-spherical")
                rebuildDots()
                attachPointer()
                toggleBtn.addEventListener("click", toggleShape)
                window.addEventListener("resize", onResize)
                render()
            }

            init()
        })()

        let teamSection = aboutPage.find(".team-section_outer")
        let teamSphere = aboutPage.find(".team-section")
        let teamMembersWrap = aboutPage.find(".team-members_wrap")
        let teamMembersList = aboutPage.find(".team-members_list")
        let teamMembersItem = aboutPage.find(".team-members_item")

        let threeStickyTl = gsap.timeline({
            defaults: {
                ease: "linear",
            },
            scrollTrigger: {
                trigger: teamSection,
                start: "clamp(top top)",
                end: "clamp(bottom bottom)",
                pin: teamSphere,
                scrub: true,
                pinSpacing: false,
            },
        })

        ScrollTrigger.create({
            trigger: teamMembersWrap,
            start: "clamp(top top)",
            end: "clamp(bottom bottom)",
            endTrigger: teamSection,
            pin: teamMembersList,
            pinSpacing: false,
            scrub: true,
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: teamMembersWrap,
                start: "clamp(top bottom)",
                end: "clamp(bottom bottom)",
                endTrigger: teamSection,
                scrub: true,
            },
        })

        tl.fromTo(
            teamMembersItem,
            { y: 1 * window.innerHeight },
            {
                y: -1 * window.innerHeight,
                duration: 1,
                stagger: 0.01,
                ease: CustomEase.create(
                    "custom",
                    "M0,0 C0,0 0,0.5 0.5,0.5 1,0.5 1,1 1,1"
                ),
            },
            "step"
        )

        // threeStickyTl.to(teamSphere, {
        //   y: "50vh",
        //   scrollTrigger: {
        //     trigger: teamSphere,
        //     start: "clamp(top center)",
        //     end: "clamp(bottom top)",
        //     scrub: true,
        //   },
        // });
        // onDesktop(() => {
        //   threeStickyTl.to(teamSphere, {
        //     y: "50vh",
        //     scrollTrigger: {
        //       trigger: teamSphere,
        //       start: "clamp(top center)",
        //       end: "clamp(bottom top)",
        //       scrub: true,
        //     },
        //   });
        // });
        // onMobile(() => {
        //   threeStickyTl.to(teamSphere, {
        //     scrollTrigger: {
        //       trigger: aboutDivider,
        //       start: "clamp(bottom top)",
        //       end: "clamp(bottom top)",
        //       endTrigger: teamSphere,
        //       pin: teamSphere,
        //       // markers: true,
        //     },
        //   });
        // });

        // threeStickyTl.fromTo(
        //   teamMembersWrap,
        //   {
        //     yPercent: 50,
        //   },
        //   {
        //     yPercent: -50,
        //   },
        //   "<"
        // );

        //Our Mission
        let missionSection = aboutPage.find(".mission-section")
        let missionSticky = aboutPage.find(".mission-sticky_wrap")
        let missionImgWrap = aboutPage.find(".mission-imgs_outer")
        let missionImgs = missionImgWrap.find(".mission-img")
        let missionImgsEl = missionImgWrap.find(".mission-imgs_wrap")
        let missionTitle = aboutPage.find(".mission-info_wrap")
        let missionGreyText = aboutPage.find(".mission-title")
        let missionClipImgs = missionImgWrap.find(".mission-img_clip")

        let missionGrowTl = gsap.timeline({
            defaults: {
                ease: "linear",
            },
            scrollTrigger: {
                trigger: missionSection,
                start: "clamp(top 80%)",
                end: "clamp(bottom bottom)",
                scrub: true,
            },
        })

        missionGrowTl.from(missionImgWrap, {
            height: "110svh",
        })

        ScrollTrigger.create({
            trigger: missionSticky,
            start: "top top",
            end: "bottom top",
            pin: true,
            endTrigger: missionTitle,
            scrub: true,
            // markers: true,
            pinSpacing: false,
        })

        let missionClipTl = gsap.timeline({
            defaults: {
                ease: "linear",
            },
            scrollTrigger: {
                trigger: missionSticky,
                start: "top top",
                end: "bottom bottom",
                endTrigger: missionSection,
                scrub: true,
                // pinSpacing: false,
            },
        })

        missionClipTl.fromTo(
            missionClipImgs,
            { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                stagger: 0.5,
            }
        )
        missionClipTl.fromTo(
            missionImgsEl,
            {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            },
            {
                clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            }
        )
        missionClipTl.fromTo(
            missionGreyText,
            {
                yPercent: 0,
            },
            {
                yPercent: -50,
            }
        )
    })
}

function globalScripts() {
    $("img").attr("loading", "auto")
    $("img, video").each(function () {
        $(this).on("contextmenu", function (e) {
            e.preventDefault()
            return false
        })
    })
    lenis.resize()
    lenis.start()
    ScrollTrigger.refresh()
    onMobile(() => {
        lenis.options.syncTouch = true
        lenis.options.syncTouchLerp = 0.075
        lenis.options.touchInertiaExponent = 1.7
        lenis.options.touchMultiplier = 1
    })

    // let isAnimationPlaying = false;

    function updateUKTime() {
        $("[data-uk-time]").each(function () {
            const ukTime = new Date().toLocaleString("en-GB", {
                timeZone: "Europe/London",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })

            $(this).text(ukTime + " (GMT)")
        })
    }

    function initUKTimeDisplay() {
        // Update immediately
        updateUKTime()

        // Update every second
        setInterval(updateUKTime, 1000)
    }

    // Initialise the UK time display
    initUKTimeDisplay()

    function popupHandlers() {
        $("[popup-component]").each(function () {
            const $component = $(this)
            const $trigger = $component.find("[popup-trig]")
            const $closeBtn = $component.find("[popup-close]")
            const $popupEl = $component.find("[popup-el]")

            // Check if this is a credit toggle
            const isCreditToggle = $trigger.hasClass("credit-toggle")

            $trigger.on("click", function (e) {
                // e.preventDefault();
                e.stopPropagation()
                $component.toggleClass("show-popup")

                // Handle credit toggle body class
                if (isCreditToggle) {
                    if ($component.hasClass("show-popup")) {
                        $("body").addClass("credits-reveal")
                        onMobile(() => {
                            lenis.stop()
                        })
                    } else {
                        $("body").removeClass("credits-reveal")
                        onMobile(() => {
                            lenis.start()
                        })
                    }
                }
            })

            $closeBtn.on("click", function (e) {
                // e.preventDefault();
                e.stopPropagation()
                $component.removeClass("show-popup")

                // Remove credits class if this was a credit toggle
                if (isCreditToggle) {
                    $("body").removeClass("credits-reveal")
                    lenis.start()
                }
            })

            $popupEl.on("click", function (e) {
                e.stopPropagation()
            })

            $component.on("click", function (e) {
                if (e.target === this) {
                    $component.removeClass("show-popup")

                    // Remove credits class if this was a credit toggle
                    if (isCreditToggle) {
                        $("body").removeClass("credits-reveal")
                        lenis.start()
                    }
                }
            })
        })

        $(document).on("click", function (e) {
            if (!$(e.target).closest("[popup-component]").length) {
                const $openPopups = $("[popup-component].show-popup")

                // Check if any closing popups are credit toggles
                $openPopups.each(function () {
                    const $trigger = $(this).find("[popup-trig]")
                    if ($trigger.hasClass("credit-toggle")) {
                        $("body").removeClass("credits-reveal")
                        lenis.start()
                    }
                })

                $openPopups.removeClass("show-popup")
            }
        })

        $(document).on("keydown", function (e) {
            if (e.key === "Escape") {
                const $openPopups = $("[popup-component].show-popup")

                // Check if any closing popups are credit toggles
                $openPopups.each(function () {
                    const $trigger = $(this).find("[popup-trig]")
                    if ($trigger.hasClass("credit-toggle")) {
                        $("body").removeClass("credits-reveal")
                    }
                })

                $openPopups.removeClass("show-popup")
            }
        })
    }
    popupHandlers()

    function themeToggle() {
        $(".ld-toggle").on("click", function () {
            let pageMain = $("body")
            if (!pageMain.attr("theme-mode")) {
                pageMain.attr("theme-mode", "dark")
            } else {
                pageMain.removeAttr("theme-mode")
            }
        })
    }

    themeToggle()

    $(".page-main").each(function () {
        let pageEl = $(this)
        pageEl.removeAttr("nav-scrolled")

        let targets = pageEl.find("[data-cursor]")
        let xOffset = 20
        let yOffset = 10
        let cursorIsOnRight = false
        let currentTarget = null
        let lastText = ""
        let cursorItem = pageEl.find(".cursor")
        let cursorImg = cursorItem.find(".cursor-img")
        let ctaCursorWrap = pageEl.find("[cta-cursor_wrap]")
        let cursorParagraph = cursorItem.find(".cursor-text")
        let isHoveringSwiper = false
        let currentSwiperEl = null
        let cursorInner = cursorItem.find("[cursor-item]")
        onDesktop(() => {
            if (cursorItem.length) {
                gsap.set(cursorItem, { xPercent: xOffset, yPercent: yOffset })

                let xTo = gsap.quickTo(cursorItem[0], "x", {
                    duration: 0.1,
                    ease: "power3",
                })
                let yTo = gsap.quickTo(cursorItem[0], "y", {
                    ease: "power3",
                    duration: 0.1,
                })

                $(window).on("mouseover mousemove", function (e) {
                    let windowWidth = $(window).width()
                    let scrollY = $(window).scrollTop()
                    let cursorX = e.clientX
                    let cursorY = e.clientY + scrollY
                    let xPercent = xOffset
                    let yPercent = yOffset

                    if (cursorX > windowWidth * 0.9) {
                        cursorIsOnRight = true
                    } else {
                        cursorIsOnRight = false
                    }

                    $("body").toggleClass("on-right", cursorIsOnRight)

                    if (isHoveringSwiper && currentSwiperEl) {
                        const rect = currentSwiperEl[0].getBoundingClientRect()
                        const relativeX = e.clientX - rect.left
                        const halfWidth = rect.width / 2

                        const newText = relativeX < halfWidth ? "Prev" : "Next"
                        if (newText !== lastText) {
                            cursorParagraph.html(newText)
                            lastText = newText
                        }
                    } else if (currentTarget) {
                        let newText = currentTarget.attr("data-cursor")
                        if (newText !== lastText) {
                            cursorParagraph.html(newText)
                            lastText = newText
                        }
                    }

                    gsap.to(cursorItem, {
                        xPercent: xPercent,
                        yPercent: yPercent,
                        duration: 0.1,
                        ease: "power3",
                    })

                    xTo(cursorX)
                    yTo(cursorY - scrollY)
                })

                targets.each(function () {
                    let target = $(this)

                    target.on("mouseleave mouseout", function () {
                        $("body").removeClass("c-vis")
                    })

                    target.on("mouseover mousemove", function () {
                        $("body").addClass("c-vis")
                        currentTarget = target
                        let newText = target.is("[data-easteregg]")
                            ? target.attr("data-easteregg")
                            : target.attr("data-cursor")

                        if (newText !== lastText) {
                            cursorParagraph.html(newText)
                            lastText = newText
                        }
                    })
                })
            }
        })

        $("[slider-section]").each(function (index) {
            let swiperEl = $(this).find(".swiper")
            const projSlider = new Swiper(swiperEl[0], {
                autoplay: false,

                centeredSlides: true,
                simulateTouch: false,
                loop: true,
                runCallbacksOnInit: true,

                touchMoveStopPropagation: true,
                mousewheel: {
                    forceToAxis: true,
                },
                speed: 800,
                spaceBetween: 20,
                breakpoints: {
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 10,
                    },
                    992: {
                        slidesPerView: 1.4,
                    },
                },
            })

            swiperEl.on("mousemove mouseover", function () {
                isHoveringSwiper = true
                currentSwiperEl = $(this)
                cursorItem.addClass("active")
            })

            swiperEl.on("mouseleave mouseout", function () {
                isHoveringSwiper = false
                currentSwiperEl = null
                cursorItem.removeClass("active")
                lastText = ""
            })

            swiperEl.on("click", function (e) {
                const rect = this.getBoundingClientRect()
                const clickX = e.clientX - rect.left
                const elementWidth = rect.width
                const halfWidth = elementWidth / 2

                if (clickX < halfWidth) {
                    projSlider.slidePrev()
                } else {
                    projSlider.slideNext()
                }
            })
        })

        ScrollTrigger.create({
            trigger: $(this),
            start: "top top",
            end: "+1000px",
            onLeave: ({ self }) => {
                pageEl.attr("nav-detail", "")
            },
            onEnterBack: ({ self }) => {
                pageEl.removeAttr("nav-detail")
            },
        })

        let previousScroll = 0
        let upwardScrollDistance = 0

        lenis.on("scroll", ({ scroll, direction }) => {
            if (direction === 1) {
                pageEl.attr("nav-scrolled", "")
                upwardScrollDistance = 0 // Reset upward distance when scrolling down
            } else if (direction === -1) {
                upwardScrollDistance += previousScroll - scroll

                if (upwardScrollDistance > 50) {
                    pageEl.removeAttr("nav-scrolled")
                }
            }

            previousScroll = scroll
        })

        $("[video-player]").each(function (index) {
            let playVidBtn = $(this).find("[video-trigger]")
            let videoPopupEl = $(this).find(".video-popup")
            let videoItem = $(this).find(".plyr_component")
            let videoBg = $(this).find(".video-popup_bg")
            let videoClose = $(this).find("[video-close]")
            let vidPreviewTrigger = $(this).find("[vid-preview_trigger]")
            let vidPreview = $(this).find(".nav-video_preview")
            let vidPreviewClose = $(this).find(".vid-preview_close")
            let vidPlayInner = $(this).find(".video-inner_play")
            let thisComponent = $(this)

            const controls = `
      <div class="plyr__controls">
      <div class="plyr-contain u-container">
        <div class="plyr_stretch u-text-style-small">
          <div class="plyr_col">
            <div class="plyr__time plyr__time--current">00:00</div>
          </div>
          <div class="plyr__progress">
            <input
              data-plyr="seek"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value="0"
              aria-label="Seek"
            />
          </div>
          <div class="plyr-right u-text-style-main">
            <div class="plyr__time plyr__time--duration" aria-label="Duration">
              00:00
            </div>
            <div class="fullscreen" data-plyr="fullscreen">Full Screen</div>
            <button
              type="button"
              class="plyr__control"
              aria-label="Mute"
              data-plyr="mute"
            >
              <div class="icon--pressed" role="presentation">
                <?xml version="1.0" encoding="UTF-8"?>
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 500"
                >
                  <defs>
                    <style>
                      .cls-1 {
                        fill: transparent;
                      }
                    </style>
                  </defs>
                  <rect class="cls-1" y="0" width="500" height="500" />
                  <g>
                    <path
                      d="M429.26,187.23c-15.62,4.18-31.34,26.28-38.18,12.91-4.12-8.05-.36-8.9,1.89-32.33,2.25-23.43,2.4-34.27-10.63-37.23-29.27-6.66-37.59,38.39-44.53,59.8-3.72,11.47-11,51.55-21.28,68.52-1.56,2.58-2.03,7.13,2.26,11.61,7.41,7.75,5.46,5.66,8.96,9.67,3.5,4.01,8.31,2.36,9.08-1.23,5.47-25.32,8.02-42.44,14.16-57.94,1.63-4.11,7.02-18.2,13.64-18.2,11.69,0,13.17,14.74,16.06,29.63,5.56,28.67,41.34,22.38,54.81,18.35,40.89-12.25,35.78-74.79-6.23-63.55Z"
                    />
                    <path
                      d="M267.91,209.47c9.74-3.95,14.31,3.42,15.7,7.66,1.23,3.75.53,4.15-.04,10.67s3.93,11.02,7.04,12.39c3.27,1.43,6.56.17,6.66-5.43.56-33.06,7.53-82.63,17.74-98.21,8.42-12.85,27.66-15.25,27.04-36.65-.85-28.81-39.81-41.91-57.02-20.49-10.39,12.94-13.1,49.15-19.48,65.89-9.42,24.71-10.63,31.11-15.63,43.17-3.81,9.19,12.3,23.31,17.98,21.01Z"
                    />
                    <path
                      d="M387.48,367.37c-21.36-12.15-22.03-12.27-94.6-93.64-22.9-25.67-75.25-82.05-75.25-82.05-5.84-6.65-.71-16.42.38-21.89.64-3.21,1.12-7.68-.53-14.77-3.16-13.61-15.13-18.01-26.58-11.94-3.13,1.66-9.71,8.86-14.56,4.77,0,0-41.46-42.15-49.53-51.76-8.07-9.6-6.52-17.26-18.45-25.5-16.57-11.46-37.31,8.46-21.69,29.74,9.12,12.43,25.23,11.37,42.38,28.52,2.21,2.21,16.72,17.69,37.65,40.29,1.68,1.81,2.24,4.39,1.44,6.72-8.13,23.77-12.98,53.88-20.87,68.51-6.44,11.95-11.92,16.39-13.76.63-2.55-21.94,1.31-39.59-16.68-45.92-12.33-4.34-10.84-2.6-35.03-11.54-38.49-14.22-67.28,48.72-23.15,65.03,11.81,4.36,27.39,1.54,37.03-7.49,11.73-10.99,23.66-8.3,12.38,37.07-2.41,9.69-6.78,21.11-7.51,31.07-.64,8.58-3.25,19.72,2.97,26.86.06.07.12.13.17.2,5.12,5.67,14.07,7.27,21.14,6.63,20.31-1.83,24.33-37.77,30.03-53.48,6.3-17.36,14.19-74.19,25.67-77.93,18.1-5.89,10.82,23.16,10.31,31.69-1.73,28.78-.92,90.23-14.72,113.33-9.93,16.6-26.75,22.65-24.14,45.81,3,26.64,42.24,36.16,57.22,14.42,12.15-17.64,12.3-70.15,17.43-93.15,5.54-24.81,11-47.73,16.93-66.64.83-2.65,4.24-3.39,6.11-1.33,6.35,7,12.7,14.02,18.99,21,3.49,3.87,4.97,9.15,4.02,14.28-2.47,13.26-4.8,26.77-5.22,35.28-.94,18.86-1.19,38.63,21.28,42.86,16.83,3.17,25.41-11.64,30.67-27.04.91-2.68,4.4-3.34,6.25-1.21,24.49,28.16,39.73,38.03,46.3,57.46,12.55,37.15,43.33,25.87,46.45,10.18,2.25-11.34-2.93-29.14-30.93-45.07ZM80.08,236.07c-26.07,9.78-30.24-25.31-15.73-30.6,23.51-8.57,38.48,22.07,15.73,30.6ZM217.43,253.64c-7.83-1.35-5.64-20.66-5.24-27.8,0-.02,0-.04,0-.06.15-2.55,3.31-3.64,5.04-1.76,4.11,4.49,8.28,9.05,12.48,13.66,2.02,2.21,2.31,5.49.76,8.05-3.67,6.07-7.69,8.84-13.04,7.92Z"
                    />
                  </g>
                </svg>
              </div>
              <div class="icon--not-pressed" role="presentation">
                <?xml version="1.0" encoding="UTF-8"?>
                <svg
                  id="Layer_1"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 500"
                >
                  <defs>
                    <style>
                      .cls-1 {
                        fill: transparent;
                      }
                    </style>
                  </defs>
                  <rect class="cls-1" y="0" width="500" height="500" />
                  <path
                    d="M429.26,186.45c-15.62,4.18-31.34,26.28-38.18,12.91-4.12-8.05-.36-8.9,1.89-32.33,2.25-23.43,2.4-34.27-10.63-37.23-29.27-6.66-37.59,38.39-44.53,59.8-4.28,13.21-18.24,80.2-29.63,85.48-8.19,3.79-10.87-2.74-11.66-9.66-2.52-22.06,6.55-111.43,18.49-129.66,8.42-12.85,27.66-15.25,27.04-36.65-.85-28.81-39.81-41.91-57.02-20.49-10.39,12.94-13.1,49.15-19.48,65.89-26.93,70.67-29.59,111.54-48.13,108.34-7.83-1.35-5.64-20.66-5.24-27.8,1.15-20.61,10.04-50.4,5.3-70.83-3.37-14.52-19-17.51-30.8-9.78-22.1,14.47-26.98,76.06-39.41,99.13-6.44,11.95-11.92,16.39-13.76.63-2.55-21.94,1.31-39.59-16.68-45.92-12.33-4.34-10.84-2.6-35.03-11.54-38.49-14.22-67.28,48.72-23.15,65.03,11.82,4.36,27.39,1.54,37.03-7.49,11.73-10.99,23.66-8.3,12.39,37.07-2.41,9.69-6.78,21.11-7.52,31.07-.64,8.58-3.25,19.72,2.97,26.86.06.07.12.13.18.2,5.12,5.67,14.07,7.27,21.14,6.63,20.31-1.83,24.33-37.77,30.03-53.48,6.3-17.36,14.19-74.19,25.66-77.93,18.1-5.89,10.82,23.16,10.31,31.69-1.73,28.78-.92,90.23-14.72,113.33-9.93,16.6-26.75,22.64-24.14,45.81,3,26.64,42.24,36.16,57.22,14.42,12.15-17.64,12.3-70.15,17.43-93.15,12.77-57.2,25.1-104.46,43.8-115.33,8.91-5.18,13.62,2.64,13.41,11.4-.65,26.62-15.07,80.18-16.38,106.52-.94,18.86-1.19,38.63,21.28,42.86,24.73,4.66,31.66-29.52,36.38-47.3,6.67-25.13,16.42-80.94,25.86-104.75,1.63-4.11,7.03-18.2,13.64-18.2,11.69,0,13.17,14.74,16.06,29.63,5.57,28.67,41.34,22.38,54.81,18.35,40.89-12.25,35.78-74.79-6.23-63.55ZM80.08,235.29c-26.07,9.78-30.24-25.31-15.73-30.6,23.51-8.57,38.48,22.07,15.73,30.6Z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
  `

            let player = new Plyr(thisComponent.find(".plyr_video")[0], {
                controls,
                resetOnEnd: true,
                muted: false,
                fullscreen: {
                    enabled: true,
                    fallback: false,
                },
            })

            let videoPopupTl = gsap.timeline({
                paused: true,
                defaults: { ease: "none", duration: 0.01 },
            })

            videoPopupTl.set(videoPopupEl, { display: "flex" })
            videoPopupTl.to(videoBg, { opacity: 1 })
            videoPopupTl.fromTo(videoItem, { opacity: 0 }, { opacity: 1 }, "<")
            videoPopupTl.set(videoBg, { pointerEvents: "auto" })

            thisComponent.data("playerInstance", player)
            thisComponent.data("timeline", videoPopupTl)

            playVidBtn.on("click", function () {
                videoPopupTl.timeScale(1).restart()
                player.play()
            })

            vidPlayInner.on("click", function () {
                player.play()
            })

            videoClose.on("click", function () {
                videoPopupTl.timeScale(2).reverse()
                player.pause()
                if (player.fullscreen.active) player.fullscreen.exit()
            })

            // Prevent clicks on Plyr controls from bubbling up and closing the video
            thisComponent.find(".plyr__controls").on("click", function (e) {
                e.stopPropagation()
            })

            let pauseTimeout

            player.on("pause", () => {
                clearTimeout(pauseTimeout)
                videoPopupEl.addClass("vid-paused")
                // pauseTimeout = setTimeout(() => {
                //   videoPopupTl.timeScale(2).reverse();
                //   if (player.fullscreen.active) player.fullscreen.exit();
                // }, 200);
            })

            player.on("play", () => {
                videoPopupEl.removeClass("vid-paused")
            })

            player.on("ready", () => {
                thisComponent
                    .find(".plyr__controls")
                    .on("mousemove mouseenter", function () {
                        $("body").removeClass("c-vis")
                    })

                // Also add the stopPropagation after the player is ready
                thisComponent.find(".plyr__controls").on("click", function (e) {
                    e.stopPropagation()
                })
            })

            onMobile(() => {
                vidPreviewTrigger.on("click", function () {
                    $(".page-main").addClass("vid-preview_active")
                })

                vidPreviewClose.on("click", function () {
                    $(".page-main").removeClass("vid-preview_active")
                })

                videoClose.on("click", function () {
                    player.pause()
                    $(".page-main").removeClass("vid-preview_active")
                })
            })

            const st = ScrollTrigger.create({
                trigger: thisComponent[0],
                start: "top bottom",
                end: "bottom top",
                onToggle(self) {
                    if (!self.isActive) {
                        // Check if player exists and has a paused property
                        if (
                            player &&
                            typeof player.paused !== "undefined" &&
                            !player.paused
                        ) {
                            player.pause()
                        }
                        videoPopupTl.timeScale(2).reverse()
                    }
                },
            })

            player.on("enterfullscreen", () => {
                lenis.stop()
            })

            player.on("exitfullscreen", () => {
                lenis.start()
            })
        })

        $(".project-feature_component").each(function () {
            let projectFeatureComponent = $(this)
            let progFeatureItems = projectFeatureComponent.find(
                ".project-feature_item"
            )

            // Aspect ratio constants
            const COLLAPSED_ASPECT_RATIO = 1.6 / 1.8 // 창�검�0.889
            const EXPANDED_ASPECT_RATIO = 680 / 760 // 창�검�0.895

            onDesktop(() => {
                const initializeItems = () => {
                    progFeatureItems.each(function (index) {
                        const item = $(this)
                        const inner = item.find(".project-feature_item-inner")

                        if (index === 2) {
                            // Initial expanded item
                            const width = "50%"
                            const height = `${50 / EXPANDED_ASPECT_RATIO}vw` // Calculate height based on viewport width
                            gsap.set(item, {
                                width: width,
                                height: height,
                            })
                        } else {
                            // Collapsed items
                            const collapsedWidth =
                                50 / (progFeatureItems.length - 1)
                            const width = collapsedWidth + "%"
                            const height = `${collapsedWidth / COLLAPSED_ASPECT_RATIO}vw`
                            gsap.set(item, {
                                width: width,
                                height: height,
                            })
                        }
                    })
                }

                const animateItems = (hoveredIndex) => {
                    const timeline = gsap.timeline()

                    progFeatureItems.each(function (index) {
                        const item = $(this)
                        const inner = item.find(".project-feature_item-inner")

                        if (index === hoveredIndex) {
                            // Expand hovered item
                            const width = "50%"
                            const height = `${50 / EXPANDED_ASPECT_RATIO}vw`
                            timeline.to(
                                item,
                                {
                                    width: width,
                                    height: height,
                                    duration: 0.6,
                                    ease: "power2.out",
                                },
                                0
                            )
                        } else {
                            // Collapse other items
                            const collapsedWidth =
                                50 / (progFeatureItems.length - 1)
                            const width = collapsedWidth + "%"
                            const height = `${collapsedWidth / COLLAPSED_ASPECT_RATIO}vw`
                            timeline.to(
                                item,
                                {
                                    width: width,
                                    height: height,
                                    duration: 0.6,
                                    ease: "power2.out",
                                },
                                0
                            )
                        }
                    })

                    return timeline
                }

                initializeItems()

                progFeatureItems.on("mouseenter", function () {
                    const hoveredIndex = progFeatureItems.index(this)
                    animateItems(hoveredIndex)
                })
            })

            onMobile(() => {
                const firstItem = progFeatureItems.eq(2)
                const firstItemInner = firstItem.find(
                    ".project-feature_item-inner"
                )
                const featuredWrap = projectFeatureComponent.find(
                    ".project-featured_wrap"
                )
                firstItem.addClass("featured")
                const initialClonedInner = firstItemInner.clone()
                featuredWrap.append(initialClonedInner)
                progFeatureItems.on("click", function () {
                    const clickedItem = $(this)
                    const itemInner = clickedItem.find(
                        ".project-feature_item-inner"
                    )
                    progFeatureItems.removeClass("featured")
                    clickedItem.addClass("featured")
                    featuredWrap.empty()
                    const clonedInner = itemInner.clone()
                    featuredWrap.append(clonedInner)
                })
            })
        })

        $(".project-flick_component").each(function () {
            let projFlickComponent = $(this)
            let projFlickItems = projFlickComponent.find(".project-flick_item")
            let projFlickNumberWrap = projFlickComponent.find(
                ".project-flick_number-wrap"
            )
            let currentIndex = 0
            let imageSources = []

            projFlickItems.each(function (index) {
                let img = $(this).find(".img-fill")
                if (img.length) {
                    imageSources[index] = img.attr("src")
                }
            })

            let totalItems = projFlickItems.length
            projFlickNumberWrap.empty()

            for (let i = 0; i < totalItems; i++) {
                let itemNumber = (i + 1).toString().padStart(2, "0")
                projFlickNumberWrap.append(
                    `<div class="project-flick_number">${itemNumber}</div>`
                )
            }

            let projFlickNumbers = projFlickNumberWrap.find(
                ".project-flick_number"
            )

            function updateActiveNumber() {
                projFlickNumbers.removeClass("active")
                projFlickNumbers.eq(currentIndex).addClass("active")
            }

            if (projFlickNumbers.length > 1) {
                gsap.set(projFlickNumbers.eq(1), { marginLeft: "auto" })
            }

            updateActiveNumber()

            projFlickItems.each(function (index) {
                if (index > 0) {
                    let widthOffset = index * 20
                    gsap.set(this, {
                        width: `calc(100% - ${widthOffset}px)`,
                        left: "100%",
                    })
                }
            })

            function navigateToSlide(targetIndex) {
                if (
                    targetIndex === currentIndex ||
                    targetIndex < 0 ||
                    targetIndex >= totalItems
                )
                    return

                if (currentIndex + 1 < projFlickNumbers.length) {
                    gsap.set(projFlickNumbers.eq(currentIndex + 1), {
                        marginLeft: 0,
                    })
                }

                if (targetIndex < currentIndex) {
                    for (let i = currentIndex; i > targetIndex; i--) {
                        gsap.to(projFlickItems.eq(i), {
                            left: "100%",
                            duration: 0.8,
                            ease: "expo.inOut",
                        })
                    }
                }

                if (targetIndex > currentIndex) {
                    for (let i = currentIndex + 1; i <= targetIndex; i++) {
                        let leftOffset = i * 20
                        gsap.to(projFlickItems.eq(i), {
                            left: `${leftOffset}px`,
                            duration: 0.8,
                            ease: "expo.inOut",
                        })
                    }
                }

                currentIndex = targetIndex
                updateActiveNumber()

                if (currentIndex + 1 < projFlickNumbers.length) {
                    gsap.set(projFlickNumbers.eq(currentIndex + 1), {
                        marginLeft: "auto",
                    })
                }
            }

            function updateCursorPreview(isRightSide) {
                let previewIndex = -1
                let shouldShowPreview = false

                if (isRightSide) {
                    previewIndex = currentIndex + 1
                    shouldShowPreview = previewIndex < totalItems
                } else {
                    previewIndex = currentIndex - 1
                    shouldShowPreview = previewIndex >= 0
                }

                if (shouldShowPreview && imageSources[previewIndex]) {
                    cursorImg.attr("src", imageSources[previewIndex])
                    $("body").addClass("c-img")
                } else {
                    $("body").removeClass("c-img")
                }
            }

            projFlickNumbers.on("click", function (e) {
                e.stopPropagation()
                let clickedIndex = $(this).index()
                navigateToSlide(clickedIndex)
            })

            projFlickComponent.on("mousemove mouseover", function (e) {
                let componentWidth = $(this).outerWidth()
                let mouseX = e.pageX - $(this).offset().left
                let isRightSide = mouseX > componentWidth / 2
                updateCursorPreview(isRightSide)
            })

            projFlickComponent.on("mouseleave", function () {
                $("body").removeClass("c-img")
            })

            projFlickComponent.on("click", function (e) {
                let componentWidth = $(this).outerWidth()
                let mouseX = e.pageX - $(this).offset().left
                let isRightSide = mouseX > componentWidth / 2
                if (isRightSide) {
                    navigateToSlide(currentIndex + 1)
                } else {
                    navigateToSlide(currentIndex - 1)
                }
            })
        })

        $("[data-click]").each(function () {
            $(this).on("mouseenter", function () {
                if ($("body").hasClass("is-muted")) {
                    unlockAudio()
                    tryPlaySfxWA()
                }
            })
        })
    })

    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function validateForm($form) {
        let isValid = true

        $form.find("input[required], textarea[required]").each(function () {
            let $field = $(this)
            let fieldType =
                $field.attr("type") || $field.prop("tagName").toLowerCase()
            let fieldValue = $field.val().trim()

            $field.removeClass("error")

            if (!fieldValue) {
                isValid = false
                $field.addClass("error")
                return
            }

            if (
                fieldType === "email" ||
                $field.hasClass("email") ||
                $field.attr("name")?.includes("email")
            ) {
                if (!emailRegex.test(fieldValue)) {
                    isValid = false
                    $field.addClass("error")
                }
            }
        })

        if (isValid) {
            $form.addClass("form-valid")
        } else {
            $form.removeClass("form-valid")
        }

        return isValid
    }

    $("form").each(function () {
        let $form = $(this)

        validateForm($form)

        $form.on("input change blur", "input, textarea, select", function () {
            validateForm($form)
        })
    })

    UnicornStudio.init().then((scenes) => {})
}
globalScripts()

// Initialize contact page functionality
const initContactPage = () => {
    const MAX_SCROLL_DELTA = 50
    const SCROLL_COOLDOWN_MS = 16
    const INTERPOLATION_FACTOR = 0.1
    const TOUCH_MULTIPLIER = 2

    const onDesktop = (fn) => {
        if (
            window.matchMedia(
                "(min-width: 992px) and (any-hover: hover) and (any-pointer: fine)"
            ).matches
        )
            fn()
    }

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

    const wrapNumber = (value, minInclusive, maxExclusive) => {
        const span = maxExclusive - minInclusive
        if (span <= 0 || !isFinite(span)) return minInclusive
        let result = (value - minInclusive) % span
        if (result < 0) result += span
        return result + minInclusive
    }

    const getRandomImage = () => {
        return globalIcons[Math.floor(Math.random() * globalIcons.length)]
    }

    $(".page-contact").each(function () {
        const $page = $(this)

        // Clean up previous instance if it exists
        const existingDestroy = $page.data("contactPageDestroy")
        if (existingDestroy) {
            existingDestroy()
        }

        const $items = $page.find(".contact-item")
        const $visual = $page.find(".contact-visual")
        const $img = $page.find(".contact-img")
        const $infiniteWrap = $page.find(".contact-infinite")
        const $infiniteItems = $page.find(".contact-wrap")

        if (!$infiniteWrap.length || !$infiniteItems.length) return

        // State
        let infiniteHeight = 0
        let itemHeight = 0
        let itemsCount = $infiniteItems.length
        let totalHeight = 0

        let currentScrollPosition = 0
        let smoothScrollY = 0

        let isTouching = false
        let touchStartY = 0

        let lastScrollTime = 0
        let rafId = 0
        let destroyed = false

        // Debounce utility
        let resizeTimer = null
        const debounce =
            (fn, wait) =>
            (...args) => {
                clearTimeout(resizeTimer)
                resizeTimer = setTimeout(() => fn.apply(null, args), wait)
            }

        const measureLayout = () => {
            const wrapEl = $infiniteWrap[0]
            const firstItemEl = $infiniteItems[0]

            infiniteHeight = wrapEl ? wrapEl.clientHeight : 0
            itemHeight = firstItemEl ? firstItemEl.clientHeight : 0
            itemsCount = $infiniteItems.length
            totalHeight = itemsCount * itemHeight

            return infiniteHeight > 0 && itemHeight > 0 && totalHeight > 0
        }

        const adjustItemsPosition = (scroll) => {
            if (destroyed) return
            if (itemHeight <= 0 || totalHeight <= 0) return

            $infiniteItems.each(function (index) {
                const rawY = index * itemHeight + scroll
                const wrappedY = wrapNumber(
                    rawY,
                    -itemHeight,
                    totalHeight - itemHeight
                )
                gsap.set(this, { y: wrappedY })
            })

            updateItemMargins()
        }

        const updateItemMargins = () => {
            if (!$visual.length || !$items.length) return

            const visualRect = $visual[0].getBoundingClientRect()
            const visualCenterY = visualRect.top + visualRect.height / 2

            $items.each(function () {
                const $item = $(this)
                const rect = this.getBoundingClientRect()
                const itemCenterY = rect.top + rect.height / 2

                const distance = Math.abs(itemCenterY - visualCenterY)
                const maxEffectDistance =
                    (visualRect.height + rect.height) * 1.5
                let proximity = Math.max(0, 1 - distance / maxEffectDistance)
                proximity = proximity * proximity * (3 - 2 * proximity)

                const marginValueRem = proximity * 5

                const $left = $item.find(".contact-item_left")
                const $right = $item.find(".contact-item_right")

                onDesktop(() => {
                    gsap.set($left, { marginRight: `${marginValueRem}rem` })
                    gsap.set($right, { marginLeft: `${marginValueRem}rem` })
                })

                if (proximity > 0.8 && $img.length) {
                    if (!$item.data("was-centered")) {
                        $item.data("was-centered", true)
                        $img.attr("src", getRandomImage())
                        if ($("body").hasClass("is-muted")) {
                            try {
                                if (typeof unlockAudio === "function")
                                    unlockAudio()
                                if (typeof tryPlaySfxWA === "function")
                                    tryPlaySfxWA()
                            } catch (_) {}
                        }
                    }
                } else {
                    $item.data("was-centered", false)
                }
            })
        }

        const animate = () => {
            if (destroyed) return
            rafId = requestAnimationFrame(animate)
            smoothScrollY =
                smoothScrollY * (1 - INTERPOLATION_FACTOR) +
                currentScrollPosition * INTERPOLATION_FACTOR
            adjustItemsPosition(smoothScrollY)
        }

        const tryConsumeScrollTick = () => {
            const now = Date.now()
            if (now - lastScrollTime < SCROLL_COOLDOWN_MS) return false
            lastScrollTime = now
            return true
        }

        const onWheel = (e) => {
            e.preventDefault()
            if (!tryConsumeScrollTick()) return
            const deltaY = "deltaY" in e ? e.deltaY : 0
            const limited = clamp(deltaY, -MAX_SCROLL_DELTA, MAX_SCROLL_DELTA)
            currentScrollPosition -= limited
        }

        const onTouchStart = (e) => {
            isTouching = true
            if (e.touches && e.touches.length) {
                touchStartY = e.touches[0].clientY
            }
            lastScrollTime = 0
        }

        const onTouchMove = (e) => {
            e.preventDefault()
            if (!isTouching) return
            if (!tryConsumeScrollTick()) return

            if (e.touches && e.touches.length) {
                const touchY = e.touches[0].clientY
                const deltaY = touchStartY - touchY
                const limited = clamp(
                    deltaY * TOUCH_MULTIPLIER,
                    -MAX_SCROLL_DELTA,
                    MAX_SCROLL_DELTA
                )
                currentScrollPosition -= limited
                touchStartY = touchY
            }
        }

        const onTouchEnd = () => {
            isTouching = false
            lastScrollTime = 0
        }

        const handleResize = () => {
            if (!measureLayout()) {
                setTimeout(() => {
                    if (measureLayout()) {
                        adjustItemsPosition(smoothScrollY)
                    }
                }, 50)
                return
            }
            adjustItemsPosition(smoothScrollY)
        }

        const debouncedResize = debounce(handleResize, 50)

        const el = $page[0]

        el.addEventListener("wheel", onWheel, { passive: false })
        el.addEventListener("mousewheel", onWheel, { passive: false })
        el.addEventListener("touchstart", onTouchStart, { passive: true })
        el.addEventListener("touchmove", onTouchMove, { passive: false })
        el.addEventListener("touchend", onTouchEnd, { passive: true })
        window.addEventListener("resize", debouncedResize, { passive: true })

        let resizeObserver = null
        if ("ResizeObserver" in window && $infiniteWrap[0]) {
            resizeObserver = new ResizeObserver(() => debouncedResize())
            resizeObserver.observe($infiniteWrap[0])
        }

        if (measureLayout()) {
            adjustItemsPosition(0)
        }
        rafId = requestAnimationFrame(animate)

        // Store destroy function
        $page.data("contactPageDestroy", () => {
            destroyed = true
            cancelAnimationFrame(rafId)
            el.removeEventListener("wheel", onWheel)
            el.removeEventListener("mousewheel", onWheel)
            el.removeEventListener("touchstart", onTouchStart)
            el.removeEventListener("touchmove", onTouchMove)
            el.removeEventListener("touchend", onTouchEnd)
            window.removeEventListener("resize", debouncedResize)
            if (resizeObserver) resizeObserver.disconnect()
        })
    })
}

// Optional: Clean up when leaving the page
// barba.hooks.beforeLeave(() => {
//   $("[video-player]").each(function () {
//     const player = $(this).data("playerInstance");
//     const timeline = $(this).data("timeline");

//     if (player) {
//       player.destroy();
//     }

//     if (timeline) {
//       timeline.kill();
//     }
//   });

//   // Kill all ScrollTriggers on the page
//   // ScrollTrigger.getAll().forEach((st) => st.kill());
// });

let pageTransitionDuration = 0.6
let pageTransitionEase = "workItemEase"

function resetWebflow(data) {
    let parser = new DOMParser()
    let dom = parser.parseFromString(data.next.html, "text/html")
    let webflowPageId = $(dom).find("html").attr("data-wf-page")
    $("html").attr("data-wf-page", webflowPageId)
    window.Webflow && window.Webflow.destroy()
    window.Webflow && window.Webflow.ready()
    window.Webflow && window.Webflow.require("ix2").init()
}

barba.hooks.enter((data) => {
    gsap.set(data.next.container, {
        position: "fixed",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
    })
})
barba.hooks.before((data) => {
    lenis.stop()
})

barba.hooks.beforeEnter((data) => {
    // checkPreloader();
    initMuteButtons()
})

barba.hooks.after((data) => {
    // initMuteButtons();
    gsap.set(data.next.container, {
        clearProps: "position,pointerEvents,top,left,width,zIndex",
    })
    $(window).scrollTop(0)
    globalScripts()
})

barba.init({
    preventRunning: true,
    cacheFirstPage: false,
    cacheIgnore: true,
    timeout: 10000,
    debug: false,
    views: [
        {
            namespace: "about",
            beforeEnter() {
                gsap.set(".transition-panel", {
                    backgroundColor: "#afaea7",
                })
                $("body").addClass("black-body")
                aboutFunctions()
            },
            beforeLeave() {
                $("body").removeClass("black-body")
            },
        },
        {
            namespace: "home",
            beforeEnter() {
                gsap.set(".transition-panel", {
                    backgroundColor: "var(--swatch--theme-white)",
                })
                homeFunctions()
            },
        },
        {
            namespace: "single-project",
            afterEnter() {
                singleProjectFunctions()
                // project-infinite_section
                // lenis.resize();
                // ScrollTrigger.refresh(true);
            },
        },
        {
            namespace: "contact",
            beforeEnter() {
                initContactPage()
                gsap.set(".transition-panel", {
                    backgroundColor: "var(--swatch--theme-white)",
                })
            },
        },
    ],

    transitions: [
        {
            name: "page-reload",
            once: (data) => {
                // if (document.querySelector(".page-content.is-home")) {
                //   homeEnterAnimation(data.next.container);
                // }
                // if (document.querySelector(".page-content.work-page")) {
                //   $("body").addClass("white");
                //   enterWorkAnimation(data.next.container);
                // }
                // if (document.querySelector(".page-content.cms-page")) {
                //   caseStudiesOnce(data.next.container);
                // }
                // if (document.querySelector(".page-content.contact-page")) {
                //   enterContactAnimation(data.next.container);
                // }
                // if (document.querySelector(".page-content.about-page")) {
                //   aboutOnceAnimation(data.next.container);
                // }
                // enterContactAnimation
            },
        },
        {
            sync: true,
            enter(data) {
                let barbaTransitionTl = gsap.timeline({
                    defaults: {
                        duration: pageTransitionDuration,
                        ease: pageTransitionEase,
                    },
                })

                barbaTransitionTl.set(".transition-wrap", {
                    display: "flex",
                })
                barbaTransitionTl.fromTo(
                    ".transition-overlay",
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        duration: pageTransitionDuration,
                        ease: "power1.out",
                    },
                    "<"
                )

                barbaTransitionTl.fromTo(
                    ".transition-panel",
                    {
                        width: "0%",
                    },
                    {
                        width: "100%",
                        stagger: {
                            amount: pageTransitionDuration,
                        },
                    },
                    "<"
                )

                barbaTransitionTl.fromTo(
                    data.next.container,
                    {
                        x: "100%",
                    },
                    {
                        x: "0%",
                        ease: "ease-3",
                        clearProps: "all",
                        onStart: () => {
                            logoLottie()
                        },

                        onComplete: () => {
                            gsap.set(".transition-wrap", {
                                display: "none",
                            })
                        },
                    },
                    "<80%"
                )

                return barbaTransitionTl
            },
        },

        {
            name: "home-work",
            from: { namespace: ["home"] },
            to: { namespace: ["single-project"] },
            enter(data) {
                const targets = gsap.utils.toArray(
                    $(data.current.container).find(
                        ".home-infinite_component .work-item"
                    )
                )

                const targetEl =
                    $(data.current.container).find(
                        ".work-item.target-project"
                    )[0] || targets[0]

                // Find the index of the target element in the targets array
                const targetIndex = targets.indexOf(targetEl)

                let homeLeaveTl = gsap.timeline({
                    defaults: {
                        duration: pageTransitionDuration,
                        ease: pageTransitionEase,
                    },
                    onStart: () => {
                        // Disable the infinite scroller
                        const homePage = document.querySelector(".page-home")
                        if (homePage?._homeModules?.scroller) {
                            homePage._homeModules.scroller.disable()
                        }

                        gsap.set(data.next.container, { opacity: 0 })
                        gsap.set(targets, { transition: "none" })
                    },
                    onComplete: () => {
                        $("body").removeClass("unclickable")

                        // Re-enable the scroller if still on home page
                        const homePage = document.querySelector(".page-home")
                        if (homePage?._homeModules?.scroller) {
                            homePage._homeModules.scroller.enable()
                        }
                    },
                })

                if (
                    $(".page-home").attr("work-items-display") === "show-thumbs"
                ) {
                    homeLeaveTl.to(
                        $(data.current.container).find(".work-item_bg"),
                        {
                            width: "100%",
                            overwrite: "auto",
                            stagger: distributeByPosition({
                                amount: pageTransitionDuration,
                                from: targetIndex,
                                ease: "power2.out",
                            }),
                        }
                    )
                }

                homeLeaveTl.to(
                    targets,
                    {
                        width: "100%",
                        overwrite: "auto",
                        onStart: () => {
                            if (
                                $(".page-home").attr("work-items-display") ===
                                "show-thumbs"
                            ) {
                                onDesktop(() => {
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".work-item_thumb"
                                        ),
                                        {
                                            width: "10vh",
                                            overwrite: "auto",
                                        }
                                    )
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".adj-project .work-item_thumb"
                                        ),
                                        { width: "15.5vh", overwrite: "auto" }
                                    )
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".target-project .work-item_thumb"
                                        ),
                                        { width: "25.5vh", overwrite: "auto" }
                                    )
                                })
                                onMobile(() => {
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".work-item_thumb"
                                        ),
                                        {
                                            width: "5.5rem",
                                            overwrite: "auto",
                                        }
                                    )
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".adj-project .work-item_thumb"
                                        ),
                                        { width: "8rem", overwrite: "auto" }
                                    )
                                    gsap.set(
                                        $(data.current.container).find(
                                            ".target-project .work-item_thumb"
                                        ),
                                        { width: "12rem", overwrite: "auto" }
                                    )
                                })
                            }
                        },
                        stagger: distributeByPosition({
                            amount: pageTransitionDuration,
                            from: targetIndex,
                            ease: "power2.out",
                        }),
                    },
                    "<"
                )

                homeLeaveTl.fromTo(
                    $(data.current.container).find(".work-item_text_wrap"),
                    { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
                    { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
                    "<"
                )

                homeLeaveTl.to(
                    $(data.current.container).find("[pt-fade]"),
                    { opacity: 0, ease: "expo.out" },
                    "<"
                )

                homeLeaveTl.fromTo(
                    targets,
                    { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
                    {
                        clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
                        stagger: distributeByPosition({
                            amount: pageTransitionDuration,
                            from: targetIndex,
                            ease: "power2.out",
                        }),
                        onComplete: () => {
                            logoLottie()
                        },
                    },
                    "<90%"
                )

                homeLeaveTl.set(data.next.container, { opacity: 1 })

                homeLeaveTl.fromTo(
                    $(data.next.container).find("[pt-fade]"),
                    { opacity: 0 },
                    { opacity: 1, ease: "power2.out", clearProps: "all" },
                    "<"
                )
                homeLeaveTl.fromTo(
                    $(data.next.container).find(".page-project"),
                    { y: "50vh" },
                    {
                        y: "0vh",
                        clearProps: "all",
                        ease: "power2.out",
                        duration: pageTransitionDuration,
                    },
                    "<"
                )
                homeLeaveTl.fromTo(
                    $(data.next.container).find("[single-fade]"),
                    { opacity: 0 },
                    {
                        opacity: 1,
                        ease: "power2.out",
                        clearProps: "all",
                        duration: pageTransitionDuration,
                    },
                    "<"
                )
                return homeLeaveTl
            },
        },
        {
            name: "project-project",
            sync: true,
            from: { namespace: ["single-project"] },
            to: { namespace: ["single-project"] },
            enter(data) {
                const $nextProject = $(".project-inf_item.project-highlighted")
                // const targetBgColor = $nextProject
                //   .find(".project-inf_link")
                //   .css("background-color");
                // $(data.next.container)
                //   .find(".project-visual_bg")
                //   .css("background-color", targetBgColor);

                let projProjTl = gsap.timeline({
                    defaults: {
                        duration: pageTransitionDuration,
                        ease: pageTransitionEase,
                    },
                    onStart: () => {
                        gsap.set(data.next.container, {
                            opacity: 0,
                        })
                        $(".project-inf_item").each(function () {
                            const $this = $(this)
                            $this.data("hoverHandlers", $this.data("events"))
                            $this.off("mouseleave")
                        })
                    },
                })
                projProjTl.set(
                    $(data.current.container).find(".transition-wrap_single"),
                    {
                        display: "flex",
                    }
                )
                projProjTl.fromTo(
                    ".transition-overlay",
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        duration: pageTransitionDuration / 2,
                    },
                    "<"
                )

                projProjTl.fromTo(
                    $(data.current.container).find(".transition-panel_single"),
                    {
                        height: "0%",
                    },
                    {
                        height: "100%",
                        stagger: {
                            amount: pageTransitionDuration,
                        },
                        onComplete: () => {
                            logoLottie()
                        },
                    },
                    "<"
                )

                projProjTl.to(
                    $(data.current.container).find("[pt-fade]"),
                    {
                        opacity: 0,
                    },
                    "<"
                )

                projProjTl.set(data.next.container, {
                    opacity: 1,
                })

                projProjTl.fromTo(
                    $(data.next.container).find("[pt-fade]"),
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        clearProps: "all",
                    }
                )
                projProjTl.fromTo(
                    $(data.next.container).find(".page-project"),
                    {
                        y: "50vh",
                    },
                    {
                        y: "0vh",
                        clearProps: "all",
                        ease: "expo.out",
                        duration: pageTransitionDuration * 2,
                    },
                    "<"
                )
                projProjTl.fromTo(
                    $(data.next.container).find("[single-fade]"),
                    {
                        opacity: 0,
                    },
                    {
                        opacity: 1,
                        clearProps: "all",
                        duration: pageTransitionDuration,
                    },
                    "<"
                )

                return projProjTl
            },
        },
    ],
})

function preloader() {
    let preDuration = 3
    let preEase = "power2"
    let preLoader = $(".preloader-component")
    let preLogo = $(".preloader-logo")
    let preNumEl = $(".preloader-num")
    let preNumElMobile = $(".preloader-num.is-mobile")
    let globalNav = $(".nav-component")
    let infiniteLoop = $(".home-infinite_component")
    let preNumText = $(".preloader-num_text")
    let preNumTextMobile = $(".is-mobile .preloader-num_text")
    let preWorkList = $(".work-list")
    let preWorkItems = $(".work-item")
    let preWorkItemsBg = preWorkItems.find(".work-item_bg")
    let pageHome = $(".page-home")
    let stdPage = $("[std-page]")
    let projPage = $(".page-project")

    // Get actual count of mobile elements
    let mobileNumCount = preNumElMobile.length
    let desktopNumCount = preNumEl.length

    if (pageHome.length) {
        onDesktop(() => {
            gsap.set(preWorkList, {
                width: "100%",
                alignItems: "center",
            })
            gsap.set(preWorkItems, {
                pointerEvents: "none",
            })
            gsap.set(pageHome, {
                pointerEvents: "none",
            })
        })
    }

    if (!pageHome.length) {
        gsap.set(preLogo, {
            scale: 0.01,
        })
    }

    let numbers = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
    ]

    let gridStagger = { each: 0.125, from: "center", grid: "auto" }

    let preloaderTl = gsap.timeline({
        defaults: { duration: preDuration, ease: preEase },
        onComplete: function () {
            $("body").removeClass("show-preloader")
        },
    })

    preloaderTl.set(preLogo, {
        display: "flex",
        opacity: 1,
        transformOrigin: "50% 0%",
    })

    preloaderTl.to(
        preLogo,
        { opacity: 0, duration: 0.1, ease: "power2.out" },
        1
    )

    onDesktop(() => {
        preloaderTl.add("show").to(
            preNumEl,
            {
                opacity: 1,
                duration: 0.01,
                ease: "none",
                stagger: { ...gridStagger, amount: 0.8 },
            },
            "show"
        )
    })

    onMobile(() => {
        preloaderTl.add("show").to(
            preNumElMobile,
            {
                opacity: 1,
                duration: 0.01,
                ease: "none",
                stagger: { ...gridStagger, amount: 0.8 },
            },
            "show"
        )
    })

    // Calculate actual numbers to display based on element count
    let numbersToDisplay = numbers.length

    for (let i = 0; i < numbersToDisplay; i++) {
        onDesktop(() => {
            preloaderTl.to(
                preNumText,
                {
                    duration: 0.01,
                    ease: "none",
                    stagger: {
                        ...gridStagger,
                        onComplete: function () {
                            this.targets()[0].textContent = numbers[i]
                        },
                    },
                },
                `show+=${i * 0.15}`
            )
        })
        onMobile(() => {
            preloaderTl.to(
                preNumTextMobile,
                {
                    duration: 0.01,
                    ease: "none",
                    stagger: {
                        ...gridStagger,
                        onComplete: function () {
                            this.targets()[0].textContent = numbers[i]
                        },
                    },
                },
                `show+=${i * 0.15}`
            )
        })
    }

    let desktopFadeOffset = numbers.length * 0.15 - 0.1
    let mobileFadeOffset = numbers.length * 0.15 - 0.1

    onDesktop(() => {
        preloaderTl.add("numsFade", `show+=${desktopFadeOffset}`)
    })
    onMobile(() => {
        preloaderTl.add("numsFade", `show+=${mobileFadeOffset}`)
    })

    if (pageHome.length) {
        onDesktop(() => {
            preloaderTl.set(preLogo, { opacity: 1 }, "numsFade")
        })
        onMobile(() => {
            preloaderTl.set(preLogo, { opacity: 1 }, "<20%")
        })
    }

    onDesktop(() => {
        preloaderTl.to(
            preNumEl,
            { opacity: 0, duration: 0.1, ease: "none", stagger: gridStagger },
            "numsFade"
        )
    })

    onMobile(() => {
        preloaderTl.to(
            preNumElMobile,
            { opacity: 0, duration: 0.1, ease: "none", stagger: gridStagger },
            "numsFade"
        )
    })

    if (pageHome.length) {
        preloaderTl.from(preLogo, {
            scale: 0.01,
            duration: 1,
            ease: "power3.inOut",
            onStart: function () {
                gsap.set(infiniteLoop, {
                    overflow: "hidden",
                })
            },
        })
        preloaderTl.to(
            preLoader,
            {
                opacity: 0,
                duration: 0.01,
                onComplete: function () {
                    gsap.set(preLoader, {
                        display: "none",
                    })
                },
            },
            "<75%"
        )

        preloaderTl.fromTo(
            globalNav,
            {
                scale: 0.8,
            },
            {
                scale: 1,
                duration: 1,
                ease: "power3.out",
            },
            "<"
        )
    }

    if (stdPage.length) {
        preloaderTl.to(preLoader, {
            opacity: 0,
            duration: 0.01,
            onComplete: function () {
                gsap.set(preLoader, {
                    display: "none",
                })
            },
        })

        preloaderTl.fromTo(
            globalNav,
            {
                scale: 0.8,
            },
            {
                scale: 1,
                duration: 1,
                ease: "power3.out",
            },
            "<"
        )
        preloaderTl.fromTo(
            "[intro-fade]",
            {
                y: "50vh",
            },
            {
                y: "0vh",
                ease: "power3.out",
                duration: pageTransitionDuration * 2,
                clearProps: "all",
            },
            "<"
        )
        preloaderTl.fromTo(
            "[intro-fade]",
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: pageTransitionDuration,
            },
            "<"
        )
    }

    if (projPage.length) {
        preloaderTl.to(preLoader, {
            opacity: 0,
            duration: 0.01,
            onComplete: function () {
                gsap.set(preLoader, {
                    display: "none",
                })
            },
        })

        preloaderTl.fromTo(
            globalNav,
            {
                scale: 0.8,
            },
            {
                scale: 1,
                duration: 1,
                ease: "power3.out",
            },
            "<"
        )
        preloaderTl.fromTo(
            "[intro-fade]",
            {
                paddingTop: "50vh",
            },
            {
                paddingTop: "0vh",
                ease: "power3.out",
                duration: pageTransitionDuration * 2,
                clearProps: "all",
                onComplete: function () {
                    ScrollTrigger.refresh()
                    // lenis.resize();
                },
            },
            "<"
        )
        preloaderTl.fromTo(
            "[intro-fade]",
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: pageTransitionDuration,
            },
            "<"
        )
        preloaderTl.fromTo(
            ".project-intro",
            {
                yPercent: 100,
            },
            {
                yPercent: 0,
                clearProps: "all",
                ease: "power3.out",
                duration: pageTransitionDuration * 2,
            },
            "<"
        )

        preloaderTl.fromTo(
            ".project-intro_bg",
            {
                yPercent: 100,
            },
            {
                yPercent: 0,
                clearProps: "all",
                ease: "power3.out",
                duration: pageTransitionDuration * 2,
            },
            "<20%"
        )
    }

    if (pageHome.length) {
        preloaderTl.fromTo(
            ".work-ui",
            {
                scale: 0.8,
            },
            {
                scale: 1,
                duration: 1,
                ease: "power3.out",
            },
            "<"
        )
        preloaderTl.fromTo(
            infiniteLoop,
            {
                y: "100vh",
            },
            {
                y: "0vh",
                duration: 1.4,
                clearProps: "all",
                ease: "power3.out",

                onComplete: function () {
                    gsap.set(preWorkList, {
                        clearProps: "all",
                    })
                    gsap.set(preWorkItems, {
                        pointerEvents: "auto",
                    })
                    gsap.set(pageHome, {
                        pointerEvents: "auto",
                    })
                },
            },
            "<"
        )
        onDesktop(() => {
            preloaderTl.fromTo(
                preWorkItemsBg,
                {
                    scaleX: 1,
                },
                {
                    scaleX: 5,
                    duration: 0.25,
                    stagger: {
                        amount: 1.2,
                        from: "start",
                        yoyo: true,
                        repeat: 1,
                    },
                    ease: "sine.inOut",
                    clearProps: "scale",
                },
                "<"
            )
        })
        onMobile(() => {
            preloaderTl.to(
                preWorkItemsBg,
                {
                    scaleX: 3,
                    duration: 0.25,
                    stagger: {
                        amount: 1.2,
                        from: "start",
                        yoyo: true,
                        repeat: 1,
                    },
                    ease: "sine.inOut",
                    clearProps: "scale",
                },
                "<"
            )
        })
    }
}
preloader()
