
import React, { useState, useEffect, useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import { FaBold, FaItalic, FaUnderline, FaCode, FaLink } from 'react-icons/fa';

interface CommentBoxProps {
  userId: string;
}

const CommentBox: React.FC<CommentBoxProps> = ({ userId }) => {
  const [text, setText] = useState('');
  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentEditableRef.current) {
      const div = contentEditableRef.current;
      const handleInput = () => {
        const isEmpty = div.innerText.trim() === '';
        setPlaceholderVisible(isEmpty);
        setText(div.innerText);
      };

      div.addEventListener('input', handleInput);
      return () => div.removeEventListener('input', handleInput);
    }
  }, []);

  const handleAddComment = async () => {
    if (text.trim() === '') return; 

    try {
      const comment = {
        id: Date.now().toString(), 
        user: {
          displayName: 'Your Display Name', 
          photoURL: 'default-photo-url', 
        },
        text,
        createdAt: new Date(),
        reactions: 0,
        replies: [],
        attachments: [],
      };

      await addDoc(collection(db, 'comments'), comment);
      setText('');
      setPlaceholderVisible(true); 
      if (contentEditableRef.current) {
        contentEditableRef.current.innerText = ''; 
      }
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  const handleCancel = () => {
    setText('');
    setPlaceholderVisible(true);
    if (contentEditableRef.current) {
        contentEditableRef.current.innerText = ''; 
    }
  };

  const applyFormatting = (command: string) => {
    document.execCommand(command, false, '');
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 max-w-lg mx-auto">
      <div className="flex items-start space-x-4">
        <img
          src="default-avatar-url" 
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div
            ref={contentEditableRef}
            className="relative w-full p-3 border border-gray-400 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px]"
            contentEditable
            onInput={() => {
              if (contentEditableRef.current) {
                setText(contentEditableRef.current.innerText);
              }
            }}
          />
          {isPlaceholderVisible && (
            <span className="absolute top-3 left-3 text-gray-500 pointer-events-none">
              Write a comment...
            </span>
          )}
        </div>
      </div>
      <div className="flex space-x-2 mt-2 mb-3 text-gray-600">
        <button
          type="button"
          onClick={() => applyFormatting('bold')}
          className="hover:text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaBold />
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('italic')}
          className="hover:text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaItalic />
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('underline')}
          className="hover:text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaUnderline />
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('formatBlock')}
          className="hover:text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaCode />
        </button>
        <button
          type="button"
          onClick={() => applyFormatting('createLink')}
          className="hover:text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaLink />
        </button>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleCancel}
          className="py-2 px-4 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-150"
        >
          Cancel
        </button>
        <button
          onClick={handleAddComment}
          className="py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
