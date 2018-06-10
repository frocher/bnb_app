import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import moment from 'moment';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updateRoute } from '../actions/app.js';
import { getRequestUrl } from '../common.js';
import './bnb-common-styles.js';
import './bnb-grid-styles.js';

class BnbUptimeDetails extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        padding: 8px;
      }

      .center {
        text-align: center;
      }

      .down {
        color: #fff;
        border-radius: 4px;
        text-align: center;
        padding: 2px;
        background-color: #B71C1C;
      }

      .up {
        color: #fff;
        border-radius: 4px;
        text-align: center;
        padding: 2px;
        background-color: #1B5E20;
      }

      a {
        color: rgba(0, 0, 0, var(--dark-primary-opacity));
      }

      vaadin-grid {
        height: calc(100vh - 80px);
      }
    </style>

    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="arrow-back" on-tap="_backTapped"></paper-icon-button>
          <span>[[page.name]]</span>
        </app-toolbar>
      </app-header>

      <div id="content" class="fit">
        <vaadin-grid id="grid" theme="bnb-grid" items="[[uptimeDetails]]">
          <vaadin-grid-column width="155px" flex-grow="0">
            <template class="header">
              <vaadin-grid-sorter path="time" direction="desc">time</vaadin-grid-sorter>
            </template>
            <template>[[_formatTime(item.time)]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column width="70px" flex-grow="0">
            <template class="header">Status</template>
            <template>
              <div class$="[[_statusClass(item.value)]]">
                [[_formatStatus(item.value)]]
              </div>
            </template>
          </vaadin-grid-column>
          <vaadin-grid-column width="60px" flex-grow="0">
            <template class="header">Code</template>
            <template><div class="center">[[item.error_code]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column flex-grow="1">
            <template class="header">Message</template>
            <template>[[item.error_message]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column width="52px" flex-grow="0">
            <template class="header"></template>
            <template>
              <div hidden$="[[!item.time_key]]">
                <a href="[[_computeUrl(item.time_key)]]" title="Show content" target="_blank">
                  <paper-icon-button icon="visibility"></paper-icon-button>
                </a>
              </div>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    </app-header-layout>
    `;
  }

  static get is() { return 'bnb-uptime-details'; }

  static get properties() {
    return {
      page: Object,
      uptimeDetails: Object
    }
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.uptimeDetails = state.app.uptimeDetails;
  }

  _backTapped() {
    store.dispatch(updateRoute('page/' + this.page.id));
  }

  _formatTime(time) {
    return moment(time).format('lll');
  }

  _statusClass(value) {
    return value === 0 ? 'down' : 'up';
  }

  _formatStatus(value) {
    return value === 0 ? 'Down' : 'Up';
  }

  _statusClass(value) {
    return value === 0 ? 'down' : 'up';
  }

  _computeUrl(key) {
    if (key) {
      return getRequestUrl('pages/' + this.page.id + '/uptime/' + key);
    }
    return '';
  }
}
window.customElements.define(BnbUptimeDetails.is, BnbUptimeDetails);
