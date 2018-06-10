import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-ripple/paper-ripple.js';
import { store } from '../store.js';
import { getRequestUrl } from '../common.js';
import { updateRoute } from '../actions/app.js';


class BnbPageCardGestures extends GestureEventListeners(PolymerElement) {
}

class BnbPageCard extends connect(store)(BnbPageCardGestures) {
  static get template() {
    return html`
    <style>
      paper-card {
        display: block;
        cursor: pointer;
        width: 100%;
        height: 100%;
      }

      .card-content h2 {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-content a {
        display: block;
        color: #9e9e9e;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-content a:hover {
        text-decoration: underline;
      }

      .hurt {
        position:absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left:0;

        -webkit-animation: pulse 5s infinite;
        animation: pulse 5s infinite;

        opacity: 1;
        background-color: red;
      }

      @-webkit-keyframes pulse {
        0% {opacity: 0}
        50% {opacity: 0.3}
        100% {opacity: 0}
      }

      @keyframes pulse {
        0% {opacity: 0}
        50% {opacity: 0.3}
        100% {opacity: 0}
      }
    </style>

    <paper-card placeholder-image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADwAQMAAABL4y8oAAAAA1BMVEW9vb2OR09dAAAAIElEQVR4Xu3AgQAAAADDoPtTX2EAtQAAAAAAAAAAAAAOJnAAAZexSsoAAAAASUVORK5CYII=" fade-image preload-image image="[[_computeScreenshotUrl(page)]]" animated="true" on-tap="cardTapped">
      <div class="card-content">
        <div class$="[[_computeHurt(page)]]"></div>
        <h2>[[page.name]]</h2>
        <a href="[[page.url]]" on-tap="urlTapped" target="_blank" title="Open url in a new tab">[[page.url]]</a>
      </div>
      <paper-ripple></paper-ripple>

    </paper-card>
    `;
  }

  static get is() { return 'bnb-page-card'; }

  static get properties() {
    return {
      page: {
        type: Object,
        value: null
      }
    }
  }

  _stateChanged(state) {
    // Nothing to do
  }

  cardTapped(e) {
    store.dispatch(updateRoute('page/' + this.page.id));
  }

  urlTapped(e) {
    e.stopPropagation();
  }

  _computeScreenshotUrl(item) {
    return getRequestUrl('pages/' + item.id + '/screenshot?style=thumb');
  }

  _computeHurt(item) {
    if (item.uptime_status === 0) {
      return 'hurt';
    }
    return '';
  }
}
window.customElements.define(BnbPageCard.is, BnbPageCard);
