# micro-basic-auth

Basic Auth for [micro](https://github.com/zeit/micro) based micro-services

> API compatible with the [microauth](https://github.com/microauth/microauth) modules

## Usage
```js
import { send } from 'micro';
import basicAuth, { challenge } from 'micro-basic-auth';

const options = {
  realm: 'MyApp',
  username: 'Bob',
  password: 'secret'
};

// Third `auth` argument will provide error or result of authentication
// so it will { err: errorObject} or { result: {
//  provider: 'basic',
//  info: userInfo
// }}
const handler = async (req, res, auth) => {

  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    console.error(auth.err);

    challenge(res, auth); // If you want to prompt for credentials again

    return send(res, 403, 'Forbidden');
  }

  return `Hello ${auth.result.info.username}`;

};

export default basicAuth(options)(handler);
```

## Install
```shell
npm i micro-basic-auth
```
