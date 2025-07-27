const responseCreator = (message = "Successful", data = {}) => {
	return { success: true, message, data };
};

const errorCreator = async (message, status = 400) => {
	const err = new Error(message);
	err.status = status;
	throw err;
};

module.exports = { responseCreator, errorCreator };
