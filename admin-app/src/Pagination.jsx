import "./admin.css";

function Pagination({ page, pages, isLoading = false, onPageChange }) {
  if (!pages || pages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="admin-pagination">
      <button
        className="admin-secondary-button"
        disabled={isLoading || page <= 1}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        Prev
      </button>

      <span>
        Page {page} of {pages}
      </span>

      <button
        className="admin-secondary-button"
        disabled={isLoading || page >= pages}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
