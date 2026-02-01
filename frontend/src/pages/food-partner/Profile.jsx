import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Heart, Bookmark, MessageCircle, Send, Pencil, Loader2, X } from "lucide-react";
import Cookies from "js-cookie";

const Profile = () => {
  // Mock data for display
  const stats = {
    totalMeals: 43,
    customerServe: "15K",
  };

  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isUpdatingPfp, setIsUpdatingPfp] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/auth/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner?.foodItems || []);
        setLoading(false);

        // Check if the current user is the owner
        const token = Cookies.get("token");
        if (token && response.data.foodPartner) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Compare IDs as strings to avoid type issues
            if (String(payload.id) === String(response.data.foodPartner._id)) {
              setIsOwner(true);
            }
          } catch (e) {
            console.error("Token parsing error:", e);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const fetchComments = async (foodId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/comments/${foodId}`);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const handleLike = async (e, foodId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/like`,
        { foodId },
        { withCredentials: true }
      );

      const updateState = (items) =>
        items.map((v) =>
          v._id === foodId
            ? {
              ...v,
              isLiked: !v.isLiked,
              likeCount: v.isLiked ? (v.likeCount || 1) - 1 : (v.likeCount || 0) + 1,
            }
            : v
        );

      setVideos(updateState);
      if (selectedVideo && selectedVideo._id === foodId) {
        setSelectedVideo(prev => ({
          ...prev,
          isLiked: !prev.isLiked,
          likeCount: prev.isLiked ? (prev.likeCount || 1) - 1 : (prev.likeCount || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };

  const handleSave = async (e, foodId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/save`,
        { foodId },
        { withCredentials: true }
      );

      const updateState = (items) =>
        items.map((v) =>
          v._id === foodId ? { ...v, isSaved: !v.isSaved } : v
        );

      setVideos(updateState);
      if (selectedVideo && selectedVideo._id === foodId) {
        setSelectedVideo(prev => ({ ...prev, isSaved: !prev.isSaved }));
      }
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/comment`,
        { foodId: selectedVideo._id, text: newComment },
        { withCredentials: true }
      );
      fetchComments(selectedVideo._id);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleOpenComments = (e, video) => {
    e.stopPropagation();
    setSelectedVideo(video);
    setShowComments(true);
    fetchComments(video._id);
  };

  const handlePfpChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    setIsUpdatingPfp(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/food-partner/update-pfp`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setProfile(prev => ({ ...prev, profilePic: response.data.profilePic }));
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    } finally {
      setIsUpdatingPfp(false);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (selectedVideo) {
    return (
      <div className="profile-container video-player-view">
        <button className="back-button" onClick={() => { setSelectedVideo(null); setShowComments(false); }}>
          <span className="back-arrow">←</span> Back to Profile
        </button>
        <div className="player-container">
          <video src={selectedVideo.video} controls autoPlay className="main-video" />

          <div className="shorts-actions">
            <button
              className={`shorts-btn ${selectedVideo.isLiked ? "liked" : ""}`}
              onClick={(e) => handleLike(e, selectedVideo._id)}
            >
              <Heart fill={selectedVideo.isLiked ? "#ff3f6c" : "none"} stroke={selectedVideo.isLiked ? "#ff3f6c" : "currentColor"} />
              <span>{selectedVideo.likeCount || 0}</span>
            </button>

            <button
              className="shorts-btn"
              onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); if (!showComments) fetchComments(selectedVideo._id); }}
            >
              <MessageCircle fill={showComments ? "white" : "none"} />
              <span>{comments.length}</span>
            </button>

            <button
              className={`shorts-btn ${selectedVideo.isSaved ? "saved" : ""}`}
              onClick={(e) => handleSave(e, selectedVideo._id)}
            >
              <Bookmark fill={selectedVideo.isSaved ? "white" : "none"} stroke={selectedVideo.isSaved ? "white" : "currentColor"} />
            </button>
          </div>

          {showComments && (
            <div className="comment-overlay" onClick={() => setShowComments(false)}>
              <div className="comment-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="drawer-header">
                  <h3>Comments</h3>
                  <button onClick={() => setShowComments(false)}>✕</button>
                </div>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map((c, i) => (
                      <div key={i} className="comment-item">
                        <div className="comment-user-avatar">{c.user?.fullName?.[0] || c.user?.ownerName?.[0] || "?"}</div>
                        <div className="comment-content">
                          <span className="comment-username">{c.user?.fullName || c.user?.ownerName || "User"}</span>
                          <p className="comment-text">{c.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet. Be the first!</p>
                  )}
                </div>
                <form className="comment-input-area" onSubmit={handleAddComment}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit">
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          )}

          <h1 className="video-title">{selectedVideo.name}</h1>
          <p className="video-description">{selectedVideo.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Link to="/" className="close-profile-btn" title="Go to Home">
        <X size={24} />
      </Link>
      <div className="profile-header">
        <div className="relative w-fit">
          <div className="profile-avatar overflow-hidden relative border-4 border-[#ff3f6c]/20">
            {profile?.profilePic ? (
              <img
                src={profile.profilePic}
                alt={profile.restaurantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#ff3f6c] flex items-center justify-center text-white text-4xl font-black">
                {profile?.restaurantName?.[0] || "?"}
              </div>
            )}

            {isUpdatingPfp && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                <Loader2 className="animate-spin text-white" size={32} />
              </div>
            )}
          </div>

          {isOwner && (
            <div className="absolute bottom-1 right-1 z-30">
              <label
                htmlFor="pfp-upload"
                className="flex items-center justify-center w-10 h-10 bg-[#ff3f6c] rounded-full cursor-pointer hover:bg-[#e0355f] transition-all shadow-xl border-2 border-white hover:scale-110 active:scale-95"
                title="Change Profile Picture"
              >
                <Pencil size={18} className="text-white" />
              </label>
              <input
                id="pfp-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePfpChange}
                disabled={isUpdatingPfp}
              />
            </div>
          )}
        </div>
        <div className="profile-info">
          <div className="info-box font-bold"><strong></strong> {profile?.restaurantName || "N/A"}</div>
          <div className="info-box"><strong>Address:</strong> {profile?.restaurantAddress || "N/A"}</div>
        </div>
        {isOwner && (
          <Link to="/create-food" className="add-food-btn">
            + Add Food
          </Link>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-label">total meals</span>
          <span className="stat-value">{stats.totalMeals}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">customer serve</span>
          <span className="stat-value">{stats.customerServe}</span>
        </div>
      </div>

      <div className="divider"></div>

      <h2 className="section-title">Menu</h2>
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map((item, index) => (
            <div key={index} className="video-card">
              <div className="thumbnail-wrapper" onClick={() => setSelectedVideo(item)}>
                <video src={item.video} className="thumbnail-preview" muted />
              </div>
              <div className="video-info">
                <div className="video-header">
                  <h3 className="video-name" onClick={() => setSelectedVideo(item)}>{item.name}</h3>
                  <div className="card-actions">
                    <button
                      className={`icon-btn ${item.isLiked ? "liked" : ""}`}
                      onClick={(e) => handleLike(e, item._id)}
                    >
                      <Heart size={20} fill={item.isLiked ? "#ff3f6c" : "none"} stroke={item.isLiked ? "#ff3f6c" : "currentColor"} />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={(e) => handleOpenComments(e, item)}
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button
                      className={`icon-btn ${item.isSaved ? "saved" : ""}`}
                      onClick={(e) => handleSave(e, item._id)}
                    >
                      <Bookmark size={20} fill={item.isSaved ? "var(--text-primary)" : "none"} stroke="var(--text-primary)" />
                    </button>
                  </div>
                </div>
                <p className="video-desc-short" onClick={() => setSelectedVideo(item)}>
                  {item.description?.substring(0, 60)}...
                </p>
                <div className="video-meta">
                  <span className="like-count">{item.likeCount || 0} likes</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
