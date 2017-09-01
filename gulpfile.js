const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const connect = require('gulp-connect');
const livereload = require('gulp-livereload');

//Log Message
gulp.task('message', () => {
    console.log('Gulp Running'); 
});

//Optimize Html to dist folder
gulp.task('copyHtml', function(){
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('imageMin', () =>
gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

//minify JS files
gulp.task('minify', function(){
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(livereload());
});

//Compile Sass
gulp.task('sass', function(){
    gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('webserver', function() {
    connect.server({
        livereload: true
    });
  });

// gulp.task('livereload', function() {
//     gulp.src(['src/js/*.js', 'src/sass/*.scss', 'src/*.html'])
//       .pipe(connect.reload());
//   });

gulp.task('watch', function(){
    livereload.listen({ basePath: 'dist' });
    gulp.watch('src/images/*', ['imageMin']);
    gulp.watch('src/js/*.js', ['minify']);
    gulp.watch('src/sass/*.scss', ['sass']);
    gulp.watch('src/*.html', ['copyHtml']);
});

// All Scripts concatinate and minified 
// gulp.task('scripts', function(){
//     gulp.src('src/js/*.js')
//         .pipe(concat('main.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('dist/js'));
// });

gulp.task('default', ['message', 'sass', 'minify', 'imageMin', 'copyHtml', 'webserver', 'watch']);//['message', 'sass', 'minify'] );


  