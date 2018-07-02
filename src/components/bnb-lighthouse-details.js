import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import '@vaadin/vaadin-grid/vaadin-grid-sorter.js';
import { format } from 'date-fns/esm'
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updateRoute } from '../actions/app.js';
import { getRequestUrl } from '../common.js';
import './bnb-common-styles.js';
import './bnb-grid-styles.js';

class BnbLighthouseDetails extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        @apply --layout-vertical;
      }

      #content {
        padding: 8px;
      }

      .number {
        text-align: right;
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

      <div id="content">
        <vaadin-grid id="toto" theme="compact" items="[[lighthouseDetails]]">
          <vaadin-grid-column>
            <template class="header">
              <vaadin-grid-sorter path="time" direction="desc">time</vaadin-grid-sorter>
            </template>
            <template>[[_formatTime(item.time)]]</template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">pwa</template>
            <template><div class="number">[[item.pwa]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">performance</template>
            <template><div class="number">[[item.performance]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">accessibility</template>
            <template><div class="number">[[item.accessibility]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">best practices</template>
            <template><div class="number">[[item.best_practices]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="100px" flex-grow="0">
            <template class="header">seo</template>
            <template><div class="number">[[item.seo]]</div></template>
          </vaadin-grid-column>
          <vaadin-grid-column width="52px" flex-grow="0">
            <template class="header"></template>
            <template>
              <a href="[[_computeUrl(item.time_key)]]" title="Show report" target="_blank">
                <paper-icon-button icon="visibility"></paper-icon-button>
              </a>
            </template>
          </vaadin-grid-column>
        </vaadin-grid>
      </div>
    </app-header-layout>
    `;
  }

  static get is() { return 'bnb-lighthouse-details'; }

  static get properties() {
    return {
      page: Object,
      lighthouseDetails: Object
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
    return format(time, 'MMM dd, YYYY HH:mm');
  }

  _computeUrl(key) {
    if (key) {
      return getRequestUrl('pages/' + this.page.id + '/lighthouse/' + key);
    }
    return '';
  }
}
window.customElements.define(BnbLighthouseDetails.is, BnbLighthouseDetails);
