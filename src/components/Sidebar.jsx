// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Youtube, Library, History, Clock, ThumbsUp, ChevronDown, Settings, Flag, HelpCircle, MessageSquare, X, User, LogIn, LogOut, Download } from 'lucide-react';
import SidebarRow from './SidebarRow.jsx';

const Sidebar = ({ isOpen, toggleSidebar, currentUser, onSignIn, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- Add this line
  const profileLink = currentUser ? `/profile/${currentUser._id}` : '/signin';

  // Helper to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar content for mobile (fixed, slides in/out) */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white p-4 shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-60 overflow-y-auto
          md:hidden`} // Only apply this fixed, sliding behavior on mobile
      >
        {/* Close button for mobile */}
        <div className="flex justify-end mb-4">
          <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
            <X className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="space-y-2">
          <Link to="/" onClick={toggleSidebar}>
            <SidebarRow Icon={Home} title="Home" selected={isActive('/')} isSidebarOpen={true} />
          </Link>
          <Link to="/subscriptions" onClick={toggleSidebar}>
            <SidebarRow Icon={Library} title="Subscriptions" selected={isActive('/subscriptions')} isSidebarOpen={isOpen} />
          </Link>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* "You" section for logged-in users */}
        {currentUser && (
          <>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 px-3">YOU</h3>
            <div className="space-y-2">
              <Link to={profileLink} onClick={toggleSidebar}>
                <SidebarRow Icon={User} title="Your Channel" selected={isActive(profileLink)} isSidebarOpen={true} />
              </Link>
              <Link to="/history" onClick={toggleSidebar}>
                <SidebarRow Icon={History} title="History" selected={isActive('/history')} isSidebarOpen={true} />
              </Link>
              <Link to="/watch-later" onClick={toggleSidebar}>
                <SidebarRow Icon={Clock} title="Watch later" selected={isActive('/watch-later')} isSidebarOpen={isOpen} />
              </Link>
              <Link to="/liked-videos" onClick={toggleSidebar}>
                <SidebarRow Icon={ThumbsUp} title="Liked videos" selected={isActive('/liked-videos')} isSidebarOpen={true} />
              </Link>
              <Link to="/downloaded-videos" onClick={toggleSidebar}>
                <SidebarRow Icon={Download} title="Downloads" selected={isActive('/downloaded-videos')} isSidebarOpen={isOpen} />
              </Link>
            </div>
            <hr className="my-4 border-gray-200" />
          </>
        )}

        {/* Sign In/Out button */}
        {!currentUser ? (
          <Link to="/signin" onClick={toggleSidebar}>
            <SidebarRow Icon={LogIn} title="Sign In" isSidebarOpen={true} />
          </Link>
        ) : (
          <button onClick={() => { onSignOut(); toggleSidebar(); navigate('/'); }} className="w-full text-left">
            <SidebarRow Icon={LogOut} title="Sign Out" isSidebarOpen={true} />
          </button>
        )}

        <hr className="my-4 border-gray-200" />

        <h3 className="text-sm font-semibold text-gray-500 mb-2 px-3">MORE FROM YOUTUBE</h3>
        <div className="space-y-2">
          <Link to="/settings" onClick={toggleSidebar}>
            <SidebarRow Icon={Settings} title="Settings" isSidebarOpen={true} />
          </Link>
        </div>
      </aside>

      {/* Sidebar content for desktop (part of flex layout, changes width) */}
      <aside
        className={`hidden md:block bg-white p-4 shadow-lg flex-shrink-0 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-60' : 'w-20'} ${!isOpen ? 'overflow-hidden' : ''}
          sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        {/* No close button needed here as it's controlled by width */}
        <div className="space-y-2">
          <Link to="/">
            <SidebarRow Icon={Home} title="Home" selected={isActive('/')} isSidebarOpen={isOpen} />
          </Link>
          <Link to="/subscriptions">
            <SidebarRow Icon={Library} title="Subscriptions" selected={isActive('/subscriptions')} isSidebarOpen={isOpen} />
          </Link>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* "You" section for logged-in users - desktop */}
        {currentUser && (
          <>
            <h3 className={`text-sm font-semibold text-gray-500 mb-2 px-3 ${!isOpen && 'hidden'}`}>YOU</h3>
            <div className="space-y-2">
              <Link to={profileLink}>
                <SidebarRow Icon={User} title="Your Channel" selected={isActive(profileLink)} isSidebarOpen={isOpen} />
              </Link>
              <Link to="/history">
                <SidebarRow Icon={History} title="History" selected={isActive('/history')} isSidebarOpen={isOpen} />
              </Link>
              <Link to="/watch-later">
                <SidebarRow Icon={Clock} title="Watch later" selected={isActive('/watch-later')} isSidebarOpen={isOpen} />
              </Link>
              <Link to="/liked-videos">
                <SidebarRow Icon={ThumbsUp} title="Liked videos" selected={isActive('/liked-videos')} isSidebarOpen={isOpen} />
              </Link>
              <Link to="/downloaded-videos">
                <SidebarRow Icon={Download} title="Downloads" selected={isActive('/downloaded-videos')} isSidebarOpen={isOpen} />
              </Link>
            </div>
            <hr className="my-4 border-gray-200" />
          </>
        )}

        {/* Sign In/Out button - desktop */}
        {!currentUser ? (
          <Link to="/signin">
            <SidebarRow Icon={LogIn} title="Sign In" isSidebarOpen={isOpen} />
          </Link>
        ) : (
          <button onClick={() => { onSignOut(); navigate('/'); }} className="w-full text-left">
            <SidebarRow Icon={LogOut} title="Sign Out" isSidebarOpen={isOpen} />
          </button>
        )}

        <hr className="my-4 border-gray-200" />

        <h3 className={`text-sm font-semibold text-gray-500 mb-2 px-3 ${!isOpen && 'hidden'}`}>MORE FROM YOUTUBE</h3> {/* Hide header when collapsed */}
        <div className="space-y-2">
          <Link to="/settings">
            <SidebarRow Icon={Settings} title="Settings" isSidebarOpen={isOpen} />
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
