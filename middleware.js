exports.accessLogger = function() {
  return function(req, res, next) {
    next()
  };
};
