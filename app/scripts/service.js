var BnbService = (function() {

  var BASE_URL = 'api/';

  var loadEnvironment = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/environment', 'GET', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var signin = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/auth/sign_in', 'POST', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var signup = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/auth/', 'POST', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var signout = function() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('uid');
  };

  var forgotPassword = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/auth/password', 'POST', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var updatePassword = function(params, headers, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/auth/password', 'PUT', params, headers);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var loadUser = function(id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/users/' + id, 'GET', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var updateUser = function(id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/users/' + id, 'PUT', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var loadPages = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages', 'GET', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var loadPage = function(id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + id, 'GET', params);
    _sendRequest(options,
      function(data) {
        // TODO : we need to transform object and add update et destroy methods to it
        successCallback.apply(callbackObj, [data]);
      },
      function(error) {
        errorCallback.apply(callbackObj, [error]);
      },
      this);
  };

  var createPage = function(params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages', 'POST', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var updatePage = function(id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + id, 'PUT', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var deletePage = function(id, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + id, 'DELETE');
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var loadStats = function(id, start, end, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + id + '/stats', 'GET', {start: start, end: end});
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var loadMembers = function(id, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + id + '/members', 'GET', {});
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var addMember = function(page_id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + page_id + '/members', 'POST', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var updateMember = function(page_id, id, params, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + page_id + '/members/' + id, 'PUT', params);
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var removeMember = function(page_id, id, successCallback, errorCallback, callbackObj) {
    var options = _generateOptions('/pages/' + page_id + '/members/' + id, 'DELETE');
    _sendRequest(options, successCallback, errorCallback, callbackObj);
  };

  var storeCredentials = function(accessToken, uid, client) {
    _setAccessToken(accessToken);
    _setUid(uid);
    _setClient(client);
  };

  var _generateOptions = function(url, method, params, headers) {
    var options = {
      url: _getRequestUrl(url, params),
      method: method,
      headers: _.extend(_getCredentials(), _getRequestHeaders(headers)),
      body: '',
      async: true,
      handleAs: 'json',
      withCredentials: false
    };
    return options;
  };

  var _getCredentials = function() {
    var token = _getAccessToken();
    if (token !== null && token != "null") {
      return {'access-token' : token, 'client' : _getClient(), 'uid' : _getUid(), 'token-type' : 'Bearer'};
    }
    else {
      return {};
    }
  };

  var _sendRequest = function(options, successCallback, errorCallback, callbackObj) {
    var req = document.createElement('iron-request');
    req.completes.then( function(result) {
      _handleSuccess(req, successCallback, callbackObj);
    }, function(err) {
      _handleError(req, errorCallback, callbackObj, err);
    });
    req.send(options);
  };

  var _handleSuccess = function(request, callback, callbackObj) {
    var accessToken = request.xhr.getResponseHeader('access-token');
    var uid         = request.xhr.getResponseHeader('uid');
    var client      = request.xhr.getResponseHeader('client');
    _setAccessToken(accessToken);
    _setUid(uid);
    _setClient(client);
    callback.apply (callbackObj, [request.xhr.response]);
  };

  var _handleError = function(request, callback, callbackObj, error) {
    if (request.xhr.response === null) {
      app.fire('message', {message: "Error : can't reach server. Try again later."});
    }
    else {
      callback.apply (callbackObj, [request.xhr.response]);
    }
  };

  var _getRequestHeaders = function(headers) {
    var resu = {};
    var header;

    if (headers instanceof Object) {
      for (header in headers) {
        resu[header] = headers[header].toString();
      }
    }

    return resu;
  };

  var _getQueryString = function(params) {
    var queryParts = [];
    var param;
    var value;

    for (param in params) {
      value = params[param];
      param = window.encodeURIComponent(param);

      if (value !== null) {
        param += '=' + window.encodeURIComponent(value);
      }

      queryParts.push(param);
    }

    return queryParts.join('&');
  };

  var _getRequestUrl = function(url, params) {
    var queryString = _getQueryString(params);

    if (queryString) {
      return BASE_URL + url + '?' + queryString;
    }

    return BASE_URL + url;
  };

  var _getAccessToken = function() {
    return sessionStorage.getItem('accessToken');
  };

  var _setAccessToken = function(token) {
    if (token === null) {
      sessionStorage.removeItem('accessToken');
    }
    else {
      sessionStorage.setItem('accessToken', token);
    }
  };

  var _getClient = function() {
    return sessionStorage.getItem('client');
  };

  var _setClient = function(client) {
    if (client === null) {
      sessionStorage.removeItem('client');
    }
    else {
      sessionStorage.setItem('client', client);
    }
  };

  var _getUid = function() {
    return sessionStorage.getItem('uid');
  };

  var _setUid = function _setUid(uid) {
    if (uid === null) {
      sessionStorage.removeItem('uid');
    }
    else {
      sessionStorage.setItem('uid', uid);
    }
  };

  return {
    BASE_URL: BASE_URL,
    storeCredentials: storeCredentials,
    loadEnvironment: loadEnvironment,
    signin: signin,
    signup: signup,
    signout: signout,
    forgotPassword: forgotPassword,
    updatePassword: updatePassword,
    loadUser: loadUser,
    updateUser: updateUser,
    loadPages: loadPages,
    loadPage: loadPage,
    createPage: createPage,
    updatePage: updatePage,
    deletePage: deletePage,
    loadStats: loadStats,
    loadMembers: loadMembers,
    addMember: addMember,
    updateMember: updateMember,
    removeMember: removeMember
  };
})();
