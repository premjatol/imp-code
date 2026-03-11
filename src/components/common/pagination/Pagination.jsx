import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import "./paginationStyle.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

export default function Pagination({
  totalItems = 0,
  itemsPerPage = 10,
  currentPage: externalCurrentPage = 1,
  onPageChange,
  onItemsPerPageChange,
  showPageInfo = true,
  showItemsPerPage = true,
  maxVisiblePages = 5,
  removeText = false,
}) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(10);
  const { t } = useTranslation();

  // Use external props when provided, otherwise use internal state
  const currentPage =
    externalCurrentPage !== undefined
      ? externalCurrentPage
      : internalCurrentPage;
  const dataLimit =
    itemsPerPage !== undefined ? itemsPerPage : internalItemsPerPage;

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / dataLimit)),
    [totalItems, dataLimit],
  );

  // Generate page numbers with ellipsis for large page counts
  const pageNumbers = useMemo(() => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the beginning
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }

    // Adjust if we're near the end
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift("...");
      }
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  // Generate items per page options
  const itemsPerPageOptions = useMemo(() => {
    const options = [10, 20, 50, 100];
    if (!options.includes(dataLimit) && dataLimit > 0) {
      options.push(dataLimit);
      options.sort((a, b) => a - b);
    }
    return options;
  }, [dataLimit]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        if (onPageChange) {
          onPageChange(newPage);
        } else {
          setInternalCurrentPage(newPage);
        }
      }
    },
    [currentPage, totalPages, onPageChange],
  );

  // Handle items per page change
  const handleItemsPerPageChange = useCallback(
    (newLimit) => {
      const newItemsPerPage = parseInt(newLimit);

      if (onItemsPerPageChange) {
        onItemsPerPageChange(newItemsPerPage);
      } else {
        setInternalItemsPerPage(newItemsPerPage);
      }

      // Reset to first page when changing items per page
      handlePageChange(1);
    },
    [onItemsPerPageChange, handlePageChange],
  );

  // Effects for external prop changes
  useEffect(() => {
    if (itemsPerPage !== undefined) {
      setInternalItemsPerPage(itemsPerPage);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    if (externalCurrentPage !== undefined) {
      setInternalCurrentPage(externalCurrentPage);
    }
  }, [externalCurrentPage]);

  // Don't render if no data
  if (totalItems <= 0) {
    return null;
  }

  const renderPageItems = () => {
    return pageNumbers.map((pageNum, index) => (
      <li
        key={pageNum === "..." ? `ellipsis-${index}` : pageNum}
        className={`page-item ${
          pageNum === currentPage
            ? "bg-primary text-white"
            : pageNum === "..."
              ? "bg-primary-100 cursor-default"
              : "bg-primary-100 text-gray-500 cursor-pointer"
        }`}
        onClick={() => pageNum !== "..." && handlePageChange(pageNum)}
      >
        {pageNum}
      </li>
    ));
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 bg-white rounded-lg">
      {showPageInfo && (
        <div className="text-primary font-semibold text-sm">
          Showing {(currentPage - 1) * dataLimit + 1} -{" "}
          {Math.min(currentPage * dataLimit, totalItems)} of {totalItems} Items
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Previous Button */}
        <button
          className={`w-9 h-9 p-2 rounded-full transition-colors ${
            isFirstPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-100 text-primary hover:bg-primary hover:text-white cursor-pointer"
          }`}
          onClick={() => !isFirstPage && handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label={"Previous Page"}
        >
          <GrFormPrevious fontSize={18} />
        </button>

        {/* Page Numbers */}
        <ul className="flex gap-1 ul-parent">{renderPageItems()}</ul>

        {/* Next Button */}
        <button
          className={`w-9 h-9 p-2 rounded-full transition-colors ${
            isLastPage
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-primary-100 text-primary hover:bg-primary hover:text-white cursor-pointer"
          }`}
          onClick={() => !isLastPage && handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label={"Next Page"}
        >
          <GrFormNext fontSize={18} />
        </button>
      </div>

      {showItemsPerPage && (
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="items-per-page" className="text-gray-600">
            {"Items per page"}:
          </label>
          <select
            id="items-per-page"
            className="outline-none border rounded-lg border-purple-300 text-primary px-2 py-1 cursor-pointer bg-white"
            value={dataLimit}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

{
  /* <Pagination
  totalItems={20}
  itemsPerPage={limit}
  currentPage={page}
  onPageChange={(page) => setPage(page)}
  onItemsPerPageChange={(limit) => setLimit(limit)}
/> */
}
