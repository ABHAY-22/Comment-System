import React from 'react';

const Pagination = ({ totalComments }) => {
  const pages = Math.ceil(totalComments / 8);
  // Handle pagination logic here

  return (
    <div className="pagination">
      {[...Array(pages)].map((_, index) => (
        <button key={index}>{index + 1}</button>
      ))}
    </div>
  );
};

export default Pagination;
