import React, { useRef, useState } from "react";
import { generateKey, signMessage } from "ed25519-keys";
import axios from "axios";
import LoadingBtn from "./LoadingBtn";
import { ClientJS } from "clientjs";
import ErrorDiv from "./ErrorDiv";

import { useDispatch } from "react-redux";
import { setAuth } from "./../_actions";

// eslint-disable-next-line react/prop-types
const RegisterMenu = ({ t }) => {
  const dispatch = useDispatch();
  const [login, setLogin] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checkLogin, setCheckLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registerKey, setRegisterKey] = useState("");
  const loginRef = useRef();

  const client = new ClientJS();
  const fingerprint = client.getFingerprint();

  const checkApiLogin = (login) => {
    setLoading(true);
    axios({
      method: "post",
      url: process.env.REACT_APP_API_SERVER + "/api/checklogin",
      data: {
        login,
        hash: fingerprint,
      },
    }).then((res) => {
      if (res.data.status) {
        setLoading(false);
        setCheckLogin(true);
        setError("");
        setRegisterKey(res.data.rk);
      } else {
        setLoading(false);
        setCheckLogin(false);
        setError(res.data.error);
      }
    });
  };

  const registerApi = () => {
    setLoading(true);
    signMessage(login, key.privateKey).then((signature) => {
      axios({
        method: "post",
        url: process.env.REACT_APP_API_SERVER + "/api/register",
        data: {
          login,
          signature,
          publicKey: key.publicKey,
          hash: fingerprint,
          rk: registerKey,
        },
      }).then((res) => {
        if (res.data.authKey) {
          const l = {
            login,
            authKey: res.data.authKey,
            publicKey: key.publicKey,
            privateKey: key.privateKey,
          };

          setLoading(false);
          dispatch(setAuth(l));
          setError("");
        } else {
          setLoading(false);
          setError(t("Error. Signature not match. Please try again."));
        }
      });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        <div>{t("Register")}</div>
      </h2>

      {!login && (
        <>
          <input
            type="text"
            className="mt-5 rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder={t("Your login name")}
            ref={loginRef}
            onChange={() => {
              setCheckLogin(false);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                if (checkLogin) {
                  setLogin(loginRef.current.value);
                }

                checkApiLogin(loginRef.current.value);
              }
            }}
          />

          <button
            className="mt-5 py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            onClick={() => {
              if (checkLogin) {
                setLogin(loginRef.current.value);
              }

              checkApiLogin(loginRef.current.value);
            }}
          >
            {loading ? (
              <LoadingBtn />
            ) : (
              <>{checkLogin ? t("Next") : t("Check login")}</>
            )}
          </button>

          {error && <ErrorDiv error={error} />}
        </>
      )}

      {login && !key && (
        <div>
          <button
            className="mt-5 py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            onClick={() => {
              generateKey(32).then((key) => {
                setKey(key);
              });
            }}
          >
            {t("Get my key")}
          </button>
        </div>
      )}

      {key && (
        <>
          <div className="mt-5 bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t("Save now your")}{" "}
                <strong>
                  <em>{t("private key")}</em>
                </strong>{" "}
                {t("in a safe place, or print it!")}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {t(
                  "The private key will never be sent to the server, it will only be stored on your device and used to sign messages."
                )}
              </p>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {t(
                  "Save now your private key, you will never see it again, and without private key you will never be able to log in."
                )}
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                {/* <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t("Public key")}:
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {key.publicKey}
                  </dd>
                </div> */}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    {t("Private Key")}:
                  </dt>
                  <dd
                    style={{ lineBreak: "anywhere" }}
                    className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                  >
                    {key.privateKey}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div>
            <button
              className="mt-5 py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              onClick={() => {
                let cpk = prompt(t("Confirm your private key"));
                if (cpk === key.privateKey) {
                  registerApi();
                } else {
                  alert(t("Save your private key and confirm."));
                }
              }}
            >
              {loading ? <LoadingBtn /> : <>{t("Register me")}</>}
            </button>
          </div>

          {error && <ErrorDiv error={error} />}
        </>
      )}
    </div>
  );
};

export default RegisterMenu;
