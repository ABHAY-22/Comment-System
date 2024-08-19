import React from 'react';
import { useComments } from '../../context/CommentContext';
import CommentItem from './CommentItem';
import Pagination from './Pagination';

const CommentList = () => {
  const { comments } = useComments();

  return (
    <div className="comment-list">
      {comments.slice(0, 8).map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
      <Pagination totalComments={comments.length} />
    </div>
  );
};

export default CommentList;
