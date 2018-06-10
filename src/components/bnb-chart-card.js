import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-tabs/paper-tabs.js';
import './bnb-chart.js';
import './bnb-value-chip.js';

class BnbChartCard extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        margin: 16px;
      }

      paper-card {
        width: 100%;
      }

      #chips {
        text-align: center;
        align-items: stretch;
        @apply --layout-horizontal;
        @apply --layout-wrap;
      }

      bnb-value-chip {
        flex: 1;
      }

      #chart {
        width: 100%;
        height: 340px;
      }
    </style>

    <paper-card heading="[[name]]">
      <div class="card-content">
        <div id="chips">
          <template is="dom-repeat" id="values" items="[[data]]">
            <bnb-value-chip text="[[computeLabel(item)]]" value="[[item.summary]]" suffix="[[computeSuffix(item)]]">
            </bnb-value-chip>
          </template>
        </div>
        <bnb-chart id="chart" type="[[type]]" data="[[data]]" model="[[model]]"></bnb-chart>
      </div>
      <div class="card-actions" hidden$='[[!hasDetails]]'>
        <paper-button on-tap="_detailsTapped"><iron-icon icon="icons:toc"></iron-icon>Details</paper-button>
      </div>
    </paper-card>
    `;
  }

  static get is() { return 'bnb-chart-card'; }

  static get properties() {
    return {
      name: {
        type: String,
        value: ''
      },
      data: {
        type: Array,
        value: function () {
          return [];
        }
      },
      model: {
        type: Array,
        value: function () {
          return [];
        }
      },
      type: {
        type: String,
        value: 'line'
      },
      hasDetails: {
        type: Boolean,
        value: false
      }
    }
  }

  ready() {
    super.ready();
    this._polyfillFind();
  }

  computeLabel(o) {
    let item = this.model.find(function(i) { return i.name === o.key; });
    if (item) {
      return item.label;
    }
    return '';
  }

  computeSuffix(o) {
    let item = this.model.find(function(i) { return i.name === o.key; });
    if (item) {
      return item.suffix;
    }
    return '';
  }

  _detailsTapped() {
    this.dispatchEvent(new CustomEvent('details'));
  }

  _polyfillFind() {
    if (!Array.prototype.find) {
      Object.defineProperty(Array.prototype, 'find', {
        value: function(predicate) {
          if (!this) {
            throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this);
          var len = o.length >>> 0;

          if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
          }

          var thisArg = arguments[1];
          var k = 0;

          while (k < len) {
            var kValue = o[k];
            if (predicate.call(thisArg, kValue, k, o)) {
              return kValue;
            }
            k++;
          }
          return undefined;
        }
      });
    }
  }
}
customElements.define(BnbChartCard.is, BnbChartCard);
