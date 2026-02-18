export const icons = {
    outlined: {
        folder: (selected) => (
            <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                d={
                    selected
                        ? "M3 19V6a1 1 0 0 1 1-1h4.032a1 1 0 0 1 .768.36l1.9 2.28a1 1 0 0 0 .768.36H16a1 1 0 0 1 1 1v1M3 19l3-8h15l-3 8z"
                        : "M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1"
                }
            />
        ),
        document: (selected) => (
            <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={selected ? "currentColor" : "none"}
                d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
            />
        ),
        play: (selected) => (
            <path
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill={selected ? "currentColor" : "none"}
                d="M5 3l14 9-14 9V3z"
            />
        ),
    },
    filled: {
        close: () => <path d="M18 6 6 18M6 6l12 12" />,
        fullScreen: (selected) => (
            <path
                d={
                    selected
                        ? "M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7"
                        : "M15 3h6m0 0v6m0-6L14 10M9 3H3m0 0v6m0-6l7 7M15 21h6m0 0v-6m0 6l-7-7M9 21H3m0 0v-6m0 6l7-7"
                }
            />
        ),
        plusMinus: (selected) => (
            <path d={selected ? "M6 12h12" : "M18 12h-6m0 0H6m6 0V6m0 6v6"} />
        ),
    },
}
