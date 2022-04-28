/* eslint-disable react/prop-types */
import React, { useState, useRef } from "react";
import ErrorDiv from "./ErrorDiv";
import axios from "axios";
import { signMessage } from "ed25519-keys";
import { useTranslation } from "react-i18next";
import CloseBtn from "./CloseBtn";

import { useSelector, useDispatch } from "react-redux";
import { addCount } from "./../_redux/count";
import {
  addComment,
  addSubComment,
  editComment,
  editSubComment,
} from "./../_redux/comments";

const CommentForm = ({ setOpenForm, url, parent_id, comment, type = "" }) => {
  const [commentLength, setCommentLength] = useState(0);
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const msgRef = useRef();

  const postComment = () => {
    if (!msgRef.current.value) return;

    const API_URL =
      process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_API_LOCAL_SERVER
        : process.env.REACT_APP_API_SERVER;

    signMessage(msgRef.current.value, auth.privateKey).then((signature) => {
      axios({
        method: type === "edit" ? "patch" : "post",
        url: API_URL + `/api/${type === "edit" ? "edit" : "comment"}`,
        data: {
          authKey: auth.authKey,
          url,
          comment: msgRef.current.value,
          signature,
          parent_id,
          id: comment ? comment.id : undefined,
        },
      }).then((res) => {
        if (res.data.meta) {
          if (res.data.meta.parent_id !== null) {
            dispatch(addSubComment(res.data.meta));
          } else {
            dispatch(addComment(res.data.meta));
          }

          dispatch(addCount(1));
          setError("");
        }

        if (res.data.edit) {
          if (res.data.edit.parent_id !== null) {
            dispatch(editSubComment(res.data.edit));
          } else {
            dispatch(editComment(res.data.edit));
          }

          setError("");
        }

        if (res.data.error) {
          setError(res.data.error);
        } else {
          msgRef.current.value = "";
          setCommentLength(0);
          setOpenForm && setOpenForm(0);
        }
      });
    });
  };

  return (
    <div className="flex mx-auto items-center justify-center dark:shadow-none shadow-lg relative">
      {(type === "edit" || type === "reply") && (
        <div
          className="absolute dark:text-gray-300 text-gray-500"
          style={{ top: 1, right: 1, cursor: "pointer" }}
          onClick={() => setOpenForm(0)}
        >
          <CloseBtn />
        </div>
      )}
      <div id="form"></div>
      <div className="w-full mt-3 dark:bg-transparent bg-white rounded-lg px-4 pt-2">
        <div className="flex flex-wrap -mx-3 mb-6">
          <h2 className="px-4 pt-3 pb-2 dark:text-gray-100 text-gray-800 text-lg">
            {type === "reply"
              ? t("Add a new reply")
              : type === "edit"
              ? t("Edit your comment")
              : t("Add a new comment")}
          </h2>
          <div className="w-full md:w-full px-3 mb-2 mt-2">
            <textarea
              ref={msgRef}
              className="dark:bg-gray-400 bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium dark:placeholder-gray-500 placeholder-gray-700 focus:outline-none focus:bg-white"
              placeholder={t("Type Your Comment")}
              required
              defaultValue={type === "edit" ? comment.comment : null}
              maxLength={3000}
              onChange={(e) => {
                setCommentLength(e.target.value.length);
              }}
            ></textarea>
          </div>

          <div className="w-full md:w-full flex items-start md:w-full px-3">
            <div className="flex items-start w-1/2 dark:text-gray-200 text-gray-700 px-2 mr-auto">
              <svg
                fill="none"
                className="w-5 h-5 dark:text-gray-200 text-gray-600 mr-1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs md:text-sm pt-px">
                {t("remaining")} {3000 - commentLength} {t("characters")}
              </p>
            </div>
            <div className="-mr-1">
              <button
                disabled={commentLength > 3000 ? true : false}
                className="dark:bg-blue-600 dark:text-white dark:border-blue-700 bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 dark:bg-blue-600"
                onClick={postComment}
              >
                {type === "reply"
                  ? t("Post Reply")
                  : type === "edit"
                  ? t("Save Comment")
                  : t("Post Comment")}
              </button>
            </div>
          </div>
        </div>
        {error && <ErrorDiv error={error} />}
      </div>
    </div>
  );
};

export default CommentForm;
