import React from 'react';
import styles from './Paginator.module.css';

const ChangePageButton = ({ disabled, onClick, direction }) => {
  const map = {
    next: <span>&#8250;</span>, // >
    previous: <span>&#8249;</span>, // <
  };

  return (
    <button
      type="button"
      className={`${styles.pageButton} ${styles[direction]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {map[direction]}
    </button>
  );
};

const GoToPage = ({ isLoading, maxValue, onSubmit }) => {
  const [value, setValue] = React.useState();
  const formRef = React.useRef(null);

  if (maxValue < 2) {
    return null;
  }

  const handleChange = (event) => {
    setValue(Number(event.target.value));
  };

  const handleGoToPage = (event) => {
    event.preventDefault();
    onSubmit(value, formRef.current);
  };

  return (
    <div className={styles.goToPage}>
      <form ref={formRef} onSubmit={handleGoToPage}>
        <label htmlFor="pageNumber">
          <span>На страницу:</span>
          <input id="pageNumber" required type="number" min={1} max={maxValue} onChange={handleChange} disabled={isLoading} />
          <button className={styles.go} type="submit" disabled={isLoading}>Go!</button>
        </label>
      </form>
    </div>
  );
};

const Paginator = (props) => {
  const {
    changePage,
    pageNumber,
    pagesCount,
    isLoading,
  } = props;

  const isPreviousDisabled = isLoading || pageNumber === 1;
  const isNextDisabled = isLoading || pageNumber === pagesCount;

  const increasePage = () => changePage(pageNumber + 1);
  const decreasePage = () => changePage(pageNumber - 1);

  const pageText = pagesCount > 0
    ? `Страница ${pageNumber} из ${pagesCount}`
    : 'Страница ... из ...';

  const handleGoToPage = (newPageNumber, form) => {
    if (newPageNumber !== pageNumber) {
      changePage(newPageNumber);
      form.reset();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pagination}>
        <ChangePageButton direction="previous" onClick={decreasePage} disabled={isPreviousDisabled} />
        <div className={styles.pageNumber}>
          <span>{pageText}</span>
        </div>
        <ChangePageButton direction="next" onClick={increasePage} disabled={isNextDisabled} />
      </div>
      <GoToPage isLoading={isLoading} maxValue={pagesCount} onSubmit={handleGoToPage} />
    </div>
  );
};

export default Paginator;
