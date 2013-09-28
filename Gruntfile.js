module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist:{
                src: ['src/defines.js', 'src/**/*.js'],
                dest: "build/<%=pkg.name %>.<%= pkg.version %>.js"
            }
        },
        uglify: {
            options: {
                banner:
                    '/**\n' +
                    '* GO Query!\n' +
                    '* Query executor on js array of objects\n' +
                    '* Build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '* @author <%= pkg.author %>\n' +
                    '* @version <%= pkg.version %>\n' +
                    '* @license <%= pkg.license %>\n' +
                    '*/\n'
            },
            dist:{
                src: "build/<%= pkg.name %>.<%= pkg.version %>.js",
                dest: "dist/<%= pkg.name %>.<%= pkg.version %>.min.js"
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};