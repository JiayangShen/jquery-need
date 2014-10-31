'use strict';

module.exports = function(grunt) {
// These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.initConfig({
  uglify: {
    my_target: {
      files: {
        'release/jquery.need.min.js': 'jquery.need.js'
      }
    }
  }
});

  grunt.registerTask('default', ['uglify']);

};
