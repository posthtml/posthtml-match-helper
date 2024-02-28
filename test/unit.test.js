import {test, expect} from 'vitest'
import match from '../lib/index.js'

test("Matcher with tag name", () => {
  expect(match("div")).toEqual({ tag: "div" });
});

test("Matcher with id", () => {
  expect(match("#waldo")).toEqual({ attrs: { id: "waldo" } });
});

test("Matcher with one class", () => {
  expect(match(".foo")).toEqual({ attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with multiple classes", () => {
  expect(match(".foo.bar.baz")).toEqual({
    attrs: {
      class: /(?:^|\s)foo\s(?:.*?\s)?bar\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)foo\s(?:.*?\s)?baz\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?foo\s(?:.*?\s)?baz(?:\s|$)|(?:^|\s)bar\s(?:.*?\s)?baz\s(?:.*?\s)?foo(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?foo\s(?:.*?\s)?bar(?:\s|$)|(?:^|\s)baz\s(?:.*?\s)?bar\s(?:.*?\s)?foo(?:\s|$)/
    }
  });
});

test("Matcher with tag name and id", () => {
  expect(match("div#waldo")).toEqual({ tag: "div", attrs: { id: "waldo" } });
});

test("Matcher with tag name and class", () => {
  expect(match("div.foo")).toEqual({ tag: "div", attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with tag name, id and class", () => {
  expect(match("div#waldo.foo")).toEqual({ tag: "div", attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with id and class", () => {
  expect(match("#waldo.foo")).toEqual({ attrs: { id: "waldo", class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with attribute", () => {
  expect(match("[qux]")).toEqual({ attrs: { qux: true } });
});

test("Matcher with attribute with exact match", () => {
  expect(match("[qux=\"corge\"]")).toEqual({ attrs: { qux: "corge" } });
});

test("Matcher with attribute with whitespaced list matching", () => {
  expect(match("[qux~=\"corge\"]")).toEqual({ attrs: { qux: /(?:^|\s)corge(?:\s|$)/ } });
});

test("Matcher with attribute with full match or followed by a dash", () => {
  expect(match("[qux|=\"corge\"]")).toEqual({ attrs: { qux: /^corge(?:-|$)/ } });
});

test("Matcher with attribute with start match", () => {
  expect(match("[qux^=\"corge\"]")).toEqual({ attrs: { qux: /^corge/ } });
});

test("Matcher with attribute with end match", () => {
  expect(match("[qux$=\"corge\"]")).toEqual({ attrs: { qux: /corge$/ } });
});

test("Matcher with attribute that contains value", () => {
  expect(match("[qux*=\"corge\"]")).toEqual({ attrs: { qux: /corge/ } });
});

test("Matcher with attribute that does not contain value", () => {
  expect(match("[qux!=\"corge\"]")).toEqual({ attrs: { qux: /^((?!corge)[\s\S])*$/ } });
});

test("Matcher with id notation and id as attribute - the former wins", () => {
  expect(match("#waldo[id=\"fred\"]")).toEqual({ attrs: { id: "waldo" } });
});

test("Matcher with class notation and class as attribute - the former wins", () => {
  expect(match(".foo[class=\"baz\"]")).toEqual({ attrs: { class: /(?:^|\s)foo(?:\s|$)/ } });
});

test("Matcher with escaped class notation", () => {
  expect(match(".\\[display:none\\]")).toEqual({ attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/ } });
});

test("Matcher with escaped class notation and attribute", () => {
  expect(match(".\\[display:none\\][foo^=bar]")).toEqual({ attrs: { class: /(?:^|\s)\[display:none\](?:\s|$)/, foo: /^bar/ } });
});
