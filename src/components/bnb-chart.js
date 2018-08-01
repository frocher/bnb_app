import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior';
import '@polymer/iron-pages/iron-pages';
import '@polymer/paper-spinner/paper-spinner';
import { isEqual, find } from 'lodash-es';

class BnbChart extends mixinBehaviors([IronResizableBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: inline-block;
      }

      iron-pages {
        width: 100%;
        height: 100%;
      }

      #canvas {
        position:relative;
        width: 100%;
        height: 100%;
      }

      #loading {
        display: flex;

        width: 100%;
        height: 100%;

        color: #999;

        font-size: 24px;

        align-items: center;
        justify-content: center;
      }

      #noData {
        display: flex;
        width: 100%;
        height: 100%;
        color: #999;
        font-size: 36px;
        align-items: center;
        justify-content: center;
      }

      #noData span {
        margin-top: -50px;
      }
    </style>

    <iron-pages selected="[[selectedPage]]">
      <div id="loading">
        <span>Loading&nbsp;</span>
        <paper-spinner active></paper-spinner>
      </div>
      <div id="noData"><span>No data</span></div>
      <div id="canvas">
        <canvas id="chart"></canvas>
      </div>
    </iron-pages>
    `;
  }

  static get properties() {
    return {
      chart: {
        notify: true,
      },
      data: {
        type: Object,
        value() {
          return null;
        },
      },
      model: {
        type: Array,
        value() {
          return [];
        },
      },
      symbol: {
        type: String,
        value: '',
      },
      type: {
        type: String,
        value: 'line',
      },
      selectedPage: {
        type: Number,
        value: 0,
      },
    };
  }

  static get observers() {
    return [
      'updateChart(data.*)',
    ];
  }

  ready() {
    super.ready();
    this.addEventListener('iron-resize', this.onIronResize);
  }

  onIronResize() {
    if (this.chart) {
      this.chart.resize();
      this.chart.render(true);
    }
  }

  updateChart() {
    if (this.data) {
      if (this.hasValues(this.data)) {
        this.selectedPage = 2;
      } else {
        this.selectedPage = 1;
      }
    } else {
      this.selectedPage = 0;
    }

    if (this.data && this.hasValues(this.data)) {
      const chartData = this.createChartData();

      if (this.chart) {
        if (!isEqual(this.oldData, this.data)) {
          this.chart.data.datasets = chartData.datasets;
          this.chart.options.scales.xAxes[0].time.unit = this.computeTickFormat(chartData);
          this.chart.update();

          this.oldData = this.data;
        }
      } else {
        let chartType = 'line';
        switch (this.type) {
          case 'area':
          case 'line':
            chartType = 'line';
            break;
          case 'bar':
            chartType = 'bar';
            break;
        }

        const options = {
          maintainAspectRatio: false,
          legend: {
            position: 'bottom',
            labels: {
              fontColor: '#fff',
            },
          },
          tooltips: {
            position: 'nearest',
            mode: 'index',
            intersect: false,
            callbacks: {},
          },
          scales: {
            xAxes: [{
              stacked: this.type === 'bar',
              type: 'time',
              time: {
                unit: this.computeTickFormat(chartData),
                displayFormats: {
                  hour: 'MMM D hA',
                },
              },
              ticks: {
                fontColor: '#fff',
              },
            }],
            yAxes: [{
              stacked: this.type === 'area' || this.type === 'bar',
              ticks: {
                fontColor: '#fff',
                beginAtZero: true,
              },
            }],
          },
        };

        if (this.type === 'area') {
          options.tooltips.callbacks.footer = function (tooltipItems, data) {
            let sum = 0;
            tooltipItems.forEach((tooltipItem) => {
              sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
            });
            return `Total: ${Math.round(sum)}`;
          };
        } else if (this.type === 'bar') {
          options.tooltips.callbacks.footer = function (tooltipItems, data) {
            let sum = 0;
            tooltipItems.forEach((tooltipItem) => {
              sum += data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].y;
            });
            return `Average: ${Math.round(sum / tooltipItems.length)}`;
          };
        }

        const ctx = this.$.chart;
        this.chart = new Chart(ctx, {
          type: chartType,
          data: chartData,
          options,
        });
      }
    }
  }

  transparentize(color, opacity) {
    const alpha = opacity === undefined ? 0.5 : 1 - opacity;
    return Color(color).alpha(alpha).rgbString();
  }

  hasValues(data) {
    let resu = false;
    for (let i = 0; i < data.length && !resu; i += 1) {
      resu = data[i].values.length > 0;
    }
    return resu;
  }

  createChartData() {
    const resu = {
      datasets: [],
    };
    for (let i = 0; i < this.model.length; i += 1) {
      const dataset = {};
      dataset.label = this.model[i].label;
      dataset.fill = i === 0 ? 'origin' : '-1';
      dataset.backgroundColor = this.transparentize(this.model[i].color);
      dataset.borderColor = this.model[i].color;
      dataset.data = this.createValues(this.model[i].name);
      resu.datasets.push(dataset);
    }
    return resu;
  }

  createValues(key) {
    const item = find(this.data, i => i.key === key);
    const resu = [];
    if (item) {
      for (let i = 0; i < item.values.length; i += 1) {
        resu.push({ x: new Date(item.values[i].time), y: item.values[i].value });
      }
    }
    return resu;
  }

  computeTickFormat(chartData) {
    let resu = 'day';
    if (chartData.datasets.length > 0) {
      const dataset = chartData.datasets[0];
      const first = dataset.data[0].x;
      const last = dataset.data[dataset.data.length - 1].x;
      if ((last - first) < (7 * 24 * 60 * 60 * 1000)) {
        resu = 'hour';
      }
    }
    return resu;
  }
}
window.customElements.define('bnb-chart', BnbChart);
