import React, { useEffect } from 'react';

const YourComponent: React.FC = () => {
  useEffect(() => {
    const targetNode = document.getElementById('yourElementId');
    
    if (!targetNode) return;

    const observerOptions = {
      childList: true,
      subtree: true
    };

    const callback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          console.log('A child node has been added or removed.');
        }
      }
    };

    const observer = new MutationObserver(callback);

    observer.observe(targetNode, observerOptions);

    // Cleanup function
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <div id="yourElementId">Observe me!</div>
    </div>
  );
};

export default YourComponent;
