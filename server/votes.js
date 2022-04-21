const { prisma } = require("./datebase");

const saveUserVoteLock = async (userLogin, commentId, voteType) => {
  return await prisma.vote.create({
    data: {
      userLogin,
      commentId,
      voteType,
    },
  });
};
const removeUserVoteLock = async (userLogin, commentId) => {
  return await prisma.vote.deleteMany({
    where: {
      userLogin,
      commentId,
    },
  });
};

const voteUpIncrement = async (commentId) => {
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      votesUp: {
        increment: 1,
      },
    },
    select: {
      id: true,
      votesUp: true,
      votesDown: true,
      parent_id: true,
    },
  });
};

const voteUpDecrement = async (commentId) => {
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      votesUp: {
        decrement: 1,
      },
    },
    select: {
      id: true,
      votesUp: true,
      votesDown: true,
      parent_id: true,
    },
  });
};
const voteDownIncrement = async (commentId) => {
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      votesDown: {
        increment: 1,
      },
    },
    select: {
      id: true,
      votesUp: true,
      votesDown: true,
      parent_id: true,
    },
  });
};

const voteDownDecrement = async (commentId) => {
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      votesDown: {
        decrement: 1,
      },
    },
    select: {
      id: true,
      votesUp: true,
      votesDown: true,
      parent_id: true,
    },
  });
};

/////
/////
/////

const VotesHandler = async (userLogin, commentId, userVote) => {
  const vote = await prisma.vote.findFirst({
    where: {
      userLogin,
      commentId,
    },
  });

  let votes;
  let voteType;

  if (vote && vote.id) {
    // voted already
    await removeUserVoteLock(userLogin, commentId);

    if (vote.voteType === 1 && vote.voteType !== userVote) {
      await saveUserVoteLock(userLogin, commentId, userVote);

      /* is voted up? reverse! */
      voteType = 0;

      // voteUp Decrement
      await voteUpDecrement(commentId);
      // voteDown Increment
      votes = await voteDownIncrement(commentId);
    }
    if (vote.voteType === 0 && vote.voteType !== userVote) {
      await saveUserVoteLock(userLogin, commentId, userVote);

      /* is voted down? reverse! */
      voteType = 1;

      // voteDown Decrement
      await voteDownDecrement(commentId);
      // voteUp Increment
      votes = await voteUpIncrement(commentId);
    }

    if (vote.voteType === 1 && vote.voteType === userVote) {
      /* is voted up? remove vote if user voted on this same */
      voteType = null;

      // voteUp Decrement
      votes = await voteUpDecrement(commentId);
    }
    if (vote.voteType === 0 && vote.voteType === userVote) {
      /* is voted down? remove vote if user voted on this same */
      voteType = null;

      // voteDown Decrement
      votes = await voteDownDecrement(commentId);
    }
  } else {
    // not voted yet
    await saveUserVoteLock(userLogin, commentId, userVote);

    if (userVote === 1) {
      // voteUp Increment
      voteType = 1;
      votes = await voteUpIncrement(commentId);
    }
    if (userVote === 0) {
      // voteDown Increment
      voteType = 0;
      votes = await voteDownIncrement(commentId);
    }
  }

  return { votes, voteType };
};

module.exports = { VotesHandler };
