import * as assert from 'assert';
import { SpaceReplacer } from '../src/replacer'

suite("Space replace tests", () => {

  test("Empty text is not modified", () => {
    const text = '';
    const r = new SpaceReplacer(4);
    const res = r.replace(text);
    assert(res == text);
  });

  test("4 spaces are normalized to 1 tab", () => {
    const text = '    ';
    const r = new SpaceReplacer(4);
    const res = r.replace(text);
    assert(res == '\t');
  });

  test("8 spaces are normalized to 2 tabs", () => {
    const text = '        ';
    const r = new SpaceReplacer(4);
    const res = r.replace(text);
    assert(res == '\t\t');
  });

  test("2 spaces are normalized to 1 tab", () => {
    const text = '\t';
    const r = new SpaceReplacer(2);
    const res = r.replace(text);
    assert(res == '\t');
  });

  test("Only spaces are normalized in mixed whitespace", () => {
    const text = '\t  \t\t    \t';
    const r = new SpaceReplacer(1);
    const res = r.replace(text);
    assert(res == '\t\t\t\t\t\t\t\t\t\t');
  });

  test("Only spaces are normalized in mixed text", () => {
    const text = 'a\tb\t  c  \tefg\t  ';
    const r = new SpaceReplacer(2);
    const res = r.replace(text);
    assert(res == 'a\tb\t\tc\t\tefg\t\t');
  });

  test("Only spaces are normalized in mixed multi-line text", () => {
    const text = 'a\tb\t  c  \tefg\t  \nI\'m on a new     line!'
    const r = new SpaceReplacer(2);
    const res = r.replace(text);
    assert(res == 'a\tb\t\tc\t\tefg\t\t\nI\'m on a new\t\t line!');
  })

});
