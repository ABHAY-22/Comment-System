import React from 'react';
import CommentBox from './CommentBox';
import CommentList from './CommentList';
import GoogleLogin from './GoogleLogin';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
 
  const userId = 'some-user-id';

  return (
    <div className="container mx-auto p-4">
      <GoogleLogin />
      <CommentBox userId={userId} />
      <CommentList />
      <ToastContainer />
    </div>
  );
};

export default App;
