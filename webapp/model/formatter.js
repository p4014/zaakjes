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
		formatDate: function(date){
			var dateText = date.slice(0 , 10);
			return dateText;
		},

		formatMonth: function(month, year){
			var monthText="";
			switch(month){
				case 1:
					monthText = year + " January";
					break;
				case 2:
					monthText = year + " February";
					break;
				case 3:
					monthText = year + " Maart";
					break;
				case 4:
					monthText = year + " April";
					break;
				case 5:
					monthText = year + " Mei";
					break;
				case 6:
					monthText = year + " Juni";
					break;
				case 7:
					monthText = year + " July";
					break;
				case 8:
					monthText = year + " Augustus";
					break;
				case 9:
					monthText = year + " September";
					break;
				case 10:
					monthText = year + " Oktober";
					break;
				case 11:
					monthText = year + " November";
					break;
				case 12:
					monthText = year + " December";
					break;
				default:
					monthText = year + " Undefined";
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