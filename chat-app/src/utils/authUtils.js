exports.getCookie = (vue) => {
  return vue.$cookies.get('token').token;
};

exports.isAuthenticated = (vue, userId) => {
  const cookieId = vue.$cookies.get('token').userId;
  console.log(typeof userId, userId, typeof cookieId, cookieId);

  return userId === vue.$cookies.get('token').userId;
};

exports.setCookie = (vue, userId, token) => {
  vue.$cookies.set('token', {
    token: token,
    userId: userId
  })
};
