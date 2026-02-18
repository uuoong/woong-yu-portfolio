import { ReactNode } from "react"
import { Header } from "../Header/Header.tsx"

type LayoutProps = {
    children: ReactNode
}

export function Layout({ children }: LayoutProps) {
    return (
        <div
            style={{
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100svh",
                overscrollBehavior: "none",
            }}
        >
            <Header />
            <main
                style={{
                    display: "flex",
                    flex: "1",
                    flexDirection: "column",
                    minHeight: "var(--space-0)",
                    paddingInline: "var(--space-2)",
                    paddingBottom: "var(--space-2)",
                }}
            >
                {children}
            </main>
        </div>
    )
}
