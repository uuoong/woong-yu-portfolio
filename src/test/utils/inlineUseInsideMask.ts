export function inlineUseInsideMasks(svg: HTMLElement): void {
    if (!svg) return;

    const XLINK = "http://www.w3.org/1999/xlink";

    svg.querySelectorAll("mask > use").forEach(use => {
        const href = use.getAttribute("href") || use.getAttributeNS(XLINK, "href");

        if (!href || !href.startsWith("#")) return;

        const target = svg.querySelector(href);
        if (!target) return;

        const clone = target.cloneNode(true) as HTMLElement;

        clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
        clone.removeAttribute("id");

        const t = use.getAttribute("transform");
        if (t) {
            const g = svg.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("transform", t);
            g.appendChild(clone);
            use.replaceWith(g);
        } else {
            use.replaceWith(clone);
        }
    });
}
