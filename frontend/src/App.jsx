import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, push, onValue, remove, update } from 'firebase/database';
import { auth, database } from './firebaseConfig';
import AuthPage from './AuthPage.jsx';
import { summarizeURL } from './summarizerAPI';
import ReactMarkdown from 'react-markdown';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState({});
  const [newURL, setNewURL] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [expandedBookmarks, setExpandedBookmarks] = useState({});

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to bookmarks in real-time
  useEffect(() => {
    if (user) {
      const bookmarksRef = ref(database, `users/${user.uid}/bookmarks`);
      const unsubscribe = onValue(bookmarksRef, (snapshot) => {
        const data = snapshot.val();
        setBookmarks(data || {});
      });

      return () => unsubscribe();
    } else {
      setBookmarks({});
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSuccessMessage('Logged out successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError('Failed to logout');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newURL.trim()) return;

    setIsAdding(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validate and normalize URL
      let url = newURL.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Get AI summary
      const result = await summarizeURL(url);

      // Save to Firebase
      const bookmarksRef = ref(database, `users/${user.uid}/bookmarks`);
      await push(bookmarksRef, {
        url: url,
        title: result.title,
        favicon: result.favicon,
        summary: result.summary,
        createdAt: new Date().toISOString(),
        generatedAt: result.generatedAt
      });

      setNewURL('');
      setSuccessMessage('Bookmark added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding bookmark:', err);
      setError(err.message || 'Failed to add bookmark');
      setTimeout(() => setError(''), 5000);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteBookmark = async (bookmarkId) => {
    if (!window.confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    try {
      const bookmarkRef = ref(database, `users/${user.uid}/bookmarks/${bookmarkId}`);
      await remove(bookmarkRef);
      setSuccessMessage('Bookmark deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRegenerateSummary = async (bookmarkId, bookmark) => {
    setRegeneratingId(bookmarkId);
    setError('');

    try {
      // Get new AI summary
      const result = await summarizeURL(bookmark.url);

      // Update in Firebase
      const bookmarkRef = ref(database, `users/${user.uid}/bookmarks/${bookmarkId}`);
      await update(bookmarkRef, {
        title: result.title,
        favicon: result.favicon,
        summary: result.summary,
        generatedAt: result.generatedAt
      });

      setSuccessMessage('Summary regenerated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error regenerating summary:', err);
      setError(err.message || 'Failed to regenerate summary');
      setTimeout(() => setError(''), 5000);
    } finally {
      setRegeneratingId(null);
    }
  };

  const toggleExpandBookmark = (bookmarkId) => {
    setExpandedBookmarks(prev => ({
      ...prev,
      [bookmarkId]: !prev[bookmarkId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={() => setUser(auth.currentUser)} />;
  }

  const bookmarksArray = Object.entries(bookmarks).map(([id, data]) => ({
    id,
    ...data
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarks</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Bookmark Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Bookmark</h2>
          <form onSubmit={handleAddBookmark} className="flex gap-3">
            <input
              type="text"
              value={newURL}
              onChange={(e) => setNewURL(e.target.value)}
              placeholder="Enter URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              disabled={isAdding}
            />
            <button
              type="submit"
              disabled={isAdding || !newURL.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Bookmark
                </>
              )}
            </button>
          </form>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Bookmarks Grid */}
        {bookmarksArray.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">Add your first bookmark to get started with AI-powered summaries!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarksArray.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Title and Favicon */}
                  <div className="flex items-start gap-3 mb-4">
                    {bookmark.favicon && (
                      <img
                        src={bookmark.favicon}
                        alt="favicon"
                        className="w-8 h-8 flex-shrink-0 rounded"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-indigo-600 hover:text-indigo-700 line-clamp-2 break-words"
                      >
                        {bookmark.title}
                      </a>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {new URL(bookmark.url).hostname}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">AI Summary:</h4>
                      <button
                        onClick={() => toggleExpandBookmark(bookmark.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        {expandedBookmarks[bookmark.id] ? (
                          <>
                            Show Less
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Show More
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div className={`text-sm text-gray-600 prose prose-sm max-w-none ${!expandedBookmarks[bookmark.id] ? 'line-clamp-4' : ''}`}>
                      <ReactMarkdown
                        components={{
                          // Style markdown elements
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="ml-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-gray-800" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                          code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2 text-gray-800" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-2 text-gray-800" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-semibold mb-1 text-gray-800" {...props} />,
                        }}
                      >
                        {bookmark.summary}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-400 mb-4">
                    Added: {new Date(bookmark.createdAt).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegenerateSummary(bookmark.id, bookmark)}
                      disabled={regeneratingId === bookmark.id}
                      className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {regeneratingId === bookmark.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Regenerate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteBookmark(bookmark.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
