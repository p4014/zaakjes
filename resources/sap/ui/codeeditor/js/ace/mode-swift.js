ace.define("ace/mode/doc_comment_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text_highlight_rules").TextHighlightRules;var D=function(){this.$rules={"start":[{token:"comment.doc.tag",regex:"@[\\w\\d_]+"},D.getTagRule(),{defaultToken:"comment.doc",caseInsensitive:true}]};};o.inherits(D,T);D.getTagRule=function(s){return{token:"comment.doc.tag.storage.type",regex:"\\b(?:TODO|FIXME|XXX|HACK)\\b"};};D.getStartRule=function(s){return{token:"comment.doc",regex:"\\/\\*(?=\\*)",next:s};};D.getEndRule=function(s){return{token:"comment.doc",regex:"\\*\\/",next:s};};e.DocCommentHighlightRules=D;});ace.define("ace/mode/swift_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],function(r,e,m){"use strict";var o=r("../lib/oop");var l=r("../lib/lang");var D=r("./doc_comment_highlight_rules").DocCommentHighlightRules;var T=r("./text_highlight_rules").TextHighlightRules;var S=function(){var k=this.createKeywordMapper({"variable.language":"","keyword":"__COLUMN__|__FILE__|__FUNCTION__|__LINE__"+"|as|associativity|break|case|class|continue|default|deinit|didSet"+"|do|dynamicType|else|enum|extension|fallthrough|for|func|get|if|import"+"|in|infix|init|inout|is|left|let|let|mutating|new|none|nonmutating"+"|operator|override|postfix|precedence|prefix|protocol|return|right"+"|safe|Self|self|set|struct|subscript|switch|Type|typealias"+"|unowned|unsafe|var|weak|where|while|willSet"+"|convenience|dynamic|final|infix|lazy|mutating|nonmutating|optional|override|postfix"+"|prefix|required|static|guard|defer","storage.type":"bool|double|Double"+"|extension|float|Float|int|Int|private|public|string|String","constant.language":"false|Infinity|NaN|nil|no|null|null|off|on|super|this|true|undefined|yes","support.function":""},"identifier");function s(a,b){var n=b.nestable||b.interpolation;var i=b.interpolation&&b.interpolation.nextState||"start";var d={regex:a+(b.multiline?"":"(?=.)"),token:"string.start"};var f=[b.escape&&{regex:b.escape,token:"character.escape"},b.interpolation&&{token:"paren.quasi.start",regex:l.escapeRegExp(b.interpolation.lead+b.interpolation.open),push:i},b.error&&{regex:b.error,token:"error.invalid"},{regex:a+(b.multiline?"":"|$"),token:"string.end",next:n?"pop":"start"},{defaultToken:"string"}].filter(Boolean);if(n)d.push=f;else d.next=f;if(!b.interpolation)return d;var g=b.interpolation.open;var h=b.interpolation.close;var j={regex:"["+l.escapeRegExp(g+h)+"]",onMatch:function(v,p,q){this.next=v==g?this.nextState:"";if(v==g&&q.length){q.unshift("start",p);return"paren";}if(v==h&&q.length){q.shift();this.next=q.shift();if(this.next.indexOf("string")!=-1)return"paren.quasi.end";}return v==g?"paren.lparen":"paren.rparen";},nextState:i};return[j,d];}function c(){return[{token:"comment",regex:"\\/\\/(?=.)",next:[D.getTagRule(),{token:"comment",regex:"$|^",next:"start"},{defaultToken:"comment",caseInsensitive:true}]},D.getStartRule("doc-start"),{token:"comment.start",regex:/\/\*/,stateName:"nested_comment",push:[D.getTagRule(),{token:"comment.start",regex:/\/\*/,push:"nested_comment"},{token:"comment.end",regex:"\\*\\/",next:"pop"},{defaultToken:"comment",caseInsensitive:true}]}];}this.$rules={start:[s('"',{escape:/\\(?:[0\\tnr"']|u{[a-fA-F1-9]{0,8}})/,interpolation:{lead:"\\",open:"(",close:")"},error:/\\./,multiline:false}),c(),{regex:/@[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:"variable.parameter"},{regex:/[a-zA-Z_$][a-zA-Z_$\d\u0080-\ufffe]*/,token:k},{token:"constant.numeric",regex:/[+-]?(?:0(?:b[01]+|o[0-7]+|x[\da-fA-F])|\d+(?:(?:\.\d*)?(?:[PpEe][+-]?\d+)?)\b)/},{token:"keyword.operator",regex:/--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?:|[!$%&*+\-~\/^]=?/,next:"start"},{token:"punctuation.operator",regex:/[?:,;.]/,next:"start"},{token:"paren.lparen",regex:/[\[({]/,next:"start"},{token:"paren.rparen",regex:/[\])}]/}]};this.embedRules(D,"doc-",[D.getEndRule("start")]);this.normalizeRules();};o.inherits(S,T);e.HighlightRules=S;});ace.define("ace/mode/folding/cstyle",["require","exports","module","ace/lib/oop","ace/range","ace/mode/folding/fold_mode"],function(r,e,a){"use strict";var o=r("../../lib/oop");var R=r("../../range").Range;var B=r("./fold_mode").FoldMode;var F=e.FoldMode=function(c){if(c){this.foldingStartMarker=new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/,"|"+c.start));this.foldingStopMarker=new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/,"|"+c.end));}};o.inherits(F,B);(function(){this.foldingStartMarker=/([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;this.foldingStopMarker=/^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;this.singleLineBlockCommentRe=/^\s*(\/\*).*\*\/\s*$/;this.tripleStarBlockCommentRe=/^\s*(\/\*\*\*).*\*\/\s*$/;this.startRegionRe=/^\s*(\/\*|\/\/)#?region\b/;this._getFoldWidgetBase=this.getFoldWidget;this.getFoldWidget=function(s,f,b){var l=s.getLine(b);if(this.singleLineBlockCommentRe.test(l)){if(!this.startRegionRe.test(l)&&!this.tripleStarBlockCommentRe.test(l))return"";}var c=this._getFoldWidgetBase(s,f,b);if(!c&&this.startRegionRe.test(l))return"start";return c;};this.getFoldWidgetRange=function(s,f,b,c){var l=s.getLine(b);if(this.startRegionRe.test(l))return this.getCommentRegionBlock(s,l,b);var m=l.match(this.foldingStartMarker);if(m){var i=m.index;if(m[1])return this.openingBracketBlock(s,m[1],b,i);var d=s.getCommentFoldRange(b,i+m[0].length,1);if(d&&!d.isMultiLine()){if(c){d=this.getSectionRange(s,b);}else if(f!="all")d=null;}return d;}if(f==="markbegin")return;var m=l.match(this.foldingStopMarker);if(m){var i=m.index+m[0].length;if(m[1])return this.closingBracketBlock(s,m[1],b,i);return s.getCommentFoldRange(b,i,-1);}};this.getSectionRange=function(s,b){var l=s.getLine(b);var c=l.search(/\S/);var d=b;var f=l.length;b=b+1;var g=b;var m=s.getLength();while(++b<m){l=s.getLine(b);var i=l.search(/\S/);if(i===-1)continue;if(c>i)break;var h=this.getFoldWidgetRange(s,"all",b);if(h){if(h.start.row<=d){break;}else if(h.isMultiLine()){b=h.end.row;}else if(c==i){break;}}g=b;}return new R(d,f,g,s.getLine(g).length);};this.getCommentRegionBlock=function(s,l,b){var c=l.search(/\s*$/);var d=s.getLength();var f=b;var g=/^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;var h=1;while(++b<d){l=s.getLine(b);var m=g.exec(l);if(!m)continue;if(m[1])h--;else h++;if(!h)break;}var i=b;if(i>f){return new R(f,c,i,l.length);}};}).call(F.prototype);});ace.define("ace/mode/swift",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/swift_highlight_rules","ace/mode/behaviour/cstyle","ace/mode/folding/cstyle"],function(r,e,m){"use strict";var o=r("../lib/oop");var T=r("./text").Mode;var H=r("./swift_highlight_rules").HighlightRules;var C=r("./behaviour/cstyle").CstyleBehaviour;var F=r("./folding/cstyle").FoldMode;var M=function(){this.HighlightRules=H;this.foldingRules=new F();this.$behaviour=new C();this.$behaviour=this.$defaultBehaviour;};o.inherits(M,T);(function(){this.lineCommentStart="//";this.blockComment={start:"/*",end:"*/",nestable:true};this.$id="ace/mode/swift";}).call(M.prototype);e.Mode=M;});(function(){ace.require(["ace/mode/swift"],function(m){if(typeof module=="object"&&typeof exports=="object"&&module){module.exports=m;}});})();
