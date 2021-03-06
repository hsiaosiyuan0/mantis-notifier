import * as del from "del";
import * as gulp from "gulp";
import * as gutil from "gulp-util";
import * as jsonfile from "jsonfile";
import * as sourcemaps from "gulp-sourcemaps";
import * as ts from "gulp-typescript";

const tslint = require("gulp-tslint");
const prettier = require("gulp-prettier-plugin");

const src = ["./src/**/*.{ts,tsx}"];
const tsProject = ts.createProject('tsconfig.json')

gulp.task("typescript", () => {
  return gulp
    .src(src)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "../src" }))
    .pipe(gulp.dest("dist"));
});

gulp.task("copyFiles", () => {
  return gulp.src(["src/**/*.png", "src/**/*.json"]).pipe(gulp.dest("dist"));
});

gulp.task("prettier", () => {
  const cfg = jsonfile.readFileSync("./.prettierrc", { throws: false });
  if (cfg === null) {
    throw new gutil.PluginError({
      plugin: "prettier",
      message: "missing or deformed .prettierrc"
    });
  }
  return gulp
    .src(src)
    .pipe(prettier(cfg, { filter: true }) as any)
    .pipe(gulp.dest((file: any) => file.base));
});

gulp.task("tslint", () =>
  gulp
    .src(src)
    .pipe(
      tslint({
        formatter: "stylish"
      })
    )
    .pipe(
      tslint.report({
        allowWarnings: true,
        summarizeFailureOutput: true
      })
    )
);

gulp.task("clean", () => {
  return del("dist/*");
});

gulp.task("build", gulp.series("clean", "typescript", "copyFiles"));
