import React, { useState } from 'react';

const ShowMoreLess = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const showMore = text.length > 100;

  return (
    <div className="show-more-less">
      <p>{isExpanded ? text : `${text.slice(0, 100)}...`}</p>
      {showMore && (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

export default ShowMoreLess;
