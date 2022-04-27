/* eslint-disable no-console */
require("dotenv").config();

const akismet = require("akismet-js").client({
  blog: process.env.AKISMENT_URL,
  apiKey: process.env.AKISMENT_KEY,
});

const CheckKey = () => {
  akismet.verifyKey((_err, verified) => {
    if (verified) return console.log("API key successfully verified.");
    else throw console.log("Unable to verify API key.");
  });
};

CheckKey();

const CheckComment = async (req, name) => {
  return new Promise((resolve) => {
    const user_ip =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    akismet.checkComment(
      {
        user_ip,
        comment_author: name,
        comment_content: req.body.comment,
      },
      (_err, isSpam) => {
        if (isSpam) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

module.exports = { CheckComment };
