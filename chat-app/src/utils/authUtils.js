exports.getCookie = (vue) => {
  return vue.$cookies.get('token').token;
};

exports.isAuthenticated = (vue, userId) => {
  if (vue.$cookies.isKey('token')) {
    return userId === vue.$cookies.get('token').userId;
  } else {
    return false;
  }
};

exports.getAuthedUserId = (vue) => {
  return vue.$cookies.get('token').userId;
};

exports.setCookie = (vue, userId, token) => {
  vue.$cookies.set('token', {
    token: token,
    userId: userId
  })
};
