import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/social-icons.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-toggle-button/paper-toggle-button.js';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updateRoute, updateUser, saveSubscription } from '../actions/app.js';
import './bnb-collapse.js';
import './bnb-common-styles.js';
import './bnb-divider.js';
import { BnbFormElement } from './bnb-form-element.js';

class BnbUserPreferences extends connect(store)(BnbFormElement(PolymerElement)) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-horizontal;
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      #container {
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
        @apply --layout-vertical;
      }
    </style>

    <iron-a11y-keys keys="enter" target="[[target]]" on-keys-pressed="saveTapped">
    </iron-a11y-keys>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="close" on-tap="closeTapped"></paper-icon-button>
          <span class="title">User preferences</span>
          <span class="flex"></span>
          <paper-button on-tap="saveTapped">Save</paper-button>
        </app-toolbar>
      </app-header>
      <div id="content" class="fit">
        <div id="container">
          <bnb-collapse icon="icons:info" header="General" opened>
            <paper-input id="name" label="Name" value="[[user.name]]" autofocus="true"></paper-input>
            <paper-toggle-button id="pushButton" disabled="[[!isNotificationsEnabled()]]">Send me notifications on this device</paper-toggle-button>
          </bnb-collapse>
          <bnb-divider></bnb-divider>
        </div>
      </div>
    </app-header-layout>

    <paper-dialog id="discardDlg" modal>
      <p>Discard edit.</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="closePage">Discard</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get is() { return 'bnb-user-preferences'; }

  static get properties() {
    return {
      user: Object,
      target: Object,
      pushKey: {
        type: String,
        observer: 'pushKeyChanged'
      },
      errors: {
        type: Object,
        observer: '_errorsChanged'
      }
    }
  }

  _stateChanged(state) {
    this.user = state.app.user;
    this.pushKey = state.app.pushKey;
    this.errors = state.app.errors;
  }

  ready() {
    super.ready();
    this.target = this.$.content;

    if (this.isNotificationsEnabled()) {
      this.$.pushButton.addEventListener('checked-changed', this.notificationsChanged.bind(this));

      this.getNotificationPermissionState().then((state) => {
        this.$.pushButton.checked = state === 'granted';
      });
    }
  }

  notificationsChanged() {
    this.$.pushButton.disabled = true;

    if (this.$.pushButton.checked) {
      this.askPermission()
      .then(() => {
        return this.subscribeUserToPush()
      })
      .then((subscription) => {
        if (subscription) {
          this.sendSubscriptionToBackEnd(subscription);
        }

        return subscription;
      })
      .then((subscription) => {
        this.$.pushButton.disabled = false;
        this.$.pushButton.checked = subscription !== null;
      })
      .catch((err) => {
        this.getNotificationPermissionState().then((state) => {
          this.$.pushButton.disabled = state === 'denied';
        });
        this.$.pushButton.checked = false;
      });
    }
    else {
      this.unsubscribeUserFromPush();
    }
  }

  pushKeyChanged() {
    if (this.isNotificationsEnabled()) {
      this.$.pushButton.addEventListener('checked-changed', this.notificationsChanged.bind(this));
      this.$.pushButton.disabled = !this.isNotificationsEnabled();
      this.getNotificationPermissionState().then((state) => {
        this.$.pushButton.checked = state === 'granted';
      });
    }
  }

  closeTapped() {
    if (this.$['name'].value !== this.user.name) {
      this.$.discardDlg.open();
    }
    else {
      this.closePage();
    }
  }

  closePage() {
    this.$['name'].invalid = false;
    store.dispatch(updateRoute('home'));
  }

  saveTapped() {
    this.$['name'].invalid = false;
    let user = { name: this.$['name'].value };
    store.dispatch(updateUser(this.user.id, user));
  }

  askPermission() {
    return new Promise((resolve, reject) => {
      const permissionResult = Notification.requestPermission((result) => {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
    .then((permissionResult) => {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
    });
  }

  getNotificationPermissionState() {
    if (navigator.permissions) {
      return navigator.permissions.query({name: 'notifications'})
      .then((result) => {
        return result.state;
      });
    }

    return new Promise((resolve) => {
      resolve(Notification.permission);
    });
  }

  isNotificationsEnabled() {
    return this.pushKey && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  getSWRegistration() {
    return navigator.serviceWorker.getRegistration();
  }

  subscribeUserToPush() {
    return this.getSWRegistration()
    .then((registration) => {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(this.pushKey)
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then((pushSubscription) => {
      return pushSubscription;
    });
  }

  unsubscribeUserFromPush() {
    return this.getSWRegistration()
      .then((registration) => {
        return registration.pushManager.getSubscription();
      })
      .then((subscription) => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .then((subscription) =>  {
        this.$.pushButton.disabled = false;
        this.$.pushButton.checked = false;
      })
      .catch((err) => {
        console.error('Failed to subscribe the user.', err);
        this.getNotificationPermissionState()
        .then((permissionState) => {
          this.$.pushButton.disabled = permissionState === 'denied';
          this.$.pushButton.checked = false;
        });
      });
  }

  sendSubscriptionToBackEnd(subscription) {
    store.dispatch(saveSubscription(subscription));
  }

  urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

}

window.customElements.define(BnbUserPreferences.is, BnbUserPreferences);
