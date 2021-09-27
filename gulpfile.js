const gulp = require('gulp');
const zip = require('gulp-zip');
const prompt = require('gulp-prompt');
var file = require('gulp-file');
var ftp = require( 'vinyl-ftp' );
const replace = require('gulp-replace');
var rename = require('gulp-rename');

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
        password: 'w7!IY?Ry=Wjm',
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

function installInteractive(cb) {

}


function generateConf(cb) {
    let res;
    // gulp.src('test.js')
    //     .pipe(prompt.prompt({
    //         type: 'input',
    //         name: 'task',
    //         message: 'Which task would you like to run?'
    //     }))
    //     .pipe(res => {console.log(res)})



    return gulp.src('.')
        .pipe(prompt.prompt([
            {
                type: 'list',
                name: 'targetEnv',
                message: 'What is the env',
                choices: ['dev', 'presale', 'prod']
            },
            {
                type: 'input',
                name: 'brandId',
                message: 'What is the brandId ?'
            },
            {
                type: 'input',
                name: 'projectId',
                message: 'What is the vercel project Id ?'
            },
            {
                type: 'input',
                name: 'googleKey',
                message: 'What is the googleKey ?'
            },

            ], function(res){
                console.log(res.targetEnv);
                console.log(res.brandId);
                console.log(res.projectId);

                //if (res.targetEnv === 'dev') {
                    gulp.src('./src/conf/config-' + res.targetEnv + '.json')
                        .pipe(rename('config.json'))
                        .pipe(replace('brandIdReplace', res.brandId))
                        .pipe(replace('googleKeydReplace', res.googleKey))
                        .pipe(gulp.dest('./src/conf', {overwrite:true}))
                        .pipe(gulp.src('./src/conf/project.json'))
                        .pipe(replace('projectIdReplace', res.projectId))
                        .pipe(gulp.dest('.vercel', {overwrite:true}), (res) => cb() )
                        //.done();
            }));

}

exports.uploadFtp = uploadFtp;
exports.generateZip = generateZip;
exports.generateConf = generateConf;
exports.installInteractive = installInteractive;