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
                dest: "build/<%= pkg.name %>.<%= pkg.version %>.min.js"
            }
        },

        nodeunit: {
            all: ["tests/nodeunit/*.test.js"]
        },

        jsdoc : {
            dist : {
                src: ['src/**/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'nodeunit', "jsdoc"]);

};