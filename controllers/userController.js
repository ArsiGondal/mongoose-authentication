const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const secret = "test-api-to-authenticate-users";
const tokenExpiry = "90d";
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: tokenExpiry,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);

    createSendToken(newUser, 201, req, res);
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      data: {
        error: err,
      },
    });
    next();
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        data: {
          error: err,
        },
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "fail",
        data: {
          error: err,
        },
      });
    }

    createSendToken(user, 200, req, res);
    next();
  } catch (err) {
    return res.status(401).json({
      status: "fail",
      data: {
        error: err,
      },
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    res.status(400).json({ status: "error", e });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        err: "You are logged out please Login again.",
      });
      next();
    }

    const decoded = await promisify(jwt.verify)(token, secret);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "fail",
        err: "The user no longer exists.",
      });
      next();
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    return res.status(404).json({ status: "error", err });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "fail",
        err: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
