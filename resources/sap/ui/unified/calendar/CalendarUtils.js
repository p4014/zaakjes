/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/date/UniversalDate','./CalendarDate','sap/ui/core/Locale','sap/ui/core/LocaleData',"sap/ui/thirdparty/jquery"],function(U,C,L,a,q){"use strict";var b={};b.MAX_MILLISECONDS=8640000000000000;b.HOURS24=1000*3600*24;b._createLocalDate=function(d,t){var l;if(d){var m;if(d instanceof U){m=d.getJSDate();}else{m=d;}l=new Date(m.getUTCFullYear(),m.getUTCMonth(),m.getUTCDate());if(m.getFullYear()<1000){l.setFullYear(m.getFullYear());}if(t){l.setHours(m.getUTCHours());l.setMinutes(m.getUTCMinutes());l.setSeconds(m.getUTCSeconds());l.setMilliseconds(m.getUTCMilliseconds());}}return l;};b._createUTCDate=function(d,t){var u;if(d){var m;if(d instanceof U){m=d.getJSDate();}else{m=d;}u=new Date(Date.UTC(m.getFullYear(),m.getMonth(),m.getDate()));if(m.getFullYear()<1000){u.setUTCFullYear(m.getFullYear());}if(t){u.setUTCHours(m.getHours());u.setUTCMinutes(m.getMinutes());u.setUTCSeconds(m.getSeconds());u.setUTCMilliseconds(m.getMilliseconds());}}return u;};b._createUniversalUTCDate=function(d,c,t){var u;if(c){u=U.getInstance(this._createUTCDate(d,t),c);}else{u=new U(this._createUTCDate(d,t).getTime());}return u;};b.calculateWeekNumber=function(d,y,l,o){var w=0;var W=0;var f=o.getFirstDayOfWeek();var c=new L(l);if(c&&(c.getLanguage()=='en'&&c.getRegion()=='US')){var j=new U(d.getTime());j.setUTCFullYear(y,0,1);W=j.getUTCDay();var e=new U(d.getTime());e.setUTCDate(e.getUTCDate()-e.getUTCDay()+W);w=Math.round((e.getTime()-j.getTime())/86400000/7)+1;}else{var t=new U(d.getTime());t.setUTCDate(t.getUTCDate()-f);W=t.getUTCDay();t.setUTCDate(t.getUTCDate()-W+4);var F=new U(t.getTime());F.setUTCMonth(0,1);W=F.getUTCDay();var A=0;if(W>4){A=7;}var g=new U(F.getTime());g.setUTCDate(1-W+4+A);w=Math.round((t.getTime()-g.getTime())/86400000/7)+1;}return w;};b.getFirstDateOfWeek=function(d){var u=new U(d.getTime()),f,F,l=a.getInstance(sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale()),c=l.getFirstDayOfWeek(),w;w=U.getWeekByDate(u.getCalendarType(),u.getUTCFullYear(),u.getUTCMonth(),u.getUTCDate());f=U.getFirstDateOfWeek(u.getCalendarType(),w.year,w.week);F=new U(Date.UTC(f.year,f.month,f.day));while(F.getUTCDay()!==c){F.setUTCDate(F.getUTCDate()-1);}return new U(Date.UTC(F.getUTCFullYear(),F.getUTCMonth(),F.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds())).getJSDate();};b.getFirstDateOfMonth=function(d){var n=new U(d.getTime());n.setUTCDate(1);return n;};b._getNumberOfWeeksForYear=function(y){var l=sap.ui.getCore().getConfiguration().getFormatLocale(),o=a.getInstance(new L(l)),c=new Date(Date.UTC(y,0,1)),i=c.getUTCDay(),n=52;if(o.getFirstDayOfWeek()===0){if(i===5||i===6){n=53;}}else{if(i===3||i===4){n=53;}}return n;};b.monthsDiffer=function(d,D){return(d.getMonth()!==D.getMonth()||d.getFullYear()!==D.getFullYear());};b.isDateLastInMonth=function(d){var n=new Date(d.getTime()+24*60*60*1000);return n.getUTCDate()<d.getUTCDate();};b._updateUTCDate=function(d,y,m,D,h,M,s,i){if(q.isNumeric(y)){d.setUTCFullYear(y);}if(q.isNumeric(m)){d.setUTCMonth(m);}if(q.isNumeric(D)){d.setUTCDate(D);}if(q.isNumeric(h)){d.setUTCHours(h);}if(q.isNumeric(M)){d.setUTCMinutes(M);}if(q.isNumeric(s)){d.setUTCSeconds(s);}if(q.isNumeric(i)){d.setUTCMilliseconds(i);}};b._checkJSDateObject=function(d){if(q.type(d)!=="date"){throw new Error("Date must be a JavaScript date object.");}};b._checkYearInValidRange=function(y){if(!q.isNumeric(y)||(y<1||y>9999)){throw new Error("Year must be in valid range (between year 0001 and year 9999).");}};b._isNextMonth=function(d,D){return(d.getMonth()>D.getMonth()&&d.getFullYear()===D.getFullYear())||d.getFullYear()>D.getFullYear();};b._daysInMonth=function(c){this._checkCalendarDate(c);c=new C(c);c.setDate(1);c.setMonth(c.getMonth()+1);c.setDate(0);return c.getDate();};b._isLastDateInMonth=function(c){return c.getDate()===b._daysInMonth(c);};b._getFirstDateOfWeek=function(c){this._checkCalendarDate(c);var j=b.getFirstDateOfWeek(c.toUTCJSDate());j.setFullYear(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());return C.fromLocalJSDate(j,c.getCalendarType());};b._getFirstDateOfMonth=function(c){this._checkCalendarDate(c);var j=b.getFirstDateOfMonth(c.toUTCJSDate()).getJSDate();j.setFullYear(j.getUTCFullYear(),j.getUTCMonth(),j.getUTCDate());return C.fromLocalJSDate(j,c.getCalendarType());};b._minDate=function(c){return new C(1,0,1,c);};b._maxDate=function(c){var o=new C(9999,11,1,c);o.setDate(this._daysInMonth(o));return new C(o);};b._isBetween=function(d,s,e,i){this._checkCalendarDate(d);this._checkCalendarDate(s);this._checkCalendarDate(e);if(i){return d.isSameOrAfter(s)&&d.isSameOrBefore(e);}else{return d.isAfter(s)&&d.isBefore(e);}};b._daysBetween=function(f,s){this._checkCalendarDate(f);this._checkCalendarDate(s);return Math.ceil((f.valueOf()-s.valueOf())/(this.HOURS24));};b._isOutside=function(c,s,e){return!this._isBetween(c,s,e,true);};b._isSameMonthAndYear=function(c,o){this._checkCalendarDate(c);this._checkCalendarDate(o);return c.getEra()===o.getEra()&&c.getYear()===o.getYear()&&c.getMonth()===o.getMonth();};b._checkCalendarDate=function(c){if(!c||!(c instanceof C)){throw"Invalid calendar date: ["+c+"]. Expected: sap.ui.unified.calendar.CalendarDate";}};b._getWeek=function(c){this._checkCalendarDate(c);return U.getWeekByDate(c.getCalendarType(),c.getYear(),c.getMonth(),c.getDate());};b._areCurrentMinutesLessThan=function(m){var c=new Date().getMinutes();return m>=c;};b._areCurrentMinutesMoreThan=function(m){var c=new Date().getMinutes();return m<=c;};b._isWeekend=function(c,l){var d=c.getDay();return d===l.getWeekendStart()||d===l.getWeekendEnd();};return b;},true);
