import { addEffect } from "@react-three/fiber"
import Lenis from "@studio-freight/lenis"
import EmergingImage from "./components/EmergingImage.jsx"
import Scene from "./Scene.jsx"
import { useState } from "react"
import { useEffect } from "react"

const styles = `
body {
  scroll-behavior: smooth;
}

canvas {
  touch-action: none;
  /* animation: fade-in 1.5s ease 0.5s forwards; */
}

*,
*::after,
*::before {
	box-sizing: border-box;
}

:root {
	font-size: 12px;
	--color-text: #f0f0f0;
	--color-bg: #101014;
	--color-link: #818798;
	--color-link-hover: #fff;
	--color-title: #7f7f8f;
	--color-year: #b9b3af;
	--img-ratio: 1.3;
	--s: 1;
}

body {
	margin: 0;
	color: var(--color-text);
	background-color: var(--color-bg);
	font-family: ui-monospace, monospace;
	font-weight: 600;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	width: 100%;
	overflow-x: hidden;
}

/* Page Loader */
.js .loading::before,
.js .loading::after {
	content: '';
	position: fixed;
	z-index: 1000;
}

.js .loading::before {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: var(--color-bg);
}

.js .loading::after {
	top: 50%;
	left: 50%;
	width: 60px;
	height: 60px;
	margin: -30px 0 0 -30px;
	opacity: 0.4;
	background: var(--color-link);
	animation: loaderAnim 0.7s linear infinite alternate forwards;

}

@keyframes loaderAnim {
	to {
		opacity: 1;
		transform: scale3d(0.7,0.7,1);
	}
}

a {
	text-decoration: none;
	color: var(--color-link);
	outline: none;
	cursor: pointer;
}

a:hover {
	color: var(--color-link-hover);
	outline: none;
}

/* Better focus styles from https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible */
a:focus {
	/* Provide a fallback style for browsers
	 that don't support :focus-visible */
	outline: none;
}

a:focus-visible {
	/* Draw a very noticeable focus style for
	 keyboard-focus on browsers that do support
	 :focus-visible */
	outline: 2px solid red;
}

.unbutton {
	background: none;
	border: 0;
	padding: 0;
	margin: 0;
	font: inherit;
	cursor: pointer;
}

.unbutton:focus {
	outline: none;
}

.frame {
	position: relative;
	padding: 2rem 3rem;
	display: grid;
	width: 100%;
	min-height: 40vh;
	grid-template-columns: min-content min-content auto 260px;
	grid-template-areas: 'prev back sponsor ...' 'title title title title' 'demos demos demos demos'  ;
	grid-row-gap: 5vh;
	grid-column-gap: 2rem;
	pointer-events: none;
	justify-items: start;
}

.frame a {
	pointer-events: auto;
}

.frame__title {
	grid-area: title;
	font-size: clamp(1.5rem, 10vw,5rem);
	margin: 0;
	line-height: 1.2;
	font-family: "gabriella", sans-serif;
	font-weight: 900;
}

.frame__back {
	grid-area: back;
	justify-self: start;
	white-space: nowrap;
}

.frame__prev {
	grid-area: prev;
	justify-self: start;
	white-space: nowrap;
}

.frame__demos {
	grid-area: demos;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	align-self: start;
	flex-wrap: wrap;
}

.frame__demos-item{
	cursor: pointer;
}

.frame__demos-item.is-active{
	border: 1px solid;
}

.frame__demos-item {
	width: 2.5rem;
	display: block;
	flex: none;
	border-radius: 50%;
	aspect-ratio: 1;
	display: grid;
	place-items: center;
}

.grid {
	width: 100%;
	display: grid;
	position: relative;
	margin: 10vh auto 50vh;
	padding: 0 3rem;
	grid-row-gap: 3rem;
}

.grid__item {
    position: relative;
    margin: 0;
}

.grid__item-img {
	position: relative;
	overflow: hidden;
	display: grid;
	place-items: center;
	width: 100%;
	height: auto;
	aspect-ratio: var(--img-ratio);
}

.grid__item-img-inner {
	width: 100%;
	height: 100%;
	background-position: 50%;
	background-size: cover;
	position: relative;
}

.grid__item-caption {
	position: absolute;
	padding: 0.5rem 0;
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.grid__item-caption h3 {
	font-weight: bold;
	font-size: inherit;
	margin: 0;
	color: var(--color-title);
}

.grid__item-caption span {
	font-weight: bold;
	color: var(--color-year);
}

.outro {
	display: grid;
	place-items: center;
	margin: 40vh 0;
}

.outro__title {
	font-weight: 300;
	font-size: clamp(1.5rem,10vw,2rem);
}

.card-wrap {
	margin-top: 5vh;
	display: grid;
	grid-gap: 2rem;
	grid-auto-flow: row;
	grid-template-columns: 250px;
	text-align: center;
}

.card__image {
	display: block;
	border-radius: 7px;
	background-size: cover;
	background-position: 50% 50%;
	width: 100%;
	height: auto;
	aspect-ratio: 4 / 3;
	filter: contrast(0.95);
}

.card__title {
	font-weight: 300;
}

.credits {
	font-size: 1.5rem;
	text-align: center;
	margin: 50vh auto 0;
	padding-bottom: 50vh;
}

@media screen and (min-width: 53em) {
	.card-wrap {
		grid-template-columns: repeat(2,300px);
	}
	.grid {
		gap: 3vw;
		grid-template-columns: repeat(10,1fr);
		grid-auto-rows: auto;
	}
	.grid__item {
    grid-column: var(--c) / span var(--s);
    grid-row: var(--r);
  }
}
`

