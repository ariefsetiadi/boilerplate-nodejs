const getCookieOptions = (maxAge) => ({
  httpOnly: process.env.AUTH_COOKIE_HTTP_ONLY === 'true',
  secure: process.env.AUTH_COOKIE_SECURE === 'true',
  sameSite: process.env.AUTH_COOKIE_SAME_SITE || 'lax',
  maxAge: maxAge !== undefined ? maxAge : parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10),
});

const clearAuthCookies = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};

module.exports = {
  getCookieOptions,
  clearAuthCookies,
};
