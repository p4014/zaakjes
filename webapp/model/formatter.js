sap.ui.define([], function () {
	"use strict";
	return {
		statusText: function (sStatus, bedrag) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "Af":
					return resourceBundle.getText("Af",[bedrag]);
				case "Bij":
					return resourceBundle.getText("Bij", [bedrag]);
				default:
					return bedrag;
			}
		}
	};
});