const lenis = new Lenis()
addEffect((t) => lenis.raf(t))

function App() {
    const [type, setType] = useState(0)

    useEffect(() => {
        const nav = [...document.querySelectorAll(".frame__demos-item")]
        nav.forEach((el) => el.classList.remove("is-active"))
        nav[type].classList.add("is-active")
    }, [type])

    return (
        <>
            <style>{styles}</style>
            <Scene />
            <main>
                <div className="frame">
                    <h1 className="frame__title">
                        Revealing <br />
                        WebGL Images
                    </h1>
                    <a
                        className="frame__back"
                        href="https://tympanus.net/codrops/?p=75561"
                    >
                        Back to the article
                    </a>
                    <a
                        className="frame__prev"
                        href="https://tympanus.net/Development/StickySections/"
                    >
                        Previous demo
                    </a>
                    <nav className="frame__demos">
                        <span className="frame__demos-title">Variations </span>
                        <a
                            className="frame__demos-item is-active"
                            onClick={() => setType(0)}
                        >
                            1
                        </a>
                        <a
                            className="frame__demos-item"
                            onClick={() => setType(1)}
                        >
                            2
                        </a>
                        <a
                            className="frame__demos-item"
                            onClick={() => setType(2)}
                        >
                            3
                        </a>
                        <a
                            className="frame__demos-item"
                            onClick={() => setType(3)}
                        >
                            4
                        </a>
                        <a
                            className="frame__demos-item"
                            onClick={() => setType(4)}
                        >
                            5
                        </a>
                    </nav>
                </div>
                <div className="grid">
                    <figure
                        className="grid__item"
                        style={{ "--r": 1, "--c": 1, "--s": 4 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=1"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Embrace of Heat</h3> <span>2023</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 2, "--c": 5, "--s": 3 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=2"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Silence in Sand</h3> <span>2022</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 3, "--c": 3, "--s": 2 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=3"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Whispers of Earth</h3> <span>2024</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 4, "--c": 1, "--s": 2 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=4"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Mirage in Time</h3> <span>2021</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 5, "--c": 3, "--s": 5 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=5"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Veiled in Gold</h3> <span>2023</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 6, "--c": 2 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=6"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Ancient Sands Speak</h3> <span>2022</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 7, "--c": 3, "--s": 3 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=7"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Dreams of Dust</h3> <span>2024</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 8, "--c": 6, "--s": 2 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=8"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Gilded Sands Sing</h3> <span>2021</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 9, "--c": 1, "--s": 5 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=9"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Mirrored Illusions Fade</h3> <span>2023</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 10, "--c": 6, "--s": 3 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=10"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Ripples in Time</h3> <span>2022</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 11, "--c": 4, "--s": 2 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=11"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Essence of Silence</h3> <span>2024</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 12, "--c": 1, "--s": 3 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=12"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Luxury in Lines</h3> <span>2021</span>
                        </figcaption>
                    </figure>
                    <figure
                        className="grid__item"
                        style={{ "--r": 13, "--c": 4, "--s": 5 }}
                    >
                        <div className="grid__item-img">
                            <EmergingImage
                                type={type}
                                url="https://picsum.photos/1920/1080?random=13"
                                className="grid__item-img-inner"
                            />
                        </div>
                        <figcaption className="grid__item-caption">
                            <h3>Escape in Shadows</h3> <span>2023</span>
                        </figcaption>
                    </figure>
                </div>
                <section className="outro">
                    <h2 className="outro__title">More you might like</h2>
                    <div className="card-wrap">
                        <div className="card">
                            <a
                                href="http://tympanus.net/Development/GridToSlider/"
                                className="card__image"
                                style={{
                                    backgroundImage:
                                        "url(https://tympanus.net/codrops/wp-content/uploads/2023/05/gridtoslider_feat.jpg",
                                }}
                            ></a>
                            <h3 className="card__title">
                                <a href="http://tympanus.net/Development/GridToSlider/">
                                    Grid to Slideshow Switch Animations
                                </a>
                            </h3>
                        </div>
                        <div className="card">
                            <a
                                href="https://tympanus.net/Development/GridFlowEffect/"
                                className="card__image"
                                style={{
                                    backgroundImage:
                                        "url(https://tympanus.net/codrops/wp-content/uploads/2023/07/gridflow_featured-1.jpg",
                                }}
                            ></a>
                            <h3 className="card__title">
                                <a href="http://tympanus.net/Development/GridFlowEffect/">
                                    Grid Flow Animation
                                </a>
                            </h3>
                        </div>
                    </div>
                </section>
                <p className="credits">
                    Made by <a href="https://twitter.com/akella">@akella</a> for{" "}
                    <a href="https://twitter.com/codrops">@codrops</a>
                </p>
            </main>
        </>
    )
}

export default App
