/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { signMessage } from "ed25519-keys";
import axios from "axios";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const Comments = ({ url, auth }) => {
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentLength, setCommentLength] = useState(0);
  const msgRef = useRef();
  const loaded = useRef(false);
  const { t } = useTranslation();

  const postComment = () => {
    if (!msgRef.current.value) return;

    signMessage(msgRef.current.value, auth.privateKey).then((signature) => {
      axios({
        method: "post",
        url: process.env.REACT_APP_API_SERVER + "/api/comment",
        data: {
          authKey: auth.authKey,
          url,
          comment: msgRef.current.value,
          signature,
        },
      }).then((res) => {
        if (res.data.meta) {
          setComments((prev) => [...prev, res.data.meta]);
          msgRef.current.value = "";
          setCount((prev) => prev + 1);
          setError("");
          setCommentLength(0);
        } else {
          setError(res.data.error);
        }
      });
    });
  };

  useEffect(() => {
    if (loaded.current === false) {
      setLoading(true);
      axios({
        method: "post",
        url: process.env.REACT_APP_API_SERVER + "/api/getcomments",
        data: {
          url,
          authKey: auth.authKey,
        },
      }).then((res) => {
        setLoading(false);

        if (res.data.meta) {
          setComments(res.data.meta);
          setCount(res.data.page.count);
          setError("");
        } else {
          setError(res.data.error);
        }
      });

      loaded.current = true;
    }
  }, []);

  return (
    <div>
      <div className="mt-5 ml-8 inline-flex items-center bg-white leading-none rounded-full p-1 shadow text-teal text-sm">
        <span className="inline-flex bg-gray-700 text-white rounded-full h-6 px-3 justify-center items-center">
          {t("Page")}
        </span>
        {/* <span className="inline-flex px-2 text-gray-700">{url}</span> */}
        <span className="inline-flex px-2 text-gray-700">
          {count} {t("comments")}
        </span>
      </div>

      {loading && (
        <div className="px-4 py-5 border-b rounded-t sm:px-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="inline-flex items-center bg-white leading-none  rounded-full p-2 shadow text-teal text-sm">
              <span className="inline-flex px-2 text-gray-700">
                {t("Loading...")}
              </span>
            </div>
          </div>
        </div>
      )}

      <CommentsList
        comments={comments}
        auth={auth}
        setComments={setComments}
        t={t}
      />

      <CommentForm
        msgRef={msgRef}
        setCommentLength={setCommentLength}
        commentLength={commentLength}
        postComment={postComment}
        error={error}
        t={t}
      />
    </div>
  );
};

export default Comments;
