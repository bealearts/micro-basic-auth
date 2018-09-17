import micro from 'micro';
import test from 'ava';
import listen from 'test-listen';
import fetch from 'node-fetch';

import basicAuth from '../src/basicAuth';

const { send } = micro;
let service;
let url;

test.beforeEach(async () => {
  service = micro(basicAuth({
    username: 'is',
    password: 'correct',
    realm: 'Test'
  })(async (req, res, auth) => {
    if (!auth) {
      return send(res, 404, 'Not Found');
    }

    if (auth.err) {
      return send(res, 403, 'Forbidden');
    }

    return 'Hello';
  }));
  url = await listen(service);
});

test.afterEach.always(() => {
  service.close();
});


test('No credentials', async (t) => {
  const response = await fetch(url);
  const body = await response.text();

  t.is(response.status, 401);
  t.is(body, 'Access denied');
  t.true(response.headers.has('www-authenticate'));
});

test('challenge', async (t) => {
  const response = await fetch(url);
  const body = await response.text();

  t.is(response.status, 401);
  t.is(body, 'Access denied');
  t.is(response.headers.get('www-authenticate'), 'Basic realm="Test"');
});


test('wrong credentials', async (t) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from('not:correct').toString('base64')}`
    }
  });
  const body = await response.text();

  t.is(response.status, 403);
  t.is(body, 'Forbidden');
  t.false(response.headers.has('www-authenticate'));
});


test('right credentials', async (t) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${Buffer.from('is:correct').toString('base64')}`
    }
  });
  const body = await response.text();

  t.is(response.status, 200);
  t.is(body, 'Hello');
  t.false(response.headers.has('www-authenticate'));
});
