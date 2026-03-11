import React from "react";
import "./ScrollContainer.css";

const ScrollContainer = ({
  children,
  className = "",
  customHeight = 400,
  vertical = true,
  horizontal = false,
}) => {
  return (
    <div
      className={`custom-scroll-container ${className}`}
      style={{
        height: `calc(100vh - ${customHeight}px)`,
        overflowY: vertical ? "auto" : "hidden",
        overflowX: horizontal ? "auto" : "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default ScrollContainer;
