import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comments",
  initialState: [],
  reducers: {
    setComments: (_state, action) => {
      return action.payload;
    },

    addComment: (state, action) => {
      return [...state, action.payload];
    },

    addSubComment: (state, action) => {
      return state.map((x) =>
        x.id === action.payload.parent_id
          ? { ...x, Children: [...x.Children, action.payload] }
          : x
      );
    },

    deleteComment: (state, action) => {
      return state.map((x) =>
        x.id === action.payload ? { ...x, deleted: 1 } : x
      );
    },

    deleteSubComment: (state, action) => {
      const deleteSubComment = state.map((comment) => {
        if (comment.id !== action.payload.parent_id) return comment;

        const updatedSubComments = comment.Children.map((subComment) => {
          if (subComment.id !== action.payload.id) return subComment;

          return { ...subComment, deleted: 1 };
        });

        return { ...comment, Children: updatedSubComments };
      });

      return deleteSubComment;
    },

    voteComment: (state, action) => {
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
    },

    voteSubComment: (state, action) => {
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
    },

    editComment: (state, action) => {
      return state.map((x) =>
        x.id === action.payload.id
          ? {
              ...x,
              comment: action.payload.comment,
            }
          : x
      );
    },

    editSubComment: (state, action) => {
      const editSubComment = state.map((comment) => {
        if (comment.id !== action.payload.parent_id) return comment;

        const updatedSubComments = comment.Children.map((subComment) => {
          if (subComment.id !== action.payload.id) return subComment;

          return { ...subComment, comment: action.payload.comment };
        });

        return { ...comment, Children: updatedSubComments };
      });

      return editSubComment;
    },

    loadOlderComments: (state, action) => {
      return action.payload.concat(state);
    },
  },
});

export const {
  setComments,
  addComment,
  addSubComment,
  deleteComment,
  deleteSubComment,
  voteComment,
  voteSubComment,
  editComment,
  editSubComment,
  loadOlderComments,
} = commentsSlice.actions;

export default commentsSlice.reducer;
