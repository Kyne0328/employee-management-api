const argon2 = require('argon2');

const {
  SESSION_COOKIE_NAME,
  sessionCookieClearOptions,
} = require('../../config/session');

const {
  findUserById,
  findUserByUsername,
  insertUser,
} = require('./auth.queries');

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function destroySession(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function mapPublicUser(row) {
  return {
    userId: Number(row.userId),
    username: row.username,
  };
}

async function establishUserSession(req, user) {
  await regenerateSession(req);

  req.session.user = {
    userId: user.userId,
    username: user.username,
  };

  await saveSession(req);
}

async function register(req, res) {
  const {username, password} = req.validated.body;

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  const row = await insertUser({username, passwordHash});
  const user = mapPublicUser(row);

  await establishUserSession(req, user);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: {
      user,
    },
  });
}

async function login(req, res) {
  const {username, password} = req.validated.body;
  const row = await findUserByUsername(username);

  if (!row) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
  }

  const passwordMatches = await argon2.verify(
    row.passwordHash,
    password,
  );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password.',
    });
  }

  const user = mapPublicUser(row);

  await establishUserSession(req, user);

  return res.status(200).json({
    success: true,
    message: 'User logged in successfully.',
    data: {
      user,
    },
  });
}

async function getCurrentUser(req, res) {
  const sessionUser = req.session.user;

  if (!sessionUser?.userId) {
    return res.status(200).json({
      success: true,
      data: {
        authenticated: false,
        user: null,
      },
    });
  }

  const row = await findUserById(sessionUser.userId);

  if (!row) {
    await destroySession(req);

    res.clearCookie(
      SESSION_COOKIE_NAME,
      sessionCookieClearOptions,
    );

    return res.status(200).json({
      success: true,
      data: {
        authenticated: false,
        user: null,
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      authenticated: true,
      user: mapPublicUser(row),
    },
  });
}

async function logout(req, res) {
  await destroySession(req);

  res.clearCookie(
    SESSION_COOKIE_NAME,
    sessionCookieClearOptions,
  );

  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
}

module.exports = {
  getCurrentUser,
  login,
  logout,
  register,
};
