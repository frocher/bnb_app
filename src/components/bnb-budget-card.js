import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './bnb-budget.js';
import './bnb-common-styles.js';

class BnbBudgetCard extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
        margin: 16px;
      }

      paper-card {
        width: 100%;
      }

      #chart {
        width: 100%;
        height: 340px;
      }

      .budget-header {
        @apply --paper-font-headline;
        margin-bottom: 16px;
      }

      .budget-header-buttons {
        float: right;
        font-size: 14px;
        vertical-align: middle;
      }
    </style>
    <paper-card>
      <div class="card-content">
        <div class="budget-header">[[budgetInfo.name]]
          <div class="budget-header-buttons">
            <paper-icon-button icon="close" hidden$="[[!canDelete]]" on-tap="closeTapped"></paper-icon-button>
          </div>
        </div>
        <bnb-budget id="chart" data="[[budgetInfo.data]]" model="[[budgetInfo.model]]" budget="[[budgetInfo.budget]]"></bnb-budget>
      </div>
    </paper-card>
    `;
  }

  static get is() { return 'bnb-budget-card'; }

  static get properties() {
    return {
      budgetInfo: Object,
      canDelete: {
        type: Boolean,
        value: true
      }
    }
  }

  closeTapped() {
    this.dispatchEvent(new CustomEvent('close', {detail: this.budgetInfo}));
  }
}
window.customElements.define(BnbBudgetCard.is, BnbBudgetCard);
