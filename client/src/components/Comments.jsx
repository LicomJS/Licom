/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import { signMessage } from "ed25519-keys";
import moment from "moment";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const Comments = ({ url, auth }) => {
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const msgRef = useRef();
  const loaded = useRef(false);

  const postComment = () => {
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
      <div className="inline-flex items-center bg-white leading-none ${props.textColor} rounded-full p-2 shadow text-teal text-sm">
        <span className="inline-flex bg-gray-700 text-white rounded-full h-6 px-3 justify-center items-center">
          Page
        </span>
        <span className="inline-flex px-2 text-gray-700">{url}</span>/ {count}{" "}
        comments
      </div>

      {loading && (
        <div className="px-4 py-5 border-b rounded-t sm:px-6">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="inline-flex items-center bg-white leading-none  rounded-full p-2 shadow text-teal text-sm">
              <span className="inline-flex px-2 text-gray-700">Loading...</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-5 border-b rounded-t sm:px-6">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {comments.map((c, key) => (
              <li
                key={key}
                style={{
                  opacity: c.deleted === 1 ? 0.2 : 1,
                }}
              >
                <a className="block hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-md text-gray-700 dark:text-white md:truncate">
                        {c.deleted === 1 ? (
                          <em>Comment deleted by author</em>
                        ) : (
                          <span>{c.comment}</span>
                        )}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p>
                          {c.userLogin === auth.login && c.deleted !== 1 && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Do you really want to delete?"
                                  )
                                ) {
                                  axios({
                                    method: "delete",
                                    url:
                                      process.env.REACT_APP_API_SERVER +
                                      "/api/comment",
                                    data: {
                                      id: c.id,
                                      authKey: auth.authKey,
                                    },
                                  }).then((res) => {
                                    if (res.data.success) {
                                      setComments(
                                        comments.map((x) =>
                                          x.id === res.data.id
                                            ? { ...x, deleted: 1 }
                                            : x
                                        )
                                      );
                                    } else {
                                      setError(res.data.error);
                                    }
                                  });
                                }
                              }}
                            >
                              delete
                            </button>
                          )}
                        </p>

                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {c.userLogin}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-md font-light text-gray-500 dark:text-gray-300">
                          {moment(c.time).fromNow()}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex w-full max-w-sm space-x-3">
        <div className="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="mb-6 text-3xl font-light text-center text-gray-800 dark:text-white">
            Add new comment
          </div>

          {error && (
            <div className="inline-flex items-center bg-white leading-none ${props.textColor} rounded-full p-2 shadow text-teal text-sm">
              <span className="inline-flex bg-pink-600 text-white rounded-full h-6 px-3 justify-center items-center">
                Error
              </span>
              <span className="inline-flex px-2 text-pink-600">{error} </span>
            </div>
          )}

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
                ></textarea>
              </label>
            </div>
            <div className="col-span-2 text-right">
              <button
                type="submit"
                className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                onClick={postComment}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
