import React, { useContext, useMemo } from "react";
import { UploadsContext } from "../../Store/UploadsContext";
import { BookmarksContext } from "../../Store/BookmarksContext";
import "./Stat.css";
import { FaRegImage, FaHeart, FaBookmark, FaEye, FaBolt } from "react-icons/fa";

const StatsCards = () => {
  const { uploads } = useContext(UploadsContext);
  const { bookmarks } = useContext(BookmarksContext);

  // Compute totals
  const { totalLikes, totalViews } = useMemo(() => {
    return uploads.reduce(
      (acc, upload) => {
        acc.totalLikes += upload.likes || 0;
        acc.totalViews += upload.views || 0;
        return acc;
      },
      { totalLikes: 0, totalViews: 0 }
    );
  }, [uploads]);

 

  const stats = [
  {
    title: "Total Uploads",
    value: uploads.length,
    icon: <FaRegImage />,
    color: "#0ea5e9",
  },
  {
    title: "Total Likes",
    value: totalLikes,
    icon: <FaHeart />,
    color: "#ef4444",
  },
  {
    title: " Bookmarks",
    value: bookmarks.length,
    icon: <FaBookmark />,
    color: "#f43f5e",
  },
  {
    title: "Total Views",
    value: totalViews,
    icon: <FaEye />,
    color: "#4f46e5",
  },
  
];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="stats-card"
          style={{
            borderTop: `4px solid ${stat.color}`,
            backgroundColor: "#fff",
          }}
        >
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