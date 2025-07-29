const errorHandler = (err, req, res, next) => {
	if(err.status){
		res.status(err.status);
	}else{
		res.status(501)
	}

	res.send({ success: false, message: err.message });
};

module.exports = errorHandler;
