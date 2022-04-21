import React from "react";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const ErrorDiv = ({ error }) => {
  const { t } = useTranslation();

  switch (error) {
    case "E-1":
      error = t("Comment not found.");
      break;
    case "E-2":
      error = t("Error. Please try again.");
      break;
    case "E-3":
      error = t("Login can have min 2 and max 30 characters.");
      break;
    case "E-4":
      error = t("Error. You have already one account.");
      break;
    case "E-5":
      error = t("Login exist, try another one.");
      break;
    case "E-6":
      error = t("Signature not match, please try again.");
      break;
    case "E-7":
      error = t("Website URL to long. Max 2000 characters.");
      break;
    case "E-8":
      error = t("Comment can have min 2 and max 3000 characters.");
      break;
    case "E-9":
      error = t("Please log in to post comment.");
      break;
    case "E-10":
      error = t("Please log in to see comments.");
      break;
    case "E-11":
      error = t("Cannot vote on dead comments.");
      break;
    case "E-12":
      error = t("Please log in to vote.");
      break;
    case "E-13":
      error = t("Already voted on this comment.");
      break;
    case "E-14":
      error = t("Unknow vote option.");
      break;
    case "E-15":
      error = t("Can't vote on your own comments.");
      break;

    default:
      break;
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-3"
      role="alert"
    >
      {/* <strong className="font-bold">Error</strong> */}
      <span className="block sm:inline">{error}</span>
    </div>
  );
};

export default ErrorDiv;
