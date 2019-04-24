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
		formatter : formatter,

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if(oRouter.getRoute("transactionDetail") !== null){
				oRouter.getRoute("transactionDetail").attachPatternMatched(this._onObjectMatched, this);
			}
			
		},
		_onObjectMatched: function (oEvent) {
			var datum = oEvent.getParameter("arguments").month;
			var rekening = oEvent.getParameter("arguments").rekening;
			var aFilter = [];
			var aSorter = [];
			 aSorter.push(new sap.ui.model.Sorter("Bedrag", true));
			if (datum) {
				aFilter.push(new Filter("Datum", FilterOperator.Contains, datum));
				aFilter.push(new Filter("Rekening", FilterOperator.Contains, rekening));
			}

			// filter binding
			var oList = this.byId("transactionsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			oBinding.sort(aSorter);
		},

		onFilterInvoices : function (oEvent) {

			// build filter array
			
			var sQuery = oEvent.getParameter("query");
			var aFilter = [];
			
			 
			  
			if (sQuery) {
				aFilter.push(new Filter("Datum", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oList = this.byId("transactionsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
		},

		_filter : function(sQuery){
			
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