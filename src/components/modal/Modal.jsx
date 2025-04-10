import "./Modal.css"

function Modal({isOpen, onClose, title, children}){

    if(!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h1>{title}</h1>
                <div className="modal-body">
                    {children}
                </div>
                <button className="modal-close-btn" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    )
}

export default Modal;