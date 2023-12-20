'use client'
import React, { useEffect, useRef } from 'react'

const MenuForm = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void}) => {

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleModalClose = () => {
    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      onClose()
    }
  };

  useEffect(() => {
    const modalElement = modalRef.current

    console.log(`-----${isOpen}-----`)

    if (isOpen) {
      modalElement?.showModal()
    } else {
      modalElement?.close()
    }
  }, [isOpen])

  return (
    <dialog className="modal" ref={modalRef} onKeyDown={handleKeyDown}>
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button onClick={handleModalClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
  )
}

export default MenuForm