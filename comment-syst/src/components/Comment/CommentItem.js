import React, { useState } from 'react';
import ReactionButtons from './ReactionButtons';
import ReplyBox from './ReplyBox';
import ShowMoreLess from './ShowMoreLess';
import formatTime from '../utils/formatTime';

const CommentItem = ({ comment }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div className="comment-item">
      <img src={comment.userPhoto} alt={comment.userName} className="user-photo" />
      <div className="comment-content">
        <div className="comment-header">
          <h4>{comment.userName}</h4>
          <span>{formatTime(comment.createdAt)}</span>
        </div>
        <ShowMoreLess text={comment.text} />
        {comment.imageUrl && <img src={comment.imageUrl} alt="attachment" />}
        <ReactionButtons reactions={comment.reactions} />
        <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
        {showReplyBox && <ReplyBox parentId={comment.id} />}
      </div>
    </div>
  );
};

export default CommentItem;
