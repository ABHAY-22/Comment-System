
// src/App.js
import React from 'react';
import { useAuth } from './context/AuthContext';
import CommentBox from './components/Comment/CommentBox';
import CommentList from './components/Comment/CommentList';
import LoginButton from './components/LoginButton';

function App() {
  const { user } = useAuth(); // Destructure user from useAuth

  return (
    <div className="App">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
        <h1 className="text-2xl">Comment System</h1>
        <LoginButton />
      </header>
      <main className="p-4">
        {user ? (
          <>
            <CommentBox />
            <CommentList />
          </>
        ) : (
          <p>Please sign in to leave a comment.</p>
        )}
      </main>
    </div>
  );
}

export default App;
