import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Heart, Bookmark, MessageCircle, Send, X, Loader2, LogOut, User as UserIcon, ChefHat } from "lucide-react";
import "../../styles/auth.css";

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
  const [userProfile, setUserProfile] = useState(null);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null

  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const searchTimeout = useRef(null);

  // Check login status
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          // Attempt to fetch if it's a food-partner
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/food-partner/${payload.id}`, { withCredentials: true })
            .then(res => {
              if (res.data.foodPartner) {
                setUserProfile(res.data.foodPartner);
              }
            })
            .catch(() => {
              // Not a food partner or error, ignore
            });
        }
      } catch (e) {
        console.error("Token parsing error:", e);
      }
    }
  }, []);

  const fetchVideos = async (query = "") => {
    const token = Cookies.get("token");
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/get${query ? `?search=${query}` : ""}`,
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
      const token = Cookies.get("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      Cookies.remove("token", { path: "/" });
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: still clear local session even if server call fails
      Cookies.remove("token", { path: "/" });
      setIsLoggedIn(false);
      window.location.reload();
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/comments/${foodId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleLike = async (foodId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/like`,
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
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/save`,
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
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/comment`,
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
      <nav className="fixed top-0 left-30 right-30 h-18 bg-black/40  border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="text-4xl font-extrabold text-[#ff3f6c] tracking-tighter hover:scale-105 transition-transform">
          zomato
        </Link>

        <div className="flex-1 flex items-center justify-end gap-8">
          {isLoggedIn && (
            <div className="hidden md:flex flex-1 max-w-[500px] relative">
              <input
                type="text"
                placeholder="   Search for restaurant, cuisine or a dish"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/10 border border-white/10 rounded-2xl pb-8 py-8 px-6 mx-5 h-9 text-white focus:outline-none focus:bg-white/20 focus:border-[#ff3f6c] transition-all placeholder:text-white/40 text-lg shadow-inner"
              />
            </div>
          )}

          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setAuthModal('login')}
                  className="flex items-center gap-2 text-white hover:text-[#ff3f6c] font-bold text-[1rem] transition-all active:scale-95"
                >
                  <UserIcon size={18} />
                  <span>Log in</span>
                </button>
                <button
                  onClick={() => setAuthModal('signup')}
                  className="text-white hover:text-[#ff3f6c] px-[1.5rem] py-[0.8rem] rounded-lg font-bold text-[1rem] transition-all active:scale-95"
                >
                  Sign up
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {userProfile && (
                  <Link
                    to={`/food-partner/${userProfile._id}`}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#ff3f6c] hover:scale-110 transition-transform shadow-lg"
                    title="My Profile"
                  >
                    {userProfile.profilePic ? (
                      <img src={userProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#ff3f6c] flex items-center justify-center text-white font-bold">
                        {userProfile.restaurantName?.[0] || "?"}
                      </div>
                    )}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-[#ff3f6c]/10 text-[#ff3f6c] px-4 py-2 rounded-lg font-bold text-base transition-all active:scale-95"
                >
                  <LogOut size={18} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

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
              <div className="relative w-full h-[80vh] max-w-[1400px] mt-20 mx-auto overflow-hidden rounded-none md:rounded-3xl shadow-2xl bg-[#111]">
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="h-full w-full object-cover"
                  src={video.video}
                  loop
                  muted
                  playsInline
                />

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

                  <button onClick={() => handleVisitStore(video.foodPartner?._id)} className="flex flex-col items-center gap-1 transition-transform active:scale-95 text-white">
                    <img src="/food-delivery.png" alt="Order" className="w-[36px] h-[36px] object-contain invert brightness-0 [filter:drop-shadow(0_4px_6px_rgba(0,0,0,0.4))]" />
                    <span className="text-sm font-bold drop-shadow-lg">Order</span>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-12 pb-14 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="mb-8 max-w-[85%]">
                    <div
                      className="flex items-center gap-4 mb-5 cursor-pointer group/brand w-fit"
                      onClick={() => handleVisitStore(video.foodPartner?._id)}
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-[#ff3f6c] p-0.5 shadow-xl border-2 border-white/20 transition-transform group-hover/brand:scale-110 group-hover/brand:border-[#ff3f6c]">
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
                        <h4 className="text-white font-bold text-2xl group-hover/brand:text-[#ff3f6c] transition-colors">{video.foodPartner?.restaurantName || video.name}</h4>
                        <p className="text-white text-xl font-normal leading-relaxed line-clamp-2 opacity-90 mt-1">{video.description}</p>
                      </div>
                    </div>
                  </div>

                </div>

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
                              <div className="w-10 h-10 rounded-full bg-[#ff3f6c] text-white flex items-center justify-center font-bold flex-shrink-0">{c.user?.fullName?.[0] || c.user?.ownerName?.[0] || "?"}</div>
                              <div className="flex flex-col">
                                <span className="font-bold text-black text-sm">{c.user?.fullName || c.user?.ownerName || "Gourmet"}</span>
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
      {/* Auth Selection Modal */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setAuthModal(null)}>
          <div className="auth-card relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="auth-header">
              <h1 className="auth-title">
                {authModal === 'login' ? 'Welcome Back' : 'Join Zomato'}
              </h1>
              <p className="auth-subtitle">Choose your role to continue</p>
            </div>

            <div className="auth-form">
              <Link
                to={authModal === 'login' ? "/user/login" : "/user/register"}
                className="form-button form-button-primary flex items-center justify-center gap-3 no-underline shadow-none"
              >
                <UserIcon size={20} />
                <span>Continue as User</span>
              </Link>

              <div className="auth-divider">
                <span className="auth-divider-text">OR</span>
              </div>

              <Link
                to={authModal === 'login' ? "/food-partner/login" : "/food-partner/register"}
                className="form-button form-button-primary flex items-center justify-center gap-3 no-underline shadow-none"
                style={{ backgroundColor: '#111' }}
              >
                <ChefHat size={20} />
                <span>Continue as Food-Partner</span>
              </Link>
            </div>

            <div className="auth-footer">
              <p className="auth-footer-text">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
