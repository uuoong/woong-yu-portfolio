/**
 * hexToFloat32
 * "#403fb7" → Float32Array([r, g, b])
 */
export function hexToFloat32(hex) {
    const h = hex.replace("#", "")
    return new Float32Array([
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255,
    ])
}
