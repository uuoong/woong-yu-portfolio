/**
 * data.js — 프로젝트 데이터 중앙 관리
 *
 * ─── Q3: Framer 디자인 패널 방식에서 DOC_TYPES/slug 필요성 ──────────────
 *
 *  Framer 디자인 패널에서 페이지를 생성하면:
 *    - URL 라우팅: Framer가 자동 처리 (수동 설정 불필요)
 *    - 페이지 간 이동: Framer의 <a href="/works/project-name"> 인터셉트
 *
 *  따라서 DOC_TYPES/getUrlFromPageType은 "선택적"으로만 필요:
 *    ✅ 필요한 경우: Navigation mainLinks, Footer 링크 등
 *                  Link 컴포넌트에서 href를 자동 생성할 때
 *    ❌ 불필요한 경우: 직접 href 문자열 입력 가능한 경우
 *
 *  결론: 유지하면 일관성 ↑, 제거해도 직접 href 문자열로 대체 가능
 *        Link 컴포넌트에서 linkType: "external"처럼
 *        linkType: "href"를 추가해 단순화도 가능
 */

// ─── Slugs / Paths ────────────────────────────────────────────────────────────
export const HOME_SLUG = "home"
export const FOUR_OH_FOUR_SLUG = "404"
export const WORKS_SLUG = "works"
export const ABOUT_SLUG = "about"
export const CONTACT_SLUG = "contact"

// ─── Doc Types ───────────────────────────────────────────────────────────────
export const DOC_TYPES = {
    PAGE: "page",
    WORK: "work",
}

// ─── Transitions ─────────────────────────────────────────────────────────────
export const TRANSITION_DURATION = 1.2
export const TRANSITION_DURATION_MS = TRANSITION_DURATION * 1000

// ─── URL 생성 ─────────────────────────────────────────────────────────────────
export const getUrlFromPageType = (pageType, slug) => {
    if (pageType === DOC_TYPES.PAGE && slug === HOME_SLUG) return "/"
    if (pageType === DOC_TYPES.PAGE) return `/${slug}`
    if (pageType === DOC_TYPES.WORK) return `/${WORKS_SLUG}/${slug}`
    // linkType: "href" 직접 사용 가능 (Framer 단순화 옵션)
    return `/${slug}`
}

// ─── Navigation Data ─────────────────────────────────────────────────────────
export const NAV_DATA = {
    title: "WOONG YU",
    location: "Seoul",
    timeZone: "SEOUL",

    mainLinks: [
        { linkType: DOC_TYPES.PAGE, link: WORKS_SLUG, label: "Work" },
        { linkType: DOC_TYPES.PAGE, link: ABOUT_SLUG, label: "About" },
        { linkType: DOC_TYPES.PAGE, link: CONTACT_SLUG, label: "Contact" },
    ],

    drawerContent: {
        titleDescription: "We design and build\nexperiences",
        description:
            "A product design studio specializing in digital experiences.",
        titleType: "Product Studio",
        titleLocation: "Seoul\nRemote",
        contactEmail: "hello@woongyu.com",
        copyright: "© 2025 Woong Yu",
        socialLinks: [
            {
                linkType: "external",
                link: "https://instagram.com",
                label: "Instagram",
            },
            {
                linkType: "external",
                link: "https://linkedin.com",
                label: "LinkedIn",
            },
        ],
        worksListItems: [
            { label: "Project Alpha", image: "" },
            { label: "Project Beta", image: "" },
        ],
    },
}

// ─── Section Content Registry ─────────────────────────────────────────────────
/**
 * CONTENT
 *
 * 모든 섹션 콘텐츠를 키-값으로 관리.
 * 같은 섹션 컴포넌트를 다른 콘텐츠로 여러 페이지에서 재사용 가능.
 *
 * 구조:
 *   CONTENT.섹션타입.콘텐츠키 = { ...props }
 */
