/**
 * src/components/WindowToggleList/WindowToggleList.jsx
 *
 * WINDOW_TOGGLE_LIST 데이터를 읽어 Toggle 버튼 목록을 렌더링합니다.
 * 데이터 변경은 src/data/windows.js 에서만 합니다.
 */

import Toggle from "../Toggle/Toggle.jsx"
import { WINDOW_TOGGLE_LIST } from "../../data/_index.js"

const WindowToggleList = ({ activeWindows, onToggleWindow }) => {
    return (
        <ul
            style={{
                display: "grid",
                width: "fit-content",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            }}
        >
            {WINDOW_TOGGLE_LIST.map((item) => (
                <li key={item.id}>
                    <Toggle
                        label={item.label}
                        icon={item.icon}
                        isActive={activeWindows.includes(item.id)}
                        onClick={() => onToggleWindow(item.id)}
                    />
                </li>
            ))}
        </ul>
    )
}

export default WindowToggleList
