var request = require('request');

function urlExistsDeep(url, header, method) {

  return new Promise(function(resolve, reject) {

    request({
      url: url,
      method: method || 'HEAD',
      headers: header || {},
      followRedirect: false
    }, function(err, res) {

      if (!res || err) {
        resolve(false);
        return;
      }

      var checkUrl;

      if (/4\d\d/.test(res.statusCode) && res.statusCode !== 403) {
        resolve(false);
        return;
      }

      if (res.statusCode === 403) {
        checkUrl = res.request.uri.href;
        header = { "Accept": "text/html", "User-Agent": "Mozilla/5.0" };
        method = 'GET';
      }
      if (res.statusCode === 301) {
        checkUrl = res.headers.location;
      }

      if (checkUrl) {
        urlExistsDeep(checkUrl, header, method)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(err) {
            resolve(false);
        });
      } else {
        resolve(res.request.uri);
      }

    });
  });
}

module.exports = urlExistsDeep;