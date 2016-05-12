(function(document) {
  'use strict';

  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';

  // Logged user informations
  app.user  = null;

  // Loaded pages
  app.pages = null;

  // Current page
  app.page = null;

  window.addEventListener('WebComponentsReady', function() {
    var loadEl = document.getElementById('splash');
    loadEl.addEventListener('transitionend', loadEl.remove);
    loadEl.classList.remove('loading');
  });

  app.isLogged = function() {
    return sessionStorage.getItem('accessToken') !== null;
  };

})(wrap(document));
