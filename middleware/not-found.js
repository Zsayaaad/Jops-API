const notFound = (req, res) => {
  res.status(404).json({ msg: 'This route not found' });
};

module.exports = notFound;
