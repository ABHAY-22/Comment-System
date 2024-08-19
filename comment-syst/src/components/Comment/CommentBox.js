import React, { useState } from 'react';
import { useComments } from '../../context/CommentContext';
import { useAuth } from '../../context/AuthContext';
import ImageUploader from './ImageUploader';

const CommentBox = () => {
  const { addComment } = useComments();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [image, setImage] = useState(null);
  
  const handleSubmit = () => {
    if (commentText.length > 0) {
      addComment(commentText, image);
      setCommentText('');
      setImage(null);
    }
  };

  return user ? (
    <div className="comment-box">
      <textarea
        className="comment-input"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write a comment..."
        maxLength={250}
      />
      <ImageUploader onImageUpload={setImage} />
      <button onClick={handleSubmit} className="send-button">Send</button>
    </div>
  ) : (
    <p>Please log in to comment.</p>
  );
};

export default CommentBox;
