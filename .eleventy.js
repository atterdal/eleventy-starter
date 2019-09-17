module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy('src/assets/img')
  
    return {
      dir: { input: 'src', output: 'dist', data: '_data' },
      passthroughFileCopy: true,
      templateFormats: ['njk', 'md', 'css', 'html', 'yml'],
      htmlTemplateEngine: 'njk'
    }
  }