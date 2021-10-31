// gulp-sass: Biên dịch Sass sang CSS
// gulp-autoprefixer : tự động thêm prefix vào code CSS
// gulp-pug: Biên dịch các file PUG sang HTML
// browser-sync: Đồng bộ với trình duyệt, tự động tải lại trang khi có cập nhật thay đổi
// gulp-concat: Nối các file lại với nhau
// gulp: Vì làm việc với Gulp nên chúng ta chắn chắn cần module gulp
// gulp-imagemin: tối ưu các hình ảnh
// gulp-cache : cache hinh ảnh
// gulp-uglify : tối ưu file js
// del : xóa các file ko sử dụng
// gulp-babel : viết es6
// gulp-plumber : xác định lỗi

const gulp = require("gulp");
const pug = require("gulp-pug");
// const sass = require("gulp-sass");
const sass = require("gulp-sass")(require("sass"));
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const browsersync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const del = require("del");
const plumber = require("gulp-plumber");

const options = {
  pug: {
    src: ["app/views/*.pug", "app/views/!blocks/**", "app/views/!layout/**"],
    all: "app/views/**/*.pug",
    dest: "public",
  },
  scripts: {
    src: "app/scripts/**/*.js",
    dest: "public/scripts",
  },
  styles: {
    src: "app/styles/**/*.scss",
    dest: "public/styles",
  },
  images: {
    src: "app/images/*.+(png|jpeg|jpg|gif|svg)",
    dest: "public/images",
  },
  fonts: {
    src: "app/fonts/*",
    dest: "public/fonts",
  },
  browserSync: {
    baseDir: "public",
  },
};

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: options.browserSync.baseDir,
    },
    port: 3000,
  });
  done();
}

function styles() {
  return gulp
    .src(options.styles.src)
    .pipe(
      plumber(function (err) {
        console.log("Styles Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
        grid: true,
      })
    )
    .pipe(gulp.dest(options.styles.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

function scripts() {
  return gulp
    .src(options.scripts.src)
    .pipe(
      plumber(function (err) {
        console.log("Scripts Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(options.scripts.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

function views() {
  return gulp
    .src(options.pug.src)
    .pipe(
      plumber(function (err) {
        console.log("Pug Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(options.pug.dest))
    .pipe(
      browsersync.reload({
        stream: true,
      })
    );
}

function images() {
  return gulp
    .src(options.images.src)
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest(options.images.dest));
}

function videos() {
  return gulp.src(options.videos.src).pipe(gulp.dest(options.imavideoges.dest));
}

function fonts() {
  return gulp.src(options.fonts.src).pipe(gulp.dest(options.fonts.dest));
}

async function clean() {
  return Promise.resolve(del.sync("public"));
}

function watchFiles() {
  gulp.watch(options.pug.all, views);
  gulp.watch(options.styles.src, styles);
  gulp.watch(options.scripts.src, scripts);
  gulp.watch(options.images.src, images);
  gulp.watch(options.fonts.src, fonts);
}

// Build

const build = gulp.series(
  clean,
  gulp.parallel(styles, views, scripts, images, fonts)
);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.styles = styles;
exports.views = views;
exports.scripts = scripts;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
