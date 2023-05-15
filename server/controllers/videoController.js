const catchAsync = require('../utils/catchAsync');

exports.getVideo = catchAsync(async (req, res, next) => {
  // Response
  res.status(200).json({
    status: 'success',
    data: 'hi',
  });
});
