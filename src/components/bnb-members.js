import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@vaadin/vaadin-grid/vaadin-grid.js';
import { find } from 'lodash-es';
import { connect } from 'pwa-helpers';
import { store } from '../store.js';
import { updateRoute, createPageMember, updatePageMember, deletePageMember } from '../actions/app.js';
import './bnb-grid-styles.js';

class BnbMembers extends connect(store)(PolymerElement) {
  static get template() {
    return html`
    <style>
      h3 {
        color: var(--secondary-text-color);
      }

      #content {
        @apply --layout-horizontal;
        @apply --layout-center-justified;
      }

      #container {
        width: 100%;
        max-width: 1000px;
        padding: 10px 22px 10px 22px;
      }

      #email {
        min-width: 200px;
        margin-right: 16px;
      }

      #members {
        max-height: 400px;
      }
    </style>
    <app-header-layout fullbleed>
      <app-header slot="header" fixed condenses shadow>
        <app-toolbar>
          <paper-icon-button icon="arrow-back" on-tap="closeTapped"></paper-icon-button>
          <span class="title">Members</span>
        </app-toolbar>
      </app-header>
      <div id="content">
        <div id="container">
          <div class="layout horizontal wrap end">
            <paper-input id="email" class="flex" label="E-mail" on-input="emailChanged" required="true" error-message="You should enter a valid email address"></paper-input>
            <paper-dropdown-menu id="roleMenu" label="Role" required="true" error-message="You should select a role">
              <paper-listbox id="role" slot="dropdown-content" attr-for-selected="role">
                <paper-item role="admin">Administrator</paper-item>
                <paper-item role="master">Master</paper-item>
                <paper-item role="editor">Editor</paper-item>
                <paper-item role="guest">Guest</paper-item>
              </paper-listbox>
            </paper-dropdown-menu>

            <iron-pages id="buttons" selected="0">
              <section>
                <paper-button id="addBtn" hidden$="[[!page.can_add_member]]" on-tap="addTapped">Add</paper-button>
              </section>
              <section>
                <paper-button id="updateBtn" hidden$="[[!page.can_update_member]]" on-tap="updateTapped">Update</paper-button>
                <paper-button id="removeBtn" hidden$="[[!page.can_remove_member]]" on-tap="removeTapped">Remove</paper-button>
              </section>
            </iron-pages>
          </div>

          <h3>Members</h3>
          <vaadin-grid id="membersGrid" theme="bnb-grid" items="[[_computeMembers(members)]]" active-item="{{activeMember}}">
            <vaadin-grid-column>
              <template class="header">Name</template>
              <template>
                <div>[[item.username]]</div>
              </template>
            </vaadin-grid-column>
            <vaadin-grid-column>
              <template class="header">Email</template>
              <template>
                <div>[[item.email]]</div>
              </template>
            </vaadin-grid-column>
            <vaadin-grid-column>
              <template class="header">Role</template>
              <template>
                <div>[[item.role]]</div>
              </template>
            </vaadin-grid-column>
          </vaadin-grid>
        </div>
      </div>
    </app-header-layout>
    `;
  }

  static get is() { return 'bnb-members'; }

  static get properties() {
    return {
      page: Object,
      members: {
        type: Array,
        observer: '_membersChanged'
      },
      target: Object,
      activeMember: {
        observer: '_activeMemberChanged'
      }
    }
  }

  _stateChanged(state) {
    this.page = state.app.page;
    this.members = state.app.page_members;
    this.uptimeDetails = state.app.uptimeDetails;
  }

  ready() {
    super.ready();
    this.target = this.$.content;
  }

  closeTapped() {
    this.$.email.invalid = false;
    this.$.email.value = '';
    this.$.role.selected = -1;
    store.dispatch(updateRoute('page/' + this.page.id));
  }

  emailChanged() {
    let value = this.$.email.value;
    let member = find(this.members, function(o) { return o.email === value; });
    if (!member) {
      this.$.buttons.selected = 0;
    }
    else {
      this.$.buttons.selected = 1;
    }
  }

  addTapped() {
    if (this.validateInputs()) {
      let email = this.$.email.value;
      let role = this.$.role.selected;
      store.dispatch(createPageMember(this.page.id, {email: email, role:role}));
    }
  }

  updateTapped() {
    if (this.validateInputs()) {
      let email = this.$.email.value;
      let role = this.$.role.selected;
      let member = find(this.members, function(o) { return o.email === email; });
      store.dispatch(updatePageMember(this.page.id, {id: member.id, email: email, role:role}));
    }
  }

  removeTapped() {
    if (this.validateInputs()) {
      let email = this.$.email.value;
      let member = find(this.members, function(o) { return o.email === email; });
      store.dispatch(deletePageMember(this.page.id, member.id));
    }
  }

  validateInputs() {
    let emailOK = this.$.email.validate();
    let roleOK = this.$.roleMenu.validate();
    return emailOK && roleOK;
  }

  _membersChanged() {
    this.emailChanged();
  }

  _activeMemberChanged(item) {
    this.$.membersGrid.selectedItems = item ? [item] : [];
    if (item) {
      this.$.email.value = item.email;
      this.$.role.selected = item.role;
      this.emailChanged();
    }
  }

  _computeMembers(members) {
    return members || [];
  }
}
customElements.define(BnbMembers.is, BnbMembers);
