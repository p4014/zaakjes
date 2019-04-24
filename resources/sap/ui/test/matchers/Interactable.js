/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/test/matchers/Matcher','sap/ui/test/matchers/Visible',"sap/ui/thirdparty/jquery"],function(M,V,q){"use strict";var v=new V();return M.extend("sap.ui.test.matchers.Interactable",{isMatching:function(c){if(!v.isMatching(c)){return false;}if(c.getBusy&&c.getBusy()){this._oLogger.debug("Control '"+c+"' is busy");return false;}if(c.getEnabled&&!c.getEnabled()){this._oLogger.debug("Control '"+c+"' is not enabled");return false;}var p=c.getParent();while(p){if(p.getBusy&&p.getBusy()){this._oLogger.debug("Control '"+c+"' has a parent '"+p+"' that is busy");return false;}if(p.getEnabled&&!p.getEnabled()){this._oLogger.debug("Control '"+c+"' has a parent '"+p+"' that is not enabled");return false;}var P=p.getMetadata().getName()==="sap.ui.core.UIArea";if(P&&p.bNeedsRerendering){this._oLogger.debug("Control '"+c+"' is currently in a UIArea that needs a new rendering");return false;}p=p.getParent();}var C=c.$().closest("#sap-ui-static").length;var o=q("#sap-ui-blocklayer-popup").is(":visible");if(!C&&o){this._oLogger.debug("The control '"+c+"' is hidden behind a blocking popup layer");return false;}return true;}});});
