sap.ui.define([
		'sap/ui/core/mvc/Controller',
		"sap/ui/core/routing/History",
		"sap/ui/core/UIComponent",
	    'sap/ui/model/json/JSONModel',
	    "com/meui5ncrud/app/model/formatter"
	], function( Controller, History, UIComponent, JSONModel, formatter) {
	      "use strict";

	return Controller.extend("com.meui5ncrud.app.controller.ExcelImport", {
		formatter : formatter,
		
		onInit: function(oEvent) {
        	var oProductModel = new JSONModel();
    		oProductModel.loadData("./model/excel.json");
    		sap.ui.getCore().setModel(oProductModel, "excel");
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
		
		handleUpload: function(oEvent){
		  var oFileToRead = oEvent.getParameters().files["0"];
	      var reader = new FileReader();
	      var json = [];
	      var text = this.byId("Text");
	      var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

	      
	      // Read file into memory as UTF-8
	      reader.readAsText(oFileToRead);

	      // Handle errors load
	      reader.onload = loadHandler;
	      reader.onerror = errorHandler;
	      


		    function loadHandler(event) {	
		      var csv = event.target.result;
		      processData(csv);

		    }

		    function processData(csv) {
		        var allTextLines = csv.split(/\r\n|\n/);
		        var headers = [
		        		oResourceBundle.getText("datum"),
		        		oResourceBundle.getText("naamOmschrijving"),
		        		oResourceBundle.getText("rekening"),
		        		oResourceBundle.getText("tegenrekening"),
		        		oResourceBundle.getText("code"),
		        		oResourceBundle.getText("afBij"),
		        		oResourceBundle.getText("bedrag"),
		        		oResourceBundle.getText("mutatieSoort"),
		        		oResourceBundle.getText("mededelingen")
		        ];
		        

		        for (var i=1; i<allTextLines.length; i++) {

			      var data = allTextLines[i].split(';');
		          json.push(buildJSON(headers, data));
			      
		        }
		        text.setText(JSON.stringify(json, undefined, 2));
		    }
		    
		    function buildJSON(headers, currentLine){
		    	let jsonObject = {};
		        for (let j = 0; j < headers.length; j++) {
		            let propertyName = headers[j];
		            var value = getValueFormatByType(currentLine[j], propertyName);
		            
		            jsonObject[propertyName] = value;
		        }
		        return jsonObject;
		    }

		    function errorHandler(evt) {
			if(evt.target.error.name == "NotReadableError") {
				alert("Cannot read file !");
		      }

		    }
		
		    function getValueFormatByType(value, propertyName) {
		        let isNumber = !isNaN(value);
		        if(isNumber){
			        switch(propertyName){
			        	case "Datum":
			        		var year = value.slice(0,4);
			        		var month = value.slice(4,6);
			        		var day = value.slice(6,8);
			        		return year.concat('-').concat(month).concat('-').concat(day);
			        	case "Bedrag":
			        		return parseFloat(value);
			        	default:
			        		return String(value);
			        }
		        } else{
		        	return String(value);
		        }
		    }
		}
	})
});