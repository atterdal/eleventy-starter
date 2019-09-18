// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var gulpSequence = require('gulp-sequence');
var replace = require('gulp-replace');
var autoprefixer = require('autoprefixer');
var srcset = require('gulp-srcset').default;
 

// Configuration file to keep your code DRY
var cfg = require('./gulpconfig.json');
var paths = cfg.paths;

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function() {
	var stream = gulp
		.src(paths.sass + '/*.scss')
		.pipe(
			plumber({
				errorHandler: function(err) {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sass({ errLogToConsole: true }))
		.pipe(postcss([autoprefixer()]))
		.pipe(sourcemaps.write(undefined, { sourceRoot: null }))
		.pipe(gulp.dest(paths.css));
	return stream;
});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function() {
	gulp.watch(`${paths.sass}/**/*.scss`, gulp.series('styles'));
	gulp.watch(
		[
			`${paths.dev}/assets/js/**/*.js`,
			`${paths.js}/**/*.js`,
			`!${paths.js}/app.js`,
			`!${paths.js}/app.min.js`
		],
		gulp.series('scripts')
	);

	//Inside the watch task.
	gulp.watch(`${paths.imgsrc}/**`, gulp.series('imagemin-watch'));
});

// Run:
// gulp imagemin
// Running image optimizing task
gulp.task('imagemin', function() {
	gulp
		.src(`${paths.imgsrc}/**`)
		.pipe(imagemin())
		.pipe(gulp.dest(paths.img));
});

gulp.task('images', () =>
    gulp
        .src(`${paths.imgsrc}/**`)
        .pipe(srcset([{
            match:  '(min-width: 2000px)',
            width:  [1920, 1280, 1024, 860, 540, 320],
            format: ['jpg', 'webp']
        }], {
            skipOptimization: true
        }))
        .pipe(gulp.dest(paths.img))
);

/**
 * Ensures the 'imagemin' task is complete before reloading browsers
 * @verbose
 */
gulp.task(
	'imagemin-watch',
	gulp.series('images', function() {
		browserSync.reload({stream: true});
	})
);

// Run:
// gulp cssnano
// Minifies CSS files
gulp.task('cssnano', function() {
	return gulp
		.src(paths.css + '/styles.css')
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(
			plumber({
				errorHandler: function(err) {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(cssnano({ discardComments: { removeAll: true } }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

gulp.task('minifycss', function() {
	return gulp
		.src(`${paths.css}/styles.css`)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(cleanCSS({ compatibility: '*' }))
		.pipe(
			plumber({
				errorHandler: function(err) {
					console.log(err);
					this.emit('end');
				}
			})
		)
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

gulp.task('cleancss', function() {
	return gulp
		.src(`${paths.css}/*.min.css`, { read: false }) // Much faster
		.pipe(ignore('styles.css'))
		.pipe(rimraf());
});

gulp.task('styles', function(callback) {
	gulp.series('sass', 'minifycss')(callback);
});

gulp.task('vendor', function () {
    var scripts = [
        `${paths.node}/jquery/dist/jquery.min.js`,
        `${paths.node}/popper.js/dist/umd/popper.min.js`,
        `${paths.node}/bootstrap/dist/js/bootstrap.min.js`,
        `${paths.node}/lazysizes/lazysizes.min.js`
	];
    
	return gulp
        .src(scripts, { allowEmpty: true })
        .pipe(gulp.dest(paths.js));
});

// Run:
// gulp browser-sync
// Starts browser-sync task for starting the server.
gulp.task('browser-sync', function() {
	browserSync.init(cfg.browserSyncWatchFiles, cfg.browserSyncOptions);
});

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
	var scripts = [
		// Start - All BS4 stuff
        
        // `${paths.node}/jquery/dist/jquery.js`,
        // `${paths.node}/popper.js/dist/umd/popper.js`,
        // `${paths.node}/bootstrap/dist/js/bootstrap.js`,
        // `${paths.node}/aos/src/js/aos.js`,

		// End - All BS4 stuff

		// Adding currently empty javascript file to add on for your own themes´ customizations
		// Please add any customizations to this .js file only!
		`./src/assets/js/scripts.js`
	];
	gulp
		.src(scripts, { allowEmpty: true })
		.pipe(babel(
			{
				presets: ['@babel/preset-env']
			}
		))
		.pipe(concat('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js));

	return gulp
		.src(scripts, { allowEmpty: true })
		.pipe(babel())
		.pipe(concat('app.js'))
		.pipe(gulp.dest(paths.js))
        .pipe(browserSync.stream());
});

// Deleting any file inside the /src folder
gulp.task('clean-source', function() {
	return del(['src/**/*']);
});

// Run:
// gulp watch-bs
// Starts watcher with browser-sync. Browser-sync reloads page automatically on your browser
gulp.task('watch-bs', gulp.parallel('browser-sync', 'watch'));

// Deleting any file inside the /dist folder
gulp.task('clean-dist', function() {
	return del([paths.dist + '/**']);
});

// Run
// gulp compile
// Compiles the styles and scripts and runs the dist task
gulp.task('compile', gulp.series('styles', 'scripts', 'images', 'vendor'));

// Run:
// gulp
// Starts watcher (default task)
gulp.task('default', gulp.series('watch'));
