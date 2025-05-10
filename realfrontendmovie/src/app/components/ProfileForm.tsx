import { getProfile, updateUserProfile } from '@/services/api';
import { useEffect, useState } from 'react';
import { getProfilelow } from '@/services/api';
const ProfileForm = () => {
  const [profile, setProfile] = useState({
    name: '',
    address: '',
    image: '',
    dob: '',
    id: 0,
    categories: [] as string[],
  });/auth/${id}

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set the token in the headers for authenticated requests
          const datalow = await getProfilelow();
          setProfile(datalow);
          console.log("In profile", datalow.userId);
  
          // Then fetch using getProfile with userId from the first fetch
          const data = await getProfile(datalow.userId);
          setProfile(data);
          console.log("Full profile", data);
        } else {
          console.error('No token found, please log in first.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(profile.id, profile);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle update failure (e.g., show error message to the user)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="address"
        value={profile.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        type="text"
        name="image"
        value={profile.image}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <input
        type="date"
        name="dob"
        value={profile.dob ? new Date(profile.dob).toISOString().split('T')[0] : ''}
        onChange={handleChange}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;
