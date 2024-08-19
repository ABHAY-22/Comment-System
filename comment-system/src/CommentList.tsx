

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, startAfter, onSnapshot, doc, updateDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import CommentItem from './CommentItem';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const CommentList: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'popularity'>('latest');
  const [page, setPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const commentsCollection = collection(db, 'comments');

      let commentsQuery = query(commentsCollection, limit(8));

      if (sortBy === 'latest') {
        commentsQuery = query(commentsCollection, orderBy('createdAt', 'desc'), limit(8));
      } else if (sortBy === 'popularity') {
        commentsQuery = query(commentsCollection, orderBy('reactions', 'desc'), limit(8));
      }

      if (page > 1 && lastVisible) {
        commentsQuery = query(commentsQuery, startAfter(lastVisible));
      }

      try {
        const unsubscribe = onSnapshot(commentsQuery, snapshot => {
          const newComments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Comment[];

          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          setComments(prevComments => page === 1 ? newComments : [...prevComments, ...newComments]);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching comments: ', error);
        toast.error('Failed to load comments.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [sortBy, page]);

  const handleReplySubmit = async (replyText: string, parentId: string) => {
    try {
      const commentRef = doc(db, 'comments', parentId);
      const commentDoc = await getDoc(commentRef);
      
      if (!commentDoc.exists()) {
        throw new Error('Comment not found');
      }

      const existingData = commentDoc.data();
      const newReply = {
        id: Date.now().toString(),
        user: {
          displayName: 'Your Display Name',
          photoURL: 'default-photo-url',
        },
        text: replyText,
        createdAt: new Date(),
        reactions: 0,
        replies: [],
        attachments: [],
      };

      const updatedReplies = [...(existingData?.replies || []), newReply];
      await updateDoc(commentRef, { replies: updatedReplies });

      toast.success('Reply added successfully!');
    } catch (error) {
      console.error('Error adding reply: ', error);
      toast.error('Failed to add reply.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setSortBy('latest')}
          className={`py-2 px-4 rounded ${sortBy === 'latest' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Latest
        </button>
        <button
          onClick={() => setSortBy('popularity')}
          className={`py-2 px-4 rounded ${sortBy === 'popularity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          Popularity
        </button>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} onReplySubmit={handleReplySubmit} />
          ))
        ) : (
          <div className="text-center text-gray-500">No comments available.</div>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="py-2 px-4 bg-gray-300 rounded">
          Previous
        </button>
        <button
          onClick={() => setPage(prev => prev + 1)}
          className="py-2 px-4 bg-gray-300 rounded"
          disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CommentList;
