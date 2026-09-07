import { test } from 'node:test'
import assert from 'node:assert/strict'
import match from '../lib/index.js'

test("Matcher with tag name", () => {
  assert.deepEqual(match("div"), { tag: "div" });
});

test("Matcher with id", () => {
  assert.deepEqual(match("#waldo"), { attrs: { id: "waldo" } });
});

test("Matcher with one class", () => {
  assert.deepEqual(match(".foo"), { attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with multiple classes", () => {
  assert.deepEqual(match(".foo.bar.baz"), {
    attrs: {
      class: /(?:^|\s)foo\s(?:.*?\s)?bar\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)foo\s(?:.*?\s)?baz\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?foo\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?baz\s(?:.*?\s)?foo(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?foo\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?bar\s(?:.*?\s)?foo(?:\s|$)/
    }
  });
});

test("Matcher with tag name and id", () => {
  assert.deepEqual(match("div#waldo"), { tag: "div", attrs: { id: "waldo" } });
});

test("Matcher with tag name and class", () => {
  assert.deepEqual(match("div.foo"), { tag: "div", attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with tag name, id and class", () => {
  assert.deepEqual(match("div#waldo.foo"), { tag: "div", attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with id and class", () => {
  assert.deepEqual(match("#waldo.foo"), { attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with attribute", () => {
  assert.deepEqual(match("[qux]"), { attrs: { qux: true } });
});

test("Matcher with attribute with exact match", () => {
  assert.deepEqual(match("[qux=\"corge\"]"), { attrs: { qux: "corge" } });
});

test("Matcher with attribute with whitespaced list matching", () => {
  assert.deepEqual(match("[qux~=\"corge\"]"), { attrs: { qux: /(?:^|\s)corge(?:\s|$)/ } });
});

test("Matcher with attribute with full match or followed by a dash", () => {
  assert.deepEqual(match("[qux|=\"corge\"]"), { attrs: { qux: /^corge(?:-|$)/ } });
});

test("Matcher with attribute with start match", () => {
  assert.deepEqual(match("[qux^=\"corge\"]"), { attrs: { qux: /^corge/ } });
});

test("Matcher with attribute with end match", () => {
  assert.deepEqual(match("[qux$=\"corge\"]"), { attrs: { qux: /corge$/ } });
});

test("Matcher with attribute that contains value", () => {
  assert.deepEqual(match("[qux*=\"corge\"]"), { attrs: { qux: /corge/ } });
});

test("Matcher with attribute that does not contain value", () => {
  assert.deepEqual(match("[qux!=\"corge\"]"), { attrs: { qux: /^((?!corge)[\s\S])*$/ } });
});

test("Matcher with id notation and id as attribute - the former wins", () => {
  assert.deepEqual(match("#waldo[id=\"fred\"]"), { attrs: { id: "waldo" } });
});

test("Matcher with class notation and class as attribute - the former wins", () => {
  assert.deepEqual(match(".foo[class=\"baz\"]"), { attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with escaped class notation", () => {
  assert.deepEqual(match(".\\[display:none\\]"), { attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/ } });
});

test("Matcher with escaped class notation and attribute", () => {
  assert.deepEqual(match(".\\[display:none\\][foo^=bar]"), { attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/, foo: /^bar/ } });
});

test("Matcher with comma-separated class notation", () => {
  assert.deepEqual(match(".foo, .bar"), [{ attrs: { class: /(?:^|\s)foo(?:\s|$)/ } }, { attrs: { class: /(?:^|\s)bar(?:\s|$)/ } }]);
});

test("Matcher with array of selectors", () => {
  assert.deepEqual(match([".foo", ".bar"]), [{ attrs: { class: /(?:^|\s)foo(?:\s|$)/ } }, { attrs: { class: /(?:^|\s)bar(?:\s|$)/ } }]);
});

test("Matcher object is returned as-is", () => {
  assert.deepEqual(match({ tag: "div", attrs: { id: "waldo" } }), { tag: "div", attrs: { id: "waldo" } });
});

test("Matcher with custom element tag name", () => {
  assert.deepEqual(match("my-custom-element"), { tag: "my-custom-element" });
});
