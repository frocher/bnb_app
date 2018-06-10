import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { connect } from 'pwa-helpers';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-toast/paper-toast.js';
import { store } from '../store.js';
import { updateRoute, loadEnvironment, loadPages, loadPage, loadPageMembers, loadPageStats, loadBudgets,
  loadLighthouseDetails, loadAssetsDetails, loadUptimeDetails, loadUser } from '../actions/app.js';
import { isLogged } from '../common.js';
import './bnb-analytics.js';
import './bnb-common-styles.js';
import './bnb-home.js';
import './bnb-signin.js';

class BnbApp extends connect(store)(PolymerElement) {

  static get template() {
    return html`
    <style>
      :host {
        --dark-primary-color: #000000;
        --default-primary-color:var(--paper-grey-900);
        --light-primary-color: #303030;
        --text-primary-color: #ffffff; /*text/icons*/
        --accent-color: #FF5722;
        --primary-background-color: #303030;
        --primary-text-color: #ffffff;
        --secondary-text-color: var(--paper-grey-300);
        --disabled-text-color: #bdbdbd;
        --divider-color: #B6B6B6;
        --error-color: #db4437;

        --paper-card-background-color: var(--paper-grey-800);
        --paper-card-header-color: var(--text-primary-color);
        --paper-dialog-button-color: var(--google-blue-300);
        --paper-divider-color: #B6B6B6;
        --paper-input-container-color: var(--secondary-text-color);
        --paper-input-container-focus-color: var(--google-blue-300);
        --paper-radio-button-checked-color: var(--google-blue-300);
        --paper-tabs-selection-bar-color: var(--google-blue-300);
        --paper-toggle-button-checked-button-color: var(--google-blue-300);
        --paper-toggle-button-checked-ink-color: var(--google-blue-500);

        --range-datepicker-cell-hover: var(--google-blue-300);
        --range-datepicker-cell-selected: var(--google-blue-300);
        --range-datepicker-cell-hovered: var(--google-blue-500);

        background-color: var(--primary-background-color);
        @apply --layout-fit;
        @apply --layout-vertical;
      }

      .view {
        @apply --layout-fit;
      }
    </style>

    <app-location route="{{route}}"></app-location>
    <app-route
        route="{{route}}"
        pattern="/:page"
        data="{{routeData}}"
        tail="{{subroute}}"></app-route>

    <bnb-analytics id="analytics" key="[[analyticsKey]]"></bnb-analytics>

    <iron-pages class="view" selected="[[view]]" attr-for-selected="name" selected-attribute="visible" fallback-selection="404">
      <bnb-add-page            name="add-page"            class="view"></bnb-add-page>
      <bnb-bytes-details       name="bytes-details"       class="view"></bnb-bytes-details>
      <bnb-home                name="home"                class="view"></bnb-home>
      <bnb-members             name="members"             class="view"></bnb-members>
      <bnb-edit-page           name="edit-page"           class="view"></bnb-edit-page>
      <bnb-edit-password       name="edit-password"       class="view"></bnb-edit-password>
      <bnb-forgot-password     name="forgot-password"     class="view"></bnb-forgot-password>
      <bnb-lighthouse-details  name="lighthouse-details"  class="view"></bnb-lighthouse-details>
      <bnb-page                name="page"                class="view"></bnb-page>
      <bnb-performance-details name="performance-details" class="view"></bnb-performance-details>
      <bnb-requests-details    name="requests-details"    class="view"></bnb-requests-details>
      <bnb-signin              name="signin"              class="view"></bnb-signin>
      <bnb-signup              name="signup"              class="view"></bnb-signup>
      <bnb-uptime-details      name="uptime-details"      class="view"></bnb-uptime-details>
      <bnb-user-preferences    name="user-preferences"    class="view"></bnb-user-preferences>
      <bnb-404-warning         name="404"                 class="view"></bnb-404-warning>
    </iron-pages>

    <paper-toast id="message-toast" duration="4000"></paper-toast>
    `;
  }

  static get is() { return 'bnb-app'; }

  static get properties() {
    return {
      routePath: {
        type: String,
        reflectToAttribute: true,
        observer: '_routePathChanged'
      },

      view: {
        type: String,
        reflectToAttribute: true,
        observer: '_viewChanged'
      },

      message: {
        type: Object,
        observer: '_messageChanged'
      },

      analyticsKey: {
        type: String
      },

      page: {
        type: Object
      },

      page_stats: {
        type: Object
      },

      period: {
        type: Object,
        observer: '_periodChanged'
      },

      offline: {
        type: Boolean,
        value: false,
        readOnly: true
      }
    };
  }

