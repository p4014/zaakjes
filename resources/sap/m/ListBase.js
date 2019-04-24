/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/events/KeyCodes","sap/ui/Device","sap/ui/core/Control","sap/ui/core/InvisibleText","sap/ui/core/LabelEnablement","sap/ui/core/delegate/ItemNavigation","./library","./InstanceManager","./GrowingEnablement","./GroupHeaderListItem","./ListItemBase","./ListBaseRenderer","sap/base/strings/capitalize","sap/ui/thirdparty/jquery","sap/base/Log","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Selectors","sap/ui/dom/jquery/Aria"],function(K,D,C,I,L,a,l,b,G,c,d,f,g,q,h){"use strict";var j=l.ListType;var k=l.ListKeyboardMode;var m=l.ListGrowingDirection;var S=l.SwipeDirection;var n=l.ListSeparators;var o=l.ListMode;var p=l.ListHeaderDesign;var r=l.Sticky;var s=C.extend("sap.m.ListBase",{metadata:{library:"sap.m",dnd:true,properties:{inset:{type:"boolean",group:"Appearance",defaultValue:false},headerText:{type:"string",group:"Misc",defaultValue:null},headerDesign:{type:"sap.m.ListHeaderDesign",group:"Appearance",defaultValue:p.Standard,deprecated:true},footerText:{type:"string",group:"Misc",defaultValue:null},mode:{type:"sap.m.ListMode",group:"Behavior",defaultValue:o.None},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},includeItemInSelection:{type:"boolean",group:"Behavior",defaultValue:false},showUnread:{type:"boolean",group:"Misc",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},showNoData:{type:"boolean",group:"Misc",defaultValue:true},enableBusyIndicator:{type:"boolean",group:"Behavior",defaultValue:true},modeAnimationOn:{type:"boolean",group:"Misc",defaultValue:true},showSeparators:{type:"sap.m.ListSeparators",group:"Appearance",defaultValue:n.All},swipeDirection:{type:"sap.m.SwipeDirection",group:"Misc",defaultValue:S.Both},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:20},growingTriggerText:{type:"string",group:"Appearance",defaultValue:null},growingScrollToLoad:{type:"boolean",group:"Behavior",defaultValue:false},growingDirection:{type:"sap.m.ListGrowingDirection",group:"Behavior",defaultValue:m.Downwards},rememberSelections:{type:"boolean",group:"Behavior",defaultValue:true},keyboardMode:{type:"sap.m.ListKeyboardMode",group:"Behavior",defaultValue:k.Navigation},sticky:{type:"sap.m.Sticky[]",group:"Appearance"}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.ListItemBase",multiple:true,singularName:"item",bindable:"bindable",selector:"#{id} .sapMListItems",dnd:true},swipeContent:{type:"sap.ui.core.Control",multiple:false},headerToolbar:{type:"sap.m.Toolbar",multiple:false},infoToolbar:{type:"sap.m.Toolbar",multiple:false},contextMenu:{type:"sap.ui.core.IContextMenu",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{deprecated:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}},selectionChange:{parameters:{listItem:{type:"sap.m.ListItemBase"},listItems:{type:"sap.m.ListItemBase[]"},selected:{type:"boolean"},selectAll:{type:"boolean"}}},"delete":{parameters:{listItem:{type:"sap.m.ListItemBase"}}},swipe:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"},swipeContent:{type:"sap.ui.core.Control"},srcControl:{type:"sap.ui.core.Control"}}},growingStarted:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},growingFinished:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},updateStarted:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},updateFinished:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},itemPress:{parameters:{listItem:{type:"sap.m.ListItemBase"},srcControl:{type:"sap.ui.core.Control"}}},beforeOpenContextMenu:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}}},designtime:"sap/m/designtime/ListBase.designtime"}});s.prototype.bAnnounceDetails=true;s.getInvisibleText=function(){return this.oInvisibleText||(this.oInvisibleText=new I().toStatic());};s.prototype.sNavItemClass="sapMLIB";s.prototype.init=function(){this._aNavSections=[];this._aSelectedPaths=[];this._iItemNeedsHighlight=0;this.data("sap-ui-fastnavgroup","true",true);};s.prototype.onBeforeRendering=function(){this._bRendering=true;this._bActiveItem=false;this._aNavSections=[];this._removeSwipeContent();};s.prototype.onAfterRendering=function(){this._bRendering=false;this._sLastMode=this.getMode();if(D.system.desktop){this._bItemNavigationInvalidated=true;}};s.prototype.exit=function(){this._oSelectedItem=null;this._aNavSections=[];this._aSelectedPaths=[];this._destroyGrowingDelegate();this._destroyItemNavigation();};s.prototype.refreshItems=function(R){if(this._oGrowingDelegate){this._oGrowingDelegate.refreshItems(R);}else{if(!this._bReceivingData){this._updateStarted(R);this._bReceivingData=true;}this.refreshAggregation("items");}};s.prototype.updateItems=function(R){if(this._oGrowingDelegate){this._oGrowingDelegate.updateItems(R);}else{if(this._bReceivingData){this._bReceivingData=false;}else{this._updateStarted(R);}this.updateAggregation("items");this._updateFinished();}};s.prototype.setBindingContext=function(e,M){var i=(this.getBindingInfo("items")||{}).model;if(i===M){this._resetItemsBinding();}return C.prototype.setBindingContext.apply(this,arguments);};s.prototype._bindAggregation=function(N,B){function e(B,E,H){B.events=B.events||{};if(!B.events[E]){B.events[E]=H;}else{var O=B.events[E];B.events[E]=function(){H.apply(this,arguments);O.apply(this,arguments);};}}if(N==="items"){this._resetItemsBinding();e(B,"dataRequested",this._onBindingDataRequestedListener.bind(this));e(B,"dataReceived",this._onBindingDataReceivedListener.bind(this));}C.prototype._bindAggregation.call(this,N,B);};s.prototype._onBindingDataRequestedListener=function(e){this._showBusyIndicator();if(this._dataReceivedHandlerId!=null){clearTimeout(this._dataReceivedHandlerId);delete this._dataReceivedHandlerId;}};s.prototype._onBindingDataReceivedListener=function(e){if(this._dataReceivedHandlerId!=null){clearTimeout(this._dataReceivedHandlerId);delete this._dataReceivedHandlerId;}this._dataReceivedHandlerId=setTimeout(function(){this._hideBusyIndicator();delete this._dataReceivedHandlerId;}.bind(this),0);};s.prototype.destroyItems=function(e){if(!this.getItems(true).length){return this;}this._oSelectedItem=null;this.destroyAggregation("items","KeepDom");if(!e){this.invalidate();}return this;};s.prototype.removeAllItems=function(A){this._oSelectedItem=null;return this.removeAllAggregation("items");};s.prototype.removeItem=function(i){var e=this.removeAggregation("items",i);if(e&&e===this._oSelectedItem){this._oSelectedItem=null;}return e;};s.prototype.getItems=function(R){if(R){return this.mAggregations["items"]||[];}return this.getAggregation("items",[]);};s.prototype.getId=function(e){var i=this.sId;return e?i+"-"+e:i;};s.prototype.setGrowing=function(e){e=!!e;if(this.getGrowing()!=e){this.setProperty("growing",e,!e);if(e){this._oGrowingDelegate=new G(this);}else if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}}return this;};s.prototype.setGrowingThreshold=function(t){return this.setProperty("growingThreshold",t,true);};s.prototype.setEnableBusyIndicator=function(e){this.setProperty("enableBusyIndicator",e,true);if(!this.getEnableBusyIndicator()){this._hideBusyIndicator();}return this;};s.prototype.setNoDataText=function(N){this.setProperty("noDataText",N,true);this.$("nodata-text").text(this.getNoDataText());return this;};s.prototype.getNoDataText=function(e){if(e&&this._bBusy){return"";}var N=this.getProperty("noDataText");N=N||sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LIST_NO_DATA");return N;};s.prototype.getSelectedItem=function(){var e=this.getItems(true);for(var i=0;i<e.length;i++){if(e[i].getSelected()){return e[i];}}return null;};s.prototype.setSelectedItem=function(e,i,F){if(this.indexOfItem(e)<0){h.warning("setSelectedItem is called without valid ListItem parameter on "+this);return;}if(this._bSelectionMode){e.setSelected((i===undefined)?true:!!i);F&&this._fireSelectionChangeEvent([e]);}};s.prototype.getSelectedItems=function(){return this.getItems(true).filter(function(i){return i.getSelected();});};s.prototype.setSelectedItemById=function(i,e){var t=sap.ui.getCore().byId(i);return this.setSelectedItem(t,e);};s.prototype.getSelectedContexts=function(A){var B=this.getBindingInfo("items"),M=(B||{}).model,e=this.getModel(M);if(!B||!e){return[];}if(A&&this.getRememberSelections()){return this._aSelectedPaths.map(function(P){return e.getContext(P);});}return this.getSelectedItems().map(function(i){return i.getBindingContext(M);});};s.prototype.removeSelections=function(A,F,e){var i=[];this._oSelectedItem=null;A&&(this._aSelectedPaths=[]);this.getItems(true).forEach(function(t){if(!t.getSelected()){return;}if(e&&t.isSelectedBoundTwoWay()){return;}t.setSelected(false,true);i.push(t);!A&&this._updateSelectedPaths(t);},this);if(F&&i.length){this._fireSelectionChangeEvent(i);}return this;};s.prototype.selectAll=function(F){if(this.getMode()!="MultiSelect"){return this;}var e=[];this.getItems(true).forEach(function(i){if(!i.getSelected()){i.setSelected(true,true);e.push(i);this._updateSelectedPaths(i);}},this);if(F&&e.length){this._fireSelectionChangeEvent(e,F);}return this;};s.prototype.getLastMode=function(M){return this._sLastMode;};s.prototype.setMode=function(M){M=this.validateProperty("mode",M);var O=this.getMode();if(O==M){return this;}this._bSelectionMode=M.indexOf("Select")>-1;if(!this._bSelectionMode){this.removeSelections(true);}else{var e=this.getSelectedItems();if(e.length>1){this.removeSelections(true);}else if(O===o.MultiSelect){this._oSelectedItem=e[0];}}return this.setProperty("mode",M);};s.prototype.getGrowingInfo=function(){return this._oGrowingDelegate?this._oGrowingDelegate.getInfo():null;};s.prototype.setRememberSelections=function(R){this.setProperty("rememberSelections",R,true);!this.getRememberSelections()&&(this._aSelectedPaths=[]);return this;};s.prototype.setSelectedContextPaths=function(e){this._aSelectedPaths=e||[];};s.prototype.getSelectedContextPaths=function(A){if(!A||(A&&this.getRememberSelections())){return this._aSelectedPaths.slice(0);}return this.getSelectedItems().map(function(i){return i.getBindingContextPath();});};s.prototype.isAllSelectableSelected=function(){if(this.getMode()!=o.MultiSelect){return false;}var i=this.getItems(true),e=this.getSelectedItems().length,t=i.filter(function(u){return u.isSelectable();}).length;return(i.length>0)&&(e==t);};s.prototype.getVisibleItems=function(){return this.getItems(true).filter(function(i){return i.getVisible();});};s.prototype.getActiveItem=function(){return this._bActiveItem;};s.prototype.onItemDOMUpdate=function(e){if(!this._bRendering&&this.bOutput){this._startItemNavigation(true);}};s.prototype.onItemActiveChange=function(e,A){this._bActiveItem=A;};s.prototype.onItemHighlightChange=function(i,N){this._iItemNeedsHighlight+=(N?1:-1);if(this._iItemNeedsHighlight==1&&N){this.$("listUl").addClass("sapMListHighlight");}else if(this._iItemNeedsHighlight==0){this.$("listUl").removeClass("sapMListHighlight");}};s.prototype.onItemSelectedChange=function(e,i){if(this.getMode()==o.MultiSelect){this._updateSelectedPaths(e,i);return;}if(i){this._aSelectedPaths=[];this._oSelectedItem&&this._oSelectedItem.setSelected(false,true);this._oSelectedItem=e;}else if(this._oSelectedItem===e){this._oSelectedItem=null;}this._updateSelectedPaths(e,i);};s.prototype.getItemsContainerDomRef=function(){return this.getDomRef("listUl");};s.prototype.checkGrowingFromScratch=function(){};s.prototype.onBeforePageLoaded=function(e,i){this._fireUpdateStarted(i,e);this.fireGrowingStarted(e);};s.prototype.onAfterPageLoaded=function(e,i){this._fireUpdateFinished(e);this.fireGrowingFinished(e);};s.prototype.addNavSection=function(i){this._aNavSections.push(i);return i;};s.prototype.getMaxItemsCount=function(){var B=this.getBinding("items");if(B&&B.getLength){return B.getLength()||0;}return this.getItems(true).length;};s.prototype.shouldRenderItems=function(){return true;};s.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._bUpdating=false;this._bReceivingData=false;this.removeSelections(true,false,true);this._oGrowingDelegate&&this._oGrowingDelegate.reset();this._hideBusyIndicator();if(this._oItemNavigation){this._oItemNavigation.iFocusedIndex=-1;}}};s.prototype._updateStarted=function(R){if(!this._bReceivingData&&!this._bUpdating){this._bUpdating=true;this._fireUpdateStarted(R);}};s.prototype._fireUpdateStarted=function(R,i){this._sUpdateReason=g(R||"Refresh");this.fireUpdateStarted({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});};s.prototype.onThemeChanged=function(){if(this._oGrowingDelegate){this._oGrowingDelegate._updateTrigger();}};s.prototype._updateFinished=function(){if(!this._bReceivingData&&this._bUpdating){this._fireUpdateFinished();this._bUpdating=false;}};s.prototype._fireUpdateFinished=function(i){this._hideBusyIndicator();setTimeout(function(){this._bItemNavigationInvalidated=true;this.fireUpdateFinished({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});}.bind(this),0);};s.prototype._showBusyIndicator=function(){if(this.getEnableBusyIndicator()&&!this.getBusy()&&!this._bBusy){this._bBusy=true;this._sBusyTimer=setTimeout(function(){this.$("nodata-text").text("");}.bind(this),this.getBusyIndicatorDelay());this.setBusy(true,"listUl");}};s.prototype._hideBusyIndicator=function(){if(this._bBusy){this._bBusy=false;this.setBusy(false,"listUl");clearTimeout(this._sBusyTimer);if(!this.getItems(true).length){this.$("nodata-text").text(this.getNoDataText());}}};s.prototype.onItemBindingContextSet=function(i){if(!this._bSelectionMode||!this.getRememberSelections()||!this.isBound("items")){return;}if(i.isSelectedBoundTwoWay()){return;}var P=i.getBindingContextPath();if(P){var e=(this._aSelectedPaths.indexOf(P)>-1);i.setSelected(e);}};s.prototype.onItemInserted=function(i,e){if(e){this.onItemSelectedChange(i,true);}if(!this._bSelectionMode||!this._aSelectedPaths.length||!this.getRememberSelections()||!this.isBound("items")||i.isSelectedBoundTwoWay()||i.getSelected()){return;}var P=i.getBindingContextPath();if(P&&this._aSelectedPaths.indexOf(P)>-1){i.setSelected(true);}};s.prototype.onItemSelect=function(e,i){if(this.getMode()==o.MultiSelect){this._fireSelectionChangeEvent([e]);}else if(this._bSelectionMode&&i){this._fireSelectionChangeEvent([e]);}};s.prototype._fireSelectionChangeEvent=function(e,i){var t=e&&e[0];if(!t){return;}this.fireSelectionChange({listItem:t,listItems:e,selected:t.getSelected(),selectAll:!!i});this.fireSelect({listItem:t});};s.prototype.onItemDelete=function(e){this.fireDelete({listItem:e});};s.prototype.onItemPress=function(e,i){if(e.getType()==j.Inactive){return;}setTimeout(function(){this.fireItemPress({listItem:e,srcControl:i});}.bind(this),0);};s.prototype._updateSelectedPaths=function(i,e){if(!this.getRememberSelections()||!this.isBound("items")){return;}var P=i.getBindingContextPath();if(!P){return;}e=(e===undefined)?i.getSelected():e;var t=this._aSelectedPaths.indexOf(P);if(e){t<0&&this._aSelectedPaths.push(P);}else{t>-1&&this._aSelectedPaths.splice(t,1);}};s.prototype._destroyGrowingDelegate=function(){if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}};s.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}};s.prototype._getTouchBlocker=function(){return this.$().children();};s.prototype._getSwipeContainer=function(){return this._$swipeContainer||(this._$swipeContainer=q("<div>",{"id":this.getId("swp"),"class":"sapMListSwp"}));};s.prototype._setSwipePosition=function(){if(this._isSwipeActive){return this._getSwipeContainer().css("top",this._swipedItem.$().position().top);}};s.prototype._renderSwipeContent=function(){var $=this._swipedItem.$(),e=this._getSwipeContainer();this.$().prepend(e.css({top:$.position().top,height:$.outerHeight(true)}));if(this._bRerenderSwipeContent){this._bRerenderSwipeContent=false;var i=sap.ui.getCore().createRenderManager();i.render(this.getSwipeContent(),e.empty()[0]);i.destroy();}return this;};s.prototype._swipeIn=function(){var t=this,$=t._getTouchBlocker(),i=t._getSwipeContainer();t._isSwipeActive=true;t._renderSwipeContent();b.addDialogInstance(t);window.document.activeElement.blur();q(window).on("resize.swp",function(){t._setSwipePosition();});$.css("pointer-events","none").on("touchstart.swp mousedown.swp",function(e){if(!i[0].firstChild.contains(e.target)){e.preventDefault();e.stopPropagation();}});i.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");i.css("opacity",1).focus();$.parent().on("touchend.swp touchcancel.swp mouseup.swp",function(e){if(!i[0].firstChild.contains(e.target)){t.swipeOut();}});}).removeClass("sapMListSwpOutAnim").addClass("sapMListSwpInAnim");};s.prototype._onSwipeOut=function(e){this._getSwipeContainer().css("opacity",0).remove();q(window).off("resize.swp");this._getTouchBlocker().css("pointer-events","auto").off("touchstart.swp mousedown.swp");if(typeof e=="function"){e.call(this,this._swipedItem,this.getSwipeContent());}this._isSwipeActive=false;b.removeDialogInstance(this);};s.prototype.swipeOut=function(e){if(!this._isSwipeActive){return this;}var t=this,$=this._getSwipeContainer();this._getTouchBlocker().parent().off("touchend.swp touchend.swp touchcancel.swp mouseup.swp");$.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");t._onSwipeOut(e);}).removeClass("sapMListSwpInAnim").addClass("sapMListSwpOutAnim");return this;};s.prototype._removeSwipeContent=function(){if(this._isSwipeActive){this.swipeOut()._onSwipeOut();}};s.prototype.close=s.prototype._removeSwipeContent;s.prototype._onSwipe=function(e){var i=this.getSwipeContent(),t=e.srcControl;if(i&&t&&!this._isSwipeActive&&this!==t&&!this._eventHandledByControl&&D.support.touch){for(var u=t;u&&!(u instanceof d);u=u.oParent);if(u instanceof d){this._swipedItem=u;this.fireSwipe({listItem:this._swipedItem,swipeContent:i,srcControl:t},true)&&this._swipeIn();}}};s.prototype.ontouchstart=function(e){this._eventHandledByControl=e.isMarked();};s.prototype.onswipeleft=function(e){var i=sap.ui.getCore().getConfiguration().getRTL()?"RightToLeft":"LeftToRight";if(this.getSwipeDirection()!=i){this._onSwipe(e);}};s.prototype.onswiperight=function(e){var i=sap.ui.getCore().getConfiguration().getRTL()?"LeftToRight":"RightToLeft";if(this.getSwipeDirection()!=i){this._onSwipe(e);}};s.prototype.setSwipeDirection=function(e){return this.setProperty("swipeDirection",e,true);};s.prototype.getSwipedItem=function(){return(this._isSwipeActive?this._swipedItem:null);};s.prototype.setSwipeContent=function(e){this._bRerenderSwipeContent=true;this.toggleStyleClass("sapMListSwipable",!!e);return this.setAggregation("swipeContent",e,!this._isSwipeActive);};s.prototype.invalidate=function(O){if(O&&O===this.getSwipeContent()){this._bRerenderSwipeContent=true;this._isSwipeActive&&this._renderSwipeContent();return;}return C.prototype.invalidate.apply(this,arguments);};s.prototype.addItemGroup=function(e,H,i){H=H||new c({title:e.text||e.key});H._bGroupHeader=true;this.addAggregation("items",H,i);return H;};s.prototype.removeGroupHeaders=function(e){this.getItems(true).forEach(function(i){if(i.isGroupHeader()){i.destroy(e);}});};s.prototype.getAccessibilityType=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_LIST");};s.prototype.getAccessibilityStates=function(){if(!this.getItems(true).length){return"";}var e="",M=o,i=this.getMode(),B=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(L.isRequired(this)){e+=B.getText("LIST_REQUIRED")+" ";}if(i==M.MultiSelect){e+=B.getText("LIST_MULTISELECTABLE")+" ";}else if(i==M.Delete){e+=B.getText("LIST_DELETABLE")+" ";}else if(i!=M.None){e+=B.getText("LIST_SELECTABLE")+" ";}if(this.isGrouped()){e+=B.getText("LIST_GROUPED")+" ";}return e;};s.prototype.getAccessibilityDescription=function(){var e="";var H=this.getHeaderToolbar();if(H){var t=H.getTitleControl();if(t){e+=t.getText()+" ";}}else{e+=this.getHeaderText()+" ";}e+=this.getAccessibilityStates()+" ";return e;};s.prototype.getAccessibilityInfo=function(){return{description:this.getAccessibilityDescription().trim(),focusable:true};};s.prototype.getAccessbilityPosition=function(i){var e=0,t=this.getVisibleItems(),P=t.indexOf(i)+1,B=this.getBinding("items");if(this.getGrowing()&&this.getGrowingScrollToLoad()&&B&&B.isLengthFinal()){e=B.getLength();if(B.isGrouped()){e+=t.filter(function(i){return i.isGroupHeader()&&i.getVisible();}).length;}}else{e=t.length;}return{setSize:e,posInset:P};};s.prototype.onItemFocusIn=function(i,F){this._handleStickyItemFocus(i.getDomRef());if(i!==F){return;}if(!sap.ui.getCore().getConfiguration().getAccessibility()){return;}var e=i.getDomRef(),P=this.getAccessbilityPosition(i);if(!i.getContentAnnouncement){this.getNavigationRoot().setAttribute("aria-activedescendant",e.id);e.setAttribute("aria-posinset",P.posInset);e.setAttribute("aria-setsize",P.setSize);}else{var A=i.getAccessibilityInfo(),B=sap.ui.getCore().getLibraryResourceBundle("sap.m"),t=A.type+" ";t+=B.getText("LIST_ITEM_POSITION",[P.posInset,P.setSize])+" ";t+=A.description;this.updateInvisibleText(t,e);return t;}};s.prototype.updateInvisibleText=function(t,i,P){var e=s.getInvisibleText(),F=q(i||document.activeElement);if(this.bAnnounceDetails){this.bAnnounceDetails=false;t=this.getAccessibilityInfo().description+" "+t;}e.setText(t.trim());F.addAriaLabelledBy(e.getId(),P);window.setTimeout(function(){F.removeAriaLabelledBy(e.getId());},0);};s.prototype.getNavigationRoot=function(){return this.getDomRef("listUl");};s.prototype.getFocusDomRef=function(){return this.getNavigationRoot();};s.prototype._startItemNavigation=function(i){if(!D.system.desktop){return;}var e=this.getKeyboardMode(),t=k;if(e==t.Edit&&!this.getItems(true).length){return;}var N=this.getNavigationRoot();var T=(e==t.Edit)?-1:0;if(i&&!N.contains(document.activeElement)){this._bItemNavigationInvalidated=true;if(!N.getAttribute("tabindex")){N.tabIndex=T;}return;}if(!this._oItemNavigation){this._oItemNavigation=new a();this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);this._setItemNavigationTabIndex(T);this._oItemNavigation.setTableMode(true,true).setColumns(1);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"]});}this._oItemNavigation.setPageSize(this.getGrowingThreshold());this._oItemNavigation.setRootDomRef(N);this.setNavigationItems(this._oItemNavigation,N);this._bItemNavigationInvalidated=false;};s.prototype.setNavigationItems=function(i,N){var e=q(N).children(".sapMLIB").get();i.setItemDomRefs(e);if(i.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==m.Upwards){i.setFocusedIndex(e.length-1);}else{i.setFocusedIndex(0);}}};s.prototype.getItemNavigation=function(){return this._oItemNavigation;};s.prototype._setItemNavigationTabIndex=function(t){if(this._oItemNavigation){this._oItemNavigation.iActiveTabIndex=t;this._oItemNavigation.iTabIndex=t;}};s.prototype.setKeyboardMode=function(e){this.setProperty("keyboardMode",e,true);if(this.isActive()){var t=(e==k.Edit)?-1:0;this.$("nodata").prop("tabIndex",~t);this.$("listUl").prop("tabIndex",t);this.$("after").prop("tabIndex",t);this._setItemNavigationTabIndex(t);}return this;};s.prototype.setItemFocusable=function(e){if(!this._oItemNavigation){return;}var i=this._oItemNavigation.getItemDomRefs();var t=i.indexOf(e.getDomRef());if(t>=0){this._oItemNavigation.setFocusedIndex(t);}};s.prototype.forwardTab=function(F){this._bIgnoreFocusIn=true;this.$(F?"after":"before").focus();};s.prototype.onsaptabnext=function(e){if(e.isMarked()||this.getKeyboardMode()==k.Edit){return;}if(e.target.id==this.getId("nodata")){this.forwardTab(true);e.setMarked();}};s.prototype.onsaptabprevious=function(e){if(e.isMarked()||this.getKeyboardMode()==k.Edit){return;}var t=e.target.id;if(t==this.getId("nodata")){this.forwardTab(false);}else if(t==this.getId("trigger")){this.focusPrevious();e.preventDefault();}};s.prototype._navToSection=function(F){var t;var i=0;var e=F?1:-1;var u=this._aNavSections.length;this._aNavSections.some(function(w,x){var y=(w?window.document.getElementById(w):null);if(y&&y.contains(document.activeElement)){i=x;return true;}});var v=this.getItemsContainerDomRef();var $=q(document.getElementById(this._aNavSections[i]));if($[0]===v&&this._oItemNavigation){$.data("redirect",this._oItemNavigation.getFocusedIndex());}this._aNavSections.some(function(){i=(i+e+u)%u;t=q(document.getElementById(this._aNavSections[i]));if(t[0]===v&&this._oItemNavigation){var R=t.data("redirect");var w=this._oItemNavigation.getItemDomRefs();var T=w[R]||v.children[0];t=q(T);}if(t.is(":focusable")){t.focus();return true;}},this);return t;};s.prototype.onsapshow=function(e){if(e.isMarked()||e.which==K.F4||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(true)){e.preventDefault();e.setMarked();}};s.prototype.onsaphide=function(e){if(e.isMarked()||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(false)){e.preventDefault();e.setMarked();}};s.prototype.onkeydown=function(e){var i=(e.which==K.A)&&(e.metaKey||e.ctrlKey);if(e.isMarked()||!i||!q(e.target).hasClass(this.sNavItemClass)){return;}e.preventDefault();if(this.getMode()!==o.MultiSelect){return;}if(this.isAllSelectableSelected()){this.removeSelections(false,true);}else{this.selectAll(true);}e.setMarked();};s.prototype.onmousedown=function(e){if(this._bItemNavigationInvalidated){this._startItemNavigation();}};s.prototype.focusPrevious=function(){if(!this._oItemNavigation){return;}var N=this._oItemNavigation.getItemDomRefs();var i=this._oItemNavigation.getFocusedIndex();var $=q(N[i]);var R=$.control(0)||{};var t=R.getTabbables?R.getTabbables():$.find(":sapTabbable");var F=t.eq(-1).add($).eq(-1);this.bAnnounceDetails=true;F.focus();};s.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;e.stopImmediatePropagation(true);return;}if(this._bItemNavigationInvalidated){this._startItemNavigation();}var t=e.target;if(t.id==this.getId("nodata")){this.updateInvisibleText(this.getNoDataText(),t);}if(e.isMarked()||!this._oItemNavigation||this.getKeyboardMode()==k.Edit||t.id!=this.getId("after")){return;}this.focusPrevious();e.setMarked();};s.prototype.onsapfocusleave=function(e){if(this._oItemNavigation&&!this.bAnnounceDetails&&!this.getNavigationRoot().contains(document.activeElement)){this.bAnnounceDetails=true;}};s.prototype.onItemArrowUpDown=function(e,E){var i=this.getItems(true),t=i.indexOf(e)+(E.type=="sapup"?-1:1),u=i[t];if(u&&u.isGroupHeader()){u=i[t+(E.type=="sapup"?-1:1)];}if(!u){return;}var T=u.getTabbables(),F=e.getTabbables().index(E.target),$=T.eq(T[F]?F:-1);$[0]?$.focus():u.focus();E.preventDefault();E.setMarked();};s.prototype.onItemContextMenu=function(e,E){var i=this.getContextMenu();if(!i){return;}var t=this.fireBeforeOpenContextMenu({listItem:e,column:sap.ui.getCore().byId(q(E.target).closest(".sapMListTblCell",this.getNavigationRoot()).attr("data-sap-ui-column"))});if(t){E.setMarked();E.preventDefault();var B,u=this.getBindingInfo("items");if(u){B=e.getBindingContext(u.model);i.setBindingContext(B);}i.openAsContextMenu(E,e);}};s.prototype.isGrouped=function(){var B=this.getBinding("items");return B&&B.isGrouped();};s.prototype.setContextMenu=function(e){this.setAggregation("contextMenu",e,true);};s.prototype.destroyContextMenu=function(){this.destroyAggregation("contextMenu",true);};s.getStickyBrowserSupport=function(){var B=D.browser;return(B.safari||B.chrome||(B.firefox&&B.version>=59)||(B.edge&&B.version>=16));};s.prototype.getStickyStyleValue=function(){var e=this.getSticky();if(!e||!e.length||!s.getStickyBrowserSupport()){return(this._iStickyValue=0);}var i=0,H=this.getHeaderText(),t=this.getHeaderToolbar(),u=H||(t&&t.getVisible()),v=this.getInfoToolbar(),w=v&&v.getVisible(),x=false;if(this.isA("sap.m.Table")){x=this.getColumns().some(function(y){return y.getVisible()&&y.getHeader();});}e.forEach(function(y){if(y===r.HeaderToolbar&&u){i+=1;}else if(y===r.InfoToolbar&&w){i+=2;}else if(y===r.ColumnHeaders&&x){i+=4;}});return(this._iStickyValue=i);};s.prototype._handleStickyItemFocus=function(i){if(!this._iStickyValue||this._sLastFocusedStickyItemId===i.id){return;}var e=l.getScrollDelegate(this,true);if(!e){return;}var t=0,T=0,u=0,v=0,H=0,w=0;if(this._iStickyValue&4){var x=this.getDomRef("tblHeader").firstChild;var y=x.getBoundingClientRect();T=parseInt(y.bottom);t=parseInt(y.height);}if(this._iStickyValue&2){var z=this.getDomRef().querySelector(".sapMListInfoTBarContainer");if(z){var A=z.getBoundingClientRect();v=parseInt(A.bottom);u=parseInt(A.height);}}if(this._iStickyValue&1){var B=this.getDomRef().querySelector(".sapMListHdr");if(B){var E=B.getBoundingClientRect();w=parseInt(E.bottom);H=parseInt(E.height);}}var F=Math.round(i.getBoundingClientRect().top);if(T>F||v>F||w>F){window.requestAnimationFrame(function(){e.scrollToElement(i,0,[0,-t-u-H]);});}this._sLastFocusedStickyItemId=i.id;};s.prototype.setHeaderToolbar=function(H){return this._setToolbar("headerToolbar",H);};s.prototype.setInfoToolbar=function(i){return this._setToolbar("infoToolbar",i);};s.prototype._setToolbar=function(A,t){var O=this.getAggregation(A);if(O){O.detachEvent("_change",this._onToolbarPropertyChanged,this);}this.setAggregation(A,t);if(t){t.attachEvent("_change",this._onToolbarPropertyChanged,this);}return this;};s.prototype._onToolbarPropertyChanged=function(e){if(e.getParameter("name")!=="visible"){return;}var O=this._iStickyValue,N=this.getStickyStyleValue();if(O!==N){var i=this.getDomRef();if(i){var t=i.classList;t.toggle("sapMSticky",!!N);t.remove("sapMSticky"+O);t.toggle("sapMSticky"+N,!!N);}}};return s;});
