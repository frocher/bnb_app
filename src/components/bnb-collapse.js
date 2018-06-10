import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-styles/paper-styles.js';
import './bnb-common-styles.js';

class BnbCollapse extends PolymerElement {
  static get template() {
    return html`
		<style include="bnb-common-styles">
			.header {
				min-height: 48px;

        cursor: pointer;

				color: var(--primary-text-color);
				@apply --layout-horizontal;
				@apply --layout-center-center;
				@apply --paper-font-subhead;
			}

			.icon {
				margin-right: 24px;

				--iron-icon-height: 32px;
				--iron-icon-width: 32px;
			}

			.icon,.toogle {
				color: var(--disabled-text-color);
			}

			.content {
				padding-bottom: 12px;

				color: var(--primary-text-color);
				@apply --paper-font-body;
			}
		</style>

		<div class="header" on-click="_toggleOpened">
			<iron-icon class="icon" src="[[src]]" icon="[[icon]]"></iron-icon>
			<div class="flex">[[header]]</div>
			<paper-icon-button class="toogle" icon="[[_toggleIcon]]"></paper-icon-button>
		</div>
		<iron-collapse class="content" opened="{{opened}}">
			<slot></slot>
		</iron-collapse>
    `;
  }

  static get is() { return 'bnb-collapse'; }
  
  static get properties() {
    return {
      /**
       * Text in the header row
       */
      header: String,

      /**
       * The name of the icon to use. The name should be of the
       * form: iconset_name:icon_name.
       */
      icon: String,

      /**
       * If using paper-collapse-item without an iconset, you can set the
       * src to be the URL of an individual icon image file. Note that
       * this will take precedence over a given icon attribute.
       */
      src: String,

      /**
       * True if the content section is opened
       */
      opened: Boolean,

      _toggleIcon: {
        type: String,
        computed: '_computeToggleIcon(opened)'
      }
    }
  }

  _toggleOpened(e) {
    this.opened = !this.opened;
  }

  _computeToggleIcon(opened) {
    return opened ? 'icons:expand-less' : 'icons:expand-more';
  }
}
window.customElements.define(BnbCollapse.is, BnbCollapse);