  static get observers() { return [
    '_routeViewChanged(routeData.page)'
  ]}

  _stateChanged(state) {
    this.routePath = state.app.route;
    this.message = state.app.message;
    this.analyticsKey = state.app.analyticsKey;
    this.page = state.app.page;
    this.page_stats = state.app.page_stats;
    this.period = state.app.period;
  }

  ready() {
    super.ready();
    this.removeAttribute('unresolved');
    loadEnvironment();
    this.scrollPositions = new Map();
  }

  _routePathChanged(path, oldPath) {
    // Store view scroll position
    if (this.scrollPositions) {
      this.scrollPositions.set(this.route.path, window.scrollY);
    }

    window.history.pushState({}, null, '/' + path);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

  _routeViewChanged(view) {
    // Check if we find credentials in parameters (used for omniauth)
    // if true : store credentials and remove them from the query string
    if (this._getUrlParameter('auth_token')) {
      this.storeCredentials(this._getUrlParameter('auth_token'), this._getUrlParameter('uid'), this._getUrlParameter('client_id'));
      this._removeParameters();
    }

    if (view !== 'signin' && view !== 'signup' && view !== 'forgot-password' && view !== 'edit-password') {
      if (!isLogged()) {
        store.dispatch(updateRoute('signin'));
      }
    }
    this.view = view || 'home';
  }

  _viewChanged(view, oldView) {
    if (view !== null) {
      // home and signin route are eagerly loaded
      if (view === 'home' || view === 'signin') {
        this._viewLoaded(Boolean(oldView));
      // other routes are lazy loaded
      } else {
        // When a load failed, it triggered a 404 which means we need to
        // eagerly load the 404 page definition
        let cb = this._viewLoaded.bind(this, Boolean(oldView));
        import('./bnb-' + view + '.js').then(cb);
      }

      // Restore scroll position
      if (this.scrollPositions && this.scrollPositions.has(this.route.path)) {
        window.scroll(0, this.scrollPositions.get(this.route.path));
      }
      else {
        window.scroll(0, 0);
      }
    }
  }

  _viewLoaded(shouldResetLayout) {
    this._ensureLazyLoaded();
    this.$.analytics.sendPath(this.route.path);

    if (isLogged()) {
      this._loadCurrentViewData();
    }
  }

  _loadCurrentViewData() {
    if (this.view === 'home') {
      store.dispatch(loadPages());
    }
    else if (this.view === 'user-preferences') {
      store.dispatch(loadUser());
    }
    else if (this.view === 'page') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadPageStats(pageId, this.period));
      store.dispatch(loadBudgets(pageId, this.period));
    }
    else if (this.view === 'edit-page') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
    }
    else if (this.view === 'members') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadPageMembers(pageId));
    }
    else if (this.view === 'lighthouse-details' || this.view === 'performance-details') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadLighthouseDetails(pageId, this.period));
    }
    else if (this.view === 'uptime-details') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadPage(pageId));
      store.dispatch(loadUptimeDetails(pageId, this.period));
    }
    else if (this.view === 'requests-details' || this.view === 'bytes-details') {
      let pageId = Number(this.subroute.path.substring(1));
      store.dispatch(loadAssetsDetails(pageId, this.period));
    }
  }

  _ensureLazyLoaded() {
    if (!this.loadComplete) {
      afterNextRender(this, () => {
        import('./lazy-resources.js').then(() => {
          // Register service worker if supported.
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js', {scope: '/'});
          }
          this._notifyNetworkStatus();
          this.loadComplete = true;
        });
      });
    }
  }

  _notifyNetworkStatus() {
    let oldOffline = this.offline;
    this._setOffline(!window.navigator.onLine);
    // Show the snackbar if the user is offline when starting a new session
    // or if the network status changed.
    if (this.offline || (!this.offline && oldOffline === true)) {
      if (!this._networkSnackbar) {
        this._networkSnackbar = document.createElement('bnb-snackbar');
        this.root.appendChild(this._networkSnackbar);
      }
      this._networkSnackbar.textContent = this.offline ?
          'You are offline' : 'You are online';
      this._networkSnackbar.open();
    }
  }

  _messageChanged(newVal, oldVal) {
    if (newVal && newVal.text) {
      let toast = this.$['message-toast'];
      toast.show(newVal.text);
    }
  }

  _periodChanged(newVal, oldVal) {
    this._loadCurrentViewData();
  }

  _getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Remove all query string from the url (and hash too)
   */
  _removeParameters() {
    var newLocation = window.location.protocol + '//'+
            window.location.host+
            window.location.pathname;
    window.history.pushState('', document.title, newLocation);
  }
}

customElements.define(BnbApp.is, BnbApp);
