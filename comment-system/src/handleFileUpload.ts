import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase'; 

const handleFileUpload = async (file: File) => {
  const storageRef = ref(storage, `comments/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("File uploaded:", downloadURL);
    return downloadURL; 
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
