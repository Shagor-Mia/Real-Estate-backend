const Property = require("../models/propertyModel");
exports.createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      userId: req.user.id,
    });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.getProperties = async (req, res) => {
  const properties = await Property.findAll();
  res.json(properties);
};
