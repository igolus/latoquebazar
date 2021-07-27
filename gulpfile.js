const gulp = require('gulp');
const zip = require('gulp-zip');
const prompt = require('gulp-prompt');
var file = require('gulp-file');
var ftp = require( 'vinyl-ftp' );

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


function uploadFtp(cb) {
    var conn = ftp.create( {
        host:     'goyave.o2switch.net',
        user:     'rogu6473',
        password: 'T5VADWq7fkz2',
        parallel: 10,
        // log:      gutil.log
    } );

    var globs = [
        'latoquesite.zip',
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/bookingsorcerer.com' ) )
        .pipe( conn.dest( '/bookingsorcerer.com' ) );
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

exports.uploadFtp = uploadFtp;
exports.generateZip = generateZip;
exports.generateConf = generateConf;