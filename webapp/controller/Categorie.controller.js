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

		getPage : function() {
			return this.byId("dynamicPageId");
		},

		onToggleFooter: function () {
			this.getPage().setShowFooter(!this.getPage().getShowFooter());
		},
        
        //navigate back to previous page or to homepage if no history is available
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

		//copy selected json object in model
		onCopy: function () {
			var oTable = this.getView().byId("excelTable");
			var oModel = this.getView().getModel("categorie");
			var currentRows = oModel.getProperty("/Categorie");
			var Indice = oTable.getSelectedIndices()[0];
			var newRows = currentRows.concat(this.createEntry(Indice));
			oModel.setProperty("/Categorie", newRows);
		},

		//Remove selected json objects from model
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

		//create copy of json model
		createEntry: function(Indice){
			var oTable = this.getView().byId("excelTable");
			var oRow = oTable.getRows()[Indice];
			var cells = oRow.getCells();
			var json = [{
				"Naam Omschrijving": cells[0].getValue(),
				"Code": cells[1].getValue(),
				"Mededelingen": cells[2].getValue(),
				"Categorie": cells[3].getValue(),

			}];
			return json;
		},

		//remove footer if not ready for changes
		onPressReject: function () {
			this.onToggleFooter();
		},

		//send selected items to database, database will not take double entries
		onPressAccept: function(){
			var oTable = this.getView().byId("excelTable");
			var oModel = oTable.getModel("table");
			var indice = oTable.getSelectedIndices();

			for (let j = 0; j < indice.length; j++) {
		            var oRow = oTable.getRows()[indice[j]];
		            var cells = oRow.getCells();
					var aData = jQuery.sap.sjax({
                    type : "POST",
                    contentType : "application/json",
                    url : "http://192.168.178.38:3000/post?NaamOmschrijving=" + cells[0].getValue() +
                    "&Code="+ cells[1].getValue() +
                    "&Mededelingen="+ cells[2].getValue() +
                    "&Categorie"+cells[3].getValue(),
                    dataType : "json",
                    async: true, 
                    success : function(data,textStatus, jqXHR) {
                        oModel.setData({modelData : data}); 
                        alert("Saved");
                    },
                    error : function(data,textStatus, jqXHR) {
                        oModel.setData({modelData : data}); 
                        alert("Failed");
                    }
            	});

		        }

		    
		}
	})
});