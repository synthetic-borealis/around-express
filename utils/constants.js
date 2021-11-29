const errorMessages = {
  notFound: { message: 'Card or user not found' },
  invalidData: { message: 'Bad request' },
  serverError: { message: 'An error has occured on the server' },
  unauthorized: { message: 'Unauthorized user' },
  forbidden: { message: 'Unautorized action' },
};

module.exports = { errorMessages };
