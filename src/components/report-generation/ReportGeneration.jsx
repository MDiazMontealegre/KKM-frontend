import "./ReportGeneration.css"

function ReportGeneration({textButton}) {
    return (
        <>
            <button className="report-generation">
            <span class="material-symbols-outlined">add</span>{textButton}
            </button>
        </>
    )
}

export default ReportGeneration;