import React, { useState } from "react";
import Comments from "./components/Comments";
import LoginMenu from "./components/LoginMenu";
import RegisterMenu from "./components/RegisterMenu";
import { useTranslation } from "react-i18next";

import { useSelector, useDispatch } from "react-redux";
import { deleteAuth } from "./_actions";
import i18next from "i18next";
import moment from "moment";

const App = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [page, setPage] = useState("");

  const query = new URLSearchParams(window.location.search);
  const url = query.get("url");

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

                      <select
                        onChange={(e) => {
                          i18next
                            .changeLanguage(e.target.value)
                            .then(moment.locale(e.target.value));
                        }}
                      >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="pl">Polski</option>
                        <option value="nl">Nederlands</option>
                      </select>

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

                    {url && <Comments url={url} />}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
