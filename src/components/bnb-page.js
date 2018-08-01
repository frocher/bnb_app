import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/app-layout/app-layout';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-dialog/paper-dialog';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-menu-button/paper-menu-button';
import '@polymer/paper-tabs/paper-tab';
import '@polymer/paper-tabs/paper-tabs';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import {
  updateRoute, deletePage, deletePageMember, createBudget, deleteBudget,
} from '../actions/app';
import './bnb-common-styles';
import './bnb-budget-bar';
import './bnb-budget-card';
import './bnb-chart-card';
import './bnb-divider';
import './bnb-icons';
import './bnb-period-bar';

class BnbPage extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
    :host {
      @apply --layout-vertical;
    }

    #charts {
      @apply --layout-vertical;
      @apply --layout-wrap;
      @apply --layout-center-justified;
    }

    paper-item {
      cursor: pointer;
    }
    </style>

    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="arrow-back" on-tap="backTapped"></paper-icon-button>
          <span main-title>[[page.name]]</span>
          <paper-menu-button horizontal-align="right">
            <paper-icon-button icon="more-vert" slot="dropdown-trigger"></paper-icon-button>
            <paper-listbox slot="dropdown-content">
              <paper-item on-tap="editTapped" hidden$="{{!page.can_edit}}">Settings</paper-item>
              <paper-item on-tap="membersTapped">Members</paper-item>
              <bnb-divider></bnb-divider>
              <paper-item on-tap="deleteTapped" hidden$="{{!page.can_delete}}">Delete</paper-item>
              <paper-item on-tap="leaveTapped" hidden$="{{page.can_delete}}">Leave</paper-item>
            </paper-listbox>
          </paper-menu-button>
        </app-toolbar>
        <paper-tabs selected="{{selectedTab}}" sticky>
          <paper-tab>Statistics</paper-tab>
          <paper-tab>Budget</paper-tab>
        </paper-tabs>
      </app-header>

      <div id="content" class="fit">
        <div id="charts">
          <iron-pages selected="[[selectedTab]]">
            <section>
              <bnb-period-bar></bnb-period-bar>
              <bnb-chart-card id="lighthouseChart" name="Lighthouse scores" type="bar" data="[[stats.lighthouse]]" model="[[lighthouseModel]]" has-details="true"></bnb-chart-card>
              <bnb-chart-card id="performanceChart" name="Performance" type="line" data="[[stats.performance]]" model="[[performanceModel]]" has-details="true"></bnb-chart-card>
              <bnb-chart-card id="uptimeChart" name="Uptime" type="line" data="[[stats.uptime]]" model="[[uptimeModel]]" has-details="true"></bnb-chart-card>
              <bnb-chart-card id="requestsChart" name="Assets count" type="area" data="[[stats.requests]]" model="[[requestsModel]]" has-details="true"></bnb-chart-card>
              <bnb-chart-card id="bytesChart" name="Assets size" type="area" data="[[stats.bytes]]" model="[[bytesModel]]" has-details="true"></bnb-chart-card>
            </section>
            <section>
              <bnb-budget-bar id="budgetBar" can-add="[[page.can_create_budget]]"></bnb-budget-bar>
              <template is="dom-repeat" items="[[budgets]]">
                <bnb-budget-card budget-info="[[item]]" can-delete="[[page.can_delete_budget]]" on-close="budgetCloseTapped"></bnb-budget-card>
              </template>
            </section>
          </iron-pages>
        </div>

      </div>
    </app-header-layout>

    <paper-dialog id="deleteDlg" modal>
      <p>Are you really sure you want to delete page ? All data will be lost</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="deletePageTapped">Delete</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="leaveDlg" modal>
      <p>Leave this page, sure ?</p>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm autofocus on-tap="leavePageTapped">Leave</paper-button>
      </div>
    </paper-dialog>
    `;
  }

  static get properties() {
    return {
      page: {
        type: Object,
      },
      stats: {
        type: Object,
        observer: '_statsChanged',
      },
      selectedTab: {
        type: Number,
        reflectToAttribute: true,
        value: 0,
      },
      lighthouseModel: Object,
      performanceModel: Object,
      uptimeModel: Object,
      requestsModel: Object,
      bytesModel: Object,
      budgets: Array,
      _budgets: {
        type: Array,
        observer: '_budgetsChanged',
      },
    };
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.stats = state.app.page_stats;
    this._budgets = state.app.budgets;
  }

  ready() {
    super.ready();

    this.lighthouseModel = [
      { name: 'pwa', color: '#4A148C', label: 'pwa' },
      { name: 'performance', color: '#7B1FA2', label: 'performance' },
      { name: 'accessibility', color: '#9C27B0', label: 'accessibility' },
      { name: 'best_practices', color: '#BA68C8', label: 'best practices' },
      { name: 'seo', color: '#E1BEE7', label: 'seo' },
    ];

    this.performanceModel = [
      {
        name: 'first_byte', color: '#E65100', label: 'first byte', suffix: 'ms',
      },
      {
        name: 'first_paint', color: '#F57C00', label: 'first paint', suffix: 'ms',
      },
      {
        name: 'speed_index', color: '#FF9800', label: 'speed index',
      },
      {
        name: 'interactive', color: '#FFB74D', label: 'interactive', suffix: 'ms',
      },
    ];

    this.uptimeModel = [
      {
        name: 'uptime', color: '#00C853', label: 'uptime', suffix: '%',
      },
    ];

    this.requestsModel = [
      { name: 'html', color: '#01579B', label: 'html' },
      { name: 'css', color: '#0288D1', label: 'css' },
      { name: 'js', color: '#03A9F4', label: 'javascript' },
      { name: 'image', color: '#4FC3F7', label: 'image' },
      { name: 'font', color: '#81D4FA', label: 'font' },
      { name: 'other', color: '#B3E5FC', label: 'other' },
    ];

    this.bytesModel = [
      {
        name: 'html', color: '#880E4F', label: 'html', suffix: 'kb',
      },
      {
        name: 'css', color: '#C2185B', label: 'css', suffix: 'kb',
      },
      {
        name: 'js', color: '#D81B60', label: 'javascript', suffix: 'kb',
      },
      {
        name: 'image', color: '#EC407A', label: 'image', suffix: 'kb',
      },
      {
        name: 'font', color: '#F48FB1', label: 'font', suffix: 'kb',
      },
      {
        name: 'other', color: '#F8BBD0', label: 'other', suffix: 'kb',
      },
    ];

    this.$.lighthouseChart.addEventListener('details', this.lightHouseChartDetailsTapped.bind(this));
    this.$.performanceChart.addEventListener('details', this.performanceChartDetailsTapped.bind(this));
    this.$.uptimeChart.addEventListener('details', this.uptimeChartDetailsTapped.bind(this));
    this.$.requestsChart.addEventListener('details', this.requestsChartDetailsTapped.bind(this));
    this.$.bytesChart.addEventListener('details', this.bytesChartDetailsTapped.bind(this));

    this.$.budgetBar.addEventListener('add', this.handleAddBudget.bind(this));
  }

  _statsChanged() {
    if (this.stats) {
      this._updateBudgets();
    } else {
      this.budgets = [];
    }
  }

  _budgetsChanged() {
    if (this.stats) {
      this._updateBudgets();
    }
  }

  _updateBudgets() {
    const budgets = [];
    if (this._budgets) {
      for (let i = 0; i < this._budgets.length; i += 1) {
        budgets.push(this.createBudgetObject(this._budgets[i]));
      }
      budgets.sort((a, b) => {
        if (a.category > b.category) {
          return 1;
        }
        if (a.category < b.category) {
          return -1;
        }
        return a.item > b.item ? 1 : -1;
      });
    }
    this.budgets = budgets;
  }

  backTapped() {
    store.dispatch(updateRoute('home'));
  }

  editTapped() {
    store.dispatch(updateRoute(`edit-page/${this.page.id}`));
  }

  membersTapped() {
    store.dispatch(updateRoute(`members/${this.page.id}`));
  }

  deleteTapped() {
    this.$.deleteDlg.open();
  }

  deletePageTapped() {
    store.dispatch(deletePage(this.page.id));
  }

  leaveTapped() {
    this.$.leaveDlg.open();
  }

  leavePageTapped() {
    store.dispatch(deletePageMember(this.page.id, -1));
  }

  lightHouseChartDetailsTapped() {
    store.dispatch(updateRoute(`lighthouse-details/${this.page.id}`));
  }

  performanceChartDetailsTapped() {
    store.dispatch(updateRoute(`performance-details/${this.page.id}`));
  }

  uptimeChartDetailsTapped() {
    store.dispatch(updateRoute(`uptime-details/${this.page.id}`));
  }

  requestsChartDetailsTapped() {
    store.dispatch(updateRoute(`requests-details/${this.page.id}`));
  }

  bytesChartDetailsTapped() {
    store.dispatch(updateRoute(`bytes-details/${this.page.id}`));
  }

  handleAddBudget(e) {
    store.dispatch(createBudget(this.page.id, e.detail.category, e.detail.item, e.detail.budget));
  }

  createBudgetName(category, item) {
    const data = [
      { name: 'Lighthouse', values: ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Average'] },
      { name: 'Performance', values: ['First byte', 'First paint', 'Speed index', 'Interactive'] },
      { name: 'Assets count', values: ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'] },
      { name: 'Assets size', values: ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'] },
    ];
    return `${data[category].name}/${data[category].values[item]}`;
  }

  createBudgetObject(src) {
    let model;
    let data;
    switch (src.category) {
      case 0:
        model = this.lighthouseModel;
        data = this.stats.lighthouse;
        break;
      case 1:
        model = this.performanceModel;
        data = this.stats.performance;
        break;
      case 2:
        model = this.requestsModel;
        data = this.stats.requests;
        break;
      case 3:
        model = this.bytesModel;
        data = this.stats.bytes;
        break;
    }

    let budgetModel;
    let budgetData;
    if (src.item >= data.length) {
      switch (src.category) {
        case 0:
          budgetModel = { label: 'average', color: '#D500F9' };
          budgetData = { key: 'average', values: this.createAverageData(data) };
          break;
        case 2:
          budgetModel = { label: 'total', color: '#00B0FF' };
          budgetData = { key: 'total', values: this.createTotalData(data) };
          break;
        case 3:
          budgetModel = { label: 'total', color: '#FF80AB' };
          budgetData = { key: 'total', values: this.createTotalData(data) };
          break;
      }
    } else {
      budgetModel = model[src.item];
      budgetData = data[src.item];
    }

    return {
      id: src.id,
      category: src.category,
      item: src.item,
      name: this.createBudgetName(src.category, src.item),
      model: budgetModel,
      data: budgetData,
      budget: src.budget,
    };
  }

  createTotalData(data) {
    const total = [];
    for (let iSet = 0; iSet < data.length; iSet += 1) {
      for (let iData = 0; iData < data[iSet].values.length; iData += 1) {
        if (total[iData] === undefined) {
          total[iData] = JSON.parse(JSON.stringify(data[iSet].values[iData]));
        } else {
          total[iData].value = Math.round(total[iData].value + data[iSet].values[iData].value);
        }
      }
    }
    return total;
  }

  createAverageData(data) {
    const average = this.createTotalData(data);
    if (data.length > 0) {
      for (let i = 0; i < average.length; i += 1) {
        average[i].value = Math.round(average[i].value / data.length);
      }
    }
    return average;
  }

  budgetCloseTapped(e) {
    store.dispatch(deleteBudget(this.page.id, e.detail.id));
  }
}
window.customElements.define('bnb-page', BnbPage);
