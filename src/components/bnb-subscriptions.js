import { PolymerElement, html } from '@polymer/polymer/polymer-element';
import '@polymer/polymer/lib/elements/dom-repeat';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-card/paper-card';
import { connect } from 'pwa-helpers';
import { store } from '../store';
import { createStripeSubscription } from '../actions/user';
import './bnb-common-styles';

class BnbSubscriptions extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style include="bnb-common-styles">
      ul {
        list-style-type: none;
        padding-left: 0;
      }

      paper-card {
        margin-right: 8px;
        margin-bottom: 8px;
      }

      .plans {
        padding: 8px;
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      .card-header {
        font-size: 28px;
      }

      .card-price {
        font-size: 20px;
      }

      .card-label {
        padding-right: 8px;
      }

      .card-value {
        float: right;
        font-weight: bold;
      }

      .card-current {
        margin-top: 8px;
      }

      @media (max-width: 400px) {
        .plans {
          @apply --layout-vertical;
        }
      }
    </style>

    <p hidden$="[[!_isFreePlan(currentPlan)]]">
      You are currently using the free plan that limits you to 3 pages and 3 team members by page.
      You can increase these limits by upgrading to one of the plans below.
    </p>

    <div class="plans">
      <template is="dom-repeat" items="[[plans]]">
        <paper-card>
          <div class="card-content">
            <div class="card-header">[[item.name]]</div>
            <div class="card-price">$[[item.amount]] per month</div>
            <ul>
              <li>
                <span class="card-label">Pages</span>
                <span class="card-value">[[item.pages]]</span>
              </li>
              <li>
                <span class="card-label">Team members</span>
                <span class="card-value">[[_computeTeamMembers(item.members)]]</span>
              </li>
              <li>
                <span class="card-label">Uptime check every</span>
                <span class="card-value">[[item.uptime]]m</span>
              </li>
            </ul>
          </div>
          <div class="card-actions">
            <paper-button hidden$="[[_computeHideSubscribe(item, currentPlan)]]" on-tap="_subscribeTapped">Subscribe</paper-button>
            <div class="card-current" hidden$="[[!_computeHideSubscribe(item, currentPlan)]]">Your current Plan</div>
          </div>
        </paper-card>
      </template>
    </div>
    `;
  }

  static get properties() {
    return {
      plans: Object,
      currentPlan: Object,
      stripeKey: Object,
    };
  }

  ready() {
    super.ready();
    this.checkout = this._initCheckout();
    window.addEventListener('popstate', () => this.checkout.close());
  }

  _stateChanged(state) {
    this.stripeKey = state.app.stripeKey;
    this.plans = state.app.subscriptionPlans;
    this.currentPlan = state.app.stripeSubscription;
  }

  _computeTeamMembers(value) {
    return value < 0 ? 'infinite' : value;
  }

  _isFreePlan(plan) {
    if (!plan) {
      return false;
    }
    return plan.pages === 3;
  }

  _computeHideSubscribe(item, plan) {
    if (item && plan) {
      return plan.pages === item.pages;
    }
    return false;
  }

  _subscribeTapped(e) {
    this.selectedPlan = e.model.item.id;
    const config = {
      amount: e.model.item.amount * 100,
      key: this.stripeKey,
      name: e.model.item.name,
    };
    this.checkout.open(config);
  }

  _initCheckout() {
    return StripeCheckout.configure({
      allowRememberMe: true,
      locale: 'auto',
      image: 'https://my.botnbot.com/images/ms-touch-icon-144x144-precomposed.png',
      key: this.stripeKey,
      zipCode: true,
      token: (token) => {
        store.dispatch(createStripeSubscription(token.email, token.id, this.selectedPlan));
      },
    });
  }
}

window.customElements.define('bnb-subscriptions', BnbSubscriptions);
