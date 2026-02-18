export const MODAL_LISTS = [
    {
        id: "about",
        label: "About",
        iconType: "document",
        // 데스크탑: 켜짐, 모바일: 켜짐
        defaultOnDesktop: true,
        defaultOnMobile: true,
    },
    {
        id: "works",
        label: "Work Gallery",
        iconType: "document",
        // 데스크탑: 켜짐, 모바일: 켜짐
        defaultOnDesktop: true,
        defaultOnMobile: true,
    },
    {
        id: "article",
        label: "Featured Article",
        iconType: "document",
        // 데스크탑: 켜짐, 모바일: 꺼짐
        defaultOnDesktop: true,
        defaultOnMobile: false,
    },
    {
        id: "experiment",
        label: "Featured Experiment",
        iconType: "document",
        // 데스크탑: 켜짐, 모바일: 꺼짐
        defaultOnDesktop: true,
        defaultOnMobile: false,
    },
    {
        id: "showreel",
        label: "Showreel",
        iconType: "play",
        // 데스크탑: 꺼짐(유일한 예외), 모바일: 꺼짐
        defaultOnDesktop: false,
        defaultOnMobile: false,
    },
]
