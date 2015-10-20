var selectorReg = /^([^#\.\[]+)?(?:#([^\.\[]+))?(?:\.([^#\[]+))?((?:\[[^\]]+\])+)?$/;
var attributeReg = /^([a-zA-Z0-9_-]*[^~|^$*!=])(?:([~|^$*!]?)=['"]?([^'"]*)['"]?)?$/;
var splitReg = /\s*,\s*/;

function expandMatcher (matcher) {

	if (typeof matcher === "string") {

		var match = matcher.match(selectorReg);

		if (match) {
			matcher = {};
			var tag = match[1];
			var id = match[2];
			var className = match[3];
			var attrs = match[4];

			if (tag) {
				matcher.tag = tag;
			}

			matcher.attrs = (attrs) ? expandAttributes(attrs) : {};

			if (id) {
				matcher.attrs.id = id;
			}

			if (className) {
				matcher.attrs.class = new RegExp(getCombinations(className.split(".")).map(function(order){
					return "(?:^|\\s)" + order.join("\\s(?:.*?\\s)?") + "(?:\\s|$)";
				}).join("|"));
			}
		}
		else {
			matcher = {tag: matcher};
		}
	}

	return matcher;
}

function expandAttributes (attrs) {
	attrs = attrs.slice(1, -1).split("][");
	var attrObject = {};
	var l = attrs.length;
	var attrsMatch, name, operator, value, reg;

	while (l--) {
		attrsMatch = attrs[l].match(attributeReg);

		if (attrsMatch) {
			name = attrsMatch[1];
			operator = attrsMatch[2];
			value = attrsMatch[3];

			if (value) {

				switch (operator) {

					case "~":
						reg = "(?:^|\\s)" + value + "(?:\\s|$)";
						break;

					case "|":
						reg = "^" + value + "(?:-|$)";
						break;

					case "^":
						reg = "^" + value;
						break;

					case "$":
						reg = value + "$";
						break;

					case "*":
						reg = value;
						break;

					case "!":
						reg = "^((?!" + value + ")[\\s\\S])*$";
						break;

					default:
						reg = "^" + value + "$";
						break;

				}

				attrObject[name] = new RegExp(reg);

			}
			else {
				attrObject[name] = true;
			}
		}
	}
	
	return attrObject;
}

function getCombinations (values, subresult) {
	subresult = subresult || [];

	var result = [];

	values.forEach(function (value, index) {
		if (subresult.indexOf(value) < 0) {
			var _subresult = subresult.concat([value]);
			if (_subresult.length < values.length) {
				result = result.concat(getCombinations(values, _subresult));
			}
			else {
				result.push(_subresult);
			}
		}
	});

	return result;
}

module.exports = function (matcher) {

	if (typeof matcher === "string") {

		if (matcher.match(splitReg)) {
			matcher = matcher.split(splitReg);
		}
		else {
			return expandMatcher(matcher);
		}

	}

	if (Array.isArray(matcher)) {
		return matcher.map(expandMatcher);
	}

	return matcher;
};
