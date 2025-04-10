import "./StockAdding.css"

function StockAdding({ textButton, onClick }) {
    return (
        <>
            <button className="stock-adding" onClick={onClick}>
                <span className="material-symbols-outlined">add</span>
                {textButton}
            </button>
        </>
    )
}

export default StockAdding;