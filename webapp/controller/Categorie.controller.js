sap.ui.define([
		'sap/ui/core/mvc/Controller',
		"jquery.sap.global",
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent",
	    'sap/ui/model/json/JSONModel',
	    "com/meui5ncrud/app/model/formatter"
	], function( Controller, jQuery, History, UIComponent, JSONModel, formatter) {
	      "use strict";

	return Controller.extend("com.meui5ncrud.app.controller.ExcelImport", {
		formatter : formatter,

		onInit: function () {
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			this.getView().setModel(oModel);
		},
		getPage : function() {
			return this.byId("dynamicPageId");
		},
		onToggleFooter: function () {
			this.getPage().setShowFooter(!this.getPage().getShowFooter());
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
		onEdit: function () {
			this.getPage().setShowFooter(!this.getPage().getShowFooter());
		},
		onCopy: function () {
			var oTable = this.getView().byId("excelTable");
			var oModel = this.getView().getModel("categorie");
			var currentRows = oModel.getProperty("/Categorie");
			var Indice = oTable.getSelectedIndices()[0];
			var newRows = currentRows.concat(this.createEntry(Indice));
			oModel.setProperty("/Categorie", newRows);

		},
		onDelete: function () {
			var oTable = this.getView().byId("excelTable");
			var indice = oTable.getSelectedIndices();
			var oModel = this.getView().getModel("categorie");
			var newModel = oModel.getProperty("/Categorie");

			for (let j = indice.length -1 ; j > 0 ; j--) {
				newModel.splice(indice[j], 1);
			}
			oModel.setProperty("/Categorie", newModel);
		},

		createEntry: function(Indice){
			var oTable = this.getView().byId("excelTable");
			var oRow = oTable.getRows()[Indice];
			var cells = oRow.getCells();
			var json = [{
				"Naam Omschrijving": cells[0].getText(),
				"Code": cells[1].getText(),
				"Mededelingen": cells[2].getText(),
				"Categorie": cells[3].getText(),

			}];
			return json;
		},

		onPressReject: function () {
			var oTable = this.getView().byId("excelTable");
			var selectedRows = oTable.getSelectedIndices();
			var oRow = oTable.getRows()[selectedRows[0]];
			var cells = oRow.getCells();
			var data = cells[0].getText();
		},

		
		onPressAccept: function(){
			var oTable = this.getView().byId("excelTable");
			var oModel = oTable.getModel("table");
			var oFinalResult = JSON.parse(oModel.getJSON());

			for (let j = 0; j < oFinalResult.length; j++) {
		            var jsonObject = oFinalResult[j];
					var aData = jQuery.sap.sjax({
                    type : "POST",
                    contentType : "application/json",
                    url : "http://192.168.178.38:3000/post?Datum=" + jsonObject.Datum +
                    "&NaamOmschrijving="+ jsonObject["Naam Omschrijving"] +
                    "&Rekening="+ jsonObject.Rekening +
                    "&Tegenrekening="+ jsonObject.Tegenrekening +
                    "&Code="+ jsonObject.Code +
                    "&AfBij="+ jsonObject["Af Bij"] +
                    "&Bedrag="+ jsonObject.Bedrag +
                    "&MutatieSoort="+ jsonObject.MutatieSoort +
                    "&Mededelingen="+ jsonObject.Mededelingen,
                    dataType : "json",
                    async: true, 
                    success : function(data,textStatus, jqXHR) {
                        oModel.setData({modelData : data}); 
                    },
                    error : function(data,textStatus, jqXHR) {
                        oModel.setData({modelData : data}); 
                    }
            	});

		        }

		    
		}
	})
});