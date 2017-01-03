module.exports = function(grunt) {
   grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
    build: {
        files: [{
            expand: true,
            src: 'sq-css-animation.js',
            dest: 'build/',
            ext: '.min.js'
        }]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
}