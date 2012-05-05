/*\
title: $:/core/modules/wiki.filters.js
type: application/javascript
module-type: wikimethod

Filter method for the $tw.Wiki object

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

//# Extensible filter functions
exports.filters = {
	tiddler: function(results,match) {
		var title = match[1] || match[4];
		if(results.indexOf(title) === -1) {
			results.push(title);
		}
	},
	tag: function(results,match) {
	},
	sort: function(results,match) {
	},
	limit: function(results,match) {
		return results.slice(0,parseInt(match[3],10));
	},
	field: function(results,match) {
	},
	is: function(results,match) {
		switch(match[3]) {
			case "pluginModule":
				this.forEachTiddler(function(title,tiddler) {
					if(title.indexOf("$:/plugins/") === 0 && tiddler.fields.type === "application/javascript") {
						if(results.indexOf(title) === -1) {
							results.push(title);
						}
					}
				});
				break;
			case "pluginTiddler":
				this.forEachTiddler(function(title,tiddler) {
					if(title.indexOf("$:/plugins/") === 0 && tiddler.fields.type !== "application/javascript") {
						if(results.indexOf(title) === -1) {
							results.push(title);
						}
					}
				});
				break;
		}
	}
};

// Return the tiddler titles from the store that match a filter expression
//    filter - filter expression (eg "tidlertitle [[multi word tiddler title]] [tag[systemConfig]]")
// Returns an array of tiddler titles that match the filter expression
exports.filterTiddlers = function(filter) {
	// text or [foo[bar]] or [[tiddler title]]
	var re = /([^\s\[\]]+)|(?:\[([ \w\.\-]+)\[([^\]]+)\]\])|(?:\[\[([^\]]+)\]\])/mg;
	var results = [];
	if(filter) {
		var match = re.exec(filter);
		while(match) {
			var handler = (match[1]||match[4]) ? 'tiddler' : (this.filters[match[2]] ? match[2] : 'field');
			this.filters[handler].call(this,results,match);
			match = re.exec(filter);
		}
	}
	return results;
};

})();