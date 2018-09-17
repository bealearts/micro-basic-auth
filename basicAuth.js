'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = basicAuth;
exports.challenge = challenge;

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

var _micro = require('micro');

var _micro2 = _interopRequireDefault(_micro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var send = _micro2.default.send;

var provider = 'basic';

function basicAuth(options) {
  var opts = _extends({
    realm: '',
    username: '',
    password: ''
  }, options);

  return function (handler) {
    return function (req, res) {
      var credentials = (0, _basicAuth2.default)(req);

      if (!credentials) {
        challenge(res, opts);
        return send(res, 401, 'Access denied');
      }

      if (credentials.name !== opts.username || credentials.pass !== opts.password) {
        return handler(req, res, {
          err: new Error('Invalid Username or Password'),
          provider: provider,
          realm: opts.realm
        });
      }

      return handler(req, res, {
        result: {
          provider: provider,
          realm: opts.realm,
          info: {
            username: credentials.name
          }
        }
      });
    };
  };
}

function challenge(res, auth) {
  res.setHeader('WWW-Authenticate', 'Basic realm="' + auth.realm + '"');
}
