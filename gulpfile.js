const gulp = require('gulp');
const zip = require('gulp-zip');
const prompt = require('gulp-prompt');
var file = require('gulp-file');

function generateZip(cb) {
    return gulp.src([
        '**',
        '!src/conf/config.json',
        '!node_modules/**',
        '!netlify/**',
        '!out/**',

        '!.netlify/**/*.*',
        '!.next/**/*.*',
        '!.vercel/**/*.*',
        '!yarn-error.log',
        '!latoquesite.zip']) // Here I'm excluding .min.js files
        .pipe(zip('latoquesite.zip'))
        .pipe(gulp.dest('.'));
}


function generateConf(cb) {
    var target = gulp.src('.');
    var target2 = gulp.src('.');
    var brandId = ""
    var googleKey = ""
    return gulp.src('.')
        .pipe(prompt.prompt({
            type: 'input',
            name: 'brandId',
            message: 'What is your brandId ?'
        }, function(res){
            brandId = res.brandId;

            target.pipe(prompt.prompt({
                type: 'input',
                name: 'googleKey',
                message: 'What is your googleKey ?'
            }, function(res){
                googleKey = res.googleKey;
               console.log(brandId)
               console.log(googleKey)
                    //target.pipe()

               const content = `
{
  "graphQlUrl": "https://us-central1-latoqueprod.cloudfunctions.net/graphQlApi",
  "brandId": "${brandId}",
  "googleKey": "${googleKey}"
}
`
               target2.pipe(file('config.json', content, {overwrite:true}))
                   .pipe(gulp.dest('./src/conf', {overwrite:true}))
            //value is in res.task (the name option gives the key)
        }))
            //value is in res.task (the name option gives the key)
        }));
    // .pipe(file('version', "toto"))
    // .pipe(gulp.dest('.'))
}

exports.generateZip = generateZip;
exports.generateConf = generateConf;