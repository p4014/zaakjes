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
		}
	};
});