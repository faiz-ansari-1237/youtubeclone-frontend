import React, { useState } from 'react';

const ProfileSettings = ({ currentUser, onProfileUpdate }) => {
    const [username, setUsername] = useState(currentUser?.username || '');
    const [channelName, setChannelName] = useState(currentUser?.channelName || '');
    const [profilePicture, setProfilePicture] = useState(currentUser?.profilePicture || '');
    const [newPicture, setNewPicture] = useState(null);

    const handlePictureChange = (e) => {
        setNewPicture(e.target.files[0]);
        setProfilePicture(URL.createObjectURL(e.target.files[0]));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', username);
        formData.append('channelName', channelName);
        if (newPicture) formData.append('profilePicture', newPicture);

        const token = localStorage.getItem('token');
        const res = await fetch(`https://youtubeclone-backend-b4m2.onrender.com/api/users/${currentUser._id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const data = await res.json();
        if (res.ok) {
            alert('Profile updated!');
            onProfileUpdate(data.user);
        } else {
            alert(data.message || 'Update failed');
        }
    };

    return (
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4">Profile Settings</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Username</label>
                        <input
                            className="w-full border rounded p-2"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Channel Name</label>
                        <input
                            className="w-full border rounded p-2"
                            value={channelName}
                            onChange={e => setChannelName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePictureChange}
                            className="w-full border rounded p-2"
                        />
                        {profilePicture && (
                            <img src={profilePicture} alt="Preview" className="h-20 w-20 rounded-full mt-2 object-cover" />
                        )}
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
