/* eslint-disable no-case-declarations */
export const auth = (state = "", action) => {
  switch (action.type) {
    case "SET_AUTH":
      localStorage.setItem("licom", JSON.stringify(action.payload));
      return action.payload;

    case "DELETE_AUTH":
      localStorage.removeItem("licom");
      return action.payload;

    default:
      if (JSON.parse(localStorage.getItem("licom"))) {
        const l = JSON.parse(localStorage.getItem("licom"));
        if (l && l.login && l.authKey && l.publicKey && l.privateKey) {
          return l;
        }
      } else {
        return state;
      }
  }
};
//
export const comments = (state = [], action) => {
  switch (action.type) {
    case "SET_COMMENTS":
      return action.payload;

    case "ADD_COMMENT":
      return [...state, action.payload];

    case "LOAD_OLDER_COMMENTS":
      return action.payload.concat(state);

    case "ADD_SUB_COMMENT":
      return state.map((x) =>
        x.id === action.payload.parent_id
          ? { ...x, Children: [...x.Children, action.payload] }
          : x
      );

    case "EDIT_COMMENT":
      return state.map((x) =>
        x.id === action.payload.id
          ? {
              ...x,
              comment: action.payload.comment,
            }
          : x
      );

    case "EDIT_SUB_COMMENT":
      const editSubComment = state.map((comment) => {
        if (comment.id !== action.payload.parent_id) return comment;

        const updatedSubComments = comment.Children.map((subComment) => {
          if (subComment.id !== action.payload.id) return subComment;

          return { ...subComment, comment: action.payload.comment };
        });

        return { ...comment, Children: updatedSubComments };
      });

      return editSubComment;

    case "DELETE_COMMENT":
      return state.map((x) =>
        x.id === action.payload ? { ...x, deleted: 1 } : x
      );

    case "DELETE_SUB_COMMENT":
      const deleteSubComment = state.map((comment) => {
        if (comment.id !== action.payload.parent_id) return comment;

        const updatedSubComments = comment.Children.map((subComment) => {
          if (subComment.id !== action.payload.id) return subComment;

          return { ...subComment, deleted: 1 };
        });

        return { ...comment, Children: updatedSubComments };
      });

      return deleteSubComment;

    case "VOTE_COMMENT":
      return state.map((x) =>
        x.id === action.payload.id
          ? {
              ...x,
              votesUp: action.payload.votesUp,
              votesDown: action.payload.votesDown,
              votes: [{ voteType: action.payload.voteType }],
            }
          : x
      );

    case "VOTE_SUB_COMMENT":
      const voteSubComment = state.map((comment) => {
        if (comment.id !== action.payload.parent_id) return comment;

        const updatedSubComments = comment.Children.map((subComment) => {
          if (subComment.id !== action.payload.id) return subComment;

          return {
            ...subComment,
            votesUp: action.payload.votesUp,
            votesDown: action.payload.votesDown,
            votes: [{ voteType: action.payload.voteType }],
          };
        });

        return { ...comment, Children: updatedSubComments };
      });

      return voteSubComment;

    default:
      return state;
  }
};
//
export const count = (state = 0, action) => {
  switch (action.type) {
    case "SET_COUNT":
      return action.payload;
    case "ADD_COUNT":
      return state + action.payload;

    default:
      return state;
  }
};
