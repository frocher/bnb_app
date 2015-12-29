(function(document) {

var TwbService = scope.TwbService = scope.TwbService || {};

TwbService.BASE_URL = '/api/';


TwbService.signin = function signin(params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/auth/sign_in', 'POST', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.signup = function signup(params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/auth/', 'POST', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.signout = function signout() {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('uid');
};

TwbService.forgotPassword = function forgotPassword(params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/auth/password', 'POST', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.updatePassword = function updatePassword(params, headers, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/auth/password', 'PUT', params, headers);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.loadPages = function loadPages(params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/pages', 'GET', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.loadPage = function loadPage(id, params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/page/' + id, 'GET', params);
  TwbService._sendRequest(options,
    function(data) {
      // TODO : we need to transform object and add update et destroy methods to it
      successCallback.apply(callbackObj, data);
    },
    function(error) {
      errorCallback.apply(callbackObj, error);
    },
    this);
};

TwbService.handleLoadPageSuccess = function TwbService.handleLoadPageSuccess(next) {
  // TODO : enrichir avec les fonctions destroy et save
  next();
};

TwbService.createPage = function createPage(params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/pages', 'POST', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.updatePage = function updatePage(id, params, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/page/' + id, 'PUT', params);
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService.deletePage = function deletePage(id, successCallback, errorCallback, callbackObj) {
  var options = TwbService._generateOptions('/page/' + id, 'DELETE');
  TwbService._sendRequest(options, successCallback, errorCallback, callbackObj);
};

TwbService._generateOptions = function _generateOptions(url, method, params, headers) {
  var options = {
    url: TwbService._getRequestUrl(url, params),
    method: method,
    headers: _.extend(TwbService._getCredentials(), TwbService._getRequestHeaders(headers)),
    body: '',
    async: true,
    handleAs: 'json',
    withCredentials: false
  };
  return options;
};

TwbService._getCredentials = function _getCredentials() {
  var token = TwbService._getAccessToken();
  if (token !== null && token != "null") {
    return {'access-token' : token, 'client' : TwbService._getClient(), 'uid' : TwbService._getUid(), 'token-type' : 'Bearer'};
  }
  else {
    return {};
  }
};

TwbService._sendRequest = function _sendRequest(options, successCallback, errorCallback, callbackObj) {
  var req = document.createElement('iron-request');
  var _this = this;
  req.completes.then( function(result) {
    _this._handleSuccess(req, successCallback, callbackObj);
  }, function(err) {
    _this._handleSuccess(req, errorCallback, callbackObj);
  });
  req.send(options);
};

TwbService._handleSuccess = function _handleSuccess(request, callback, callbackObj) {
  var accessToken = request.xhr.getResponseHeader('access-token');
  var uid         = request.xhr.getResponseHeader('uid');
  var client      = request.xhr.getResponseHeader('client');
  TwbService._setAccessToken(accessToken);
  TwbService._setUid(uid);
  TwbService._setClient(client);
  callback.apply (callbackObj, [request.xhr.response]);
};

TwbService._handleError = function _handleError(request, callback, callbackObj, error) {
  callback.apply (callbackObj, [request.xhr.response]);
};

TwbService._getRequestHeaders = function _getRequestHeaders(headers) {
  var resu = {};
  var header;

  if (headers instanceof Object) {
    for (header in headers) {
      resu[header] = headers[header].toString();
    }
  }

  return resu;
};

TwbService._getQueryString = function _getQueryString(params) {
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

TwbService._getRequestUrl = function _getRequestUrl(url, params) {
  var queryString = TwbService._getQueryString(params);

  if (queryString) {
    return TwbService.BASE_URL + url + '?' + queryString;
  }

  return TwbService.BASE_URL + url;
};

TwbService._getAccessToken = function _getAccessToken() {
  return sessionStorage.getItem('accessToken');
};

TwbService._setAccessToken = function _setAccessToken(token) {
  sessionStorage.setItem('accessToken', token);
};

TwbService._getClient = function _getClient() {
  return sessionStorage.getItem('client');
};

TwbService._setClient = function _setClient(client) {
  sessionStorage.setItem('client', client);
};

TwbService._getUid = function _getUid() {
  return sessionStorage.getItem('uid');
};

TwbService._setUid = function _setUid(uid) {
  sessionStorage.setItem('uid', uid);
};

})(wrap(document));
