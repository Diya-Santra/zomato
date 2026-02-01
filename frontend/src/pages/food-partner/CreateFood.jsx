import React, { useState } from "react";
import "./CreateFood.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !video) {
      setMessage("Please provide a name and a video file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("video", video);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/foodItem/create`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Food item created successfully!");
      setLoading(false);
      // Redirect to profile or clear form
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to create food item.");
      setLoading(false);
    }
  };

  return (
    <div className="create-food-container">
      <div className="form-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="form-title">Create New Food Entry</h1>
        <p className="form-subtitle">Share your culinary creations with the world</p>

        <form onSubmit={handleSubmit} className="food-form">
          <div className="input-group">
            <label htmlFor="name">Dish Name</label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Delicious Butter Chicken"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Tell us about this dish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>

          <div className="input-group">
            <label htmlFor="video">Food Video</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleFileChange}
              required
              className="file-input"
            />
            <small>Select a short video of the prepared dish</small>
          </div>

          {message && (
            <div className={`message ${message.includes("success") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Publish Food Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
