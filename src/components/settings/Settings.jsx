import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../AuthProvider';
import { auth, storage } from '../../firebase'; // Adjust paths as necessary
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Setting.css';
import defaultProfileImg from '../../assets/user.jpeg';
import { isValidImageUrl } from '../../utils';
import Loader from '../loader/Loader';
function Settings() {
  const { currentUser } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState(currentUser?.displayName || '');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(defaultProfileImg);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkImageUrl = async () => {
      const photoUrl = currentUser?.photoURL;
      const isValid = await isValidImageUrl(photoUrl);
      if (isValid) {
        setProfilePicUrl(photoUrl);
      } else {
        setProfilePicUrl(defaultProfileImg);
      }
    };
    checkImageUrl();
  }, [currentUser]);

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (profilePic) {
        const profilePicRef = ref(storage, `profile_pics/${currentUser.uid}/${profilePic.name}`);
        await uploadBytes(profilePicRef, profilePic);
        const newProfilePicUrl = await getDownloadURL(profilePicRef);
        await updateProfile(currentUser, { photoURL: newProfilePicUrl });
        localStorage.setItem('photoUrl', newProfilePicUrl);
      }

      if (companyName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: companyName });
        localStorage.setItem('cName', companyName);
      }

      alert('Profile updated successfully! Click Ok to view your updated profile');
      window.location.reload(); // Reload the whole application
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      {loading && <Loader />}
      <h2>Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name:</label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={handleCompanyNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture:</label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            onChange={handleProfilePicChange}
          />
        </div>
        {previewUrl && <img src={previewUrl} alt="Profile Preview" className="profile-preview" />}
        <button onClick={handleSave} className="save-button">Save</button>
      </div>
    </div>
  );
}

export default Settings;
