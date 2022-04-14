/* eslint-disable react/prop-types */
import React from "react";
import ErrorDiv from "./ErrorDiv";

const CommentForm = ({
  commentLength,
  msgRef,
  setCommentLength,
  postComment,
  error,
}) => {
  return (
    <div className="flex mx-auto items-center justify-center shadow-lg mt-5 mx-5 mb-4 max-w-lg">
      <div className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
        <div className="flex flex-wrap -mx-3 mb-6">
          <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">
            Add a new comment
          </h2>
          <div className="w-full md:w-full px-3 mb-2 mt-2">
            <textarea
              ref={msgRef}
              className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
              placeholder="Type Your Comment"
              required
              maxLength={3000}
              onChange={(e) => {
                setCommentLength(e.target.value.length);
              }}
            ></textarea>
          </div>

          <div className="w-full md:w-full flex items-start md:w-full px-3">
            <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
              <svg
                fill="none"
                className="w-5 h-5 text-gray-600 mr-1"
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
                Characters {3000 - commentLength} remaining
              </p>
            </div>
            <div className="-mr-1">
              <button
                disabled={commentLength > 3000 ? true : false}
                className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                onClick={postComment}
              >
                Post Comment
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

{
  /* <div className="flex w-full max-w-sm space-x-3">
        <div className="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="mb-6 text-3xl font-light text-center text-gray-800 dark:text-white">
            Add new comment
          </div>

          {error && <ErrorDiv error={error} />}

          <div className="grid max-w-xl grid-cols-2 gap-4 m-auto">
            <div className="col-span-2">
              <label className="text-gray-700" htmlFor="name">
                <textarea
                  ref={msgRef}
                  className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  id="comment"
                  placeholder="Enter your comment"
                  name="comment"
                  rows="5"
                  cols="40"
                  maxLength={3000}
                  onChange={(e) => {
                    setCommentLength(e.target.value.length);
                  }}
                ></textarea>
                <small className="dark:text-white">
                  <em>Characters {3000 - commentLength} remaining</em>
                </small>
              </label>
            </div>
            <div className="col-span-2 text-right">
              <button
                disabled={commentLength > 3000 ? true : false}
                type="submit"
                className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                onClick={postComment}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div> */
}
