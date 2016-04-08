(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Sets app default base URL
  app.baseUrl = '/';

  /** Logged user informations **/
  app.user  = null;

  /** Loaded pages */
  app.pages = null;

  /** Current page */
  app.page = null;

  app.isLogged = function() {
    return sessionStorage.getItem('accessToken') !== null;
  };
})(wrap(document));
