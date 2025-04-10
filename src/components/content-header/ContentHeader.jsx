import "./ContentHeader.css"

const ContentHeader = ({title, paragraph}) => {
    return (
        <div className="content-header">
            <h2>{title}<span class="material-symbols-outlined">waving_hand</span></h2>
            <p>{paragraph}</p>
        </div>
    );
};

export default ContentHeader;