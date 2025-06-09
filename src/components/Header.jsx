// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Youtube, Search, Bell, Video, UserCircle, Menu, LogOut, ArrowLeft, Settings } from 'lucide-react';

const Header = ({ toggleSidebar, currentUser, onSignOut, onSearch }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef();
  const navigate = useNavigate();

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(`http://192.168.0.190:5000/api/videos/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      onSearch(data, true);
      if (isMobileSearchOpen) setIsMobileSearchOpen(false);
    } catch (err) {
      alert('Search failed');
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      onSearch([], false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  // Fetch notifications for the current user
  useEffect(() => {
    if (currentUser) {
      fetch(`http://192.168.0.190:5000/api/users/me/notifications`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setNotifications(data);
        });
    }
  }, [currentUser]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications]);

  // Mark notifications as read when the dropdown is opened
  useEffect(() => {
    if (showNotifications && notifications.some(n => !n.read)) {
      fetch('http://192.168.0.190:5000/api/users/me/notifications/mark-read', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(() => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      });
    }
  }, [showNotifications]);

  // Fallback image if user has no profile picture
  const profilePic = currentUser?.profilePicture || 'https://placehold.co/40x40/cccccc/000000?text=User';

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Mobile Search Bar - Appears when isMobileSearchOpen is true */}
      {isMobileSearchOpen && (
        <div className="fixed inset-x-0 top-0 h-16 bg-white flex items-center px-4 z-50 md:hidden">
          <button onClick={toggleMobileSearch} className="p-2 rounded-full hover:bg-gray-200 focus:outline-none mr-2">
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <input
            type="text"
            placeholder="Search"
            className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 pl-4"
            autoFocus // Automatically focus when opened
            value={searchQuery} // Bind value to state
            onChange={handleSearchChange} // Update state on change
            onKeyPress={(e) => { // Allow search on Enter key press
              if (e.key === 'Enter') {
                handleSearchSubmit(e);
              }
            }}
          />
          <button onClick={handleSearchSubmit} className="p-2 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 ml-2">
            <Search className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      )}

      {/* Main Header content - Hidden on mobile when search bar is open */}
      <div className={`flex items-center justify-between w-full ${isMobileSearchOpen ? 'hidden md:flex' : 'flex'}`}>
        {/* Left section: Menu icon and YouTube logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <Link to="/" className="flex items-center space-x-1">
            <Youtube className="h-8 w-8 text-red-600" fill="red" />
            <span className="font-bold text-xl text-gray-800 hidden sm:inline">YouTube Clone</span>
          </Link>
        </div>

        {/* Middle section: Search bar (Desktop) / Search icon (Mobile) */}
        <div className="flex flex-1 mx-2 md:mx-4 justify-end md:justify-center">
          {/* Desktop Search Input */}
          <input
            type="text"
            placeholder="Search"
            className="hidden md:flex-1 md:flex p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-1 focus:ring-blue-500 pl-4"
            value={searchQuery} // Bind value to state
            onChange={handleSearchChange} // Update state on change
            onKeyPress={(e) => { // Allow search on Enter key press
              if (e.key === 'Enter') {
                handleSearchSubmit(e);
              }
            }}
          />
          {/* Desktop Search Button */}
          <button onClick={handleSearchSubmit} className="hidden md:block p-2 bg-gray-100 border border-gray-300 rounded-r-full hover:bg-gray-200">
            <Search className="h-6 w-6 text-gray-600" />
          </button>
          {/* Mobile Search Icon - visible only on small screens, toggles mobile search bar */}
          <button onClick={toggleMobileSearch} className="p-2 rounded-full hover:bg-gray-200 focus:outline-none md:hidden">
            <Search className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative">
            <Bell
              ref={bellRef}
              className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800 relative"
              onClick={() => setShowNotifications(v => !v)}
            />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2 font-semibold border-b">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500">No notifications.</div>
                ) : (
                  <>
                    {notifications.map(n => (
                      <div key={n._id} className={`p-3 border-b hover:bg-gray-50 ${n.read ? '' : 'bg-blue-50'}`}>
                        <a href={n.link || '#'} className="text-sm text-gray-800">{n.message}</a>
                        <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {currentUser ? (
            <div className="relative profile-dropdown">
              <img
                src={profilePic}
                alt={currentUser.channelName || currentUser.username}
                className="h-10 w-10 rounded-full object-cover border-2 border-blue-400 cursor-pointer"
                onClick={() => setShowDropdown((v) => !v)}
              />
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <Link
                    to={`/profile/${currentUser._id}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => setShowDropdown(false)}
                  >
                    Your Channel
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                    onClick={() => setShowDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onSignOut();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="text-blue-600 font-semibold">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
