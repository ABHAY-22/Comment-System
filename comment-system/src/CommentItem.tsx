

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
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReplySubmit }) => {
  const [likes, setLikes] = useState(comment.reactions);
  const [isLiking, setIsLiking] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple like clicks
    setIsLiking(true);

    try {
      const commentRef = doc(db, 'comments', comment.id);

      // Verify document exists before updating
      const commentDoc = await getDoc(commentRef);
      if (!commentDoc.exists()) {
        console.error(`Document with ID ${comment.id} does not exist.`);
        setIsLiking(false);
        return;
      }

      // Update the reactions count
      await updateDoc(commentRef, {
        reactions: increment(1)
      });

      // Update local state with the new likes count
      setLikes(prevLikes => prevLikes + 1);
    } catch (error) {
      console.error('Error liking comment:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = () => {
    onReplySubmit(comment.id, replyText);
    setReplyText('');
  };

  // Convert Timestamp to Date
  const createdAt = comment.createdAt instanceof Timestamp ? comment.createdAt.toDate() : comment.createdAt;

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
          <p className="text-gray-700">{comment.text}</p>
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
        </div>
      </div>
      {/* Display nested replies */}
    </div>
  );
};

export default CommentItem;
