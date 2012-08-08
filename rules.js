var keys = {
  'secretkey': {consumer: 'consumer1', id: 'secretKey'}
};

exports = module.exports = {
  apiKey: function(name) {
    return function(keyid, fn) {
      // some lookup goes here
      var key = keys[keyid];

      if (key) {
        fn(null, key);
      } else {
        fn(new Error('Key ['+keyid+'] not found'));
      }
    }
  }
};
