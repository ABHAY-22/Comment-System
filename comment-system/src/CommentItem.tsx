

import React, { useState } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { formatDistanceToNow } from 'date-fns';
import { FaThumbsUp } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

interface User {
  displayName: string;
  photoURL?: string;
}

interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: Date | Timestamp;
  reactions: number;
  replies: Comment[];
  attachments: string[];
}

interface CommentItemProps {
  comment: Comment;
  onReplySubmit: (commentId: string, replyText: string) => void;
  maxReplyDepth: number;
  currentDepth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplySubmit, maxReplyDepth, currentDepth = 0 }) => {
  const [likes, setLikes] = useState(comment.reactions);
  const [isLiking, setIsLiking] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    try {
      const commentRef = doc(db, 'comments', comment.id);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error(`Document with ID ${comment.id} does not exist.`);
        setIsLiking(false);
        return;
      }

      await updateDoc(commentRef, {
        reactions: increment(1)
      });

      setLikes(prevLikes => prevLikes + 1);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReplySubmit(comment.id, replyText);
      setReplyText('');
    }
  };

  const createdAt = comment.createdAt instanceof Timestamp ? comment.createdAt.toDate() : comment.createdAt;

  const shouldShowMore = comment.text.length > 500;
  const displayText = showMore ? comment.text : comment.text.slice(0, 500);

  return (
    <div className="p-4 border-b border-gray-300">
      <div className="flex items-start space-x-4">
        <img
          src={comment.user.photoURL || 'default-avatar-url'}
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold">{comment.user.displayName}</p>
          <p className="text-gray-700">
            {displayText}
            {shouldShowMore && (
              <button onClick={() => setShowMore(!showMore)} className="text-blue-500 ml-2">
                {showMore ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
          {comment.attachments.length > 0 && (
            <div className="mt-2">
              {comment.attachments.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Attachment ${index}`}
                  className="w-32 h-32 object-cover mt-2"
                />
              ))}
            </div>
          )}
          <div className="flex items-center mt-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaThumbsUp className="mr-1" />
              {likes}
            </button>
            <span className="ml-4 text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>
          {currentDepth < maxReplyDepth && (
            <div className="mt-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write a reply..."
              />
              <button
                onClick={handleReply}
                className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Reply
              </button>
            </div>
          )}
          {comment.replies.length > 0 && (
            <div className="mt-4">
              <button onClick={() => setShowReplies(!showReplies)} className="text-blue-500">
                {showReplies ? 'Hide replies' : `View replies (${comment.replies.length})`}
              </button>
              {showReplies && (
                <div className="ml-8 mt-4">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onReplySubmit={onReplySubmit}
                      maxReplyDepth={maxReplyDepth}
                      currentDepth={currentDepth + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
