import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase'; // Adjust path as needed

const GoogleLogin: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user); 
    } catch (error) {
      console.error('Error during sign-in:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); 
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  return (
    <div className="flex justify-end p-2">
      <div className="p-4 bg-white rounded-lg shadow-lg w-64">
        {user ? (
          <div className="text-center">
            <img
              src={user.photoURL || ''}
              alt="Profile"
              className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-blue-500"
            />
            <h2 className="text-lg font-semibold mb-1">{user.displayName}</h2>
            <p className="text-gray-600 mb-3 text-sm">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleLogin;
