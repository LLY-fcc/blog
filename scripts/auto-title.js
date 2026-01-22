hexo.extend.filter.register('before_post_render', function (data) {
  if (data.layout !== 'post') return data;

  try {
    let filename = (data.slug || data.path).split('/').pop();
    filename = filename.replace(/\.md$/, '');

    if (!data.title || data.title.trim() === '') {
      data.title = decodeURIComponent(filename);
    }

    const content = data.content;
    if (content) {
      const headingMatch = content.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        data.title = headingMatch[1].trim();
      }
    }
  } catch (error) {}

  return data;
});
