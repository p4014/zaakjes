/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseTreeModifier","sap/base/util/ObjectPath","sap/ui/util/XMLHelper","sap/ui/core/Component","sap/base/util/merge","sap/ui/core/Fragment"],function(B,O,X,C,m){"use strict";var J={targets:"jsControlTree",setVisible:function(c,v){if(c.setVisible){this.unbindProperty(c,"visible");c.setVisible(v);}else{throw new Error("Provided control instance has no setVisible method");}},getVisible:function(c){if(c.getVisible){return c.getVisible();}else{throw new Error("Provided control instance has no getVisible method");}},setStashed:function(c,s,a){s=!!s;if(c.setStashed){var u;if(c.getStashed()===true&&s===false){c.setStashed(s);if(a instanceof C){u=this.bySelector(this.getSelector(c,a),a);}}if((u||c)["setVisible"]){this.setVisible(u||c,!s);}return u;}else{throw new Error("Provided control instance has no setStashed method");}},getStashed:function(c){if(c.getStashed){return typeof c.getStashed()!=="boolean"?!this.getVisible(c):c.getStashed();}else{throw new Error("Provided control instance has no getStashed method");}},bindProperty:function(c,p,b){c.bindProperty(p,b);},unbindProperty:function(c,p){if(c){c.unbindProperty(p,true);}},setProperty:function(c,p,P){var M=c.getMetadata().getPropertyLikeSetting(p);this.unbindProperty(c,p);if(M){var s=M._sMutator;c[s](P);}},getProperty:function(c,p){var M=c.getMetadata().getPropertyLikeSetting(p);if(M){var P=M._sGetter;return c[P]();}},isPropertyInitial:function(c,p){return c.isPropertyInitial(p);},setPropertyBinding:function(c,p,P){this.unbindProperty(c,p);var s={};s[p]=P;c.applySettings(s);},getPropertyBinding:function(c,p){return c.getBindingInfo(p);},createControl:function(c,a,v,s,S,A){var e;if(this.bySelector(s,a)){e="Can't create a control with duplicated ID "+s;if(A){return Promise.reject(e);}throw new Error(e);}if(A){return new Promise(function(r,R){sap.ui.require([c.replace(/\./g,"/")],function(b){var i=this.getControlIdBySelector(s,a);r(new b(i,S));}.bind(this),function(){R(new Error("Required control '"+c+"' couldn't be created asynchronously"));});}.bind(this));}var b=O.get(c);if(!b){throw new Error("Can't create a control because the matching class object has not yet been loaded. Please preload the '"+c+"' module");}var i=this.getControlIdBySelector(s,a);return new b(i,S);},applySettings:function(c,s){c.applySettings(s);},byId:function(i){return this._byId(i);},_byId:function(i){return sap.ui.getCore().byId(i);},getId:function(c){return c.getId();},getParent:function(c){return c.getParent();},getControlType:function(c){return c&&c.getMetadata().getName();},getAllAggregations:function(p){return p.getMetadata().getAllAggregations();},getAggregation:function(p,n){var a=this.findAggregation(p,n);if(a){return p[a._sGetter]();}},insertAggregation:function(p,n,o,i){var a=this.findAggregation(p,n);if(a){if(a.multiple){var I=i||0;p[a._sInsertMutator](o,I);}else{p[a._sMutator](o);}}},removeAggregation:function(c,n,o){var a=this.findAggregation(c,n);if(a){c[a._sRemoveMutator](o);}},removeAllAggregation:function(c,n){var a=this.findAggregation(c,n);if(a){c[a._sRemoveAllMutator]();}},getBindingTemplate:function(c,a){var b=c.getBindingInfo(a);return b&&b.template;},updateAggregation:function(c,a){var A=this.findAggregation(c,a);if(A){c[A._sDestructor]();c.updateAggregation(a);}},findIndexInParentAggregation:function(c){var p=this.getParent(c),a;if(!p){return-1;}a=this.getAggregation(p,this.getParentAggregationName(c));if(Array.isArray(a)){return a.indexOf(c);}else{return 0;}},getParentAggregationName:function(c){return c.sParentAggregationName;},findAggregation:function(c,a){if(c){if(c.getMetadata){var M=c.getMetadata();var A=M.getAllAggregations();if(A){return A[a];}}}},validateType:function(c,a,p,f){var t=a.type;if(a.multiple===false&&this.getAggregation(p,a.name)&&this.getAggregation(p,a.name).length>0){return false;}return this._isInstanceOf(c,t)||this._hasInterface(c,t);},instantiateFragment:function(f,n,v){var F=X.parse(f);F=this._checkAndPrefixIdsInFragment(F,n);var N;var i=v&&v.getId();var c=v.getController();N=sap.ui.xmlfragment({fragmentContent:F,sId:i},c);if(!Array.isArray(N)){N=[N];}return N;},destroy:function(c){c.destroy();},getChangeHandlerModulePath:function(c){if(typeof c==="object"&&typeof c.data==="function"&&c.data("sap-ui-custom-settings")&&c.data("sap-ui-custom-settings")["sap.ui.fl"]){return c.data("sap-ui-custom-settings")["sap.ui.fl"].flexibility;}else{return undefined;}}};return m({},B,J);},true);
