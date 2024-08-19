import React from 'react';

const ReactionButtons = ({ reactions }) => {
  return (
    <div className="reaction-buttons">
      <button>👍 {reactions.like || 0}</button>
      <button>👎 {reactions.dislike || 0}</button>
    </div>
  );
};

export default ReactionButtons;
