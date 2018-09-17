import auth from 'basic-auth';
import micro from 'micro';

const { send } = micro;
const provider = 'basic';

export default function basicAuth(options) {
  const opts = {
    realm: '',
    username: '',
    password: '',
    ...options
  };

  return handler => (req, res) => {
    const credentials = auth(req);

    if (!credentials) {
      challenge(res, opts);
      return send(res, 401, 'Access denied');
    }

    if (credentials.name !== opts.username || credentials.pass !== opts.password) {
      return handler(req, res, {
        err: new Error('Invalid Username or Password'),
        provider,
        realm: opts.realm
      });
    }

    return handler(req, res, {
      result: {
        provider,
        realm: opts.realm,
        info: {
          username: credentials.name
        }
      }
    });
  };
}


export function challenge(res, auth) {
  res.setHeader('WWW-Authenticate', `Basic realm="${auth.realm}"`);
}
