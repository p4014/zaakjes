/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Component","sap/ui/fl/Utils","sap/ui/core/routing/History","sap/ui/core/routing/HashChanger","sap/base/Log","sap/base/util/deepEqual"],function(q,C,f,H,a,L,d){"use strict";var V={variantTechnicalParameterName:"sap-ui-fl-control-variant-id",initializeHashRegister:function(){this._oHashRegister={currentIndex:null,hashParams:[],variantControlIds:[]};V._setOrUnsetCustomNavigationForParameter.call(this,true);},attachHashHandlers:function(v){if(this._oHashRegister.currentIndex===null){var h=a.getInstance();h.attachEvent("hashReplaced",V._handleHashReplaced,this);h.attachEvent("hashChanged",V._navigationHandler,this);var o=this.oAppComponent.destroy;this.oAppComponent.destroy=function(){V._setOrUnsetCustomNavigationForParameter.call(this,false);h.detachEvent("hashReplaced",V._handleHashReplaced,this);h.detachEvent("hashChanged",V._navigationHandler,this);this.oVariantController.resetMap();this.destroy();o.apply(this.oAppComponent,arguments);}.bind(this);V._navigationHandler.call(this);}if(Array.isArray(this._oHashRegister.variantControlIds[this._oHashRegister.variantControlIds])){this._oHashRegister.variantControlIds[this._oHashRegister.currentIndex].push(v);}else{this._oHashRegister.variantControlIds[this._oHashRegister.currentIndex]=[v];}},updateHasherEntry:function(p){if(!p||!Array.isArray(p.parameters)){L.info("Variant URL parameters could not be updated since invalid parameters were received");return;}if(p.updateURL){f.setTechnicalURLParameterValues(p.component||this.oAppComponent,V.variantTechnicalParameterName,p.parameters);}if(!p.ignoreRegisterUpdate){this._oHashRegister.hashParams[this._oHashRegister.currentIndex]=p.parameters;}},getCurrentControlVariantId:function(c){var t=f.getTechnicalParametersForComponent(c);return t&&t[V.variantTechnicalParameterName]&&Array.isArray(t[V.variantTechnicalParameterName])&&t[V.variantTechnicalParameterName][0];},_handleHashReplaced:function(e){this._sReplacedHash=e.getParameter("sHash");},_navigationHandler:function(e){var D;var n=e&&e.getParameter("newHash");if(n&&this._sReplacedHash===n){delete this._sReplacedHash;return;}if(this._oHashRegister.currentIndex===null){this._oHashRegister.currentIndex=0;D="NewEntry";}else{D=H.getInstance().getDirection();switch(D){case"Backwards":this._oHashRegister.currentIndex--;break;case"Forwards":case"NewEntry":this._oHashRegister.currentIndex++;break;case"Unknown":this._oHashRegister.currentIndex=0;this._oHashRegister.hashParams=[];this._oHashRegister.variantControlIds=[];this.switchToDefaultForVariant();break;default:return;}}if(this._oHashRegister.currentIndex>=0){var v;var p={};if(D==="NewEntry"||D==="Unknown"){var h=f.getParsedURLHash()&&f.getParsedURLHash().params;v=(h&&h[V.variantTechnicalParameterName])||[];var u=V._adjustForDuplicateParameters.call(this,v);v=v.map(function(P){return decodeURIComponent(P);});var E=this._oHashRegister.variantControlIds[this._oHashRegister.currentIndex];if(Array.isArray(E)){E.forEach(function(P){this.switchToDefaultForVariantManagement(P);}.bind(this));}p={parameters:v,updateURL:!!u};}else{v=this._oHashRegister.hashParams[this._oHashRegister.currentIndex];p={parameters:v,updateURL:true,ignoreRegisterUpdate:true};}}else{p={parameters:[],updateURL:true,ignoreRegisterUpdate:true};}this.updateHasherEntry(p);},_adjustForDuplicateParameters:function(v){var u=false;if(v.length>1){Object.keys(this.oData).forEach(function(s){this.oData[s].variants.reduce(function(b,o){var i=v.indexOf(o.key);if(i>-1){if(!b){b=true;}else{v.splice(i,1);u=true;}}return b;},false);}.bind(this));}return u;},_setOrUnsetCustomNavigationForParameter:function(s){var m=s?"registerNavigationFilter":"unregisterNavigationFilter";var u=f.getUshellContainer();if(u){u.getService("ShellNavigation")[m](V._navigationFilter);}},_navigationFilter:function(n,o){var u=f.getUshellContainer();var U=u.getService("URLParsing");var s=u.getService("ShellNavigation");var O=U.parseShellHash(o);var N=U.parseShellHash(n);var S=O&&N&&(O.params.hasOwnProperty(V.variantTechnicalParameterName)||N.params.hasOwnProperty(V.variantTechnicalParameterName))&&!d(O.params[V.variantTechnicalParameterName],N.params[V.variantTechnicalParameterName]);if(S){for(var k in O){if(k!=="params"&&k!=="appSpecificRoute"&&O[k]!==N[k]){S=false;break;}}}if(S){S=!([O,N].some(function(p){if(p.params.hasOwnProperty(V.variantTechnicalParameterName)){return Object.keys(p.params).length>1;}return Object.keys(p.params).length>0;}));}if(S){var A=(N.appSpecificRoute||"  ").substring(2);var b=(O.appSpecificRoute||"  ").substring(2);s.hashChanger.fireEvent("hashChanged",{newHash:A,oldHash:b});return{status:s.NavigationFilterStatus.Custom};}return s.NavigationFilterStatus.Continue;},getCurrentHashParamsFromRegister:function(){if(q.isNumeric(this._oHashRegister.currentIndex)&&this._oHashRegister.currentIndex>=0){return Array.prototype.slice.call(this._oHashRegister.hashParams[this._oHashRegister.currentIndex]);}}};return V;},true);
