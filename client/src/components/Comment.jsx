/* eslint-disable react/prop-types */
import React, { useState } from "react";
import CommentForm from "./CommentForm";
import ErrorDiv from "./ErrorDiv";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Ellipsis, EllipsisMode } from "react-simple-ellipsis";
import Linkify from "react-linkify";

import { useSelector, useDispatch } from "react-redux";
import {
  deleteComment,
  voteComment,
  voteSubComment,
  deleteSubComment,
} from "./../_actions";

const Comment = ({ comment, url, type = "" }) => {
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(0);
  const { t } = useTranslation();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const API_URL =
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_API_LOCAL_SERVER
      : process.env.REACT_APP_API_SERVER;

  const deleteCommentApi = (comment) => {
    if (window.confirm(t("Do you really want to delete this comment?"))) {
      axios({
        method: "delete",
        url: API_URL + "/api/comment",
        data: {
          id: comment.id,
          authKey: auth.authKey,
        },
      }).then((res) => {
        if (res.data.success) {
          if (res.data.parent_id !== null) {
            dispatch(deleteSubComment(res.data));
          } else {
            dispatch(deleteComment(res.data.id));
          }
        } else {
          setError({ id: comment.id, error: res.data.error });
        }
      });
    }
  };
  //
  const voteApi = (id, vote) => {
    axios({
      method: "post",
      url: API_URL + "/api/vote",
      data: {
        authKey: auth.authKey,
        id,
        vote,
      },
    }).then((res) => {
      if (res.data.success) {
        if (res.data.parent_id !== null) {
          dispatch(voteSubComment(res.data));
        } else {
          dispatch(voteComment(res.data));
        }

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
        opacity: comment.deleted === 1 ? 0.2 : 1,
        wordWrap: "break-word",
        lineBreak: "anywhere",
      }}
    >
      <div className="flex-shrink-0 mr-3">
        <div className="flex flex-col items-center justify-between mt-1 rounded-full w-8 h-8 dark:text-gray-500">
          <button
            onClick={() => {
              voteApi(comment.id, 1);
            }}
          >
            {(comment.votes && comment?.votes[0]?.voteType === 1) ||
            (comment.Children &&
              comment.Children.votes &&
              comment?.Children?.votes[0]?.voteType === 1) ? (
              <span style={{ color: "orange" }}>+</span>
            ) : (
              <span>+</span>
            )}
          </button>
          <span
            title={`${t("Votes up")}: ${comment.votesUp} / ${t(
              "Votes down"
            )}: ${comment.votesDown}`}
          >
            {comment.votesUp - comment.votesDown}
          </span>
          <button
            onClick={() => {
              voteApi(comment.id, 0);
            }}
          >
            {(comment.votes && comment?.votes[0]?.voteType === 0) ||
            (comment.Children &&
              comment.Children.votes &&
              comment?.Children?.votes[0]?.voteType === 0) ? (
              <span style={{ color: "orange" }}>-</span>
            ) : (
              <span>-</span>
            )}
          </button>
        </div>
      </div>
      <div
        className={`flex-1 rounded-lg px-2 py-2 leading-relaxed ${
          type === "child"
            ? "dark:bg-white bg-gray-100"
            : "dark:bg-gray-400 bg-white border"
        }`}
      >
        <strong>{comment.userLogin}</strong>
        <span title={comment.time} className="ml-1 text-xs dark:text-gray-600">
          {moment(comment.time).fromNow()}
        </span>
        <p className="text-sm comment">
          {comment.deleted === 1 ? (
            <em>{t("Comment deleted by author")}</em>
          ) : (
            <>
              {comment.comment && (
                <Ellipsis
                  ellipsis="..."
                  label={t("Show more")}
                  id={comment.id}
                  text={<Linkify>{comment.comment}</Linkify>}
                  limit={200}
                  mode={EllipsisMode.InPlace}
                  class="pl-2 underline font-size-lg cursor-pointer"
                />
              )}
            </>
          )}
        </p>
        <div
          className={`mt-1 flex items-center ${type !== "child" ? "mb-1" : ""}`}
        >
          <div className="flex text-sm text-gray-600 font-semibold">
            {comment.deleted !== 1 && type !== "child" && !openForm.type && (
              <button
                className="mr-2 text-xs"
                onClick={() =>
                  setOpenForm((prev) =>
                    !prev || prev.comment.id !== comment.id
                      ? { comment, type: "reply" }
                      : 0
                  )
                }
              >
                {t("reply")}
              </button>
            )}
            {comment.userLogin === auth.login &&
              comment.deleted !== 1 &&
              !openForm.type && (
                <>
                  <button
                    className="mr-2 text-xs"
                    onClick={() =>
                      setOpenForm((prev) =>
                        !prev || prev.comment.id !== comment.id
                          ? { comment, type: "edit" }
                          : 0
                      )
                    }
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="text-xs"
                    onClick={() => deleteCommentApi(comment)}
                  >
                    {t("delete")}
                  </button>
                </>
              )}
          </div>

          {openForm && openForm.comment.id === comment.id ? (
            <div className="dark:bg-gray-800 rounded-lg m-5">
              <CommentForm
                setOpenForm={setOpenForm}
                url={url}
                t={t}
                parent_id={comment.id}
                type={openForm.type}
                comment={comment}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        {error && error.id === comment.id && <ErrorDiv error={error.error} />}
        <div className="space-y-4">
          {(comment.Children || []).map((comment, key) => (
            <Comment
              key={`${comment.id}-${key}`}
              comment={comment}
              url={url}
              type="child"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comment;
