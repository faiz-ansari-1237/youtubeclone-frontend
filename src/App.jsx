// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Feed from './pages/Feed.jsx';
import WatchPage from './pages/Watch.jsx';
import ProfilePage from './pages/Profile.jsx';
import SignInPage from './pages/SignIn.jsx';
import VideoUploadModal from './pages/VideoUploadModal.jsx';
import FloatingUploadButton from './components/FloatingUploadButton.jsx';
import VideoCard from './components/VideoCard.jsx';
import Footer from './components/Footer.jsx';
import ProfileSettings from './pages/Settings.jsx';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import WatchLater from './pages/WatchLater';
import Downloads from './pages/Downloads';
import Subscriptions from './pages/Subscriptions.jsx';

function App() {
  // State to manage user login status and data
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Effect to load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user from localStorage:", e);
        localStorage.removeItem('currentUser');
      }
    }
    setToken(localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignIn = (user) => {
    setCurrentUser(user);
    setToken(user.token);
    localStorage.setItem('token', user.token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleGlobalSearch = (query) => {
    setCurrentSearchQuery(query);
  };

  const handleUpload = () => {
    setIsUploadModalOpen(false);
  };

  const handleSearch = (results, performed = true) => {
    setSearchResults(results);
    setSearchPerformed(performed);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-inter">
        <Header
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onSearch={handleSearch}
        />
        <div className="flex flex-1 min-h-screen">
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            currentUser={currentUser}
            onSignIn={handleSignIn}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  searchPerformed ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 ml-4">Search Results</h2>
                      {searchResults.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8 text-lg">
                          No results found.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4">
                          {searchResults.map(video => (
                            <VideoCard key={video._id} video={video} />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Feed />
                  )
                }
              />
              <Route path="/watch/:id" element={<WatchPage currentUser={currentUser} />} />
              <Route path="/channel" element={<ProfilePage currentUser={currentUser} />} />
              <Route path="/signin" element={<SignInPage onSignIn={handleSignIn} />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route
                path="/settings"
                element={
                  <ProfileSettings
                    currentUser={currentUser}
                    onProfileUpdate={setCurrentUser}
                  />
                }
              />
              <Route path="/history" element={<History />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/liked-videos" element={<LikedVideos />} />
              <Route path="/downloaded-videos" element={<Downloads />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </Routes>
          </main>
        </div>
        
        <FloatingUploadButton
          token={token}
          onUpload={handleUpload}
          onClick={() => setIsUploadModalOpen(true)}
        />
        
        <VideoUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          token={token}
          currentUser={currentUser}
          onUpload={handleUpload}
        />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
