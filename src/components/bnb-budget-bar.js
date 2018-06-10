import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import './bnb-common-styles.js';
import './bnb-period-dropdown.js';

class BnbBudgetBar extends PolymerElement {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      :host {
        display: flex;
      }

      paper-card {
        width: 100%;
        margin: 16px;
        padding: 16px;
        @apply --layout-vertical;
      }

      paper-item {
        cursor: pointer;
      }

      #budgetTools {
        display: flex;
        @apply --layout-horizontal;
      }

      #budgetTools[hidden] {
        display: none;
      }

      #itemField {
        margin-left: 5px;
      }

      #budgetField {
        margin-left: 5px;
        width: 150px;
      }

      #budgetBtn {
        height: 44px;
        align-self: flex-end;
      }

    </style>
    <paper-card>
      <bnb-period-dropdown></bnb-period-dropdown>
      <div id="budgetTools" hidden$="[[!canAdd]]">
        <paper-dropdown-menu id="categoryField" label="Category">
          <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selectedCategory}}">
            <paper-item>Lighthouse</paper-item>
            <paper-item>Performance</paper-item>
            <paper-item>Assets count</paper-item>
            <paper-item>Assets size</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu id="itemField" required error-message="required" label="Item">
          <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selectedItem}}">
            <template is="dom-repeat" items="[[items]]">
              <paper-item>[[item]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-input id="budgetField" label="Budget" type="number" min="0" required value="{{budget}}" error-message="positive number required"></paper-input>
        <paper-button id="budgetBtn" on-tap="_onAddTapped">Add</paper-button>
      </div>
    </paper-card>
    `;
  }

  static get is() { return 'bnb-budget-bar'; }

  static get properties() {
    return {
      selectedCategory: {
        type: Number,
        value: 0,
        observer: '_onSelectedItemChanged'
      },
      selectedItem: {
        type: Number
      },
      items: {
        type: Array,
        value: []
      },
      canAdd: {
        type: Boolean,
        value: true
      },
      budget: {
        type: Number
      }
    }
  }

  _onSelectedItemChanged() {
    const data = [
      ['PWA', 'Performance', 'Accessibility', 'Best practices', 'SEO', 'Average'],
      ['First byte', 'First paint', 'Speed index', 'Interactive'],
      ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total'],
      ['HTML', 'CSS', 'Javascript', 'Image', 'Font', 'Other', 'Total']
    ]
    this.items = data[this.selectedCategory];
    this.selectedItem = undefined;
  }

  _onAddTapped() {
    let isItemValid = this.$.itemField.validate();
    let isBudgetValid = this.$.budgetField.validate();
    if ( isItemValid && isBudgetValid) {
      let name = this.$.categoryField.value + '/' + this.$.itemField.value;
      this.dispatchEvent(new CustomEvent('add', {detail: {name: name, category: this.selectedCategory, item: this.selectedItem, budget: this.budget}}));
    }
  }
}
window.customElements.define(BnbBudgetBar.is, BnbBudgetBar);
