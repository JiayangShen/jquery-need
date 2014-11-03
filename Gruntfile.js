'use strict';

module.exports = function(grunt)
{
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: { preserveComments: 'some' },
            minifyJS: { files: { 'release/jquery.need.min.js': 'jquery.need.js' }}
        }
    });

    grunt.registerTask('default', ['uglify']);

};
