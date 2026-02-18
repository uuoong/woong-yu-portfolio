import Toggle from "../Toggle/Toggle.jsx"
import { MODAL_LISTS } from "./data.js"

export default function ModalToggleList({ activeModals, onToggleModal }) {
    return (
        <ul
            style={{
                display: "grid",
                width: "fit-content",
                gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            }}
        >
            {MODAL_LISTS.map((item) => (
                <li key={item.id}>
                    <Toggle
                        label={item.label}
                        icon={item.iconType}
                        isActive={activeModals.includes(item.id)}
                        onClick={() => onToggleModal(item.id)}
                    />
                </li>
            ))}
        </ul>
    )
}
