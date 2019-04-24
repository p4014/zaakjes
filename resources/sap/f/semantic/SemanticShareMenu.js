/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/IconPool","sap/ui/base/EventProvider","sap/m/library","sap/m/OverflowToolbarButton","sap/m/OverflowToolbarLayoutData","./SemanticContainer"],function(I,E,m,O,a,S){"use strict";var B=m.ButtonType;var b=S.extend("sap.f.semantic.SemanticShareMenu",{constructor:function(c,p){S.call(this,c,p);this._aShareMenuActions=[];this._aCustomShareActions=[];this._setMode(b._Mode.initial);}});b._Mode={initial:"initial",menu:"menu"};b.prototype.addCustomAction=function(c){this._onControlAdded(c);this._callContainerAggregationMethod("insertButton",c,this._getCustomActionInsertIndex());this._aCustomShareActions.push(c);return this;};b.prototype.insertCustomAction=function(c,i){this._onControlAdded(c);this._callContainerAggregationMethod("insertButton",c,this._getCustomActionInsertIndex(i));this._aCustomShareActions.splice(i,0,c);return this;};b.prototype.getCustomActions=function(){return this._aCustomShareActions;};b.prototype.indexOfCustomAction=function(c){return this._aCustomShareActions.indexOf(c);};b.prototype.removeCustomAction=function(c){var r=this._callContainerAggregationMethod("removeButton",c);this._aCustomShareActions.splice(this._aCustomShareActions.indexOf(c),1);this._onControlRemoved();return r;};b.prototype.removeAllCustomActions=function(){var r=[];this._aCustomShareActions.forEach(function(c){var R=this._callContainerAggregationMethod("removeButton",c);if(R){r.push(c);}},this);this._aCustomShareActions=[];this._onControlRemoved();return r;};b.prototype.destroyCustomActions=function(){this.removeAllCustomActions(true).forEach(function(c){c.destroy();});return this;};b.prototype.addContent=function(s){var c=this._getControl(s);this._onControlAdded(c);this._aShareMenuActions.push(s);this._preProcessOverflowToolbarButton(c);this._callContainerAggregationMethod("insertButton",c,this._getSemanticActionInsertIndex(s));return this;};b.prototype.removeContent=function(s){var c=this._getControl(s);this._callContainerAggregationMethod("removeButton",c);this._aShareMenuActions.splice(this._aShareMenuActions.indexOf(s),1);this._postProcessOverflowToolbarButton(s);this._onControlRemoved();return this;};b.prototype.destroy=function(){this._oShareMenuBtn=null;this._aShareMenuActions=null;this._aCustomShareActions=null;return S.prototype.destroy.call(this);};b.prototype._getMode=function(){return this._mode;};b.prototype._setMode=function(M){if(this._getMode()===M){return this;}if(M===b._Mode.initial){if(this._getMode()){this._fireContentChanged(true);}this._mode=b._Mode.initial;return this;}if(M===b._Mode.menu){this._mode=b._Mode.menu;this._fireContentChanged(false);}return this;};b.prototype._fireContentChanged=function(e){E.prototype.fireEvent.call(this._getParent(),"_shareMenuContentChanged",{"bEmpty":e});};b.prototype._getShareMenuButton=function(){var c=this._getContainer();if(!this._oShareMenuBtn){this._oShareMenuBtn=new O(c.getId()+"-shareButton",{icon:I.getIconURI("action"),tooltip:sap.ui.getCore().getLibraryResourceBundle("sap.f").getText("SEMANTIC_CONTROL_ACTION_SHARE"),layoutData:new a({closeOverflowOnInteraction:false}),text:sap.ui.getCore().getLibraryResourceBundle("sap.f").getText("SEMANTIC_CONTROL_ACTION_SHARE"),type:B.Transparent,press:function(){c.openBy(this._oShareMenuBtn);}.bind(this)});this._oShareMenuBtn.addEventDelegate({onAfterRendering:function(){this._oShareMenuBtn.$().attr("aria-haspopup",true);}.bind(this)},this);}return this._oShareMenuBtn;};b.prototype._getCustomActionInsertIndex=function(i){var c=this._aCustomShareActions.length;if(i===undefined){return this._aShareMenuActions.length+c;}i=i>=c?c:i;i+=this._aShareMenuActions.length;return i;};b.prototype._getSemanticActionInsertIndex=function(s){this._aShareMenuActions.sort(this._sortControlByOrder.bind(this));return this._aShareMenuActions.indexOf(s);};b.prototype._onControlAdded=function(c){if(this._isInitialMode()){this._setMode(b._Mode.menu,c);}};b.prototype._onControlRemoved=function(){var A=this._aShareMenuActions.length,c=this._aCustomShareActions.length,e=(A+c)===0;if(this._isMenuMode()&&e){this._setMode(b._Mode.initial);}};b.prototype._preProcessOverflowToolbarButton=function(o){if(o instanceof O){o._bInOverflow=true;}};b.prototype._postProcessOverflowToolbarButton=function(o){if(o instanceof O){delete o._bInOverflow;}};b.prototype._isInitialMode=function(){return this._getMode()===b._Mode.initial;};b.prototype._isMenuMode=function(){return this._getMode()===b._Mode.menu;};return b;});
