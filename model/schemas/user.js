const { Schema, model } = require("mongoose");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const { Subsc } = require("../../helpers/const");
const SALT_FACTOR = 6;

// Опис SCHEMA для функцій model/users
const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      default: "Guest",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // дополнит. валидация
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLocaleLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: [Subsc.STARTER, Subsc.PRO, Subsc.BISINESS],
      default: Subsc.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: function () {
        return gravatar.url(this.email, { s: 250 }, true);
      },
    },
    userIdImg: {
      type: String,
      default: null,
    },
    veryfy: {
      type: Boolean,
      default: false,
    },
    veryfyToken: {
      type: String,
      required: true,
      default: nanoid(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Hook "pre" - викликається перед записом в БД, "post" - після запису в БД
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // якщо пароль змінився
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Порівняння паролів
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = model("user", userSchema);

module.exports = User;
