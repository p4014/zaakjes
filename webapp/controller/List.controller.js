sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"com/meui5ncrud/app/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, formatter, Filter, FilterOperator) {
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
		}
			
			


	});
});