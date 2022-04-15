/* eslint-disable react/prop-types */
import React from "react";
import Comment from "./Comment";

const CommentsList = ({ comments, auth, setComments, setCount, url }) => {
  return (
    <div className="antialiased mx-auto mt-4">
      {/* max-w-screen-sm */}
      <div className="space-y-3">
        {comments.map((c, key) => (
          <div key={key}>
            <Comment
              c={c}
              comments={comments}
              setComments={setComments}
              auth={auth}
              url={url}
              setCount={setCount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
