// updateDocument.ts
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; 


interface Comment {
  text?: string;
  user?: {
    displayName?: string;
    photoURL?: string;
  };
  [key: string]: any; 
}

const updateComment = async (commentId: string, updatedData: Partial<Comment>) => {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, updatedData);
    console.log('Document updated successfully.');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

export { updateComment };
