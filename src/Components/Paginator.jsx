const Paginator = (props) => {
  const {
    onNextClick,
    onPreviousClick,
    isNextDisabled,
    isPrevDisabled,
    children,
  } = props;

  return (
    <div className="paginator">
      <div className="paginator-wrapper">
        <button type="button" className="page-button previous" disabled={isPrevDisabled} onClick={onPreviousClick}>
          <span>&#8249;</span>
        </button>
        <div className="page-number">{children}</div>
        <button type="button" className="page-button next" onClick={onNextClick} disabled={isNextDisabled}>
          <span>&#8250;</span>
        </button>
      </div>
    </div>
  );
};

export default Paginator;
