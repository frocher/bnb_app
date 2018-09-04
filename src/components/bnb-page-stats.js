import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { updateRoute } from '../actions/app';
import './bnb-chart-card';
import './bnb-period-bar';

class BnbPageStats extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <bnb-period-bar></bnb-period-bar>
    <bnb-chart-card id="lighthouseChart" name="Lighthouse scores" type="bar" data="[[stats.lighthouse]]" model="[[lighthouseModel]]" has-details="true"></bnb-chart-card>
    <bnb-chart-card id="performanceChart" name="Performance" type="line" data="[[stats.performance]]" model="[[performanceModel]]" has-details="true"></bnb-chart-card>
    <bnb-chart-card id="uptimeChart" name="Uptime" type="line" data="[[stats.uptime]]" model="[[uptimeModel]]" has-details="true"></bnb-chart-card>
    <bnb-chart-card id="requestsChart" name="Assets count" type="area" data="[[stats.requests]]" model="[[requestsModel]]" has-details="true"></bnb-chart-card>
    <bnb-chart-card id="bytesChart" name="Assets size" type="area" data="[[stats.bytes]]" model="[[bytesModel]]" has-details="true"></bnb-chart-card>
    `;
  }

  static get properties() {
    return {
      page: {
        type: Object,
      },
      stats: {
        type: Object,
      },
      lighthouseModel: Object,
      performanceModel: Object,
      uptimeModel: Object,
      requestsModel: Object,
      bytesModel: Object,
    };
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.stats = state.app.page_stats;
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
}

window.customElements.define('bnb-page-stats', BnbPageStats);
