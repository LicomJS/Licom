import React, { useState } from "react";
import Comments from "./components/Comments";
import LoginMenu from "./components/LoginMenu";
import RegisterMenu from "./components/RegisterMenu";
import { useTranslation } from "react-i18next";

const App = () => {
  const [auth, setAuth] = useState();
  const [page, setPage] = useState("");
  const { t } = useTranslation();

  const query = new URLSearchParams(window.location.search);
  const url = query.get("url");

  if (!auth) {
    const l = JSON.parse(localStorage.getItem("licom"));
    if (l && l.login && l.authKey && l.publicKey && l.privateKey) {
      setAuth(l);
    }
  }

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
                            localStorage.removeItem("licom");
                            setAuth("");
                            setPage("");
                          }
                        }}
                      >
                        {t("Logout")}
                      </button>
                    </div>

                    {url && <Comments url={url} auth={auth} />}
                  </>
                ) : (
                  <div>
                    <div style={{ margin: 20 }} className="flex items-center">
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

                    {page === "login" && <LoginMenu setAuth={setAuth} t={t} />}
                    {page === "register" && (
                      <RegisterMenu setAuth={setAuth} t={t} />
                    )}
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
