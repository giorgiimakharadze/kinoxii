import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Divide } from 'lucide-react';
import './SessionsList.css';


export default function SessionsPagination({
  currentPage = 1, totalPages = 1, onPageChange
}) {
  if (totalPages <= 1) return null;

  // generate page nums
  const pages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const result = [];
    result.push(1);
    if (currentPage > 3) result.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) {
      result.push(p);
    }

    if (currentPage < totalPages - 2) result.push('...');

    result.push(totalPages);
    return result;
  }, [totalPages, currentPage]);


  return (
    <div className='sessions-pagination-container'>
      {/* prev arrow */}
      <button
        type='button'
        className='pagination-arrow-btn'
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label='Previous page'>
        <ChevronLeft size={16} />
      </button>

      {/* numbers */}
      <div className='pagination-numbers-list'>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className='pagination-dots'>
              ...
            </span>
          ) : (
            <button
              key={p}
              type='button'
              className={`pagination-num-btn ${currentPage == p ? 'active' : ''}`}
              onClick={() => onPageChange(p)}>
              {p}
            </button>
          ))}

        {/* next arrow */}
        <button type='button'
          className='pagination-arrow-btn'
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label='Next Page'>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}