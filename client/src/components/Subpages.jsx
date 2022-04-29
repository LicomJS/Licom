/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setUrl } from "./../_redux/url";

// eslint-disable-next-line react/prop-types
const Subpages = ({ url, auth, t }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [subpages, setSubpages] = useState([]);
  const loaded = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaded.current === false) {
      const API_URL =
        process.env.NODE_ENV === "development"
          ? process.env.REACT_APP_API_LOCAL_SERVER
          : process.env.REACT_APP_API_SERVER;

      setLoading(true);
      axios({
        method: "post",
        url: API_URL + "/api/getsubpages",
        data: {
          url,
          authKey: auth.authKey,
        },
      }).then((res) => {
        setLoading(false);

        if (res.data.meta) {
          setSubpages(res.data.meta);
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
      <div>
        {loading ? (
          <span>{t("Loading...")}</span>
        ) : (
          <div>
            {subpages.length > 0 ? (
              <select
                style={{ width: 200 }}
                className="rounded-lg"
                onChange={(e) => {
                  dispatch(setUrl(e.target.value));
                }}
              >
                {subpages.map((u, key) => (
                  <option key={key} value={u.url}>
                    /{u.url.match(/^https?:\/\/[a-zA-Z:.0-9]+\/(.*)$/)[1]} -{" "}
                    {u.count} {u.count > 1 ? t("comments") : t("comment")}
                  </option>
                ))}
              </select>
            ) : (
              <span>{t("No subpages")}</span>
            )}

            {error && <span>{error}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subpages;
