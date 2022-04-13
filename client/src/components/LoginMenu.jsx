import React, { useRef, useState } from "react";
import { signMessage, privateToPublic } from "ed25519-keys";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const LoginMenu = ({ setAuth }) => {
  const [error, setError] = useState("");
  const keyRef = useRef();

  const loginApi = () => {
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
            localStorage.setItem("licom", JSON.stringify(l));
            setAuth(l);
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
        <div>Login</div>
      </h2>

      <div>
        <div style={{ margin: 10 }}>
          <input
            type="text"
            id="rounded-email"
            className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Your PRIVATE key"
            ref={keyRef}
            onKeyPress={(e) => {
              if (e.key === "Enter") loginApi();
            }}
          />
        </div>

        <div
          style={{ margin: 10 }}
          className="inline-flex items-center bg-white leading-none rounded-full p-2 shadow text-teal text-sm"
        >
          <span className="inline-flex px-2 text-pink-600">
            The private key will never be sent to the server, it will only be
            stored on your device and used to sign messages.{" "}
          </span>
        </div>
        <div style={{ margin: 10 }}>
          <button
            className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            onClick={loginApi}
          >
            Login
          </button>

          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginMenu;
