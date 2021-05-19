
templates = {};

module.exports = function (grunt) {
  
  grunt.initConfig({
    copy: {
      assets: {
        expand: true,
        cwd: './src/assets/',
        src: ['**'],
        dest: './dist/assets/'
      },
      js: {
        expand: true,
        cwd: './src/js/',
        src: ['**'],
        dest: './dist/js/'
      },
      styles: {
        expand: true,
        cwd: './src/styles/',
        src: ['**'],
        dest: './dist/styles/'
      },

      html: {
        expand: true,
        cwd: './src/',
        src: ['*.html'],
        dest: './dist/',
        options: {
          process: function (content) {
            for (let key in templates) {
              const match = `<!-- TEMPLATE: ${ key } -->`;
              content = content.replace(match, templates[key]);
            }
            return content;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['getTemplates', 'copy:assets', 'copy:js', 'copy:styles', 'copy:html']);

  grunt.registerTask('getTemplates', 'Get the Templates', function () {
    const filepath = './src/templates/*.template.html';
    const files = grunt.file.expand(filepath);
    files.forEach(file => {
      const name = file.replace('./src/templates/', '');
      templates[name] = grunt.file.read(file);
    });
  });

}
