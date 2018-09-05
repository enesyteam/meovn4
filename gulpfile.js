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

var html2jade = require('gulp-html2jade');

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

var jsAngularFiles = [
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
    return gulp.src(["./assets/js/", "./assets/css/"], {
        read: false
    }).pipe(clean());
});

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function() {
    // gulp.start('styles');
    // gulp.start('vendorStyles');
    gulp.start('angularScripts');
    // gulp.start('vendorScripts');
    gulp.start('appScripts');
});

gulp.task('build', function() {
    var target = gulp.src('./src/index.html');
    // It's not necessary to read the files (will speed up things), we're only after their paths:
    var sources = gulp.src(['./assets/js/scripts-angular.min.js'], {
        read: false
    });
    target.pipe(inject(sources))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./'));

    // inject to all pages
    var realtimeSources = gulp.src(['./assets/js/scripts-angular.min.js',
        './assets/js/realtime-scripts-bundle-*.js'
    ], {
        read: false
    });

    var realtimePage = gulp.src('./src/realtime/index.html');
    realtimePage.pipe(inject(realtimeSources))
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./realtime/'));

});

var adminSources = gulp.src([
        /*app*/
        // './assets/js/scripts-angular.min.js',
        // 'node_modules/angular-animate/angular-animate.min.js',
        // 'node_modules/angular-resource/angular-resource.min.js',
        // 'node_modules/angular-route/angular-route.min.js',
        // 'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        './assets/js/angular-slick.js',
        './assets/js/angular-spinners.js',

        // modules
        'src/modules/mGHN.js',
        'src/modules/mFirebase.js',
        'src/modules/mFacebook.js',
        'src/modules/mUtilities.js',

        // 'src/modules/mScrollToTop.js',

        'src/modules/metrics-graphics.js',
        

        //vendors
        'node_modules/phone-validate-vn/build/chotot.validators.phone.min.js',
        'node_modules/angular-loading-bar/build/loading-bar.min.js',
        'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter
        'node_modules/angular-toastr/dist/angular-toastr.tpls.js',
        'node_modules/angularjs-datepicker/dist/angular-datepicker.min.js', // date picker
        'node_modules/ng-file-upload/dist/ng-file-upload.min.js',

        'node_modules/angular-facebook/angular-facebook.js',

        'node_modules/ng-dialog/js/ngDialog.min.js',
        'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',

        'node_modules/moment/min/moment-with-locales.min.js',
        'node_modules/angular-moment/angular-moment.min.js',
        'node_modules/angular-moment-picker/dist/angular-moment-picker.min.js',


        // app
        'src/admin/app/app.js',
        // services
        'src/admin/service/firebase.service.js',
        'src/admin/service/facebook.service.js',
        'src/admin/service/firebase.storage.service.js',

        // directives



        'src/admin/controller/MainCtrl.js',
        // DASHBOARD
        'src/admin/pages/dashboard/dashboard.module.js',
        'src/admin/pages/dashboard/DashboardCtrl.js',
        'src/admin/pages/dashboard/DownloadCtrl.js',
        // dashboard > general
        'src/admin/pages/dashboard/general/GeneralCtrl.js',
        // dashboard > realtime
        'src/admin/pages/dashboard/realtime/RealtimeCtrl.js',

        // DASHBOARD
        'src/admin/pages/mix/mix.module.js',
        'src/admin/pages/mix/MixCtrl.js',

        // REPORT
        'src/admin/pages/report/report.module.js',

        // SETTINGS
        'src/admin/pages/settings/settings.module.js',
        'src/admin/pages/settings/OptionsCtrl.js',
        'src/admin/pages/settings/ghn/GHNCtrl.js',
        'src/admin/pages/settings/replies/QuickReplyCtrl.js',

        // SOURCES
        'src/admin/pages/sources/sources.module.js',
        'src/admin/pages/sources/pages/SourcePageCtrl.js',
        'src/admin/pages/sources/upload/UploadCtrl.js',

        // ORDERS
        'src/admin/pages/orders/orders.module.js',
        'src/admin/pages/orders/orders.directive.js',
        'src/admin/pages/orders/OrdersCtrl.js',
        'src/admin/pages/orders/list/ListOrderCtrl.js',
        'src/admin/pages/orders/push/PushOrderCtrl.js',


        'src/admin/pages/orders/create/CreateOrderCtrl.js',
        'src/admin/pages/orders/create/CreateOrderByCommentCtrl.js',

        // 

    ], {
        read: false
    });


var realtimeSources = gulp.src([
    // modules
    'src/modules/mGHN.js',
    'src/modules/mFirebase.js',
    'src/modules/mFacebook.js',
    'src/modules/mUtilities.js',

    //vendors
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter
    'node_modules/ng-dialog/js/ngDialog.min.js',

    'node_modules/angular-facebook/angular-facebook.js',
    // 'node_modules/angular-clipboard/angular-clipboard.js',
    // 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    // 'node_modules/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
    // 'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',
    // 'assets/js/firebase-util.min.js',

    // 'assets/js/snackbar.js', //snackbar
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    // 'node_modules/angular-chosen-localytics/dist/angular-chosen.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.js',


    /*app*/
    'src/realtime/app/app.js',
    'src/realtime/app/directive.js',
    // services
    'src/realtime/service/firebase.service.js',
    'src/realtime/service/firebase.storage.service.js',
    'src/realtime/service/access_token.service.js',
    'src/realtime/service/product-pack.service.js',
    //
    'src/realtime/app/controller/MainCtrl.js',

    // Orders
    'src/realtime/pages/orders/orders.module.js',
    'src/realtime/pages/orders/OrdersCtrl.js',
], {
    read: false
});

