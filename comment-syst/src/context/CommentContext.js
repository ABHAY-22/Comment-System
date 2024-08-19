import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../components/services/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const { user } = useAuth();
  const commentsRef = collection(db, 'comments');

  useEffect(() => {
    const fetchComments = async () => {
      const commentSnapshot = await getDocs(commentsRef);
      const commentList = commentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentList);
    };

    fetchComments();
  }, []);

  const addComment = async (text, imageUrl) => {
    if (user) {
      const newComment = {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        text,
        imageUrl,
        createdAt: new Date(),
        reactions: {},
      };
      await addDoc(commentsRef, newComment);
      setComments(prev => [...prev, newComment]);
    }
  };

  return (
    <CommentContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};
