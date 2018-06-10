export const BnbFormElement = (superClass) => class extends superClass {
  /**
    * Validate or invalidate fields from an errors Array
    * @param {Array} newVal
    */
  _errorsChanged(newVal) {
    if (this.errors) {
      for (let prop in this.errors) {
        if (this.errors.hasOwnProperty(prop)) {
          let objId = prop;
          if (this.$[objId] !== undefined) {
            this.$[objId].invalid = true;
            this.$[objId].errorMessage = this.errors[prop][0];
          }
        }
      }
    }
  }
}
