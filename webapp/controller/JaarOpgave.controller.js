sap.ui.define([
		'sap/m/MessageToast',
        'sap/ui/core/mvc/Controller',
		'sap/ui/core/routing/History',
		"sap/ui/core/UIComponent",
		"com/meui5ncrud/app/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
    ], function(MessageToast, Controller, History, UIComponent, formatter, Filter, FilterOperator) {
    "use strict";
    
    var PageController = Controller.extend("com.meui5ncrud.app.view.JaarOpgave", {
    		formatter : formatter,
    		onInit: function(){
    			
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
			},
			onSelectionChange: function(oEvent){
				var oTable = this.byId("TableSom");
				var oBinding = oTable.getBinding("items");
				var sFilterValue = oEvent.getParameter("selectedItem").getKey();
				var aFilters = [];
				
				if (sFilterValue){
				    aFilters.push( new Filter("_id/rekening", FilterOperator.Contains, sFilterValue) );
				}
				oBinding.filter(aFilters); 
			},
			onPress: function (oEvent) {
				var oItem = oEvent.getSource();
				var month = oItem.getBindingContext("somPerMaand").getProperty("_id/month");
				var rekening = oItem.getBindingContext("somPerMaand").getProperty("_id/rekening");
				var strMonth = "";
				if(month < 10){
					strMonth = "0" + month;
				}
				var year = oItem.getBindingContext("somPerMaand").getProperty("_id/year");
				var yearMonth = year + "-" + strMonth;
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("transactionDetail",{
					rekening : rekening,
					month: yearMonth
				});
			}
		});
    return PageController;
 	
});