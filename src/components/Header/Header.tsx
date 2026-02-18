import * as React from "react"

type HeaderProps = {
    // active page key (for nav active state)
    active?: "home" | "works" | "blog" | "lab" | "awards"
}

export function Header({ active = "home" }: HeaderProps) {
    return (
        <>
            <header className="header">
                <div className="header__left">
                    <a draggable="false" className="header__logo" href="/">
                        <picture className="header__logo-avatar">
                            <img
                                loading="eager"
                                decoding="auto"
                                alt=""
                                src="https://cdn.sanity.io/images/60rvi1lj/production/db451abc27a16f698305dcb56ec920d5a9dc08c8-1566x1566.jpg?w=16&amp;h=16&amp;max-h=3840&amp;max-w=3840&amp;q=85&amp;fit=crop&amp;auto=format"
                                srcSet="https://cdn.sanity.io/images/60rvi1lj/production/db451abc27a16f698305dcb56ec920d5a9dc08c8-1566x1566.jpg?w=16&amp;h=16&amp;max-h=3840&amp;max-w=3840&amp;q=85&amp;fit=crop&amp;auto=format&amp;dpr=2 2x, https://cdn.sanity.io/images/60rvi1lj/production/db451abc27a16f698305dcb56ec920d5a9dc08c8-1566x1566.jpg?w=16&amp;h=16&amp;max-h=3840&amp;max-w=3840&amp;q=85&amp;fit=crop&amp;auto=format&amp;dpr=3 3x"
                                width="16"
                                height="16"
                                style={
                                    {
                                        "--desired-width": "16px",
                                        "--desired-height": "16px",
                                        backgroundImage:
                                            "url(data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAUABQDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAUHAQIEBv/EACIQAAICAgMAAQUAAAAAAAAAAAECAAMEEQUGITEHFFFhcf/EABkBAAIDAQAAAAAAAAAAAAAAAAMEAAECBf/EABsRAAMAAwEBAAAAAAAAAAAAAAABAgMSQREx/9oADAMBAAIRAxEAPwCisHMte1KqwXdjpVHyTJ7lKM/iDWvI0PQz+hWGjILqeRVh9m4y/JOqUvUsd/A3Lk+tvaev8nwNGPg30ZOcWUCwelV/s51utkkMY8UVDdfStEa6xQwB0YnThMn21e3XevzE36hTVng3YjWplfRs+mIhOBOmwusUaV2A/RiIlEP/2Q==)",
                                        backgroundSize: "cover",
                                    } as React.CSSProperties
                                }
                                className="header__logo-avatar-image"
                            />
                        </picture>
                        <p className="header__logo-name">Woong Yu</p>
                    </a>
                </div>

                <div className="header__right">
                    <nav className="header__nav">
                        <ul className="header__nav-list">
                            <li>
                                <a
                                    draggable="false"
                                    className="header__nav-list-item"
                                    href="/"
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    draggable="false"
                                    className="header__nav-list-item"
                                    href="/works"
                                >
                                    Works
                                </a>
                            </li>
                            <li>
                                <a
                                    draggable="false"
                                    className="header__nav-list-item"
                                    href="/blog"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    draggable="false"
                                    className="header__nav-list-item"
                                    href="/lab"
                                >
                                    Lab
                                </a>
                            </li>
                            <li>
                                <a
                                    draggable="false"
                                    className="header__nav-list-item"
                                    href="/awards"
                                >
                                    Awards
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div className="header__tools">
                        <div className="header__tools-container">
                            <button
                                type="button"
                                className="header__tools-search"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 50 50"
                                    aria-hidden="true"
                                    className="header__tools-search-icon"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M21 3C11.621 3 4 10.621 4 20s7.621 17 17 17c3.71 0 7.14-1.195 9.938-3.219l13.156 13.125 2.812-2.812-13-13.032A16.92 16.92 0 0 0 38 20c0-9.379-7.621-17-17-17m0 2c8.297 0 15 6.703 15 15s-6.703 15-15 15S6 28.297 6 20 12.703 5 21 5"
                                    ></path>
                                </svg>
                                <kbd className="header__tools-kbd">
                                    <span className="header__tools-kbd-inner">
                                        ⌘
                                    </span>
                                    <span>K</span>
                                </kbd>
                            </button>

                            <div className="header__clock">
                                <div>
                                    <span>19</span>
                                    <span>:</span>
                                    <span>39</span>
                                </div>
                                <span className="header__location">[VIE]</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
