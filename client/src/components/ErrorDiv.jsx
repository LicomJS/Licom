import React from "react";

// eslint-disable-next-line react/prop-types
const ErrorDiv = ({ error }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-3"
      role="alert"
    >
      {/* <strong className="font-bold">Error</strong> */}
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default ErrorDiv;
