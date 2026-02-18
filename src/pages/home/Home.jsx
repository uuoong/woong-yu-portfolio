/* /pages/home/Home.jsx */
import React, { useState } from "react"
import { AnimatePresence } from "framer-motion"

import ModalAbout from "../../components/Modal/Modals.jsx"
import ModalWorks from "../../components/Modal/Modals.jsx"

import ModalToggleList from "../../components/ModalToggleList/ModalToggleList.jsx"
import Layout from "../../components/Layout/Layout.tsx"

const MODAL_COMPONENTS = {
    about: AboutModal,
    works: WorksModal,
    // article: FeaturedArticleModal,
    // experiment: FeaturedExperimentModal,
    // showreel: ShowreelModal,
}

export default function Home() {
    // 열려있는 모달 ID 스택
    const [stack, setStack] = useState([])

    // 1. 토글 로직: Menu의 Toggle 버튼과 연결됨
    const toggleModal = (id) => {
        setStack(
            (prev) =>
                prev.includes(id)
                    ? prev.filter((i) => i !== id) // 닫기
                    : [...prev, id] // 열기 (최상단 추가)
        )
    }

    // 2. 포커스 로직: 모달 클릭 시 최상단으로 이동
    const focusModal = (id) => {
        setStack((prev) => {
            if (prev[prev.length - 1] === id) return prev
            return [...prev.filter((i) => i !== id), id]
        })
    }

    // 3. 닫기 로직: Modal의 Close 버튼과 연결됨
    const closeModal = (id) => {
        setStack((prev) => prev.filter((i) => i !== id))
    }

    return (
        <Layout>
            <ModalToggleList activeModals={stack} onToggleModal={toggleModal} />

            <AnimatePresence>
                {stack.map((id, index) => {
                    const Modal = MODAL_COMPONENTS[id]

                    return (
                        <Modal
                            key={id}
                            zIndex={100 + index}
                            onFocus={() => focusModal(id)}
                            onClose={() => closeModal(id)}
                        />
                    )
                })}
            </AnimatePresence>
        </Layout>
    )
}
