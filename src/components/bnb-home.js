import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-spinner/paper-spinner.js';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updateRoute, signout } from '../actions/app.js';
import './bnb-common-styles.js';
import './bnb-divider.js';
import './bnb-page-card.js';

class BnbHome extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">

      paper-item {
        cursor: pointer;
      }

      #noData, #loading {
        display: flex;
        width: 100%;
        height: calc(100vh - 65px);
        color: #999;
        font-size: 24px;
        align-items: center;
        justify-content: center;
      }

      #withData {
        display: block;
        position: relative;
        @apply --layout-horizontal;
        @apply --layout-center-center;
        @apply --layout-wrap;
        margin-top: 10px;
      }

      #withData > .item {
        -webkit-flex: 1 calc(25% - 30px);
        flex: 1 calc(25% - 30px);
        max-width: calc(25% - 30px);
        margin: 10px;
        text-decoration: none;
      }

      @media (max-width: 1200px) {
        #withData {
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData > .item {
          -webkit-flex: 1 calc(33% - 20px);
          flex: 1 calc(33% - 20px);
          max-width: calc(33% - 20px);
          margin: 10px;
          text-decoration: none;
        }
      }

      @media (max-width: 700px) {
        #withData {
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData > .item {
          -webkit-flex: 1 calc(50% - 20px);
          flex: 1 calc(50% - 20px);
          max-width: calc(50% - 20px);
          margin: 10px;
          text-decoration: none;
        }
      }

      @media (max-width: 400px) {
        #withData{
          padding-left: 10px;
          padding-right: 10px;
        }
        #withData> .item {
          -webkit-flex: 1 calc(100% - 10px);
          flex: 1 calc(100% - 10px);
          max-width: calc(100% - 10px);
          margin: 5px;
          text-decoration: none;
        }
      }
      </style>

      <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <div main-title>All pages</div>
          <paper-icon-button icon="add" on-tap="_addTapped"></paper-icon-button>
          <paper-menu-button horizontal-align="right">
            <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content">
              <paper-item on-tap="_preferencesTapped">User preferences</paper-item>
              <bnb-divider></bnb-divider>
              <paper-item on-tap="_signoutTapped">Log out</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </app-toolbar>
      </app-header>
      <iron-pages selected="[[selectedSection]]">
        <section id="loading">
          <span>Loading&nbsp;</span>
          <paper-spinner active></paper-spinner>
        </section>
        <section id="noData">Don't you dare try the + button in the toolbar !</section>
        <section id="withData">
          <template is="dom-repeat" items="[[pages]]" sort="_sortPages">
            <bnb-page-card page="[[item]]" class="item"></bnb-page-card>
          </template>
        </section>
      </iron-pages>
      </app-header-layout>
      `;
  }


  static get is() { return 'bnb-home'; }

  static get properties() {
    return {
      pages: {
        type: Array,
        observer: '_pagesChanged'
      },
      selectedSection: {
        type: Number,
        value: 0
      }
    }
  }

  _stateChanged(state) {
    this.pages = state.app.pages;
  }

  _sortPages(first, second) {
    let a = first.name.toUpperCase();
    let b = second.name.toUpperCase();
    return a.localeCompare(b);
  }

  _addTapped() {
    store.dispatch(updateRoute('add-page'));
  }

  _preferencesTapped() {
    store.dispatch(updateRoute('user-preferences'));
  }

  _signoutTapped() {
    store.dispatch(signout());
  }

  _pagesChanged() {
    if (this.pages === null || this.pages === undefined) {
      this.selectedSection = 0;
    }
    else if (this.pages.length === 0) {
      this.selectedSection = 1;
    }
    else {
      this.selectedSection = 2;
    }
  }
}

customElements.define(BnbHome.is, BnbHome);