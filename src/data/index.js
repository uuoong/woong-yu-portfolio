// Paths
export const HOME_PATH = "/"
export const FOUR_OH_FOUR_PATH = "/404"
export const WORKS_PATH = "/works"

// Link Types
export const LINK_TYPE = {
    INTERNAL: "internal",
    EXTERNAL: "external",
    DISABLED: "disabled",
}

// Transitions
export const TRANSITION_DURATION = 1.2
// export const TRANSITION_DURATION = 40.2
export const TRANSITION_DURATION_MS = TRANSITION_DURATION * 1000

// Navigation Data
export const NAV_DATA = {
    title: "WOONG YU",
    location: "Seoul",
    timeZone: "SEOUL",

    mainLinks: [
        {
            linkType: LINK_TYPE.INTERNAL,
            href: WORKS_PATH,
            label: "Work",
        },
        {
            linkType: LINK_TYPE.INTERNAL,
            href: "/about",
            label: "About",
        },
        {
            linkType: LINK_TYPE.INTERNAL,
            href: "/contact",
            label: "Contact",
        },
    ],

    drawerContent: {
        descriptionTitle: "We design and build\nexperiences",
        description:
            "A product design studio specializing in digital experiences.",

        titleType: "Product Studio",
        titleLocation: "Seoul\nRemote",
        contactEmail: "hello@woongyu.com",
        copyright: "© 2025 Woong Yu",
        socialLinks: [
            {
                linkType: LINK_TYPE.EXTERNAL,
                href: "https://instagram.com",
                label: "Instagram",
            },
            {
                linkType: LINK_TYPE.EXTERNAL,
                href: "https://linkedin.com",
                label: "LinkedIn",
            },
        ],

        listTitle: "Title",

        list: [
            {
                itemTitle: "Project Alpha",
                itemImage: "/1.jpg",
            },
            {
                itemTitle: "Project Beta",
                itemImage: "/2.jpg",
            },
            {
                itemTitle: "Project Gamma",
                itemImage: "/3.jpg",
            },
            {
                itemTitle: "Project Gamma",
                itemImage: "/4.jpg",
            },
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
                    linkType: "internal",
                    href: "https://instagram.com",
                    label: "View Work",
                },
                {
                    linkType: "internal",
                    href: "https://instagram.com",
                    label: "Get In Touch",
                },
            ],
        },
        contactIntro: {
            description: [{ text: "Let's build something together." }],
            links: [
                {
                    linkType: "external",
                    href: "mailto:hello@woongyu.com",
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
                    image: "https://woong-yu-portfolio.vercel.app/assets/images/8.jpg",
                },
                {
                    slug: "project-beta",
                    title: "Project Beta",
                    category: "Product Design",
                    year: "2024",
                    image: "https://woong-yu-portfolio.vercel.app/assets/images/9.jpg",
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
