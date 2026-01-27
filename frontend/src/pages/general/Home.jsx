import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Heart, Bookmark, MessageCircle, Send, X, Loader2, Search, LogOut, User as UserIcon } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const searchTimeout = useRef(null);

  // Check login status
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchVideos = async (query = "") => {
    const token = Cookies.get("token");
    try {
      const result = await axios.get(
        `http://localhost:3000/auth/foodItem/get${query ? `?search=${query}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      setVideos(result.data.foodItems || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle Search with Debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      setLoading(true);
      fetchVideos(value);
    }, 500);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/user/logout", {}, { withCredentials: true });
      Cookies.remove("token");
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle video playback
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      videoRefs.current.forEach((videoRef) => {
        if (!videoRef) return;
        const rect = videoRef.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.top < window.innerHeight / 2;
        if (isInView) {
          videoRef.play().catch(() => { });
        } else {
          videoRef.pause();
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [loading]);

  const handleVisitStore = (partnerId) => {
    if (partnerId) {
      navigate(`/food-partner/${partnerId}`);
    }
  };

  const fetchComments = async (foodId) => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/foodItem/comments/${foodId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleLike = async (foodId) => {
    try {
      await axios.post(
        "http://localhost:3000/auth/foodItem/like",
        { foodId },
        { withCredentials: true }
      );
      setVideos((prev) =>
        prev.map((v) =>
          v._id === foodId
            ? { ...v, isLiked: !v.isLiked, likeCount: v.isLiked ? (v.likeCount || 1) - 1 : (v.likeCount || 0) + 1 }
            : v
        )
      );
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleSave = async (foodId) => {
    try {
      await axios.post(
        "http://localhost:3000/auth/foodItem/save",
        { foodId },
        { withCredentials: true }
      );
      setVideos((prev) =>
        prev.map((v) => v._id === foodId ? { ...v, isSaved: !v.isSaved } : v)
      );
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleOpenComments = (video) => {
    setActiveVideo(video);
    setShowComments(true);
    fetchComments(video._id);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        "http://localhost:3000/auth/foodItem/comment",
        { foodId: activeVideo._id, text: newComment },
        { withCredentials: true }
      );
      fetchComments(activeVideo._id);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="text-4xl font-extrabold text-[#ff3f6c] tracking-tighter hover:scale-105 transition-transform">
          zomato
        </Link>

        <div className="hidden md:flex flex-1 max-w-[600px] relative group mx-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-[#ff3f6c] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search for restaurant, cuisine or a dish"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-white focus:outline-none focus:bg-white/20 focus:border-[#ff3f6c] transition-all placeholder:text-white/40 text-base"
          />
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 font-medium text-lg focus:outline-none transition-colors"
            >
              Log out
            </button>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/user/login"
                className="text-white hover:text-gray-300 font-medium text-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/user/register"
                className="text-white hover:text-gray-300 font-medium text-lg transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-hide pt-0"
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-white gap-4">
            <Loader2 className="animate-spin text-[#ff3f6c]" size={48} />
            <p className="text-xl font-medium animate-pulse">Refreshing content...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-white p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">No results found!</h2>
            <p className="text-gray-400">Try searching for something else like "Burger" or "Pizza".</p>
          </div>
        ) : (
          videos.map((video, index) => (
            <div
              key={video._id}
              className="relative h-screen w-full snap-start flex items-center justify-center p-0 md:p-8 lg:p-12"
            >
              <div className="relative w-full h-[85vh] max-w-[1400px] mt-20 mx-auto overflow-hidden rounded-none md:rounded-3xl shadow-2xl bg-[#111]">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="h-full w-full object-cover"
                  src={video.video}
                  loop
                  muted
                  playsInline
                />

                {/* Interaction Overlay */}
                <div className="absolute right-8 bottom-[25%] flex flex-col items-center gap-8 z-20">
                  <button onClick={() => handleLike(video._id)} className={`flex flex-col items-center gap-1 transition-transform active:scale-95 ${video.isLiked ? 'text-[#ff3f6c]' : 'text-white'}`}>
                    <Heart fill={video.isLiked ? "#ff3f6c" : "none"} size={36} strokeWidth={2.5} className="drop-shadow-xl" />
                    <span className="text-sm font-bold drop-shadow-lg">{video.likeCount || 0}</span>
                  </button>

                  <button onClick={() => handleOpenComments(video)} className="flex flex-col items-center gap-1 transition-transform active:scale-95 text-white">
                    <MessageCircle size={36} strokeWidth={2.5} className="drop-shadow-xl" />
                    <span className="text-sm font-bold drop-shadow-lg">Chat</span>
                  </button>

                  <button onClick={() => handleSave(video._id)} className="flex flex-col items-center gap-1 transition-transform active:scale-95 text-white">
                    <Bookmark fill={video.isSaved ? "white" : "none"} size={36} strokeWidth={2.5} className="drop-shadow-xl" />
                    <span className="text-sm font-bold drop-shadow-lg">{video.isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                {/* Store Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-12 pb-14 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="mb-8 max-w-[85%]">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#ff3f6c] p-0.5 shadow-xl border-2 border-white/20">
                        {video.foodPartner?.profilePic ? (
                          <img
                            src={video.foodPartner.profilePic}
                            alt={video.foodPartner.restaurantName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                            <span className="text-white font-black text-xl">{video.foodPartner?.restaurantName?.[0] || "?"}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-2xl">{video.foodPartner?.restaurantName || video.name}</h4>
                        <span className="text-white/60 text-sm font-semibold uppercase tracking-widest">Master Chef</span>
                      </div>
                    </div>
                    <p className="text-white text-xl font-normal leading-relaxed line-clamp-2 opacity-90">{video.description}</p>
                  </div>

                  <button
                    onClick={() => handleVisitStore(video.foodPartner?._id)}
                    className="w-full md:w-fit bg-[#ff3f6c] text-white font-bold py-5 px-10 rounded-2xl hover:bg-[#e0355f] transition-all transform active:scale-95 shadow-2xl flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                  >
                    <span>Explore Shop</span>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>

                {/* Comment Drawer Section */}
                {showComments && activeVideo?._id === video._id && (
                  <div className="absolute inset-0 bg-black/50 z-30 flex justify-end" onClick={() => setShowComments(false)}>
                    <div className="w-full max-w-[400px] h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
                      <div className="p-6 border-b flex justify-between items-center text-black">
                        <h3 className="font-bold text-xl">Comments</h3>
                        <button onClick={() => setShowComments(false)}><X size={24} /></button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {comments.length > 0 ? (
                          comments.map((c, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#ff3f6c] text-white flex items-center justify-center font-bold flex-shrink-0">{c.user?.name?.[0] || "?"}</div>
                              <div className="flex flex-col">
                                <span className="font-bold text-black text-sm">{c.user?.name || "Gourmet"}</span>
                                <p className="text-gray-800 text-sm">{c.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-400 mt-20">No comments yet. Start the conversation!</p>
                        )}
                      </div>
                      <form className="p-6 border-t bg-gray-50 flex gap-3" onSubmit={handleAddComment}>
                        <input
                          type="text"
                          placeholder="Say something nice..."
                          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#ff3f6c] text-black bg-white"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="w-12 h-12 bg-[#ff3f6c] text-white rounded-full flex items-center justify-center hover:bg-[#e0355f] transition-colors shadow-lg active:scale-90">
                          <Send size={20} />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
