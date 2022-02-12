interface Matcher {
  tag?: string;
  attrs: {
    id?: string;
    class?: RegExp;
    [attr: string]: any;
  };
}

declare function createMatcher(matcher: string | string[]): Matcher | Matcher[];

export default createMatcher;
