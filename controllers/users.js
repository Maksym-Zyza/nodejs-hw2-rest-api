const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");

require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/const");

// const UploadAvatar = require("../services/upload-avatars-local"); // LOCAL
const UploadAvatar = require("../services/upload-avatars-cloud"); //CLOUD

const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendgrid,
} = require("../services/sender-email");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS; // LOCAL

// Настройка CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Контроллери (логіка роботи) для маршрутів
// REGISTRATION / SIGNUP
const reg = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email is already used",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, name, email, subscription, avatar, verifyToken } = newUser;

    // Send email:
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid() //CreateSenderNodemailer
      );
      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (e) {
      console.log(e.message);
    }

    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        id,
        name,
        email,
        subscription,
        avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

// LOGIN
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Not authorized!",
      });
    }
    if (!user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: "error",
        code: HttpCode.UNAUTHORIZED,
        message: "Check email for verification",
      });
    }
    // Віддаємо токен
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "5h" });
    await Users.updateToken(user.id, token);
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      ResponseBody: { token, user: { email, subscription: user.subscription } },
    });
  } catch (e) {
    next(e);
  }
};

// LOGOUT
const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id, null);
    return res.status(HttpCode.NO_CONTENT).json({
      status: "success",
      code: HttpCode.NO_CONTENT,
      message: "Nothing",
    });
  } catch (e) {
    next(e);
  }
};

// CURRENT USER
const currentUser = async (req, res, next) => {
  try {
    const { name, email, subscription } = await Users.findByToken(
      req.user.token
    );
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: { name, email, subscription },
      },
    });
  } catch (err) {
    next(err);
  }
};

// UPDETE Subscription
const updateSub = async (req, res, next) => {
  const id = req.user.id;
  try {
    await Users.updateUserSub(id, req.body.subscription);
    const { name, email, subscription } = await Users.findById(id);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          name,
          email,
          subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === "CastError") {
      return next({
        status: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
    next(e);
  }
};

// AVATARS - роздача картинок з сервера
const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    // LOCAL
    // const uploads = new UploadAvatar(AVATARS_OF_USERS);
    // const avatarUrl = await uploads.saveAvatarToStatic({
    //   idUser: id,
    //   pathFile: req.file.path,
    //   name: req.file.filename,
    //   oldFile: req.user.avatar,
    // });

    // CLOUD
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new UploadAvatar(uploadCloud);
    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg
    );
    await Users.updateAvatar(id, avatarUrl, userIdImg);

    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

// EMAIL VERIFY
const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token);
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HttpCode.OK).json({
        status: "success",
        code: HttpCode.OK,
        message: "Verification successful!",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "error",
      code: HttpCode.NOT_FOUND,
      message: "User not found with verification token",
    });
  } catch (error) {
    next(error);
  }
};

// REPEAT VERIFY
const repeatEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    const { name, email, verifyToken, verify } = user;
    console.log("user", user);
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
        return res.status(HttpCode.OK).json({
          status: "success",
          code: HttpCode.OK,
          message: "Verification email resubmited!",
        });
      } catch (e) {
        console.log(e.message);
        return next(e);
      }
    }
    return res.status(HttpCode.CONFLICT).json({
      status: "error",
      code: HttpCode.CONFLICT,
      message: "Email has already been verified",
    });
  }
  return res.status(HttpCode.NOT_FOUND).json({
    status: "error",
    code: HttpCode.NOT_FOUND,
    message: "User not found",
  });
};

module.exports = {
  reg,
  login,
  logout,
  currentUser,
  updateSub,
  avatars,
  verify,
  repeatEmailVerify,
};
