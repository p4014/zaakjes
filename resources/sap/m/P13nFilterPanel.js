/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./P13nConditionPanel','./P13nPanel','./library','sap/m/Panel','./P13nFilterItem'],function(P,a,l,b,c){"use strict";var d=l.P13nPanelType;var e=l.P13nConditionOperation;var f=a.extend("sap.m.P13nFilterPanel",{metadata:{library:"sap.m",properties:{maxIncludes:{type:"string",group:"Misc",defaultValue:'-1'},maxExcludes:{type:"string",group:"Misc",defaultValue:'-1'},containerQuery:{type:"boolean",group:"Misc",defaultValue:false},layoutMode:{type:"string",group:"Misc",defaultValue:null}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",visibility:"hidden"},filterItems:{type:"sap.m.P13nFilterItem",multiple:true,singularName:"filterItem",bindable:"bindable"}},events:{addFilterItem:{},removeFilterItem:{},updateFilterItem:{},filterItemChanged:{parameters:{reason:{type:"string"},key:{type:"string"},index:{type:"int"},itemData:{type:"object"}}}}},renderer:function(r,C){r.write("<section");r.writeControlData(C);r.addClass("sapMFilterPanel");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapMFilterPanelContent");r.addClass("sapMFilterPanelBG");r.writeClasses();r.write(">");var g=C.getAggregation("content");var L=g.length;for(var i=0;i<L;i++){r.renderControl(g[i]);}r.write("</div>");r.write("</section>");}});f.prototype.setConditions=function(C){var I=[];var E=[];if(C.length){for(var i=0;i<C.length;i++){var o=C[i];if(!o.exclude){I.push(o);}else{E.push(o);}}}this._oIncludeFilterPanel.setConditions(I);this._oExcludeFilterPanel.setConditions(E);if(E.length>0){this._oExcludePanel.setExpanded(true);}return this;};f.prototype.getConditions=function(){var i=this._oIncludeFilterPanel.getConditions();var E=this._oExcludeFilterPanel.getConditions();return i.concat(E);};f.prototype.setContainerQuery=function(C){this.setProperty("containerQuery",C);this._oIncludeFilterPanel.setContainerQuery(C);this._oExcludeFilterPanel.setContainerQuery(C);return this;};f.prototype.setLayoutMode=function(m){this.setProperty("layoutMode",m);this._oIncludeFilterPanel.setLayoutMode(m);this._oExcludeFilterPanel.setLayoutMode(m);return this;};f.prototype.validateConditions=function(){return this._oIncludeFilterPanel.validateConditions()&&this._oExcludeFilterPanel.validateConditions();};f.prototype.removeInvalidConditions=function(){this._oIncludeFilterPanel.removeInvalidConditions();this._oExcludeFilterPanel.removeInvalidConditions();};f.prototype.removeValidationErrors=function(){this._oIncludeFilterPanel.removeValidationErrors();this._oExcludeFilterPanel.removeValidationErrors();};f.prototype.onBeforeNavigationFrom=function(){return this.validateConditions();};f.prototype.onAfterNavigationFrom=function(){return this.removeInvalidConditions();};f.prototype.setIncludeOperations=function(o,t){t=t||"default";this._aIncludeOperations[t]=o;if(this._oIncludeFilterPanel){this._oIncludeFilterPanel.setOperations(this._aIncludeOperations[t],t);}};f.prototype.getIncludeOperations=function(t){if(this._oIncludeFilterPanel){return this._oIncludeFilterPanel.getOperations(t);}};f.prototype.setExcludeOperations=function(o,t){t=t||"default";this._aExcludeOperations[t]=o;if(this._oExcludeFilterPanel){this._oExcludeFilterPanel.setOperations(this._aExcludeOperations[t],t);}};f.prototype.getExcludeOperations=function(t){if(this._oExcludeFilterPanel){return this._oExcludeFilterPanel.getOperations(t);}};f.prototype.setKeyFields=function(k){this._aKeyFields=k;if(this._oIncludeFilterPanel){this._oIncludeFilterPanel.setKeyFields(this._aKeyFields);}if(this._oExcludeFilterPanel){this._oExcludeFilterPanel.setKeyFields(this._aKeyFields);}};f.prototype.getKeyFields=function(){return this._aKeyFields;};f.prototype.setMaxIncludes=function(m){this.setProperty("maxIncludes",m);if(this._oIncludeFilterPanel){this._oIncludeFilterPanel.setMaxConditions(m);}this._updatePanel();return this;};f.prototype.setMaxExcludes=function(m){this.setProperty("maxExcludes",m);if(this._oExcludeFilterPanel){this._oExcludeFilterPanel.setMaxConditions(m);}this._updatePanel();return this;};f.prototype._updatePanel=function(){var m=this.getMaxIncludes()==="-1"?1000:parseInt(this.getMaxIncludes());var M=this.getMaxExcludes()==="-1"?1000:parseInt(this.getMaxExcludes());if(m>0){if(M<=0){this._oIncludePanel.setHeaderText(null);this._oIncludePanel.setExpandable(false);this._oIncludePanel.addStyleClass("panelTopMargin");this._oIncludePanel.addStyleClass("panelNoHeader");}}if(M===0){this._oExcludePanel.setHeaderText(null);this._oExcludePanel.setExpandable(false);this._oExcludePanel.addStyleClass("panelNoHeader");}};f.prototype.init=function(){this.setType(d.filter);this.setTitle(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("FILTERPANEL_TITLE"));sap.ui.getCore().loadLibrary("sap.ui.layout");this._aKeyFields=[];this.addStyleClass("sapMFilterPanel");this._oRb=sap.ui.getCore().getLibraryResourceBundle("sap.m");this._aIncludeOperations={};if(!this._aIncludeOperations["default"]){this.setIncludeOperations([e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE]);}if(!this._aIncludeOperations["string"]){this.setIncludeOperations([e.Contains,e.EQ,e.BT,e.StartsWith,e.EndsWith,e.LT,e.LE,e.GT,e.GE],"string");}if(!this._aIncludeOperations["date"]){this.setIncludeOperations([e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE],"date");}if(!this._aIncludeOperations["time"]){this.setIncludeOperations([e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE],"time");}if(!this._aIncludeOperations["datetime"]){this.setIncludeOperations([e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE],"datetime");}if(!this._aIncludeOperations["numeric"]){this.setIncludeOperations([e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE],"numeric");}if(!this._aIncludeOperations["numc"]){this.setIncludeOperations([e.Contains,e.EQ,e.BT,e.EndsWith,e.LT,e.LE,e.GT,e.GE],"numc");}if(!this._aIncludeOperations["boolean"]){this.setIncludeOperations([e.EQ],"boolean");}this._aExcludeOperations={};if(!this._aExcludeOperations["default"]){this.setExcludeOperations([e.EQ]);}this._oIncludePanel=new b({expanded:true,expandable:true,headerText:this._oRb.getText("FILTERPANEL_INCLUDES"),width:"auto"}).addStyleClass("sapMFilterPadding");this._oIncludeFilterPanel=new P({maxConditions:this.getMaxIncludes(),alwaysShowAddIcon:false,layoutMode:this.getLayoutMode(),dataChange:this._handleDataChange()});this._oIncludeFilterPanel._sAddRemoveIconTooltipKey="FILTER";for(var t in this._aIncludeOperations){this._oIncludeFilterPanel.setOperations(this._aIncludeOperations[t],t);}this._oIncludePanel.addContent(this._oIncludeFilterPanel);this.addAggregation("content",this._oIncludePanel);this._oExcludePanel=new b({expanded:false,expandable:true,headerText:this._oRb.getText("FILTERPANEL_EXCLUDES"),width:"auto"}).addStyleClass("sapMFilterPadding");this._oExcludeFilterPanel=new P({exclude:true,maxConditions:this.getMaxExcludes(),alwaysShowAddIcon:false,layoutMode:this.getLayoutMode(),dataChange:this._handleDataChange()});this._oExcludeFilterPanel._sAddRemoveIconTooltipKey="FILTER";for(var t in this._aExcludeOperations){this._oExcludeFilterPanel.setOperations(this._aExcludeOperations[t],t);}this._oExcludePanel.addContent(this._oExcludeFilterPanel);this.addAggregation("content",this._oExcludePanel);this._updatePanel();};f.prototype.exit=function(){var g=function(o){if(o&&o.destroy){o.destroy();}return null;};this._aKeyFields=g(this._aKeyFields);this._aIncludeOperations=g(this._aIncludeOperations);this._aExcludeOperations=g(this._aExcludeOperations);this._oRb=g(this._oRb);};f.prototype.onBeforeRendering=function(){if(this._bUpdateRequired){this._bUpdateRequired=false;var k=[];var m=(this.getBindingInfo("items")||{}).model;var g=function(n,o,i){var B=i.getBinding(n);if(B&&o){return o.getObject()[B.getPath()];}return i.getMetadata().getProperty(n)?i.getProperty(n):i.getAggregation(n);};this.getItems().forEach(function(i){var o=i.getBindingContext(m);if(i.getBinding("key")){o.getObject()[i.getBinding("key").getPath()]=i.getKey();}k.push({key:i.getColumnKey(),text:g("text",o,i),tooltip:g("tooltip",o,i),maxLength:g("maxLength",o,i),type:g("type",o,i),typeInstance:g("typeInstance",o,i),formatSettings:g("formatSettings",o,i),precision:g("precision",o,i),scale:g("scale",o,i),isDefault:g("isDefault",o,i),values:g("values",o,i)});var n=k.length;if(k[n-1].maxLength===1||k[n-1].maxLength==="1"){k[n-1].operations=[e.EQ,e.BT,e.LT,e.LE,e.GT,e.GE];}});this.setKeyFields(k);var C=[];m=(this.getBindingInfo("filterItems")||{}).model;this.getFilterItems().forEach(function(F){var o=F.getBindingContext(m);if(F.getBinding("key")&&o){o.getObject()[F.getBinding("key").getPath()]=F.getKey();}C.push({key:F.getKey(),keyField:g("columnKey",o,F),operation:g("operation",o,F),value1:g("value1",o,F),value2:g("value2",o,F),exclude:g("exclude",o,F)});});this.setConditions(C);}};f.prototype.addItem=function(i){a.prototype.addItem.apply(this,arguments);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};f.prototype.removeItem=function(i){var r=a.prototype.removeItem.apply(this,arguments);this._bUpdateRequired=true;return r;};f.prototype.destroyItems=function(){this.destroyAggregation("items");if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};f.prototype.addFilterItem=function(F){this.addAggregation("filterItems",F,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};f.prototype.insertFilterItem=function(F,i){this.insertAggregation("filterItems",F,i,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};f.prototype.updateFilterItems=function(r){this.updateAggregation("filterItems");if(r==="change"&&!this._bIgnoreBindCalls){this._bUpdateRequired=true;this.invalidate();}};f.prototype.removeFilterItem=function(F){F=this.removeAggregation("filterItems",F,true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return F;};f.prototype.removeAllFilterItems=function(){var F=this.removeAllAggregation("filterItems",true);if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return F;};f.prototype.destroyFilterItems=function(){this.destroyAggregation("filterItems");if(!this._bIgnoreBindCalls){this._bUpdateRequired=true;}return this;};f.prototype._handleDataChange=function(){var t=this;return function(E){var n=E.getParameter("newData");var o=E.getParameter("operation");var k=E.getParameter("key");var C=E.getParameter("index");var F;var I=-1;var g=E.getSource()===t._oExcludeFilterPanel;t.getFilterItems().some(function(h,i){if((!h.getExclude()&&!g)||(h.getExclude()&&g)){C--;}I=i;return C<0;},this);switch(o){case"update":F=t.getFilterItems()[I];if(F){F.setExclude(n.exclude);F.setColumnKey(n.keyField);F.setOperation(n.operation);F.setValue1(n.value1);F.setValue2(n.value2);}t.fireUpdateFilterItem({key:k,index:I,filterItemData:F});t.fireFilterItemChanged({reason:"updated",key:k,index:I,itemData:{columnKey:n.keyField,operation:n.operation,exclude:n.exclude,value1:n.value1,value2:n.value2}});break;case"add":if(C>=0){I++;}F=new c({columnKey:n.keyField,exclude:n.exclude,operation:n.operation});F.setValue1(n.value1);F.setValue2(n.value2);t._bIgnoreBindCalls=true;t.fireAddFilterItem({key:k,index:I,filterItemData:F});t.fireFilterItemChanged({reason:"added",key:k,index:I,itemData:{columnKey:n.keyField,operation:n.operation,exclude:n.exclude,value1:n.value1,value2:n.value2}});t._bIgnoreBindCalls=false;break;case"remove":t._bIgnoreBindCalls=true;t.fireRemoveFilterItem({key:k,index:I});t.fireFilterItemChanged({reason:"removed",key:k,index:I});t._bIgnoreBindCalls=false;break;default:throw"Operation'"+o+"' is not supported yet";}t._notifyChange();};};f.prototype._notifyChange=function(){var L=this.getChangeNotifier();if(L){L(this);}};return f;});
