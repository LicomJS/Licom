const { verifyMessage } = require("ed25519-keys");
const { nanoid } = require("nanoid");
const { prisma } = require("./datebase");

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
    return res.send({ error: "Comment not found." });
  }

  if (isOwn && req.body.authKey === isOwn.User.authKey) {
    await prisma.comment.update({
      where: {
        id: req.body.id,
      },
      data: {
        comment: "",
        deleted: 1,
      },
    });
    return res.send({ success: true, id: req.body.id });
  } else {
    return res.send({ success: false });
  }

  return next(); // never
};

const checkLogin = async (req, res, next) => {
  let login = req.body.login.trim();
  let fp = String(req.body.hash);

  if (!fp) {
    return res.send({ error: "Error. Please try again." });
  }

  if (login.length < 2 || login.length > 30) {
    return res.send({ error: "Login can have min 2 and max 30 characters." });
  }

  const checkFp = await prisma.fingerprint.findFirst({
    where: {
      fp,
    },
  });

  if (checkFp && checkFp.userLogin !== null) {
    return res.send({
      error: "Error. You have already one account: " + checkFp.userLogin,
    });
  }

  const user = await prisma.user.count({
    where: { login },
  });

  if (user === 0) {
    await prisma.fingerprint.upsert({
      create: { fp, count: 1 },
      update: {
        count: {
          increment: 1,
        },
      },
      where: { fp },
    });

    res.send({ login, status: true });
  } else {
    res.send({ error: "Login exist, try another one." });
  }

  return next();
};

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
          return res.send({ error: "Error, please try again." });
        }
      } else {
        return res.send({ error: "Signature not match, please try again." });
      }

      return next(); // never
    }
  );
};

const registerUser = async (req, res, next) => {
  verifyMessage(req.body.login, req.body.signature, req.body.publicKey).then(
    async (verify) => {
      if (verify) {
        const authKey = nanoid(20);
        let login = req.body.login.trim();
        let publicKey = req.body.publicKey.trim();
        let fp = String(req.body.hash);

        try {
          fpCheck = await prisma.fingerprint.findFirst({
            where: { fp },
          });

          if (!fpCheck || fpCheck.count === 0) {
            return res.send({ error: "Error. Please try again." });
          }

          let checkUser = await prisma.user.count({
            where: {
              publicKey,
            },
          });

          if (checkUser !== 0) {
            return res.send({ error: "User exist." });
          }

          let upUser = await prisma.user.create({
            data: { login, publicKey, authKey },
          });

          await prisma.fingerprint.update({
            where: { fp },
            data: { count: 0, userLogin: login },
          });

          return res.send({
            authKey: upUser.authKey,
            login: upUser.login,
            publicKey: upUser.publicKey,
          });
        } catch (error) {
          return res.send({ error: "Error, please try again." });
        }
      } else {
        return res.send({ error: "Signature not match, please try again." });
      }

      return next(); // never
    }
  );
};

// const authUser = async (req, res, next) => {
//   verifyMessage(req.body.login, req.body.signature, req.body.publicKey).then(
//     async (verify) => {
//       if (verify) {
//         const authKey = nanoid(20);
//         let upUser;
//         let login = req.body.login.trim();
//         let publicKey = req.body.publicKey.trim();
//         // let fp = String(req.body.hash);

//         try {
//           // fpCheck = await prisma.fingerprint.findFirst({
//           //   where: { fp },
//           // });

//           // if (fpCheck && (fpCheck.count === 0 || fpCheck.joined === 0)) {
//           //   return res.send({ error: "Error. Please try again." });
//           // }

//           upUser = await prisma.user.upsert({
//             create: { login, publicKey, authKey },
//             update: { authKey },
//             where: { publicKey },
//           });

//           // await prisma.fingerprint.update({
//           //   where: { fp },
//           //   data: { count: 0, userLogin: login },
//           // });

//           return res.send({
//             authKey: upUser.authKey,
//             login: upUser.login,
//             publicKey: upUser.publicKey,
//           });
//         } catch (error) {
//           return res.send({ error: "Error, please try again." });
//         }
//       } else {
//         return res.send({ error: "Signature not match, please try again." });
//       }

//       return next();
//     }
//   );

//   // console.log(req.body.login);
//   // console.log(req.body.publicKey);
// };

const postComments = async (req, res, next) => {
  const commentMsg = req.body.comment.trim();

  if (req.body.url.length < 1 || req.body.url.length > 2000) {
    return res.send({
      error: "Website URL to long. Max 2000 characters.",
    });
  }

  if (commentMsg.length < 2 || commentMsg.length > 3000) {
    return res.send({
      error: "Comment can have min 2 and max 3000 characters.",
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
    return res.send({ error: "Please log in to post comment." });
  }

  if (user === null) {
    return res.send({ error: "Please log in to post comment." });
  }

  verifyMessage(req.body.comment, req.body.signature, user.publicKey).then(
    async (verify) => {
      if (verify) {
        if (user.login) {
          const url = req.body.url.trim();

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

          const comment = await prisma.comment.create({
            data: {
              webpageUrl: url,
              comment: commentMsg,
              userLogin: user.login,
            },
            select: {
              id: true,
              time: true,
              comment: true,
              userLogin: true,
              webpageUrl: true,
              deleted: true,
            },
          });

          res.send({ meta: comment });
        }
      } else {
        res.send({ error: "Signature not match, please try again." });
      }

      return next();
    }
  );
};

const getComments = async (req, res, next) => {
  const user = await prisma.user.count({
    where: {
      authKey: req.body.authKey,
    },
  });

  if (user === 0) {
    res.send({ error: "Please log in to see comments" });
  }

  const page = await prisma.webpage.findFirst({
    where: {
      url: req.body.url,
    },
    select: {
      count: true,
    },
  });

  const comments = await prisma.comment.findMany({
    where: {
      webpageUrl: req.body.url,
    },
    select: {
      id: true,
      time: true,
      comment: true,
      userLogin: true,
      webpageUrl: true,
      deleted: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  res.send({ meta: comments, page });

  return next();
};

module.exports = {
  getComments,
  postComments,
  // authUser,
  checkLogin,
  deleteComment,
  loginUser,
  registerUser,
};
