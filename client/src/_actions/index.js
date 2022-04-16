export const setAuth = (msg) => {
  return {
    type: "SET_AUTH",
    payload: msg,
  };
};
//
export const deleteAuth = (msg) => {
  return {
    type: "DELETE_AUTH",
    payload: msg,
  };
};
//
export const setComments = (msg) => {
  return {
    type: "SET_COMMENTS",
    payload: msg,
  };
};
//
export const addComment = (msg) => {
  return {
    type: "ADD_COMMENT",
    payload: msg,
  };
};
//
export const addSubComment = (msg) => {
  return {
    type: "ADD_SUB_COMMENT",
    payload: msg,
  };
};
//
export const deleteComment = (msg) => {
  return {
    type: "DELETE_COMMENT",
    payload: msg,
  };
};
//
export const deleteSubComment = (msg) => {
  return {
    type: "DELETE_SUB_COMMENT",
    payload: msg,
  };
};
//
export const voteComment = (msg) => {
  return {
    type: "VOTE_COMMENT",
    payload: msg,
  };
};
//
export const voteSubComment = (msg) => {
  return {
    type: "VOTE_SUB_COMMENT",
    payload: msg,
  };
};
//
export const setCount = (msg) => {
  return {
    type: "SET_COUNT",
    payload: msg,
  };
};
//
export const addCount = (msg) => {
  return {
    type: "ADD_COUNT",
    payload: msg,
  };
};
//
export const editComment = (msg) => {
  return {
    type: "EDIT_COMMENT",
    payload: msg,
  };
};
//
export const editSubComment = (msg) => {
  return {
    type: "EDIT_SUB_COMMENT",
    payload: msg,
  };
};
//
