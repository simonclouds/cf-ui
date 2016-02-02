const {equal: assertEqual} = require('assert');
const createFakeServer = require('../../../utils/createFakeServer');
const http = require('../src/http');

let server;

describe('http', function() {
  beforeEach(function() {
    server = createFakeServer();
  });

  afterEach(function() {
    server.destroy();
  });

  describe('request', function() {
    it('should call the success handler on success', function(done) {
      server.respondWith('DELETE', '/posts/3', 200, { 'Content-Type': 'application/json' }, {
        message: 'Hello World'
      });

      http.request('DELETE', '/posts/3', null, res => {
        assertEqual(res.status, 200);
        assertEqual(res.headers['content-type'], 'application/json');
        assertEqual(res.body.message, 'Hello World');
        done();
      });

      server.respond();
    });

    it('should call the error handler on error', function(done) {
      server.respondWith('GET', '/missing', 404, { 'Content-Type': 'application/json' }, {
        message: 'Not Found'
      });

      http.request('GET', '/missing', null, null, res => {
        assertEqual(res.status, 404);
        assertEqual(res.headers['content-type'], 'application/json');
        assertEqual(res.body.message, 'Not Found');
        done();
      });

      server.respond();
    });
  });

  describe('get', function() {
    it('should make a GET request', function(done) {
      server.respondWith('GET', '/posts', 200, { 'Content-Type': 'application/json' }, [
        { id: 1, title: 'Post 1', content: 'Contents of Post 1' },
        { id: 2, title: 'Post 2', content: 'Contents of Post 2' }
      ]);

      http.get('/posts', null, res => {
        assertEqual(res.body[0].id, 1);
        done();
      });

      server.respond();
    });
  });

  describe('post', function() {
    it('should make a POST request', function(done) {
      server.respondWith('POST', '/posts', 200, { 'Content-Type': 'application/json' }, {
        id: 3, title: 'Post 3', content: 'Contents of Post 3'
      });

      http.post('/posts', { body: { title: 'Post 3', content: 'Contents of Post 3' } }, res => {
        assertEqual(res.body.id, 3);
        done();
      });

      server.respond();
    });
  });

  describe('http.put', function() {
    it('should make a PUT request', function(done) {
      server.respondWith('PUT', '/posts/3', 200, { 'Content-Type': 'application/json' }, {
        id: 3, title: 'Post 3', content: 'Contents of Post 3 (edit)'
      });

      http.put('/posts/3', { body: { id: 3, title: 'Post 3', content: 'Contents of Post 3 (edit)' } }, res => {
        assertEqual(res.body.content, 'Contents of Post 3 (edit)');
        done();
      });

      server.respond();
    });
  });

  describe('http.patch', function() {
    it('should make a PATCH request', function(done) {
      server.respondWith('PATCH', '/posts/3', 200, { 'Content-Type': 'application/json' }, {
        id: 3, title: 'Post 3', content: 'Contents of Post 3 (edit 2)'
      });

      http.patch('/posts/3', { body: { content: 'Contents of Post 3 (edit 2)' } }, res => {
        assertEqual(res.body.content, 'Contents of Post 3 (edit 2)');
        done();
      });

      server.respond();
    });
  });

  describe('http.del', function() {
    it('should make a DELETE request', function(done) {
      server.respondWith('DELETE', '/posts/3', 200, { 'Content-Type': 'application/json' }, {
        id: 3, title: 'Post 3', content: 'Contents of Post 3'
      });

      http.del('/posts/3', null, res => {
        assertEqual(res.body.content, 'Contents of Post 3');
        done();
      });

      server.respond();
    });
  });
});