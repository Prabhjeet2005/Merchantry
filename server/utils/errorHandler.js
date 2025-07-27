const errorHandler = (err, req, res, next) => {
	res.status(err.status);
	res.send({ success: false, message: err.message });
};

module.exports = errorHandler;
