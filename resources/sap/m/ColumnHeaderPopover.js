/*
 * ! OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/model/base/ManagedObjectModel','sap/m/OverflowToolbar','sap/m/ResponsivePopover','sap/m/OverflowToolbarButton','sap/m/OverflowToolbarToggleButton','sap/m/ToolbarSpacer','sap/ui/model/Filter','sap/ui/model/FilterOperator'],function(C,M,O,R,a,b,T,F,c){"use strict";var d=C.extend("sap.m.ColumnHeaderPopover",{library:"sap.m",metadata:{properties:{},aggregations:{items:{type:"sap.m.ColumnPopoverItem",multiple:true,singularName:"item",bindable:true},_popover:{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"}}}});d.prototype.init=function(){var m=new M(this);var t=this;this._oShownCustomContent=null;var p=new R({showArrow:false,showHeader:false,placement:"Bottom",verticalScrolling:true,horizontalScrolling:false});this.setAggregation("_popover",p);var f=new F({path:"visible",operator:c.EQ,value1:true});var e=function(i,g){var I=g.getObject();if(I.isA("sap.m.ColumnPopoverActionItem")){return t._createActionItem(i,I);}else if(I.isA("sap.m.ColumnPopoverCustomItem")){return t._createCustomItem(i,I);}};var o=new O({content:{path:'/items',filters:[f],length:5,factory:e}});o.updateAggregation=function(){if(this._oShownCustomContent){this._oShownCustomContent=null;}O.prototype.updateAggregation.apply(this,arguments);o.addContent(new T());o.addContent(new a({type:"Transparent",icon:"sap-icon://decline",tooltip:"Close",press:[p.close,p]}));};p.addContent(o);p.setModel(m);};d.prototype._createActionItem=function(i,I){var t=this;var p=this.getAggregation("_popover");return new a(i,{icon:"{icon}",tooltip:"{text}",type:"Transparent",press:function(){if(t._oShownCustomContent){t._oShownCustomContent.setVisible(false);t._oShownCustomContent=null;t._cleanSelection(p);}I.firePress();}});};d.prototype._createCustomItem=function(i,I){var t=this;var p=this.getAggregation("_popover");var o=I.getContent();if(o){o.setVisible(false);}p.addContent(o);return new b(i,{icon:"{icon}",type:"Transparent",tooltip:"{text}",press:function(){if(t._oShownCustomContent){t._oShownCustomContent.setVisible(false);}if(this.getPressed()){t._cleanSelection(p);I.fireBeforeShowContent();o.setVisible(true);t._oShownCustomContent=o;I._sRelatedId=o.sId;}else{o.setVisible(false);t._oShownCustomContent=null;}}});};d.prototype._cleanSelection=function(p){var o=p.getContent()[0],B;if(o&&o.isA("sap.m.OverflowToolbar")&&o.getContent()){B=o.getContent();}if(B){for(var i=0;i<B.length;i++){if(B[i]!==this&&B[i].getPressed&&B[i].getPressed()){B[i].setPressed(false);}}}};d.prototype.updateAggregation=function(){var p=this.getAggregation("_popover"),e;if(p){e=p.getAggregation("content");}if(e){for(var i=0;i<e.length;i++){if(!e[i].isA("sap.m.OverflowToolbar")){p.removeAggregation("content",e[i]);}}}C.prototype.updateAggregation.apply(this,arguments);};d.prototype.openBy=function(o){var p=this.getAggregation("_popover");if(!this._bAppendedToUIArea&&!this.getParent()){var s=sap.ui.getCore().getStaticAreaRef();s=sap.ui.getCore().getUIArea(s);s.addContent(this,true);this._bAppendedToUIArea=true;}var e=o.getFocusDomRef();if(e){p.setOffsetY(-e.clientHeight);}p.openBy(o);};d.prototype.exit=function(){this._oShownCustomContent=null;var p=this.getAggregation("_popover");if(p.getContent()){p.destroyContent();}};return d;});
