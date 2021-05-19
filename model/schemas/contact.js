const mongoose = require("mongoose");
const { Schema, SchemaTypes } = mongoose;

// Опис SCHEMA для функцій model/contarts
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  {
    // Версійність
    versionKey: false,
    // Час створення та оновлення
    timestamps: true,

    // Віртуальні поля
    toObject: {
      virtuals: true, // показувати в консолі
      // сховати з консолі
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.shortContact;
        return ret;
      },
    },
    toJSON: {
      virtuals: true, // показувати в JSON
      // приховати в JSON
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.shortContact;
        return ret;
      },
    },
  }
);

contactSchema.virtual("shortContact").get(function () {
  return `Сontact: ${this.name}, ${this.phone}, ${this.email}`;
});

contactSchema.path("name").validate((value) => {
  const re = /[A-Z]\w+/;
  return re.test(String(value));
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
