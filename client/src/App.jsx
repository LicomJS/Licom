import React, { useState, useEffect } from "react";
import Comments from "./components/Comments";
import LoginMenu from "./components/LoginMenu";
import RegisterMenu from "./components/RegisterMenu";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { getAuth, deleteAuth } from "./_redux/auth";
import { initUrl } from "./_redux/url";

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const url = useSelector((state) => state.url);
  const [showLanguages, setShowLanguages] = useState(false);
  const [page, setPage] = useState("");

  useEffect(() => {
    dispatch(initUrl());
    dispatch(getAuth());
  }, []);

  return (
    <div>
      <main className="bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden relative">
        <div className="flex items-start justify-between">
          <div className="flex flex-col w-full md:space-y-4">
            <div className="overflow-auto h-screen pb-24 px-4 md:px-6">
              <div className="w-full">
                {auth ? (
                  <>
                    <div className="flex items-start justify-between m-1">
                      <div className="text-gray-800 dark:text-white">
                        <div>
                          {t("Hello")}, {auth.login}!
                        </div>
                      </div>

                      <button
                        className="dark:text-white underline"
                        onClick={() => {
                          if (
                            window.confirm(t("Do you really want to logout?"))
                          ) {
                            dispatch(deleteAuth(""));
                            setPage("");
                          }
                        }}
                      >
                        {t("Logout")}
                      </button>
                    </div>

                    {url && <Comments />}
                  </>
                ) : (
                  <div>
                    <div className="m-5 flex items-center">
                      <button
                        type="button"
                        className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
                        onClick={() => setPage("register")}
                      >
                        {t("Register")}
                      </button>
                      <button
                        type="button"
                        className="w-full border-t border-b border-r text-base font-medium rounded-r-md text-black bg-white hover:bg-gray-100 px-4 py-2"
                        onClick={() => setPage("login")}
                      >
                        {t("Login")}
                      </button>
                    </div>

                    {page === "login" && <LoginMenu t={t} />}
                    {page === "register" && <RegisterMenu t={t} />}

                    {/* <h2 className="bg-blue-200 border border-green-400 text-blue-900 p-3 m-20 text-center rounded">
                      World without comments would b flat
                    </h2> */}
                  </div>
                )}
              </div>

              <span
                className="dark:text-gray-500 cursor-pointer"
                style={{ float: "right" }}
                onClick={() => setShowLanguages((prev) => !prev)}
              >
                Language
              </span>
              {showLanguages && (
                <select
                  style={{ float: "right" }}
                  onChange={(e) => {
                    if (e.target.value !== "none") {
                      i18next
                        .changeLanguage(e.target.value)
                        .then(moment.locale(e.target.value));
                      setShowLanguages(false);
                    }
                  }}
                >
                  <option value="none">-select language-</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="pl">Polski</option>
                  <option value="nl">Nederlands</option>
                  <option value="fr">French</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
