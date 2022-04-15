/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import ErrorDiv from "./ErrorDiv";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Comment = ({ c, comments, setComments, auth, url, setCount }) => {
  const [error, setError] = useState("");
  const [reply, setReply] = useState(0);
  const { t } = useTranslation();

  const deleteCommentApi = (c) => {
    if (window.confirm(t("Do you really want to delete this comment?"))) {
      axios({
        method: "delete",
        url: process.env.REACT_APP_API_SERVER + "/api/comment",
        data: {
          id: c.id,
          authKey: auth.authKey,
        },
      }).then((res) => {
        if (res.data.success) {
          setComments(
            comments.map((x) =>
              x.id === res.data.id ? { ...x, deleted: 1 } : x
            )
          );
        } else {
          setError({ id: c.id, error: res.data.error });
        }
      });
    }
  };
  //
  const voteApi = (id, vote) => {
    axios({
      method: "post",
      url: process.env.REACT_APP_API_SERVER + "/api/vote",
      data: {
        authKey: auth.authKey,
        id,
        vote,
      },
    }).then((res) => {
      if (res.data.success) {
        setComments(
          comments.map((x) =>
            x.id === res.data.success.id
              ? {
                  ...x,
                  votesUp: res.data.success.votesUp,
                  votesDown: res.data.success.votesDown,
                }
              : x
          )
        );
        setError("");
      } else {
        setError({ id, error: res.data.error });
      }
    });
  };

  return (
    <div
      className="flex"
      style={{
        opacity: c.deleted === 1 ? 0.2 : 1,
        wordWrap: "break-word",
        lineBreak: "anywhere",
      }}
    >
      <div className="flex flex-col items-center justify-between mr-0 w-8 dark:text-gray-400">
        <button
          onClick={() => {
            voteApi(c.id, 1);
          }}
        >
          +
        </button>
        <span
          title={`${t("Votes up")}: ${c.votesUp} / ${t("Votes down")}: ${
            c.votesDown
          }`}
        >
          {c.votesUp - c.votesDown}
        </span>
        <button
          onClick={() => {
            voteApi(c.id, 0);
          }}
        >
          -
        </button>
      </div>
      <div className="flex-1 border rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed bg-white dark:bg-gray-400">
        <div className="flex items-center justify-between">
          <strong>{c.userLogin}</strong>
          <span title={c.time} className="text-xs dark:text-gray-600">
            {/* {moment(c.time).locale("pl").fromNow()} */}
            {moment(c.time).fromNow()}
          </span>
          {/* <p className="ml-2 flex-shrink-0 flex">sdf</p> */}
          {c.userLogin === auth.login && c.deleted !== 1 && (
            <button
              className="text-xs dark:text-gray-500"
              onClick={() => deleteCommentApi(c)}
            >
              {t("delete")}
            </button>
          )}
        </div>
        <p className="text-sm">
          {c.deleted === 1 ? (
            <em>{t("Comment deleted by author")}</em>
          ) : (
            <span>{c.comment}</span>
          )}
        </p>
        {/* <div className="mt-4 flex items-center">
    dfg
    <div className="text-sm text-gray-500 font-semibold">
      5 Replies
    </div>
  </div> */}

        {(c.Children || []).map((comment, key) => (
          <Comment
            key={`${comment.id}-${key}`}
            c={comment}
            auth={auth}
            setComments={setComments}
            url={url}
            setCount={setCount}
            comments={comments}
          />
        ))}

        {c.deleted !== 1 && (
          <button
            onClick={() => {
              setReply((prev) => (prev !== c.id ? c.id : 0));
            }}
          >
            Reply
          </button>
        )}

        {reply === c.id && (
          <CommentForm
            auth={auth}
            setComments={setComments}
            url={url}
            t={t}
            setCount={setCount}
            parent_id={c.id}
          />
        )}

        {error && error.id === c.id && <ErrorDiv error={error.error} />}
      </div>
    </div>
  );
};

export default Comment;
