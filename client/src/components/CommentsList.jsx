/* eslint-disable react/prop-types */
import React from "react";
import Comment from "./Comment";

import { useSelector } from "react-redux";

const CommentsList = ({ url }) => {
  const comments = useSelector((state) => state.comments);

  return (
    <div className="antialiased mx-auto mt-4">
      {/* max-w-screen-sm */}
      <div className="space-y-3">
        {comments.map((comment, key) => (
          <Comment key={key} comment={comment} url={url} />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
