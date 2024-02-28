const Paginator = (props) => {
  const {
    onNextClick,
    onPreviousClick,
    pageNumber,
    pagesCount,
    isLoading,
  } = props;

  const isPreviousDisabled = isLoading || pageNumber === 1;
  const isNextDisabled = isLoading || pageNumber === pagesCount;

  const pageText = pagesCount > 0
    ? `Страница ${pageNumber} из ${pagesCount}`
    : 'Страница ... из ...';

  return (
    <div className="paginator">
      <div className="paginator-wrapper">
        <button type="button" className="page-button previous" onClick={onPreviousClick} disabled={isPreviousDisabled}>
          <span>&#8249;</span>
        </button>
        <div className="page-number">
          <span>{pageText}</span>
        </div>
        <button type="button" className="page-button next" onClick={onNextClick} disabled={isNextDisabled}>
          <span>&#8250;</span>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
