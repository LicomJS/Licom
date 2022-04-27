const { verifyMessage } = require("ed25519-keys");
const { nanoid } = require("nanoid");
const { CheckComment } = require("./checkSpam");
const { prisma } = require("./datebase");
const { VotesHandler } = require("./votes");

/**
 * Delete Comment Handler
 */
const deleteComment = async (req, res, next) => {
  let isOwn;
  try {
    isOwn = await prisma.comment.findFirst({
      where: {
        id: req.body.id,
      },
      include: {
        User: {
          select: {
            authKey: true,
          },
        },
      },
    });
  } catch (error) {
    // Comment not found.
    return res.send({ error: "E-1" });
  }

  if (isOwn && req.body.authKey === isOwn.User.authKey) {
    let meta = await prisma.comment.update({
      where: {
        id: req.body.id,
      },
      data: {
        comment: "",
        deleted: 1,
      },
      select: {
        parent_id: true,
      },
    });
    meta.success = true;
    meta.id = req.body.id;

    return res.send(meta);
  } else {
    return res.send({ success: false });
  }

  return next(); // never
};

/**
 * Check Login Handler
 */
const checkLogin = async (req, res, next) => {
  let login = req.body.login.trim();
  let fp = String(req.body.hash);

  if (!fp) {
    // Error. Please try again.
    return res.send({ error: "E-2" });
  }

  if (login.length < 2 || login.length > 30) {
    // Login can have min 2 and max 30 characters.
    return res.send({ error: "E-3" });
  }

  const checkFp = await prisma.fingerprint.findFirst({
    where: {
      fp,
    },
  });

  if (checkFp && checkFp.userLogin !== null) {
    return res.send({
      // Error. You have already one account:
      error: "E-4", // checkFp.userLogin
    });
  }

  const user = await prisma.user.count({
    where: { login },
  });

  let rk = nanoid(20);

  if (user === 0) {
    const up = await prisma.fingerprint.upsert({
      create: { fp, count: 1, rKey: rk },
      update: {
        count: {
          increment: 1,
        },
      },
      where: { fp },
    });

    res.send({ login, status: true, rk: up.rKey });
  } else {
    // Login exist, try another one.
    res.send({ error: "E-5" });
  }

  return next();
};

/**
 * Login User Handler
 */
const loginUser = async (req, res, next) => {
  verifyMessage(req.body.sign, req.body.signature, req.body.publicKey).then(
    async (verify) => {
      if (verify) {
        let upUser;
        let publicKey = req.body.publicKey.trim();

        try {
          upUser = await prisma.user.findFirst({
            where: { publicKey },
          });

          return res.send({
            authKey: upUser.authKey,
            login: upUser.login,
            publicKey: upUser.publicKey,
          });
        } catch (error) {
          // Error. Please try again.
          return res.send({ error: "E-2" });
        }
      } else {
        // Signature not match, please try again.
        return res.send({ error: "E-6" });
      }

      return next(); // never
    }
  );
};

/**
 * Register User Handler
 */
const registerUser = async (req, res, next) => {
  let login = req.body.login.trim();

  if (login.length < 2 || login.length > 30) {
    // Login can have min 2 and max 30 characters.
    return res.send({ error: "E-3" });
  }

  verifyMessage(req.body.login, req.body.signature, req.body.publicKey).then(
    async (verify) => {
      if (verify) {
        const authKey = nanoid(20);
        let login = req.body.login.trim();
        let publicKey = req.body.publicKey.trim();
        let rk = req.body.rk.trim();
        let fp = String(req.body.hash);

        try {
          fpCheck = await prisma.fingerprint.findFirst({
            where: { fp },
          });

          if (
            !fpCheck ||
            fpCheck.count <= 1 ||
            fpCheck.rKey !== rk ||
            fpCheck.rKey.length !== 20
          ) {
            // Error. Please try again.
            return res.send({ error: "E-2" });
          }

          let checkUser = await prisma.user.count({
            where: {
              publicKey,
            },
          });

          if (checkUser !== 0) {
            // Login exist, try another one.
            return res.send({ error: "E-5" });
          }

          let upUser = await prisma.user.create({
            data: { login, publicKey, authKey },
          });

          await prisma.fingerprint.update({
            where: { fp },
            data: { count: 0, userLogin: login, rKey: "" },
          });

          return res.send({
            authKey: upUser.authKey,
            login: upUser.login,
            publicKey: upUser.publicKey,
          });
        } catch (error) {
          // Error. Please try again.
          return res.send({ error: "E-2" });
        }
      } else {
        // Signature not match, please try again.
        return res.send({ error: "E-6" });
      }

      return next(); // never
    }
  );
};

/**
 * Post Comment Handler
 */
