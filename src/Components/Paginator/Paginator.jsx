import styles from './Paginator.module.css';

const ChangePageButton = ({ disabled, onClick, direction }) => {
  const map = {
    next: <span>&#8250;</span>,
    previous: <span>&#8249;</span>,
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

  return (
    <div className={styles.paginatorWrapper}>
      <ChangePageButton direction="previous" onClick={decreasePage} disabled={isPreviousDisabled} />
      <div className={styles.pageNumber}>
        <span>{pageText}</span>
      </div>
      <ChangePageButton direction="next" onClick={increasePage} disabled={isNextDisabled} />
    </div>
  );
};

export default Paginator;
