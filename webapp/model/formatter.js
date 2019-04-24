sap.ui.define([], function () {
	"use strict";
	return {
		formatNumber: function(bedrag, afBij) {
			var minus = '';
			if(afBij === 'Af'){
				minus = '-';
			}
			console.log(minus);
			return minus.concat(bedrag);
		},

		formatMonth: function(month){
			var monthText="";
			switch(month){
				case 1:
					monthText = "January";
					break;
				case 2:
					monthText = "February";
					break;
				case 3:
					monthText = "Maart";
					break;
				case 4:
					monthText = "April";
					break;
				case 5:
					monthText = "Mei";
					break;
				case 6:
					monthText = "Juni";
					break;
				case 7:
					monthText = "July";
					break;
				case 8:
					monthText = "Augustus";
					break;
				case 9:
					monthText = "September";
					break;
				case 10:
					monthText = "Oktober";
					break;
				case 11:
					monthText = "November";
					break;
				case 12:
					monthText = "December";
					break;
				default:
					monthText = "Undefined";
			}
			return monthText;
		},
		formatRekening: function(rekening){
			var rekeningLabel= "";
			switch(rekening){
				case "NL37INGB0653824750":
					rekeningLabel="Gezamelijke rekening";
					break;
				case "NL79INGB0001540413":
					rekeningLabel="Gwendolien's rekening";
					break;
				case "NL21INGB0008552520":
					rekeningLabel="Peter's rekening";
					break;
				default:
					rekeningLabel="Nieuwe rekening";
			}
			return rekeningLabel;
		}
	};
});