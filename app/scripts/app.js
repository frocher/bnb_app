(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Period constants
  app.THIS_MONTH    = 'this_month';
  app.THIS_WEEK     = 'this_week';
  app.THIS_DAY      = 'this_day';
  app.CUSTOM_PERIOD = 'custom';

  // Sets app default base URL
  app.baseUrl = '/';

  /** Logged user informations **/
  app.user  = null;

  /** Loaded pages */
  app.pages = null;

  /** Current page */
  app.page = null;

  /** Selected period type */
  app.period = null;

  /** Custom period informations {startDate, endDate} */
  app.customPeriod = {startDate:null, endDate:null};

  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });


  app.isLogged = function() {
    return sessionStorage.getItem('accessToken') !== null;
  };


  app.getPeriodStart = function() {
    var result = null;

    switch (this.period) {
      case app.THIS_MONTH:
        result = moment().startOf('month');
        break;
      case app.THIS_WEEK:
        result = moment().startOf('week');
        break;
      case app.THIS_DAY:
        result = moment().startOf('day');
        break;
      case app.CUSTOM_PERIOD:
        result = app.customPeriod.startDate;
        break;
    }
    return result;
  };

  app.getPeriodEnd = function() {
    var result = null;

    switch (this.period) {
      case app.THIS_MONTH:
        result = moment().endOf('month');
        break;
      case app.THIS_WEEK:
        result = moment().endOf('week');
        break;
      case app.THIS_DAY:
        result = moment().endOf('day');
        break;
      case app.CUSTOM_PERIOD:
        result = app.customPeriod.endDate;
        break;
    }
    return result;
  };

})(wrap(document));
