'use strict';

/*
 Libraries
 =====================================================================================
*/
import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import pkg from './package.json';
import runSequence from 'run-sequence';
import sassdoc from 'sassdoc';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

/*
 HTML
 =====================================================================================
 Scan HTML for assets
 Optimize assets
*/
gulp.task('html', () => {
  return gulp.src('app/**/*.html')
    .pipe($.plumberNotifier())
    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('dist'));
});

/*
 Styles
 =====================================================================================
 Transpile Sass to CSS
 Automatically prefix stylesheets
*/
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10', 
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    'app/assets/sass/*.scss',
    'app/assets/css/**/*.css'
  ])
    .pipe($.plumberNotifier())
    .pipe($.newer('.tmp/assets/css'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/assets/css'))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(gulp.dest('.tmp/assets/css'));
});

/*
 Sass Documentation Generator
 =====================================================================================
 Transpile Sass to CSS
 Automatically prefix stylesheets
*/
gulp.task('sass:doc', function () {
  var options = {
    dest: 'dist/sassdocs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true,
      watermark: true
    },
    groups: {
      'undefined': 'Ungrouped'
    },
    basePath: 'https://github.com/SassDoc/sassdoc'
  };

  return gulp.src('app/assets/sass/**/*.scss')
    .pipe(sassdoc(options));
});

/*
 ES & JS Lint
 =====================================================================================
 Lint the ES6 code --> check code quality
*/
gulp.task('es:lint', () =>
  gulp.src(['app/assets/es/**/*.js', 'app/assets/js/**/*.js', '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

/*
 Scripts
 =====================================================================================
 Transpile ES2015 to ES5
 Concatenate and minify JavaScript
*/
gulp.task('scripts', () =>
  gulp.src(['app/assets/es/main.js'])
    .pipe($.plumberNotifier())
    .pipe($.newer('.tmp/assets/js'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/assets/js'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify(
      {
        output: {
          comments: false
        }
      }
    ))
    .pipe($.size({title: 'scripts'}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(gulp.dest('.tmp/assets/js'))
);

/*
 Images
 =====================================================================================
 Optimize images
*/
gulp.task('images', () =>
  gulp.src('app/assets/images/**/*')
    .pipe($.plumberNotifier())   
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size({title: 'images'}))
);

/*
 Clean
 =====================================================================================
 Clean the dist directory
*/
gulp.task('clean', () =>
  del([
    '.tmp',
    'dist/*',
    '!dist/.git'
  ],
  {
    dot: true
  })
);

/*
 Copy
 =====================================================================================
 Copy all files (root-level) from the app folder
*/
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html'
  ], {
    dot: true
  })
    .pipe($.plumberNotifier())   
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

/*
 Server
 =====================================================================================
 Watch files for changes and reload
*/
gulp.task('serve', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    logPrefix: 'NMD',
    scrollElementMapping: ['main', '.mdl-layout'],
    https: false,
    server: ['.tmp', 'app'],
    port: 8080,
    ui: {
      port: 8081,
      weinre: {
        port: 9081
      }
    }
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/assets/sass/**/*.{scss}', 'app/assets/css/**/*.{css}'], ['styles', reload]);
  gulp.watch(['app/assets/es/**/*.js', 'app/assets/js/**/*.js'], ['lint', 'scripts', reload]);
  gulp.watch(['app/assets/images/**/*'], reload);
});

/*
 Server
 =====================================================================================
 Watch files for changes and reload
*/
gulp.task('serve:dist', ['scripts', 'styles'], () => {
  browserSync({
    notify: false,
    logPrefix: 'NMD',
    scrollElementMapping: ['main', '.mdl-layout'],
    https: false,
    server: ['dist'],
    port: 8080,
    ui: {
      port: 8081,
      weinre: {
        port: 9081
      }
    }
  });
});

/*
 Default Task
 =====================================================================================
 Build production files
*/
gulp.task('default', ['clean'], cb =>
  runSequence(
    'styles',
    ['es:lint', 'html', 'scripts', 'images', 'copy'],
    'sass:doc',
    cb
  )
);
