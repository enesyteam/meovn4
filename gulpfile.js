'use strict';

// including plugins
var gulp = require('gulp'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
path = require('path'),
cleanCSS = require('gulp-clean-css'),
minify = require('gulp-minify-css'),
rev = require('gulp-rev'),
inject = require('gulp-inject'),
useref = require('gulp-useref'),
htmlmin = require('gulp-htmlmin'),
clean = require('gulp-rimraf'),
$ = require('gulp-load-plugins')();
var util = require("gulp-util");
var open = require('gulp-open');

var serve = require('gulp-serve');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

// var vendorCssFiles = [
//   'src/vendor/blueimp/css/blueimp-gallery.css',
//   'src/vendor/angular-toast/angular-toastr.css',
//   'src/vendor/angular-tooltip/angular-tooltips.css',
//   'src/vendor/angular-highchart/highcharts-ng.css',
//   'bower_components/perfect-scrollbar/css/perfect-scrollbar.min.css',
// ];

// gulp.task('vendorStyles', function() {
//     gulp.src(vendorCssFiles)
//       .pipe(concat('styles-vendor.css'))
//       .pipe(rename('styles-vendor.min.css'))
//       .pipe(sass().on('error', sass.logError))
//       .pipe(cleanCSS())
//       .pipe(rev())
//       .pipe(gulp.dest('./assets/css/'));
// });

// gulp.task('styles', function() {
//     gulp.src(['src/sass/*.scss', 'src/tempcss.css'])
//      .pipe(concat('styles.css'))
//      .pipe(rename('styles-bundle.min.css'))
//       .pipe(sass().on('error', sass.logError))
//       .pipe(cleanCSS())
//       .pipe(rev())
//       .pipe(gulp.dest('./assets/css/'));
// });

var jsAppFiles = [
  'src/pages/realtime/app/app.js',
  'src/pages/realtime/app/controller/MainCtrl.js',
];

var jsAngularFiles =  [
  'node_modules/angular/angular.min.js',
  'node_modules/angular-animate/angular-animate.min.js',
  'node_modules/angular-resource/angular-resource.min.js',
  'node_modules/angular-route/angular-route.min.js',
  'node_modules/angular-ui-router/angular-ui-router.js',
];
// jsVendorFiles =  [
//   'src/vendor/angularhotkeys/hotkeys.min.js',
//  'src/vendor/angular-web-notification/web-notification.js',
//  'src/vendor/angular-web-notification/angular-web-notification.js',
//  'src/vendor/angular-toast/angular-toastr.tpls.min.js',
//  'src/vendor/facebook-angular/angular-facebook.js',
//  'src/vendor/ngclibboard/ngclipboard.js',
//  // 'src/vendor/ngaudio/angular.audio.js',
//  'src/vendor/blueimp/js/blueimp-gallery.min.js',
//   'src/vendor/angular-tooltip/angular-tooltips.js',
//   'src/vendor/angular-highchart/highstock.src.js',
//   'src/vendor/angular-highchart/highcharts-ng.js',

//   'src/vendor/custom-file-input/custom-file-input.js',

//   'bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js',
//   'bower_components/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
// ],

var jsDest = 'assets/js';

gulp.task('angularScripts', function() {
    return gulp.src(jsAngularFiles)
        .pipe(concat('scripts-angular.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(gulp.dest('./assets/js/'));
});

// gulp.task('vendorScripts', function() {
//     return gulp.src(jsVendorFiles)
//         .pipe(concat('scripts-vendor.min.js'))
//         .pipe(gulp.dest(jsDest))
//         .pipe(uglify())
//         .pipe(gulp.dest('./assets/js/'));
// });

gulp.task('appScripts', function() {
    return gulp.src(jsAppFiles)
        .pipe(concat('realtime-scripts-bundle.min.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./assets/js/'));
});


gulp.task('clean', [], function() {
  console.log("Clean all files in build folder");
  return gulp.src(["./assets/js/", "./assets/css/"], { read: false }).pipe(clean());
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
  // gulp.start('styles');
  // gulp.start('vendorStyles');
  gulp.start('angularScripts');
  // gulp.start('vendorScripts');
  gulp.start('appScripts');
});

gulp.task('build', function () {
  var target = gulp.src('./src/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./assets/js/scripts-angular.min.js'], {read: false});
  target.pipe(inject(sources))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'));

  // inject to all pages
  var realtimeSources = gulp.src(['./assets/js/scripts-angular.min.js',
    './assets/js/realtime-scripts-bundle-*.js'], {read: false});

  var realtimePage = gulp.src('./src/realtime/index.html');
  realtimePage.pipe(inject(realtimeSources))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./realtime/'));

});

gulp.task('test', function () {
  var target = gulp.src('./src/admin/index.html');
  var sources = gulp.src([
    /*app*/
    // './assets/js/scripts-angular.min.js',
    // 'node_modules/angular-animate/angular-animate.min.js',
    // 'node_modules/angular-resource/angular-resource.min.js',
    // 'node_modules/angular-route/angular-route.min.js',
    // 'node_modules/angular-ui-router/release/angular-ui-router.min.js',

    //vendors
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter

    'node_modules/angular-facebook/angular-facebook.js',



    // app
    'src/admin/app/app.js',
    // services
    'src/admin/service/firebase.service.js',
    'src/admin/service/facebook.service.js',

    // directives



    'src/admin/controller/MainCtrl.js',
    // DASHBOARD
    'src/admin/pages/dashboard/dashboard.module.js',
    'src/admin/pages/dashboard/DashboardCtrl.js',
    // dashboard > general
    'src/admin/pages/dashboard/general/GeneralCtrl.js',
    // dashboard > realtime
    'src/admin/pages/dashboard/realtime/RealtimeCtrl.js',

    // REPORT
    'src/admin/pages/report/report.module.js',

    // SETTINGS
    'src/admin/pages/settings/settings.module.js',

    // SOURCES
    'src/admin/pages/sources/sources.module.js',
    'src/admin/pages/sources/pages/SourcePageCtrl.js',

    // ORDERS
    'src/admin/pages/orders/orders.module.js',
    'src/admin/pages/orders/orders.directive.js',
    'src/admin/pages/orders/list/ListOrderCtrl.js',
    

    'src/admin/pages/orders/create/CreateOrderCtrl.js',
    'src/admin/pages/orders/create/CreateOrderByCommentCtrl.js',

    // 

  ], {read: false});

  // return target.pipe(inject(sources))
  //   .pipe(htmlmin({collapseWhitespace: false}))
  //   .pipe(gulp.dest('./'));
    return target.pipe(inject(sources))
    .pipe(htmlmin({collapseWhitespace: false}))
    .pipe(gulp.dest('./'));
});


  var realtimeSources = gulp.src([
    //vendors
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter

    'node_modules/angular-facebook/angular-facebook.js',
    // 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    // 'node_modules/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
    'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',

    'assets/js/snackbar.js', //snackbar


    /*app*/
    'src/realtime/app/app.js',
    'src/realtime/app/directive.js',
    // services
    'src/realtime/service/firebase.service.js',
    //
    'src/realtime/app/controller/MainCtrl.js',

    // Orders
    'src/realtime/pages/orders/orders.module.js',
    'src/realtime/pages/orders/OrdersCtrl.js',
  ], {read: false});


gulp.task('realtimeBuild', function () {

  var realtimePage = gulp.src('./src/realtime/index.html');
  realtimePage.pipe(inject(realtimeSources))
  .pipe(htmlmin({collapseWhitespace: false}))
  .pipe(gulp.dest('./realtime/'));
});

// serve realtime page
gulp.task('realtime', function () {
  var target = gulp.src('./src/realtime/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  // var sourcesCss = gulp.src([
  //  './assets/css/styles-bundle*.css', './assets/css/styles-vendor*.css'], {read: false});
  // var sourcesJs = gulp.src([
  //  './assets/js/scripts-bundle-*.js'], {read: false});

    return target.pipe(inject(realtimeSources))
    .pipe(htmlmin({collapseWhitespace: false}))
    .pipe(gulp.dest('./tmp/realtime/'));
});

gulp.task('start-realtime', ['realtime'], function(){
  var options = {
    uri: '127.0.0.1:3000',
    app: 'chrome'
  };
  gulp.src('./tmp/realtime/')
  .pipe(open(options));
});

gulp.task('serve:realtime',['start-realtime'], serve());

gulp.task('app', ['test', 'realtimeBuild'], function(){
  var options = {
    uri: '127.0.0.1:3000',
    app: 'chrome'
  };
  gulp.src('./')
  .pipe(open(options));
});

// gulp.task('dist', function(){
//   var options = {
//     uri: '127.0.0.1:3000',
//     app: 'chrome'
//   };
//   gulp.src('./')
//   .pipe(open(options));
// });


gulp.task('serve',['app'], serve());

gulp.task('serve:dist',['dist'], serve(''));

gulp.task('serve-build', serve(['public', 'build']));

gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 80,
  middleware: function(req, res) {
    // custom optional middleware 
  }
}));

// dist:    gulp => gulp build => gulp serve:dist
// serve:   gulp serve