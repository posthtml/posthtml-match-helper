const test = require("ava");
const match = require("..");

test("Matcher with tag name", t => {
	const actual = match("div");
	const expected = { tag: "div" };
	t.deepEqual(actual, expected);
});

test("Matcher with id", t => {
	const actual = match("#waldo");
	const expected = { attrs: { id: "waldo" } };
	t.deepEqual(actual, expected);
});

test("Matcher with one class", t => {
	const actual = match(".foo");
	const expected = { attrs: { class: /(?:^|\s)foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with multiple classes", t => {
	const actual = match(".foo.bar.baz");
	const expected = { attrs: { class: /(?:^|\s)foo\s(?:.*?\s)?bar\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)foo\s(?:.*?\s)?baz\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?foo\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?baz\s(?:.*?\s)?foo(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?foo\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?bar\s(?:.*?\s)?foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with tag name and id", t => {
	const actual = match("div#waldo");
	const expected = { tag: "div", attrs: { id: "waldo" } };
	t.deepEqual(actual, expected);
});

test("Matcher with tag name and class", t => {
	const actual = match("div.foo");
	const expected = { tag: "div", attrs: { class: /(?:^|\s)foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with tag name, id and class", t => {
	const actual = match("div#waldo.foo");
	const expected = { tag: "div", attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with id and class", t => {
	const actual = match("#waldo.foo");
	const expected = { attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute", t => {
	const actual = match("[qux]");
	const expected = { attrs: { qux: true } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute with exact match", t => {
	const actual = match("[qux=\"corge\"]");
	const expected = { attrs: { qux: "corge" } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute with whitespaced list matching", t => {
	const actual = match("[qux~=\"corge\"]");
	const expected = { attrs: { qux: /(?:^|\s)corge(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute with full match or followed by a dash", t => {
	const actual = match("[qux|=\"corge\"]");
	const expected = { attrs: { qux: /^corge(?:-|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute with start match", t => {
	const actual = match("[qux^=\"corge\"]");
	const expected = { attrs: { qux: /^corge/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute with end match", t => {
	const actual = match("[qux$=\"corge\"]");
	const expected = { attrs: { qux: /corge$/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute that contains value", t => {
	const actual = match("[qux*=\"corge\"]");
	const expected = { attrs: { qux: /corge/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with attribute that does not contain value", t => {
	const actual = match("[qux!=\"corge\"]");
	const expected = { attrs: { qux: /^((?!corge)[\s\S])*$/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with id notation and id as attribute - the former wins", t => {
	const actual = match("#waldo[id=\"fred\"]");
	const expected = { attrs: { id: "waldo" } };
	t.deepEqual(actual, expected);
});

test("Matcher with class notation and class as attribute - the former wins", t => {
	const actual = match(".foo[class=\"baz\"]");
	const expected = { attrs: { class: /(?:^|\s)foo(?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with escaped class notation", t => {
	const actual = match(".\\[display:none\\]");
	const expected = { attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/ } };
	t.deepEqual(actual, expected);
});

test("Matcher with escaped class notation and attribute", t => {
	const actual = match(".\\[display:none\\][foo^=bar]");
	const expected = { attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/, foo: /^bar/ } };
	t.deepEqual(actual, expected);
});
