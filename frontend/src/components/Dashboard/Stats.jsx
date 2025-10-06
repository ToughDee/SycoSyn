import React, { useContext, useMemo } from "react";
import { UploadsContext } from "../../Store/UploadsContext";
import { BookmarksContext } from "../../Store/BookmarksContext";
import "./Stat.css";

const StatsCards = () => {
  const { uploads } = useContext(UploadsContext);
  const { bookmarks } = useContext(BookmarksContext);

  // Compute total likes from uploads
  const totalLikes = useMemo(() => {
    return uploads.reduce((sum, upload) => sum + (upload.likes || 0), 0);
  }, [uploads]);

  const stats = [
    {
      title: "Total Uploads",
      value: uploads.length,
      icon: "🖼️",
      color: "#0ea5e9",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      icon: "❤️",
      color: "#ef4444",
    },
    {
      title: "Bookmarks",
      value: bookmarks.length,
      icon: "🔖",
      color: "#f43f5e",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stats-card">
          <div className="stats-header">
            <span className="stats-title">{stat.title}</span>
            <span className="stats-icon" style={{ color: stat.color }}>
              {stat.icon}
            </span>
          </div>
          <div className="stats-value">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;