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
			var mutatie = oEvent.getParameter("arguments").mutatie;
			var aFilter = [];
			if (mutatie != 'Spaar') {
				aFilter.push(new Filter("Datum", FilterOperator.Contains, datum));
				aFilter.push(new Filter("Rekening", FilterOperator.Contains, rekening));
				aFilter.push(new Filter({ filters: [
					new Filter({
						path: 'Tegenrekening',
						operator: FilterOperator.NE,
						value1: ""
					}),
					new Filter({
						path: 'Code',
						operator: FilterOperator.NE,
						value1: "GT"})
					], and: false 

				}) );
			} else {
				aFilter.push(new Filter("Datum", FilterOperator.Contains, datum));
				aFilter.push(new Filter("Rekening", FilterOperator.Contains, rekening));
				aFilter.push(new Filter( { filters: [
					new Filter({
						path: 'Tegenrekening',
						operator: FilterOperator.EQ,
						value1: ""
					}),
					new Filter({
						path: 'Code',
						operator: FilterOperator.EQ,
						value1: "GT"})
					], and: true 

				}) );

			}

			// filter binding
			var oList = this.byId("transactionsList");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onChangeSort : function (oSelect) {

			// build filter array
			var aSorter = [];
			if(oSelect.getParameter("selected")){

				aSorter.push(new sap.ui.model.Sorter("Af Bij", false, true));
			} else {
				aSorter.push(new sap.ui.model.Sorter("Af Bij", true, true));
			}

			// filter binding
			var oList = this.byId("transactionsList");
			var oBinding = oList.getBinding("items");
			oBinding.sort(aSorter);
			
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