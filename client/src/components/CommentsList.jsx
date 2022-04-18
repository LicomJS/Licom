/* eslint-disable react/prop-types */
import React, { useState } from "react";
import Comment from "./Comment";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";

const CommentsList = ({ url }) => {
  const comments = useSelector((state) => state.comments);
  const [anchor, setAnchor] = useState(0);
  const { t } = useTranslation();

  return (
    <div className="antialiased mx-auto mt-4">
      {/* max-w-screen-sm */}
      {comments.length > 5 && anchor === 0 && (
        <a
          className="absolute p-1 m-2 dark:bg-white px-2 py-1 text-gray-700 bg-gray-200 rounded-md hover:bg-teal-400 hover:text-white text-teal text-sm"
          style={{ bottom: 0, left: 0 }}
          href="#form"
          onClick={() => setAnchor(1)}
        >
          {t("Add a new comment")}
        </a>
      )}
      <div className="space-y-3">
        {comments.map((comment, key) => (
          <Comment key={key} comment={comment} url={url} />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
