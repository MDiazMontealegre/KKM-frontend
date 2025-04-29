import "./ContentHeaderInventory.css"

const ContentHeaderInventory = ({title, paragraph}) => {
    return (
        <div className="content-header">
            <h2>{title}<span class="material-symbols-outlined">inventory</span></h2>
            <p>{paragraph}</p>
        </div>
    );
};

export default ContentHeaderInventory;