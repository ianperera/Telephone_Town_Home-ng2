var pkg = require ('./package.json');

var fs = require('fs'),
    path = require('path'),
    del = require('del'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip');

/*********************************************************************
 * Dev Tasks -- Build for testing and local development
 */

// main dev task
gulp.task('dev', ['dev:browserify', 'dev:sass', 'dev:cleanup']);


// run tslint on our files.
gulp.task('dev:tslint', function () {

    var tslint = require('gulp-tslint');

    return gulp.src(['./app/**/*.ts'])
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report(""));
});


// build the javascript
gulp.task('dev:js', [], function () {

    var ts = require('gulp-typescript');
    var tsProject = ts.createProject('tsconfig.json');

    var tsResult = tsProject.src().pipe(tsProject());

    return tsResult.js.pipe(gulp.dest('./app/temp'));
});

// run sass
gulp.task('dev:sass', [], function () {

    var sass = require('gulp-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        cssnano = require('gulp-cssnano');


    return gulp.src('./app/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app'));
});


// package up
gulp.task('dev:browserify', ['dev:js'], function (cb) {

    var webpack = require('gulp-webpack'),
        wp = require('webpack');

    return gulp.src('./app/temp/main.js')
        .pipe(webpack({
            optimizeDedupe: true,
            plugins: [
//                new wp.optimize.DedupePlugin()
            ],
            output: {
                filename: 'main.js'
            }
        }))
        .pipe(gulp.dest('./app'));
});

// cleanup debris
gulp.task('dev:cleanup', ['dev:browserify'], function (cb) {
    del([
        './app/temp/**'
    ]).then(function () { cb(); });
});


// Watchers

gulp.task('watch', ['watch:sass', 'watch:ts']);

gulp.task('watch:sass', function() {
    gulp.watch('./app/**/*.scss', ['dev:sass']);
});

gulp.task('watch:ts', function() {
    gulp.watch('./app/**/*.ts', ['dev:js']);
});

gulp.task('watch:test', function(){
    gulp.watch('./tests/**/*.js', ['test'])
});




/******************************************************************************
 * Release -- build release
 */

gulp.task('release', ['dist:bump', 'dist:del_dist', 'dist:copy_to_dist', 'dist:minifycss', 'dist:minifyhtml', 'dist:uglify', 'dist:version'], function() {
    return gulp.src([
            './dist/index.html',
            './dist/404.html',
            './dist/main.js',
            './dist/**/*.js',
            './dist/**/*.css',
            './dist/**/*.html',
            './dist/fonts/*',
            './dist/favicon/*',
        ], {base:'./dist'})
        .pipe(zip('release.zip'))
        .pipe(gulp.dest('./'));

});


/******************************************************************************
 * Dist Tasks -- Build for production.
 */

gulp.task('dist', ['dist:bump', 'dist:del_dist', 'dist:copy_to_dist', 'dist:minifycss', 'dist:minifyhtml', 'dist:uglify', 'dist:version'],
    function (cb) {
        process.stdout.write("Remember to update config in index.html and 404.html.dir\n");
    });

