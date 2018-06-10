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

class BnbRequestsDetails extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        padding: 8px;
      }

      a {
        color: rgba(0, 0, 0, var(--dark-primary-opacity));
      }

      .right {
        text-align: right;
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
        <vaadin-grid id="grid" theme="bnb-grid" items="[[assetsDetails]]">
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="time" direction="desc">time</vaadin-grid-sorter>
            </template>
            <template>[[_formatTime(item.time)]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">html</template>
            <template><div class="right">[[item.html_requests]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">css</template>
            <template><div class="right">[[item.css_requests]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">javascript</template>
            <template><div class="right">[[item.js_requests]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">image</template>
            <template><div class="right">[[item.image_requests]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">font</template>
            <template><div class="right">[[item.font_requests]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
              <template class="header">other</template>
              <template><div class="right">[[item.other_requests]]</div></template>
            </vaadin-grid-column>
            <vaadin-grid-column width="52px" flex-grow="0">
            <template class="header"></template>
            <template>
              <a href="[[_computeUrl(item.time_key)]]" title="Show HAR" target="_blank">
                <paper-icon-button icon="visibility"></paper-icon-button>
              </a>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    </app-header-layout>
    `;
  }

  static get is() { return 'bnb-requests-details'; }

  static get properties() {
    return {
      page: Object,
      assetsDetails: Object,
    }
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.lighthouseDetails = state.app.lighthouse_details;
  }

  _backTapped() {
    store.dispatch(updateRoute('page/' + this.page.id));
  }

  _formatTime(time) {
    return moment(time).format('lll');
  }

  _computeUrl(key) {
    if (key) {
      let result = 'http://www.softwareishard.com/har/viewer/?inputUrl=';
      result += window.location.protocol + '//' + window.location.host;
      result += getRequestUrl('pages/' + this.page.id + '/assets/' + key);
      return result;
    }
    return '';
  }
}
window.customElements.define(BnbRequestsDetails.is, BnbRequestsDetails);
