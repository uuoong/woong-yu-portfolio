import React, { useState } from "react"
import { getImageUrl, getSrcSet } from "../../utils/index.js"

const Image = ({
    src,
    alt = "",
    width,
    height,
    sizes = "75vw",
    priority = false,
    className,
    style,
    onLoad,
    objectFit = "cover",
    breakpoints,
}) => {
    const [loaded, setLoaded] = useState(false)

    const imageStyle = {
        objectFit,
        opacity: loaded || priority ? 1 : 0,
        transition: "opacity 0.3s",
        display: "block",
        width: "100%",
        height: "100%",
        ...style,
    }

    // Vercel CDN
    const optimizedSrc = getImageUrl(src, { width: width || undefined })
    const generatedSrcSet = width ? undefined : getSrcSet(src)

    const imageElement = (
        <img
            onLoad={() => {
                if (onLoad) onLoad()
                setLoaded(true)
            }}
            src={optimizedSrc || src}
            srcSet={generatedSrcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
            decoding="async"
            className={className}
            style={imageStyle}
        />
    )

    // Breakpoints
    if (breakpoints?.length) {
        const sorted = [...breakpoints].sort((a, b) => b.minWidth - a.minWidth)
        return (
            <picture>
                {sorted.map((bp, i) => (
                    <source
                        key={i}
                        srcSet={
                            getImageUrl(bp.src, { width: bp.width }) || bp.src
                        }
                        media={`(min-width: ${bp.minWidth}px)`}
                    />
                ))}
                {imageElement}
            </picture>
        )
    }

    return imageElement
}

Image.displayName = "Image"

export default Image
