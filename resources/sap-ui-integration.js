/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
(function(w){"use strict";var c,C;var s=document.currentScript||document.querySelector("script[src*='/sap-ui-integration.js']");var j=s.src.substring(0,s.src.indexOf("/sap-ui-integration.js"));function a(){if(w.sap&&w.sap.ui&&w.sap.ui.require){return b();}var S=document.createElement("script");function l(){if(!w.sap||!w.sap.ui||!w.sap.ui.require){setTimeout(l,10);return;}w.sap.ui.loader.config({baseUrl:j+"/",paths:{'sap':j+"/sap"},async:true});S.parentNode.removeChild(S);b();}S.addEventListener("load",l);S.setAttribute("src",j+"/sap-ui-boot.js");S.setAttribute("async","true");S.setAttribute("id","sap-ui-bootstrap");w["sap-ui-config"]={};var t=s.getAttribute("data-sap-ui-theme");if(t){w["sap-ui-config"]["theme"]=t;}S.setAttribute("id","sap-ui-bootstrap");w["sap-ui-config"]["xx-bindingSyntax"]="complex";w.document.head.appendChild(S);}function b(){if(w.sap&&w.sap.ui&&w.sap.ui.getCore){c=w.sap.ui.getCore();return d();}w.sap.ui.require(['/ui5loader-autoconfig','sap/ui/core/Core','sap/ui/integration/util/CustomElements'],function(e,f,g){C=g;f.boot();c=f;f.attachInit(function(){d();});C.coreInstance=c;});}function r(l){var L=c.getLoadedLibraries()[l];var p=s.getAttribute("prefix")||L.defaultTagPrefix,t=Object.keys(L.customTags),T=s.getAttribute("tags");if(T){t=T.split(",");}w.sap.ui.require(t.map(function(o,i){return L.customTags[t[i]];}),function(){var e=arguments;t.forEach(function(o,i){C.registerTag(t[i],p,e[i]);});});}function d(){w.addEventListener("load",function(){c.loadLibraries(["sap/ui/integration"],{async:true}).then(function(){r("sap.ui.integration");});});}a();})(window);