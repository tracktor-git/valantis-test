const Paginator = ({ onNextClick, onPreviousClick, pageNumber, isNextDisabled }) => {
    const isPreviousDisabled = !pageNumber || pageNumber === 1;
    return (
        <div className="paginator">
            <div className="paginator-wrapper">
                <button className="page-button previous" disabled={isPreviousDisabled} onClick={onPreviousClick}>
                    <span>&#8249;</span>
                </button>
                <div className="page-number">{pageNumber || 0}</div>
                <button className="page-button next" onClick={onNextClick} disabled={isNextDisabled}>
                    <span>&#8250;</span>
                </button>
            </div>
        </div>
    );
};

export default Paginator;
