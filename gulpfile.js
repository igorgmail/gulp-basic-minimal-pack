
import gulp from 'gulp';
import del from "del";
import fileInclude from 'gulp-file-include';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import csso from 'gulp-csso';
import autoPrefixer from 'gulp-autoprefixer';

import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import babel from 'gulp-babel';

import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import newer from 'gulp-newer';
import gulpIf from 'gulp-if';
import notify from 'gulp-notify';

import svgmin from 'gulp-svgmin';
import webp  from 'gulp-webp';
import browserSync from 'browser-sync';
import { config } from './gulpConfig.js';

const plumberConfig = (msg) => {
	return {
		errorHandler: notify.onError(error => ({
			title: msg,
			message: error.message
		}))
	}
}

const html = () => {
	return gulp.src('./src/*.html')
		.pipe(plumber(plumberConfig("HTML")))
		.pipe(fileInclude({
			prefix: '@@',
			basepath: '@file'
			}))
		.pipe(gulp.dest('./public'));
}

const js = () => {
	return gulp.src(
			// '.src/js/entry.js', // Если одна точка входа, то 
			config.js.path.src, // 
			{sourcemaps: config.js.sourcemaps})
		.pipe(plumber(plumberConfig("JS")))
		.pipe(babel())
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest(config.js.path.dest, {sourcemaps: config.js.sourcemaps}))
}

const scss = () => {
	return gulp.src(config.scss.path.src, {sourcemaps: true})
		.pipe(plumber(plumberConfig("SASS")))
		.pipe(sass())
		.pipe(autoPrefixer())
		.pipe(gulp.dest(config.scss.path.dest, {sourcemaps: true}))
		.pipe(csso())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.scss.path.dest, {sourcemaps: true}))
}

const images = () => {
	return gulp.src(config.img.path.src, {encoding: false })
		.pipe(plumber(plumberConfig("IMG")))
		.pipe(newer(config.img.path.dest))
        .pipe(gulpIf(file => /\.(png|jpe?g)$/.test(file.extname), webp({ quality: 90, lossless: true })))
        .pipe(gulpIf(file => file.extname === '.svg', svgmin()))
        .pipe(gulp.dest(config.img.path.dest))
}

const font = () => {
	return gulp.src(config.font.path.src)
		.pipe(plumber(plumberConfig("FONTS")))
		.pipe(newer(config.font.path.dest))
		.pipe(fonter(config.font.fonter))
		.pipe(gulp.dest(config.font.path.dest))
		.pipe(ttf2woff2())
		.pipe(gulp.dest(config.font.path.dest))
}

const updateJsVersion = () => {
	return gulp.src(`${config.tpl.path.appTemplates}/common/footer.tpl`)
		.pipe(version({
			value: '%DT%',
			append: {
				key: '_v',
				cover: 1,
				to: [
					{
						type: 'js',
						files: ['app.js']
					}
				]
			}
		}))
		.pipe(gulp.dest(`${config.tpl.path.appTemplates}/common/`))
}

const watcher = () => {
	gulp.watch(config.html.path.watch, html).on('all', browserSync.reload);
	gulp.watch(config.scss.path.watch, scss).on('all', browserSync.reload);
	gulp.watch(config.js.path.watch, js).on('all', browserSync.reload);
	gulp.watch(config.img.path.watch, images).on('all', browserSync.reload);
	// gulp.watch(config.font.path.watch, font).on('all', browserSync.reload);
}

// Мои настройки
const test = (done) => {
	console.log("-----GULP RUN");
	done()
}

const server = () => {
	browserSync.init({
		server: 'public',
		host: "localhost",
		port: 3000,
		// proxy: "http://localhost:8888",
		logPrefix: 'public',
		notify: false,
		open: false,
		startPath: 'index.html',
	})
}

const clear = () => {
	return del([
		config.html.path.dest,
		config.scss.path.dest,
		config.img.path.dest,
		config.js.path.dest,
		config.font.path.dest,
	]);
}


const build = gulp.series(
		test,
		clear,
		gulp.parallel(html,scss, js, images, font),
		gulp.parallel(watcher, server)
)

export {html};
export {scss};
export {js};
export {updateJsVersion};
export {images};
export {font};
export {clear};

export default build ;