var shippingSources = gulp.src([
    // modules
    'src/modules/mGHN.js',
    'src/modules/mFirebase.js',
    'src/modules/mFacebook.js',
    'src/modules/mUtilities.js',

    //vendors
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter

    'node_modules/angular-facebook/angular-facebook.js',
    'node_modules/ng-dialog/js/ngDialog.min.js',
    // 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    // 'node_modules/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
    // 'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',

    // 'assets/js/snackbar.js', //snackbar
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    
    // 'node_modules/angular-chosen-localytics/dist/angular-chosen.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/angular-moment/angular-moment.min.js',


    /*app*/
    'src/shipping/app/app.js',
    // 'src/realtime/app/directive.js',
    // // services
    'src/shipping/service/firebase.service.js',
    'src/shipping/service/firebase.storage.service.js',
    'src/shipping/service/access_token.service.js',
    'src/shipping/service/product-pack.service.js',
    'src/shipping/service/GiaoHangNhanh.service.js',
    //
    'src/shipping/controller/MainCtrl.js',
    'src/shipping/controller/DetailCtrl.js',
    'src/shipping/controller/PrintCtrl.js',

], {
    read: false
});

var printingSources = gulp.src([
    // modules
    'src/modules/mGHN.js',
    'src/modules/mFirebase.js',
    'src/modules/mFacebook.js',
    'src/modules/mUtilities.js',

    //vendors
    'node_modules/angular-loading-bar/build/loading-bar.min.js',
    'node_modules/angular-filter/dist/angular-filter.min.js', // angular filter

    'node_modules/angular-facebook/angular-facebook.js',
    'node_modules/ng-dialog/js/ngDialog.min.js',
    // 'node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js',
    // 'node_modules/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
    // 'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.min.js',

    // 'assets/js/snackbar.js', //snackbar
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
    
    // 'node_modules/angular-chosen-localytics/dist/angular-chosen.js',
    'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/angular-moment/angular-moment.min.js',

    /*app*/
    'src/print/app/app.js',

    'src/print/service/print.service.js',


    'src/print/controller/MainCtrl.js',
    'src/print/controller/DetailCtrl.js',
    'src/print/controller/PrintCtrl.js',
    'src/print/controller/PrintInvoiceMulti.js',
    'src/print/controller/PrintShippingBill.js',

], {
    read: false
});

var orderManagerSources = gulp.src([
    'node_modules/moment/min/moment.min.js',
    'node_modules/angular-moment/angular-moment.min.js',
    /*app*/
    'src/orderManager/app/app.js',
    'src/orderManager/controller/MainCtrl.js',


], {
    read: false
});

// inject admin page
gulp.task('adminBuild', function() {
    var target = gulp.src('./src/admin/index.html');
    
    return target.pipe(inject(adminSources))
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest('./'));
});

// inject realtime page
gulp.task('realtimeBuild', function() {

    var realtimePage = gulp.src('./src/realtime/index.html');
    realtimePage.pipe(inject(realtimeSources))
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest('./dist/realtime/'));
});

// inject shipping page
gulp.task('shippingBuild', function() {

    var shippingPage = gulp.src('./src/shipping/index.html');
    shippingPage.pipe(inject(shippingSources))
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest('./dist/shipping/'));
});

// inject printing page
gulp.task('printingBuild', function() {

    var printingPage = gulp.src('./src/print/index.html');
    printingPage.pipe(inject(printingSources))
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest('./dist/printing/'));
});

// inject order manager page
gulp.task('orderManagerBuild', function() {

    var orderManagerPage = gulp.src('./src/orderManager/index.html');
    orderManagerPage.pipe(inject(orderManagerSources))
        .pipe(htmlmin({
            collapseWhitespace: false
        }))
        .pipe(gulp.dest('./dist/orderManager/'));
});


//  MAKE CSS FILES
gulp.task('vendorStyles', function() {
    gulp.src(vendorCssFiles)
      .pipe(concat('styles-vendor.css'))
      .pipe(rename('styles-vendor.min.css'))
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(rev())
      .pipe(gulp.dest('./assets/css/'));
});

// inject all asset files to html and make html files
gulp.task('inject', ['adminBuild', 'realtimeBuild', 'shippingBuild', 'printingBuild', 'orderManagerBuild'], function(){

});


// MAKE JADE FILES FROM HTML
var jadeOptions = {nspaces:2};
gulp.task('make-jade', function(){
    // admin page
    gulp.src('index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views'));

    // realtime page
    gulp.src('./dist/realtime/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/realtime'));

    // shipping page
    gulp.src('./dist/shipping/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/shipping'));

    // order manager page
    gulp.src('./dist/orderManager/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/orderManager'));

    // printing page
    gulp.src('./dist/printing/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/printing'));

    // navigation page
    gulp.src('./src/navigation/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/navigation'));

    // login page
    gulp.src('./login/index.html')
    .pipe(html2jade(jadeOptions))
    .pipe(gulp.dest('views/login'));
});
