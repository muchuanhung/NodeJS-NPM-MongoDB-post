const service = {
  success: ({http = 200, res, data}) => {
    res
    .status(http)
    .send({
      status: 'success',
      data,
    })
    .end();
  },
  error: ({http = 400, res, error}) => {
    res
    .status(http)
    .send({
      status: 'error',
      message: error.message || error,
    })
    .end();
  }
}

module.exports = service;
