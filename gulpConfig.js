const init = {
	pathScr: './src',
	pathDest: './public',
}

const config = {
	html: {
		path: {
			src: init.pathScr + '/scss/*.{scss,sass}',
			watch: init.pathScr + '/**/*.html',
			dest: init.pathDest + '/**/*.html',
		}
	},
	scss: {
		path: {
			src: init.pathScr + '/scss/*.{scss,sass}',
			watch: init.pathScr + '/scss/**/*.{scss,sass}',
			dest: init.pathDest + '/assets/css'
		},
		sourcemaps: true,
		sourcemapsPath: '.',
	},
	js: {
		path: {
			src: init.pathScr + '/js/*.js',
			dest: init.pathDest + '/assets/js',
			watch: init.pathScr + '/js/**/*.js'
		},
		sourcemaps: true,
	},
	img: {
		path: {
			src: init.pathScr + '/img/**/*.{png,jpg,jpeg,webp,svg,webmanifest,avif}',
			dest: init.pathDest + '/assets/img',
			watch: init.pathScr + '/img/**/*.{png,jpg,jpeg,webp,svg,webmanifest,avif}'
		},
		imagemin: {
			progressive: true,
			verbose: true
		}
	},
	font: {
		path: {
			src: init.pathScr + '/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}',
			dest: init.pathDest + '/assets/font',
			watch: init.pathScr + '/fonts/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}'
		},
		fonter:{
			formats: ['ttf', 'woff', 'eot', 'svg']
		}
	},
}


export { config };