/* eslint-disable react/prop-types */
import React, { useState } from "react";

const Ellipsis = (props) => {
  const [showMore, setShowMore] = useState();
  const limit = props.limit ? props.limit : 200;
  const ellipsis = props.ellipsis ? props.ellipsis : "...";

  const ellipsisStr = (str) => {
    if (str.length > limit) {
      return str.slice(0, limit) + ellipsis;
    } else {
      return str;
    }
  };

  return (
    <>
      <span>
        {showMore === props.id ? props.text : ellipsisStr(props.text)}
      </span>
      {props.text.length > limit && showMore !== props.id && (
        <span
          className={props.class ? props.class : "more"}
          onClick={() => {
            setShowMore(props.id);
          }}
        >
          {props.label ? props.label : "Show more"}
        </span>
      )}
    </>
  );
};

export default Ellipsis;
