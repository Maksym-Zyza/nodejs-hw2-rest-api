const db = require("./db");
const { ObjectId } = require("mongodb");

// Обгортка, щоб брати колекцію
const getCollection = async (db, name) => {
  const client = await db;
  const collection = await client.db().collection(name);
  return collection;
};

const listContacts = async () => {
  const collection = await getCollection(db, "contacts");
  const results = collection.find({}).toArray(); // Отримуємо "курсор", .toArray() - перетворюємо в массив
  return results;
};

const getContactById = async (id) => {
  const collection = await getCollection(db, "contacts");
  const [result] = await collection.find({ _id: new ObjectId(id) }).toArray(); // ObjectId(id) - преобразование строки в обьект для MongpDb
  console.log(result._id.getTimestamp());
  return result;
};

const removeContact = async (id) => {
  const collection = await getCollection(db, "contacts");
  const { value: result } = await collection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  return result;
};

const addContact = async (body) => {
  const collection = await getCollection(db, "contacts");
  const record = { ...body };
  const {
    ops: [result], // деструктиризуємо ops
  } = await collection.insertOne(record);
  return result;
};

const updateContact = async (id, body) => {
  const collection = await getCollection(db, "contacts");

  const { value: result } = await collection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: body }, //$set - модифікатор
    { returnOriginal: false } // получение текущего значения
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
