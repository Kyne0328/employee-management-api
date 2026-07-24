const session = require('express-session');

const {env} = require('./environment');

const SESSION_COOKIE_NAME = 'employee_management_session';

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000,
  path: '/',
};

const sessionCookieClearOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
};

const sessionMiddleware = session({
  name: SESSION_COOKIE_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: sessionCookieOptions,
});

module.exports = {
  SESSION_COOKIE_NAME,
  sessionCookieClearOptions,
  sessionMiddleware,
};
