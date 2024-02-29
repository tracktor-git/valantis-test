import styles from './Paginator.module.css';

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
    <div className={styles.paginatorWrapper}>

      <button
        type="button"
        className={`${styles.pageButton} ${styles.previous}`}
        onClick={onPreviousClick}
        disabled={isPreviousDisabled}
      >
        <span>&#8249;</span>
      </button>

      <div className={styles.pageNumber}>
        <span>{pageText}</span>
      </div>

      <button
        type="button"
        className={`${styles.pageButton} ${styles.next}`}
        onClick={onNextClick}
        disabled={isNextDisabled}
      >
        <span>&#8250;</span>
      </button>

    </div>
  );
};

export default Paginator;
