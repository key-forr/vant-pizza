import ReactPaginate from "react-paginate";

import styles from "./Pagination.module.scss";

interface Props {
  currentPage: number;
  onChangePage: (selected: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, onChangePage }) => {
  return (
    <ReactPaginate
      className={styles.root}
      breakLabel="..."
      nextLabel=">"
      previousLabel="<"
      onPageChange={(event) => onChangePage(event.selected + 1)}
      pageRangeDisplayed={4}
      pageCount={4}
      forcePage={currentPage - 1}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
