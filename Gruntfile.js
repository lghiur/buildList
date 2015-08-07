module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
			  options: {
				relativeAssets: true,
				sassDir: ['components/', 'shared/'],
				imagesDir: 'build/images',
				cssDir: 'build/shared',
				specify: 'shared/sass/main.scss',
				fontsDir: 'build/shared/fonts',
				raw: 'preferred_syntax = :sass\n' // Use `raw` since it's not directly available
			  }
			}
		},
		copy: {
		  fonts: {
		  	files: [{
			    expand: true,
			    src: ['shared/fonts/**/*.woff', 'shared/fonts/**/*.ttf', 'shared/fonts/**/*.eot'],
			    dest: 'build/'
		  	}]
		  },
		  images: {
		    expand: true,
		  	src: ['components/**/images/**/*.gif', 'components/**/images/**/*.png', 'components/**/images/**/*.jpg'],
		  	dest: 'build/images/',
		  	flatten: true
		  },
		  data: {
		  	src: 'data/**/*.js',
		  	dest: 'build/'
		  },
		  indexHtml: {
		  	src: 'index.html',
		  	dest: 'build/index.html'
		  },
		  templates: {
		  	src: 'shared/js/templates/script.js',
		  	dest: 'build/'
		  }
		},
		jshint: {
			options: {
			  "curly":true,
			  "eqeqeq":true,
			  "es3":true,
			  "forin":true,
			  "immed":true,
			  "indent":2,
			  "latedef":true,
			  "newcap":true,
			  "noarg":true,
			  "noempty":true,
			  "nonew":true,
			  "plusplus":false,
			  "undef":true,
			  "unused":true,
			  "strict":false,
			  "maxparams":5,
			  "maxdepth":3,
			  "maxlen":500
			},
			all: ['components/**/*.js', 'shared/**/*.js', '!shared/**/templates/script.js', '!build/**/*.js']
		},
		useminPrepare: {
		  html: 'index.html',
		  options: {
		  	dest: 'build'
		  }
		},
		usemin: {
			html: 'build/index.html',
		},
		ngtemplates: {
      app: {
      	cwd: 'components/',
        src: '**/*.tmpl',
        dest: 'shared/js/templates/script.js',
        options: {
        	module: 'buildApp',
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          }
        }
      }
    },
		uglify: {
		  options: {
				mangle: false
		  } 
		},
		sonarRunner: {
	    analysis: {
	      options: {
	        debug: true,
	        separator: '\n',
	        sonar: {
	          host: {
	            url: 'http://localhost:9000'
	          },
	          jdbc: {
	            url: 'jdbc:mysql://localhost:3306/fesonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance',
	            username: 'sonar',
	            password: 'sonar'
	          },
	          analysis: {
	              mode: "preview"
	          },
	          issuesReport: {
	            html: {
	              location: 'target/',
	              enable: true
	            }
	          },
	          github: {
	            login: 'lghiur',
	            oauth: 'e4a37fb229d5b7a1f710c92970602c6599479737',
	            repository: 'lghiur/buildList',
	            pullRequest: '1'
	          },
	          projectKey: 'sonar:grunt-sonar-runner:0.1.0',
	          projectName: 'Pure 360',
	          projectVersion: '0.0.1',
	          sources: ['components'].join(','),
	          language: 'js',
	          sourceEncoding: 'UTF-8'
	        }
	      }
	    }
	  },
		watch: {
			images: {
				files: ['components/**/images/**/*.gif', 'components/**/images/**/*.png', 'components/**/images/**/*.jpg'],
				tasks: 'copy:images'
			},
			sass: {
				files: ['shared/**/*.scss', 'components/**/*.scss'],
				tasks: 'compass'
			},
			indexHtml: {
				files: ['index.html'],
				tasks: ['copy:indexHtml']
			},
			templates: {
				files: ['components/**/*.tmpl'],
				tasks: ['ngtemplates', 'copy:templates']
			},
			mockupData: {
				files: ['data/**/*.js'],
				tasks: ['copy:data']
			},
			js: {
				files: ['components/**/*.js', 'shared/**/*.js', '!shared/**/templates/script.js', '!build/**/*.js', 'index.html', '!data/**/*.js'],
				tasks: ['jshint', 'useminPrepare', 'concat', 'uglify', 'usemin']
			},
			fonts: {
				files: ['shared/fonts/**/*.woff', 'shared/fonts/**/*.ttf', 'shared/fonts/**/*.eot'],
				tasks: 'copy:fonts'
			}
		}
	});

	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-sonar-runner');

	grunt.registerTask('build', [
		'compass',
		'ngtemplates',
		'useminPrepare',
		'copy:images',
		'copy:fonts',
		'copy:indexHtml',
		'copy:data',
		'copy:templates',
		'concat',
		'uglify',
		'usemin'
	]);
};