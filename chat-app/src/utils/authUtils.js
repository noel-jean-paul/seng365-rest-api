exports.addCookie = (vue, response) => {
  console.log('method called', vue, response);
  const userId = response.data.userId.toString();
  vue.$cookies.set('token', userId);
  console.log(vue.$cookies.get('token'));

  vue.$router.push({ name: 'venues'});
};
