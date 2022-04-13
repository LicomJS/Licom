import React from "react";

// eslint-disable-next-line react/prop-types
const ErrorDiv = ({ error }) => {
  return (
    <div
      style={{ margin: 10 }}
      className="inline-flex items-center bg-white leading-none rounded-full p-2 shadow text-teal text-sm"
    >
      <span className="inline-flex px-2 text-pink-600">{error}</span>
    </div>
  );
};

export default ErrorDiv;
