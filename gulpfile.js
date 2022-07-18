const { src, dest, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const nunjucksRender = require('gulp-nunjucks-render');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

const browserSyncJob = () => {
  browserSync.init({
    server: "src/"
  });
};

const buildSass = () => {
  console.log('Компиляция SASS');

  return src('src/scss/app.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(dest('src/css/',  { sourcemaps: '.' }))
    .pipe(browserSync.stream());
}

const buildNunjucks = () => {
  console.log('Компиляция NJK');

  return src('src/templates/*.njk')
  .pipe(nunjucksRender({
    path: ['src/templates/']
  }))
  .pipe(dest('src/templates/'))
  .pipe(browserSync.stream());;
}

const browserSyncReload = (done) => {
  browserSync.reload();
  done();
};

const watchers = () => {
    watch('src/scss/*.scss', buildSass);
    watch(['src/*.html', 'src/*.njk'], browserSyncReload);
    watch('src/templates/*.njk', buildNunjucks);
  };




exports.server = browserSyncJob;
exports.watch = watchers;
exports.default = parallel( browserSyncJob, watchers, buildNunjucks);