/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.f.shellBar.ContentButton
sap.ui.define(['sap/m/Button', 'sap/f/shellBar/ContentButtonRenderer'],
function(Button, ContentButtonRenderer) {
	"use strict";

	/**
	 * Constructor for a new <code>ContentButton</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Private control used by the ShellBar control
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.63.1
	 *
	 * @constructor
	 * @private
	 * @experimental Since 1.63. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 * @since 1.63
	 * @alias sap.f.shallBar.ContentButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var oContentButton = Button.extend("sap.f.shallBar.ContentButton", /** @lends sap.f.shallBar.ContentButton.prototype */ {
		metadata : {
			library : "sap.f",
			aggregations: {
				avatar: {type: "sap.f.Avatar", multiple: false}
			}
		},
		renderer: ContentButtonRenderer
	});

	oContentButton.prototype.setAvatar = function (oAvatar) {
		oAvatar.setDisplaySize(sap.f.AvatarSize.XS);
		return this.setAggregation("avatar", oAvatar);
	};

	oContentButton.prototype._getText = function() {
		if (this._bInOverflow) {
			return Button.prototype._getText.call(this);
		}

		return "";
	};

	return oContentButton;

});