const postComments = async (req, res, next, type = "") => {
  const commentMsg = req.body.comment.trim();

  if (req.body.url.length < 1 || req.body.url.length > 2000) {
    return res.send({
      // Website URL to long. Max 2000 characters.
      error: "E-7",
    });
  }

  if (commentMsg.length < 2 || commentMsg.length > 3000) {
    return res.send({
      // Comment can have min 2 and max 3000 characters.
      error: "E-8",
    });
  }

  let user;
  try {
    user = await prisma.user.findFirst({
      where: {
        authKey: req.body.authKey,
      },
    });
  } catch (error) {
    // Please log in to post comment.
    return res.send({ error: "E-9" });
  }

  if (user === null) {
    // Please log in to post comment.
    return res.send({ error: "E-9" });
  }

  if (type === "edit") {
    // check if comment belongs to user and is not deleted
    const comment = await prisma.comment.findFirst({
      where: {
        id: req.body.id,
      },
    });

    if (comment.userLogin !== user.login || comment.deleted !== 0) {
      // Error. Please try again.
      return res.send({ error: "E-2" });
    }
  }

  verifyMessage(req.body.comment, req.body.signature, user.publicKey).then(
    async (verify) => {
      if (verify) {
        if (user.login) {
          const url = req.body.url.trim();

          const spam = await CheckComment(req, user.login);
          if (spam) return res.send({ error: "Spam!" });

          if (type !== "edit") {
            await prisma.webpage.upsert({
              where: {
                url,
              },
              create: {
                url,
                count: 1,
              },
              update: {
                count: {
                  increment: 1,
                },
              },
            });
          }

          let comment;
          if (type === "edit") {
            comment = await prisma.comment.update({
              where: {
                id: req.body.id,
              },
              data: {
                comment: commentMsg,
              },
            });
            return res.send({ edit: comment });
          } else {
            comment = await prisma.comment.create({
              data: {
                webpageUrl: url,
                comment: commentMsg,
                userLogin: user.login,
                parent_id: req.body.parent_id,
              },
              include: {
                Children: {
                  include: {
                    Children: true,
                  },
                },
              },
            });
            return res.send({ meta: comment });
          }
        }
      } else {
        // Signature not match, please try again.
        res.send({ error: "E-6" });
      }

      return next();
    }
  );
};

/**
 * Get Comments Handler
 */
const getComments = async (req, res, next) => {
  const user = await prisma.user.findFirst({
    where: {
      authKey: req.body.authKey,
    },
  });

  if (!user || !user.login) {
    // Please log in to see comments.
    return res.send({ error: "E-10" });
  }

  let url = req.body.url;
  if (url.includes("http://") || url.includes("https://")) {
    url = url.match(/https?:\/\/(.*)/)[1];
  }

  const page = await prisma.webpage.findFirst({
    where: {
      url: {
        endsWith: url,
      },
    },
    select: {
      count: true,
    },
  });

  let pageInt = req.body.page ? Number(req.body.page) : 0;
  let itemsPerPage = 30;

  const comments = await prisma.comment.findMany({
    skip: pageInt * itemsPerPage,
    take: itemsPerPage,

    where: {
      webpageUrl: {
        endsWith: url,
      },
      parent_id: null,
    },
    include: {
      Children: {
        include: {
          Children: true,
          votes: {
            where: {
              userLogin: user.login,
            },
            select: {
              voteType: true,
            },
          },
        },
      },
      votes: {
        where: {
          userLogin: user.login,
        },
        select: {
          voteType: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  res.send({
    meta: comments.reverse(),
    page: page === null ? { count: 0 } : page,
  });

  return next();
};

/**
 * Vote Comment Handler
 */
// eslint-disable-next-line no-unused-vars
const voteComment = async (req, res, next) => {
  let authKey = req.body.authKey;
  let commentId = req.body.id;
  let vote = req.body.vote;

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
    },
  });

  if (!comment || comment.deleted === 1) {
    // Cannot vote on dead comments.
    return res.send({ error: "E-11" });
  }

  const user = await prisma.user.findFirst({
    where: { authKey },
  });

  if (!user) {
    // Please log in to vote.
    return res.send({ error: "E-12" });
  }

  if (comment.userLogin === user.login) {
    // Can't vote on your own comments.
    return res.send({ error: "E-15" });
  }

  const vreturn = await VotesHandler(user.login, commentId, vote);
  vreturn.votes.success = true;
  vreturn.votes.voteType = vreturn.voteType;

  return res.send(vreturn.votes);
};

/**
 * Get Comments Counter Handler
 */
// eslint-disable-next-line no-unused-vars
const getCount = async (req, res, next) => {
  let urlPlain = JSON.parse(req.body);
  let url = urlPlain.url;

  try {
    if (url.includes("http://") || url.includes("https://")) {
      url = url.match(/https?:\/\/(.*)/)[1];
    }

    const count = await prisma.webpage.findFirst({
      where: {
        url: {
          endsWith: url,
        },
      },
      select: {
        count: true,
      },
    });

    res.send(count === null ? 0 : count);
  } catch (error) {}

  return next();
};

module.exports = {
  getComments,
  postComments,
  checkLogin,
  deleteComment,
  loginUser,
  registerUser,
  voteComment,
  getCount,
};
