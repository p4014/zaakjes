sap.ui.define([
		'sap/ui/core/mvc/Controller',
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent"
	], function( Controller, History, UIComponent) {
	"use strict";

	return Controller.extend("com.meui5ncrud.app.controller.JaarOpgave", {
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("LandingsPage", {}, true);
			}
		}
	});


});