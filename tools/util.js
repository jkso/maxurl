const fs = require("fs");

// https://stackoverflow.com/a/31652607/13255485
var json_escape_unicode = function(stringified) {
    return stringified.replace(/[\u007F-\uFFFF]/g, function(chr) {
		return "\\u" + ("0000" + chr.charCodeAt(0).toString(16).toUpperCase()).substr(-4)
	});
};
module.exports.json_escape_unicode = json_escape_unicode;

var strings_regex = module.exports.strings_regex = /(\n\tvar strings = )({[\s\S]+?})(;\n)/;

var stringify_strings = function(strings) {
    var stringified = JSON.stringify(strings, null, "\t").replace(/\n/g, "\n\t");
    stringified = json_escape_unicode(stringified);

    return stringified;
};
module.exports.stringify_strings = stringify_strings;

module.exports.update_userscript_strings = function(strings, userscript) {
    var stringified = stringify_strings(strings);

    var userscript_filename = __dirname + "/../userscript.user.js";

    if (!userscript)
        userscript = fs.readFileSync(userscript_filename).toString();

    userscript = userscript.replace(strings_regex, "$1" + stringified + "$3");

    fs.writeFileSync(userscript_filename, userscript);
};

var sort_by_array = module.exports.sort_by_array = function(array, key) {
    array.sort(function(a, b) {
        var a_index = key.indexOf(a);
        var b_index = key.indexOf(b);

        if (a_index < 0) {
            if (b_index >= 0)
                return 1;
            else
                return a.localeCompare(b);
        } else {
            if (b_index < 0)
                return -1;
            else
                return a_index - b_index;
        }
    });

    return array;
};

module.exports.sort_keys_by_array = function(object, key) {
    var keys = Object.keys(object);
    sort_by_array(keys, key);

    var newobj = {};
    for (const key of keys) {
        newobj[key] = object[key];
    }

    return newobj;
};
