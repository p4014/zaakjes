/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/base/Object", "sap/ui/core/Manifest"], function (BaseObject, Manifest) {
	"use strict";

	/**
	 * Creates a new CardManifest object.
	 *
	 * @class Provides a set of functions to create a card manifest and work with it.
	 *
	 * Example usages:
	 *
	 * var oManifest = new CardManifest()
	 * oManifest.load({ manifestUrl: "./somepath/manifest.json" }).then(function () {
	 *   // Do something
	 * })
	 *
	 * or
	 *
	 * var oManifestJson = {
	 * 	"sap.app": { ... },
	 *  "sap.card": { ... },
	 *  ...
	 * };
	 * var oManifest = new CardManifest(oManifestJson);
	 *
	 * NOTE: Using CardManifest.prototype.load function will also load i18n files and process the manifest
	 * replacing all translated texts and placeholders.
	 * When passing a json object to the CardManifest constructor the manifest will NOT be processed as
	 * it should be already processed beforehand.
	 *
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.63.1
	 *
	 * @constructor
	 * @private
	 * @param {Object} oManifestJson A manifest JSON.
	 * @alias sap.ui.integration.util.CardManifest
	 */
	var CardManifest = BaseObject.extend("sap.ui.integration.util.CardManifest", {
		constructor: function(oManifestJson) {
			BaseObject.call(this);

			if (oManifestJson) {
				this._oManifest = new Manifest(oManifestJson, { process: false });
				this.oJson = this._oManifest.getRawJson();
			}
		}
	});

	/**
	 * @returns {Object} A copy of the Manifest JSON.
	 */
	CardManifest.prototype.getJson = function () {
		// Use stringify/parse to clone and unfreeze the internal JSON.
		return JSON.parse(JSON.stringify(this.oJson));
	};

	/**
	 * Returns a value from the Manifest based on the specified path.
	 *
	 * @param {string} sPath The path to return a value for.
	 * @returns {*} The value at the specified path.
	 */
	CardManifest.prototype.get = function (sPath) {
		return getObject(this.oJson, sPath);
	};

	/**
	 * Destroy CardManifest resources.
	 */
	CardManifest.prototype.destroy = function () {
		this.oJson = null;
		this.oTranslator = null;
		if (this._oManifest) {
			this._oManifest.destroy();
		}
	};

	/**
	 * Load a manifest.json file and all of its resources and then process it.
	 *
	 * @param {Object} mSettings The settings to use for manifest loading.
	 * @returns {Promise} A promise resolved when the manifest is ready and processed.
	 */
	CardManifest.prototype.load = function (mSettings) {
		if (!mSettings || !mSettings.manifestUrl) {
			throw new Error("manifestUrl is mandatory!");
		}

		return Manifest.load({
			manifestUrl: mSettings.manifestUrl,
			async: true
		}).then(function (oManifest) {
			this._oManifest = oManifest;
			this.oJson = this._oManifest.getRawJson();

			return this.loadI18n().then(function () {
				this.processManifest();
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Loads the i18n resources.
	 *
	 * @private
	 * @returns {Promise} A promise resolved when the i18n resources are ready.
	 */
	CardManifest.prototype.loadI18n = function () {
		return this._oManifest._loadI18n(true).then(function (oBundle) {
			this.oTranslator = oBundle;
		}.bind(this));
	};

	/**
	 * Process the manifest json by traversing it and translating all translatable texts
	 * and replacing all placeholders.
	 *
	 * @private
	 */
	CardManifest.prototype.processManifest = function () {
		var iCurrentLevel = 0,
			iMaxLevel = 15,
			oProcessedJson = this.getJson();

		process(oProcessedJson, this.oTranslator, iCurrentLevel, iMaxLevel);
		deepFreeze(oProcessedJson);

		this.oJson = oProcessedJson;
	};

	/**
	 * Freezes the object and nested objects to avoid later manipulation.
	 * Copied from Manifest.js
	 *
	 * @private
	 * @param {Object} oObject the object to deep freeze
	 */
	function deepFreeze(oObject) {
		if (oObject && typeof oObject === 'object' && !Object.isFrozen(oObject)) {
			Object.freeze(oObject);
			for (var sKey in oObject) {
				if (oObject.hasOwnProperty(sKey)) {
					deepFreeze(oObject[sKey]);
				}
			}
		}
	}

	/**
	 * Checks if the value is a translatable string in the format of "{{text}}".
	 *
	 * @private
	 * @param {*} vValue The value to be checked.
	 * @returns {boolean} If the string is translatable.
	 */
	function isTranslatable (vValue) {
		return (typeof vValue === "string")
			&& vValue.indexOf("{{") === 0
			&& vValue.indexOf("}}") === vValue.length - 2;
	}

	/**
	 * Check if a value contains placeholders.
	 *
	 * @private
	 * @param {*} vValue The value to check.
	 * @returns {boolean} true if the value contains placeholders.
	 */
	function isProcessable (vValue) {
		return (typeof vValue === "string")
			&& (vValue.indexOf("{TODAY_ISO}") > -1 || vValue.indexOf("{NOW_ISO}") > -1);
	}

	/**
	 * Replace all placeholders inside the string.
	 *
	 * @private
	 * @param {string} sPlaceholder The value to process.
	 * @returns {string} The string with replaced placeholders.
	 */
	function processPlaceholder (sPlaceholder) {
		var sISODate = new Date().toISOString();
		var sProcessed = sPlaceholder.replace("{NOW_ISO}", sISODate);
		sProcessed = sProcessed.replace("{TODAY_ISO}", sISODate.slice(0, 10));
		return sProcessed;
	}

	/**
	 * Process a manifest.
	 *
	 * @private
	 * @param {Object} oObject The Manifest to process.
	 * @param {Object} oTranslator The translator.
	 * @param {number} iCurrentLevel The current level of recursion.
	 * @param {number} iMaxLevel The maximum level of recursion.
	 */
	function process (oObject, oTranslator, iCurrentLevel, iMaxLevel) {
		if (iCurrentLevel === iMaxLevel) {
			return;
		}

		if (Array.isArray(oObject)) {
			oObject.forEach(function (vItem, iIndex, aArray) {
				if (typeof vItem === "object") {
					process(vItem, oTranslator, iCurrentLevel + 1, iMaxLevel);
				} else if (isTranslatable(vItem)) {
					aArray[iIndex] = oTranslator.getText(vItem.substring(2, vItem.length - 2));
				} else if (isProcessable(vItem)) {
					aArray[iIndex] = processPlaceholder(vItem);
				}
			}, this);
		} else {
			for (var sProp in oObject) {
				if (typeof oObject[sProp] === "object") {
					process(oObject[sProp], oTranslator, iCurrentLevel + 1, iMaxLevel);
				} else if (isTranslatable(oObject[sProp])) {
					oObject[sProp] = oTranslator.getText(oObject[sProp].substring(2, oObject[sProp].length - 2));
				} else if (isProcessable(oObject[sProp])) {
					oObject[sProp] = processPlaceholder(oObject[sProp]);
				}
			}
		}
	}

	/**
	 * Utility function to find a property inside an Object at a specified path.
	 * Copied from Manifest.js
	 *
	 * @private
	 * @param {Object} oObject The Object to search
	 * @param {string} sPath The path to search at.
	 * @returns {*} The value at the specified path.
	 */
	function getObject(oObject, sPath) {
		// if the incoming sPath is a path we do a nested lookup in the
		// manifest object and return the concrete value, e.g. "/sap.ui5/extends"
		if (oObject && sPath && typeof sPath === "string" && sPath[0] === "/") {
			var aPaths = sPath.substring(1).split("/"),
			    sPathSegment;
			for (var i = 0, l = aPaths.length; i < l; i++) {
				sPathSegment = aPaths[i];

				// Prevent access to native properties
				oObject = oObject.hasOwnProperty(sPathSegment) ? oObject[sPathSegment] : undefined;

				// Only continue with lookup if the value is an object.
				// Accessing properties of other types is not allowed!
				if (oObject === null || typeof oObject !== "object") {

					// Clear the value in case this is not the last segment in the path.
					// Otherwise e.g. "/foo/bar/baz" would return the value of "/foo/bar"
					// in case it is not an object.
					if (i + 1 < l && oObject !== undefined) {
						oObject = undefined;
					}

					break;
				}
			}
			return oObject;
		}

		// if no path starting with slash is specified we access and
		// return the value directly from the manifest
		return oObject && oObject[sPath];
	}

	return CardManifest;
}, true);