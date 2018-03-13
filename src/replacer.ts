/**
 * Simple class for regex text replacement.
 */
export class Replacer {

    private _matcher: RegExp;
    private _replacement : string;

    constructor(matcher: RegExp, replacement: string) {
        this._matcher = matcher;
        this._replacement = replacement;
    }

    /**
     * Run a pattern replacement on the supplied text and return the result.
     */
    replace(text: string) {
        return text.replace(this._matcher, this._replacement);
    }
}

/**
 * Return a string of #tabSize spaces.
 */
function tabSizeToSpaces(tabSize: number) {
    return new Array(tabSize + 1).join(' ');
}

/**
 * Convenience class for replacing tabs with spaces.
 */
export class TabReplacer extends Replacer {
    constructor(tabSize: number) {
        super(/\t/g, tabSizeToSpaces(tabSize));
    }
}

/**
 * Convenience class for replacing spaces with tabs.
 */
export class SpaceReplacer extends Replacer {
    constructor(tabSize: number) {
        super(new RegExp(tabSizeToSpaces(tabSize), 'g'), '\t');
    }
}
