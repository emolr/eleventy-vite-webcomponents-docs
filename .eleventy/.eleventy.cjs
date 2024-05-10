// Eleventy configuration file
// https://www.11ty.dev/docs/config/
// All paths should be relative to the project root where the root .eleventy.js file is located
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rimraf = require('rimraf');
const EleventyVitePlugin = require("@11ty/eleventy-plugin-vite");
const litPlugin = require('@lit-labs/eleventy-plugin-lit');

module.exports = function (eleventyConfig) {
    rimraf.sync('dist');

	eleventyConfig.addPlugin(EleventyVitePlugin);
    eleventyConfig.addPassthroughCopy({
        ".eleventy/_components": "/",
        "src": "/src",
    });

    eleventyConfig.addCollection("markdownFiles", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/**/*.md");
    });

	eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.addPlugin(litPlugin, {
        mode: 'worker',
        componentModules: [
          '.eleventy/_components/code-example.js',
        ],
      });

    return {
        dir: {
            includes: ".eleventy/_includes",
            output: "dist",
        }
    }
};