gulp.task('dist:bump', function(){

    var bump = require('gulp-bump');

    gulp.src(['./package.json'])
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('dist:del_dist', function(cb) {
    del([
        '.DS_Store', 'dist/404.html', 'dist/app.html','dist/css/**','dist/directives/**','dist/favicon/**','dist/img/**','dist/index.html','dist/js/**','dist/main.js',
    ]).then(function () { cb(); });
});

gulp.task('dist:copy_to_dist', ['dist:bump', 'dist:del_dist'], function() {

    return gulp.src([
        './app/**/*.js', '!./app/js/config.js',
        './app/**/*.html',
        './app/**/*.css',
        './app/favicon/**',
        './app/img/**',
        './app/fonts/**'
    ], {base: './app'})
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist:minifycss', ['dist:copy_to_dist'], function() {

    var cleanCSS = require('gulp-clean-css');

    return gulp.src('./dist/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('dist:minifyhtml', ['dist:copy_to_dist'], function () {

    var htmlmin = require('gulp-htmlmin');

    return gulp.src(['./dist/**/*.html', '!./dist/index.html', '!./dist/404.html'])
        .pipe(htmlmin({collapseWhitespace: true, caseSensitive: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist:uglify', ['dist:copy_to_dist'], function() {

    var stripDebug = require('gulp-strip-debug'),
        uglify = require('gulp-uglify');

    return gulp.src(['dist/main.js'])
    // .pipe(stripDebug())
        .pipe(uglify({
            mangle: true,
            compress: true,
            screwIE8: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dist:version', ['dist:copy_to_dist'], function() {

    // Delete cache to get fresh version #.
    delete require.cache[require.resolve('./package.json')];
    delete require.cache[require.resolve('./config.json')];

    var replace = require('gulp-replace'),
        pkg2 = require('./package.json');

    var config = require('./config.json');

    return gulp.src(['./dist/index.html', './dist/404.html'])
        .pipe(replace('{{version}}', 'v'+ pkg2.version +' at '+ (new Date().toISOString())))
        .pipe(replace('<base href="/">', '<base href="/' + config.base_href + '/">'))
        .pipe(replace('var API_BASE_URL = "https://dev.shoutpoint.com"', 'var API_BASE_URL = "' + config.api_base_url + '"'))
        .pipe(gulp.dest('./dist'));
});



/******************************************************************************
 * Setup Tasks
 */

gulp.task('setup', ['setup:clean_files', 'setup:copy_fonts', 'setup:vendors_js', 'setup:vendors_css', 'setup:copy_css', 'setup:copy_js']);


gulp.task('setup:clean_files', function(cb) {

    del([
        './app/fonts/*',
        './app/js/*', '!./app/js/config*',
        './app/css/*'
    ]).then(function () { cb(); });
});

// Copy vendor fonts from bower_components to app/fonts/.
gulp.task('setup:copy_fonts', ['setup:clean_files'], function() {

    return gulp.src([
        './assets/fonts/icomoon.woff',
        './assets/fonts/icomoon.ttf',
        './assets/fonts/glyphicons-halflings-regular.woff2',
        './assets/fonts/glyphicons-halflings-regular.woff',
        './assets/fonts/glyphicons-halflings-regular.ttf',
    ])
        .pipe(gulp.dest('app/fonts'));
});


gulp.task('setup:vendors_js', ['setup:clean_files'], function() {

    var jsVendorFiles = [
        "./node_modules/core-js/client/shim.min.js",
        "./node_modules/zone.js/dist/zone.min.js",
        "./node_modules/reflect-metadata/Reflect.js",
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
        "./node_modules/bootstrap-table/dist/bootstrap-table.min.js",
        "./node_modules/clipboard/dist/clipboard.min.js",
	    "./node_modules/easytimer/dist/easytimer.min.js"
    ];

    var file = require('gulp-file');

    return gulp.src(jsVendorFiles)
        .pipe(concat('vendor.min.js', {newLine: '\n'}))
        .pipe(gulp.dest('./app/js'));
});


gulp.task('setup:copy_js', ['setup:clean_files'], function() {

    return gulp.src([
        './assets/js/html5shiv.js',
        './assets/js/respond.min.js',

    ])
        .pipe(gulp.dest('./app/js'));
});


gulp.task('setup:copy_css', ['setup:clean_files'], function() {

    return gulp.src([
        './assets/css/style.css',
    ])
        .pipe(gulp.dest('./app/css'));
});


gulp.task('setup:vendors_css', ['setup:clean_files'], function() {

    var cssVendorFiles = [
        './node_modules/angular-calendar/dist/css/angular-calendar.css',
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/britecharts/dist/css/common/common.css',
        './node_modules/britecharts/dist/css/charts/line.css',
        './assets/css/default.css',
        './assets/css/component.css',
        './assets/css/datepicker3.css',
        './assets/css/styles2.css',
        './assets/css/landing.css',
        './assets/css/w3.css',
    ];

    return gulp.src(cssVendorFiles)
        .pipe(concat('vendor.min.css', {newLine: '\n\n'}))
        .pipe(gulp.dest('./app/css'));
});



