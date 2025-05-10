'use client';

import { changePassword, getAccessToken, getProfile, getProfilelow, updateUserProfile, uploadProfilePicture } from '@/services/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/newHeader';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const [profile, setProfile] = useState<any>({});
  const [initialProfile, setInitialProfile] = useState<any>({});
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [success, setSuccess] = useState('');
  const [updatePassword, setUpdatePassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    setIsLoggedIn(!!token);

    if (token) {
      async function fetchProfile() {
        try {
          const datalow = await getProfilelow();
          setProfile(datalow);
          setInitialProfile(datalow);

          const data = await getProfile(datalow.userId);
          console.log("Profile image location url: ",data.image)
          console.log("Picture: ",`http://localhost:3000${data.image}`)
          setProfile(data);
          setInitialProfile(data);
        } catch (error) {
          setError('Failed to fetch profile');
        }
      }
      fetchProfile();
    }
  }, []);

  const handleProfileUpdate = async () => {
    if (JSON.stringify(profile) === JSON.stringify(initialProfile) && !updatePassword && !selectedFile) {
      setError('No changes to update');
      setTimeout(() => setError(''), 1000);
      return;
    }

    try {
      await updateUserProfile(profile.id, profile);
      if (updatePassword) {
        await changePassword(profile.id, { newPassword });
      }
      if (selectedFile) {
        const uploadResponse = await uploadProfilePicture(profile.id, selectedFile);
        setProfile({ ...profile, image: uploadResponse.imageUrl });
      }
      setSuccess('Profile updated successfully');
      setError('');
      router.push(`/`);
    } catch (error) {
      setError('Failed to update profile');
      setTimeout(() => setError(''), 1000);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Construct the full URL for the profile image
  const profileImageUrl = profile.image ? `http://localhost:3000${profile.image}` : '';

  return (
    <div className="profile-page">
      <Header currentPage={pathname} />
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        
        <div className="profile-form">
          {profile.image && (
            <div className="image-display">
              <img src={profileImageUrl} alt="Profile" className="profile-image" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              id="Email"
              type="text"
              value={profile.email || ''}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Name">Name</label>
            <input
              id="Name"
              type="text"
              value={profile.name || ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
          </div>

          {profile.dob && (
            <div className="dob-display">
              <p style={{ color: '#EAEAEC', marginLeft: '10px' }}>Date of Birth: {new Date(profile.dob).toLocaleDateString()}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="dob">DOB</label>
            <input
              id="dob"
              type="date"
              value={profile.dob instanceof Date ? profile.dob.toISOString().substr(0, 10) : ''}
              onChange={(e) => setProfile({ ...profile, dob: new Date(e.target.value) })}
              placeholder="Date"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Address">Address</label>
            <input
              id="Address"
              type="text"
              value={profile.address || ''}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="Address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Profile Picture</label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-group update-password-group">
            <input
              id="updatePassword"
              style={{ width: '10%' }}
              type="checkbox"
              checked={updatePassword}
              onChange={() => setUpdatePassword(!updatePassword)}
            />
            <label htmlFor="updatePassword">Update Password</label>
          </div>

          {updatePassword && (
            <div className="form-group">
              <label style={{ marginBottom: '5px' }} htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={newPassword}
                style={{ marginBottom: '5px' }}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          <button style={{ marginLeft: '10px', marginBottom: '20px' }} onClick={handleProfileUpdate}>Update Profile</button>
        </div>
      </div>
      <style jsx>{`
        .profile-page {
          background-color: #121212;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }
        .profile-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }
        .profile-title {
          margin-bottom: 20px;
          text-align: center;
        }
        .profile-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .form-group {
          margin-bottom: 15px;
          width: 100%;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: white;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .profile-image {
          border-radius: 50%;
          width: 200px;
          height: 200px;
          object-fit: cover;
          margin-bottom: 20px;
        }
        .image-display {
          display: flex;
          justify-content: center;
        }
        .update-password-group {
          display: flex;
          align-items: center;
        }
        .update-password-group label {
          margin-left: 10px;
          color: white;
        }
        .error-message {
          color: red;
          margin-left: 10px;
        }
        .success-message {
          color: green;
          margin-left: 10px;
        }
        .profile-container h1 {
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
