sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"com/meui5ncrud/app/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, History, UIComponent, formatter, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.meui5ncrud.app.controller.List", {
		
		formatNumber: function(bedrag, afBij) {
			var minus = '';
			if(afBij === 'Af'){
				minus = '-';
			}
			console.log(minus);
			return minus.concat(bedrag);
		},
		onFilterInvoices : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Datum", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("transactionsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

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