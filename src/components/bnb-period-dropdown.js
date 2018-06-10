import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-dropdown/iron-dropdown.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import 'range-datepicker/range-datepicker.js';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updatePeriod } from '../actions/app.js'
import moment from 'moment';
import './bnb-common-styles.js';


class BnbPeriodDropdown extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      #startDate, #endDate {
        cursor: pointer;
      }

      paper-menu-button {
        margin-left: -0.5em;
        padding: 0;
      }
      paper-item {
        cursor: pointer;
      }

      paper-material {
        padding: 16px;
        display: block;
        background-color: var(--paper-card-background-color);
      }
    </style>

    <div class="layout horizontal end">
      <paper-input id="startDate" label="Date from" value="[[dateFrom]]" readonly on-tap="_handleOpenDropdown"></paper-input>
      <paper-input id="endDate" label="Date to" value="[[dateTo]]" readonly on-tap="_handleOpenDropdown"></paper-input>
      <iron-dropdown id="rangeDropdown" horizontal-align="[[horizontalAlign]]">
        <paper-material slot="dropdown-content">
          <range-datepicker date-from="{{startDate}}" date-to="{{endDate}}"></range-datepicker>
        </paper-material>
      </iron-dropdown>
      <paper-menu-button horizontal-align="right">
        <paper-icon-button icon="arrow-drop-down" slot="dropdown-trigger"></paper-icon-button>
        <paper-listbox slot="dropdown-content" attr-for-selected="data-period">
          <paper-item on-tap="_periodTapped" data-period="today">Today</paper-item>
          <paper-item on-tap="_periodTapped" data-period="this_week">This week</paper-item>
          <paper-item on-tap="_periodTapped" data-period="this_month">This&nbsp;month</paper-item>
          <paper-item on-tap="_periodTapped" data-period="yesterday">Yesterday</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_week">Last week</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_month">Last month</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_7_days">Last 7 days</paper-item>
          <paper-item on-tap="_periodTapped" data-period="last_30_days">Last 30 days</paper-item>
        </paper-listbox>
      </paper-menu-button>
    </div>
    `;
  }

  static get is() { return 'bnb-period-dropdown'; }

  static get properties() {
    return {
      startDate: String,
      endDate: {
        type: String,
        notify: true,
        observer: '_endDateChanged',
      }
    }
  }

  _stateChanged(state) {
    this.dateFrom = moment(state.app.period.start, 'X').format('ll');
    this.dateTo = moment(state.app.period.end, 'X').format('ll');
  }

  _handleOpenDropdown() {
    this.$.rangeDropdown.open();
  }

  _endDateChanged(date) {
    if (date) {
      this.$.rangeDropdown.close();
      let period = {
        start: moment(this.startDate, 'X').toDate(),
        end: moment(this.endDate, 'X').toDate()
      };
      store.dispatch(updatePeriod(period));
    }
  }

  _periodTapped(e) {
    let type = e.currentTarget.dataset.period;
    let startDate = undefined;
    let endDate = undefined;
    switch (type) {
      case 'today':
        startDate = moment().startOf('day').toDate();
        endDate = moment().endOf('day').toDate();
      break;
      case 'this_week':
        startDate = moment().startOf('week').toDate();
        endDate = moment().endOf('week').toDate();
      break;
      case 'this_month':
        startDate = moment().startOf('month').toDate();
        endDate = moment().endOf('month').toDate();
      break;
      case 'yesterday':
        startDate = moment().add(-1, 'days').startOf('day').toDate();
        endDate = moment().add(-1, 'days').endOf('day').toDate();
      break;
      case 'last_week':
        startDate = moment().add(-1, 'weeks').startOf('week').toDate();
        endDate = moment().add(-1, 'weeks').endOf('week').toDate();
      break;
      case 'last_month':
        startDate = moment().add(-1, 'months').startOf('month').toDate();
        endDate = moment().add(-1, 'months').endOf('month').toDate();
      break;
      case 'last_7_days':
        startDate = moment().add(-7, 'days').startOf('day').toDate();
        endDate = moment().endOf('day').toDate();
      break;
      case 'last_30_days':
        startDate = moment().add(-30, 'days').startOf('day').toDate();
        endDate = moment().endOf('day').toDate();
      break;
    }
    store.dispatch(updatePeriod({start:startDate, end:endDate}));
  }
}
window.customElements.define(BnbPeriodDropdown.is, BnbPeriodDropdown);
