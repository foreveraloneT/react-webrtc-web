import del from 'del';
import path from 'path';
import gulp from 'gulp';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import runSequence from 'run-sequence';
import gulpLoadPlugins from 'gulp-load-plugins';
import packageJson from './package.json';
import webpackConfig from './webpack.config';

const PORT = process.env.PORT || 8001;
const $ = gulpLoadPlugins({ camelize: true });

const config = {
  devPath: 'app/src',
  distPath: 'app/dist',
  deployTarget: 'public',
}

// Main tasks
gulp.task('serve', () => runSequence('serve:clean', 'serve:index', 'serve:start'));
gulp.task('dist', () => runSequence('dist:clean', 'dist:build', 'dist:index'));
gulp.task('clean', ['dist:clean', 'serve:clean', 'deploy:clean']);

gulp.task('deploy', () => runSequence('dist:clean', 'deploy:clean', 'dist:build', 'dist:index', 'deploy:dist'))


gulp.task('deploy:dist', () => {
  gulp.src(config.distPath + '/**').pipe(gulp.dest(config.deployTarget));
});

// Remove all built files
gulp.task('serve:clean', cb => del('app/build', { dot: true }, cb));
gulp.task('dist:clean', cb => del(['app/dist', 'app/dist-intermediate'], { dot: true }, cb));
gulp.task('deploy:clean', cb => del([config.deployTarget + '/assets', config.deployTarget + '/index.html'], { dot: true }, cb));

// Copy static files across to our final directory
gulp.task('serve:static', () => {
  gulp.src([
    'app/src/assets/**'
  ])
    .pipe($.changed('build'))
    .pipe(gulp.dest('app/build/assets'))
    .pipe($.size({ title: 'static' }))
});

gulp.task('dist:static', () =>
  gulp.src([
    'app/src/assets/**'
  ])
    .pipe(gulp.dest('app/dist/assets/'))
    .pipe($.size({ title: 'static' }))
);

// Copy our index file and inject css/script imports for this build
gulp.task('serve:index', () => {
  return true
});

// Copy our index file and inject css/script imports for this build
gulp.task('dist:index', ['dist:update-static'], () => {
  gulp.src(['index.html'], { cwd: 'app/dist-intermediate' })
    .pipe(gulp.dest('app/dist'));

  return gulp
    .src(['*.{css,js}'], { cwd: 'app/dist-intermediate' })
    .pipe(gulp.dest('app/dist/assets'));
});

gulp.task('dist:update-static', () =>
  gulp.src([
    'app/dist-intermediate/images/**'
  ])
    .pipe(gulp.dest('app/dist/assets/images'))
    .pipe($.size({ title: 'update-static' }))
);

// Start a livereloading development server
gulp.task('serve:start', ['serve:static'], () => {
  const config = webpackConfig(true, 'app/build', PORT);

  return new WebpackDevServer(webpack(config), {
    contentBase: './app/build',
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  })
    .listen(PORT, '0.0.0.0', (err) => {
      if (err) throw new $.util.PluginError('webpack-dev-server', err);

      $.util.log(`[${packageJson.name} serve]`, `Listening at 0.0.0.0:${PORT}`);
    });
});
// Create a distributable package
gulp.task('dist:build', ['dist:static'], cb => {
  const config = webpackConfig(false, 'app/dist-intermediate');

  webpack(config, (err, stats) => {
    if (err) throw new $.util.PluginError('dist', err);

    $.util.log(`[${packageJson.name} dist]`, stats.toString({colors: true}));

    cb();
  });
});
