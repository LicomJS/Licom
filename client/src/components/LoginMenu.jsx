import React, { useRef, useState } from "react";
import { signMessage, privateToPublic } from "ed25519-keys";
import axios from "axios";
import ErrorDiv from "./ErrorDiv";

import { useDispatch } from "react-redux";
import { setAuth } from "./../_actions";

// eslint-disable-next-line react/prop-types
const LoginMenu = ({ t }) => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const keyRef = useRef();

  const loginApi = () => {
    if (!keyRef.current.value) return;

    const signIt = "licom";
    privateToPublic(keyRef.current.value).then((publicKey) => {
      signMessage(signIt, keyRef.current.value).then((signature) => {
        axios({
          method: "post",
          url: process.env.REACT_APP_API_SERVER + "/api/login",
          data: {
            sign: signIt,
            signature,
            publicKey,
          },
        }).then((res) => {
          if (res.data.authKey) {
            const l = {
              login: res.data.login,
              authKey: res.data.authKey,
              publicKey: res.data.publicKey,
              privateKey: keyRef.current.value,
            };
            dispatch(setAuth(l));
            setError("");
          } else {
            setError(res.data.error);
          }
        });
      });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        <div>{t("Login")}</div>
      </h2>

      <div>
        <div>
          <input
            type="text"
            id="rounded-email"
            className="mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder={t("Your PRIVATE key")}
            ref={keyRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") loginApi();
            }}
          />
        </div>

        <div className="mt-3 inline-flex items-center bg-white leading-none rounded-full p-2 shadow text-teal text-sm">
          <span className="inline-flex px-2 text-pink-600">
            {t(
              "The private key will never be sent to the server, it will only be stored on your device and used to sign messages."
            )}
          </span>
        </div>
        <div>
          <button
            className="mt-5 py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            onClick={loginApi}
          >
            {t("Login")}
          </button>

          {error && <ErrorDiv error={error} />}
        </div>
      </div>
    </div>
  );
};

export default LoginMenu;
