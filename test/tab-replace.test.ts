import * as assert from 'assert';
import { TabReplacer } from '../src/replacer'

suite("Tab replace tests", () => {

  test("Empty text is not modified", () => {
    const text = ''
    const r = new TabReplacer(4);
    const res = r.replace(text);
    assert(res == text);
  });

  test("1 tab is normalized to 4 spaces", () => {
    const text = '\t'
    const r = new TabReplacer(4);
    const res = r.replace(text);
    assert(res == '    ');
  });

  test("2 tabs are normalized to 8 spaces", () => {
    const text = '\t\t'
    const r = new TabReplacer(4);
    const res = r.replace(text);
    assert(res == '        ');
  });

  test("1 tab is normalized to 2 spaces", () => {
    const text = '\t'
    const r = new TabReplacer(2);
    const res = r.replace(text);
    assert(res == '  ');
  });

  test("Only tabs are normalized in mixed whitespace", () => {
    const text = '\t  \t\t    \t'
    const r = new TabReplacer(1);
    const res = r.replace(text);
    assert(res == '          ');
  });

  test("Only tabs are normalized in mixed text", () => {
    const text = 'a\tb\t  c  \tefg\t  '
    const r = new TabReplacer(2);
    const res = r.replace(text);
    assert(res == 'a  b    c    efg    ');
  });

  test("Only tabs are normalized in mixed multi-line text", () => {
    const text = 'a\tb\t  c  \tefg\t  \nI\'m on a new\t\t line!'
    const r = new TabReplacer(2);
    const res = r.replace(text);
    assert(res == 'a  b    c    efg    \nI\'m on a new     line!');
  })

});
