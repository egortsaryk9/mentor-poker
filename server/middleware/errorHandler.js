const errorHandler = (err, req, res, next) => {
  console.log(err, 'err')
  res.status(err.statusCode || 500).json({
    name: err.name,
    message: err.message
  })
}

module.exports = errorHandler;
