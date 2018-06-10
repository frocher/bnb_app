import '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="bnb-common-styles">
  <template>
    <style include="iron-flex iron-flex-alignment">

      app-header  {
        background-color: rgba(48, 48, 48, 0.95);
      }

      paper-button.colored {
        color: var(--default-primary-color);
      }

      @media (max-width: 767px) {
        header > h1 {
          font-size: 1.1em;
        }
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
