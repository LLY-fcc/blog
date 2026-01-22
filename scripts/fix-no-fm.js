const frontMatter = require('hexo-front-matter');

// Monkey patch hexo-front-matter to handle files without delimiters
const originalParse = frontMatter.parse;

frontMatter.parse = function(str, options) {
  if (typeof str === 'string' && !str.trim().startsWith('---')) {
    return {
      _content: str
    };
  }
  return originalParse(str, options);
};

console.log('[fix-no-fm] Monkey patched hexo-front-matter to support optional front-matter');