export const CONTENT = {
    // ── Hero 섹션 콘텐츠 ──────────────────────────────────────────────────
    hero: {
        home: {
            title: "We Design\nExperiences",
            subtitle: "Product Studio, Seoul",
        },
        works: {
            title: "Selected\nWork",
            subtitle: "2020 — 2025",
        },
        about: {
            title: "About",
            subtitle: "Seoul-based Studio",
        },
    },

    // ── MultiParagraphWithLinks 콘텐츠 ───────────────────────────────────
    multiParagraph: {
        aboutStudio: {
            description: [
                { text: "We build digital experiences that matter." },
                { text: "Focused on craft, detail, and performance." },
            ],
            smallerDescription: [
                {
                    text: "Founded in 2020, Woong Yu is a product design studio based in Seoul.",
                },
            ],
            links: [
                {
                    linkType: DOC_TYPES.PAGE,
                    link: WORKS_SLUG,
                    label: "View Work",
                },
                {
                    linkType: DOC_TYPES.PAGE,
                    link: CONTACT_SLUG,
                    label: "Get In Touch",
                },
            ],
        },
        contactIntro: {
            description: [{ text: "Let's build something together." }],
            links: [
                {
                    linkType: "external",
                    link: "mailto:hello@woongyu.com",
                    label: "hello@woongyu.com",
                },
            ],
        },
    },

    // ── TwoImagesAndText 콘텐츠 ──────────────────────────────────────────
    twoImagesAndText: {
        studioIntro: {
            title: "Studio",
            smallImage: { url: "", alt: "Studio interior" },
            largeImage: { url: "", alt: "Studio team" },
        },
    },

    // ── Works GL 섹션 콘텐츠 ─────────────────────────────────────────────
    worksGL: {
        featured: {
            title: "Featured Projects",
            subtitle: "Recent work",
            works: [
                {
                    slug: "project-alpha",
                    title: "Project Alpha",
                    category: "Digital Experience",
                    year: "2025",
                    image: "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=1600",
                },
                {
                    slug: "project-beta",
                    title: "Project Beta",
                    category: "Product Design",
                    year: "2024",
                    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
                },
            ],
        },
    },
}

// ─── Page Sections ────────────────────────────────────────────────────────────
/**
 * sections 배열 구조 (Sections.jsx가 순회)
 *
 * cmsSettings:
 *   isHidden:        개발 중 섹션 임시 비활성화
 *   cmsTitle:        id/앵커 생성 (buildIdFromText)
 *   disableOnMobile: SectionContainer → display: none
 *
 * CMS 없으면 cmsSettings 전체 생략 가능.
 * cmsTitle만 남겨 앵커 링크를 활용하는 방식 권장.
 */

export const HOME_SECTIONS = [
    {
        section: [
            {
                _type: "twoImagesAndText",
                _id: "home-studio",
                cmsSettings: { cmsTitle: "Studio", isHidden: false },
                ...CONTENT.twoImagesAndText.studioIntro,
            },
        ],
    },
    {
        section: [
            {
                _type: "multiParagraphWithLinks",
                _id: "home-about",
                cmsSettings: { cmsTitle: "About", isHidden: false },
                ...CONTENT.multiParagraph.aboutStudio,
            },
        ],
    },
]

export const WORKS_SECTIONS = [
    {
        section: [
            {
                _type: "worksGL",
                _id: "works-featured",
                cmsSettings: { cmsTitle: "Featured Works", isHidden: false },
                ...CONTENT.worksGL.featured,
            },
        ],
    },
    {
        section: [
            {
                _type: "twoImagesAndText",
                _id: "works-intro",
                cmsSettings: { cmsTitle: "Works Intro", isHidden: false },
                ...CONTENT.twoImagesAndText.studioIntro,
            },
        ],
    },
]

export const ABOUT_SECTIONS = [
    {
        section: [
            {
                _type: "multiParagraphWithLinks",
                _id: "about-studio",
                cmsSettings: { cmsTitle: "Studio Info", isHidden: false },
                ...CONTENT.multiParagraph.aboutStudio,
            },
        ],
    },
]

export const CONTACT_SECTIONS = [
    {
        section: [
            {
                _type: "multiParagraphWithLinks",
                _id: "contact-intro",
                cmsSettings: { cmsTitle: "Contact", isHidden: false },
                ...CONTENT.multiParagraph.contactIntro,
            },
        ],
    },
]
