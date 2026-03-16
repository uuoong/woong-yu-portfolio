import { SceneProvider } from "./gl/scene.js"
import GLImage from "./GLImage.jsx"

export default function TestPage() {
    return (
        <SceneProvider>
            <main style={styles.page}>
                <Hero />

                <Section>
                    <GLImage
                        src="https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=1600"
                        type="pixel"
                        color="#403fb7"
                        style={styles.imgLarge}
                    />
                </Section>

                <Section>
                    <GLImage
                        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200"
                        type="wave"
                        style={styles.imgWide}
                    />

                    <GLImage
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=900"
                        type="pixel"
                        color="#ff3366"
                        style={styles.imgSmall}
                    />
                </Section>

                <Section>
                    <GLImage
                        src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1400"
                        type="wave"
                        style={styles.imgTall}
                    />
                </Section>

                <Section>
                    <GLImage
                        src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1600"
                        type="pixel"
                        color="#00c2ff"
                        style={styles.imgWide}
                    />

                    <GLImage
                        src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=900"
                        type="wave"
                        style={styles.imgMedium}
                    />
                </Section>

                <Footer />
            </main>
        </SceneProvider>
    )
}

function Hero() {
    return (
        <section style={styles.hero}>
            <h1 style={styles.title}>Project Name</h1>
            <p style={styles.meta}>Art Direction / WebGL / 2026</p>
        </section>
    )
}

function Section({ children }) {
    return <section style={styles.section}>{children}</section>
}

function Footer() {
    return (
        <section style={styles.footer}>
            <p>End of Project</p>
        </section>
    )
}

const styles = {
    page: {
        background: "#0e0e0e",
        color: "#fff",
        fontFamily: "sans-serif",
        paddingBottom: "20vh",
    },

    hero: {
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "10vw",
    },

    title: {
        fontSize: "64px",
        marginBottom: "20px",
    },

    meta: {
        opacity: 0.6,
    },

    section: {
        display: "flex",
        flexDirection: "column",
        gap: "120px",
        padding: "12vw",
    },

    imgLarge: {
        width: "100%",
        maxWidth: "1200px",
    },

    imgWide: {
        width: "100%",
        maxWidth: "900px",
    },

    imgMedium: {
        width: "70%",
        maxWidth: "700px",
    },

    imgSmall: {
        width: "40%",
        maxWidth: "420px",
    },

    imgTall: {
        width: "40%",
        maxWidth: "420px",
    },

    footer: {
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.5,
    },
}
