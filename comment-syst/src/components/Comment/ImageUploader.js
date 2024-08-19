import React from 'react';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ImageUploader = ({ onImageUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);

    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    
    setUploading(false);
    onImageUpload(imageUrl);
  };

  return (
    <div className="image-uploader">
      <input type="file" onChange={handleImageUpload} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default ImageUploader;
