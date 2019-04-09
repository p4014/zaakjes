sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.meui5ncrud.app.controller.LandingsPages", {
		onInit : function (evt) {
			// set mock model
			var sPath = sap.ui.require.toUrl("com/meui5ncrud/app/model") + "/data.json";
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel);
		},
		onPress : function(oEvent){
			var oRouter = this.getOwnerComponent().getRouter();
			var route = oEvent.getSource().getBindingContext().getProperty("route")
            oRouter.navTo(route);
		}
	});

	return PageController;

});