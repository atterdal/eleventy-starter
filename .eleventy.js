module.exports = function(eleventyConfig) {
    // eleventyConfig.addPassthroughCopy('src/assets/img');

    // Nunjucks Shortcode

    // NOT REALLY DONE YET BUT I'M NOT FINISHING THIS NOW!
    // options: {% img src="http://placehold.it/400x300", src2x="http://placehold.it/800x600", alt="zachleat’s Avatar", class="img-fluid", loading="lazy" %}
    // eleventyConfig.addNunjucksShortcode("img", function(img) {
    //   var myClass = ""; 
    //   if (typeof img.class !== 'undefined') {
    //     myClass = img.class;
    //   }
    //   if (img.loading === "lazy") {
    //     return `<!-- responsive example with automatic sizes calculation: -->
    //             <img
    //                 data-sizes="auto"
    //                 data-src="assets/img/image10@1920w.jpg"
    //                 data-srcset="assets/img/image10@320w.jpg 320w,
    //                 assets/img/image10@540w.jpg 540w,
    //                 assets/img/image10@860w.jpg 860w,
    //                 assets/img/image10@1280w.jpg 1280w,
    //                 assets/img/image10@1920w.jpg 1920w" class="lazyload" />
    //                 `
    //   } else {
    //     return `<img class="${myClass}" src="${img.src}" alt="${img.alt}">`;
    //   }
    // });
  
    return {
      dir: { input: 'src', output: 'dist', data: '_data' },
      passthroughFileCopy: true,
      templateFormats: ['njk', 'md', 'css', 'html', 'yml'],
      htmlTemplateEngine: 'njk'
    }
  }