import { Geometry } from "https://esm.sh/ogl"

export const buildPlane = (gl, wS = 80, hS = 80) => {
    const vN = (wS + 1) * (hS + 1)
    const pos = new Float32Array(vN * 3)
    const uvs = new Float32Array(vN * 2)
    const idx = new Uint32Array(wS * hS * 6)

    let vi = 0,
        ui = 0
    for (let iy = 0; iy <= hS; iy++) {
        for (let ix = 0; ix <= wS; ix++) {
            pos[vi++] = ix / wS - 0.5
            pos[vi++] = -(iy / hS - 0.5)
            pos[vi++] = 0
            uvs[ui++] = ix / wS
            uvs[ui++] = 1 - iy / hS
        }
    }

    let ii = 0
    for (let iy = 0; iy < hS; iy++) {
        for (let ix = 0; ix < wS; ix++) {
            const a = iy * (wS + 1) + ix
            const b = a + wS + 1
            idx[ii++] = a
            idx[ii++] = b
            idx[ii++] = a + 1
            idx[ii++] = b
            idx[ii++] = b + 1
            idx[ii++] = a + 1
        }
    }

    return new Geometry(gl, {
        position: { size: 3, data: pos },
        uv: { size: 2, data: uvs },
        index: { data: idx },
    })
}
