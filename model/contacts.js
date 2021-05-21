const Contact = require("./schemas/contact");

// Функції для controllers/contasts
// GET
const getAll = async (userId, query) => {
  const {
    limit = 20,
    page = 1,
    sortBy,
    sortByDesk,
    filter, // name|email|phone|favorite
    favorite = null,
  } = query; //Ограничение запросов, сортировка, фильтр

  const optionSearch = { owner: userId };
  if (favorite !== null) {
    optionSearch.favorite = favorite;
  }

  const results = await Contact.paginate(optionSearch, {
    limit,
    page,
    select: filter ? filter.split("|").join(" ") : "", // 'name email phone favorite'
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesk ? { [`${sortByDesk}`]: -1 } : {}),
    },
  });
  const { docs: contacts, totalDocs: total } = results;
  return { contacts, total, limit, page };
};

// GET BY ID
const getById = async (userId, id) => {
  // console.log(userId);
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: "owner",
    select: "name email subscription -_id", // delete -_id
  });
  return result;
};

// POST
const create = async (body) => {
  const result = await Contact.create(body);
  return result;
};

// DELETE
const remove = async (userId, id) => {
  const result = await Contact.findByIdAndRemove({ _id: id, owner: userId });
  return result;
};

// UPDATE
const update = async (userId, id, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  );
  return result;
};

module.exports = {
  getAll,
  getById,
  remove,
  create,
  update,
};
