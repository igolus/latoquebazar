const gulp = require('gulp');
const zip = require('gulp-zip');
const prompt = require('gulp-prompt');
var file = require('gulp-file');
var ftp = require( 'vinyl-ftp' );
const replace = require('gulp-replace');
var rename = require('gulp-rename');
var download = require("gulp-download-files");
var imageResize = require('gulp-image-resize');
let resizer = require('gulp-images-resizer');
var fs = require('fs');
var data = require('gulp-data');

const Vinyl = require('vinyl')

function string_src(filename, string) {
    var src = require('stream').Readable({ objectMode: true })
    src._read = function () {
        this.push(new Vinyl({
            cwd: "",
            base: ".",
            path: filename,
            contents: Buffer.from(string, 'utf-8')
        }))
        this.push(null)
    }
    return src
}

function generateZip(cb) {
    return gulp.src([
        '**',
        '!src/existingconfs/config.json',
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

// function vercelDeploy (mainWindow, done) {
//
// var existingconfs = require('../siteLaToque/src/existingconfs/config.json');
// console.log('existingconfs '+ JSON.stringify(existingconfs))
// console.log('cmd '+ 'vercel --confirm --name '+ existingconfs.siteName)
// const child  = exec('vercel --confirm --name '+ existingconfs.siteName, {
//     cwd: 'siteLaToque'
// })
//
// child.stdout.on('data', function(data) {
//     mainWindow.webContents.send('logs', data.toString());
//     console.log(data);
// });
//
// child.stderr.on('data', function (data) {
//     mainWindow.webContents.send('logs', data.toString());
//     console.log(data);
// });
// },

function generateConfFromExisting(cb) {
    files = [];
    fs.readdirSync("./existingconfs").forEach(file => {
        console.log("file " + file);
        files.push(file.toString());
    });


    return gulp.src('.')
        .pipe(prompt.prompt([
            {
                type: 'list',
                name: 'confFile',
                message: 'Select the conf',
                choices: files
            },


        ], function(res) {

            gulp.src('./existingconfs/' + res.confFile)
                .pipe(data(function(file, callback) {
                    var content = String(file.contents);
                    //return callback(undefined,JSON.parse(content));

                    applyConfig(JSON.parse(content), cb)
                        .pipe(gulp.src('.'),
                            () => cb());
                    //console.log(JSON.parse(content));
                    //gulp.src('package.json', () => cb());

                    //return JSON.parse(content);


                    //console.log(content);
                }))
                //.pipe(data => console.log(data))

            //}))


        }));


}

function applyConfig(res, cb) {
    return download(res.imgUrl)
        .pipe(resizer({
            //format: "png",
            width: 144,
            height: 144


        }))
        .pipe(rename('iconApp.png'))
        .pipe(gulp.dest('./public', {overwrite: true}))
        .pipe(gulp.src('./src/conf/config-' + res.targetEnv + '.json'))
        .pipe(rename('config.json'))
        .pipe(replace('brandIdReplace', res.brandId))
        .pipe(replace(  'appNameReplace',res.appName))
        .pipe(replace('googleKeydReplace', res.googleKey))
        .pipe(gulp.dest('./src/conf', {overwrite: true}))
        .pipe(gulp.src('./src/conf/project.json'))
        .pipe(replace('projectIdReplace', res.projectId))
        .pipe(gulp.dest('./src/existingconfs', {overwrite: true}))
        .pipe(gulp.dest('.vercel', {overwrite: true}))
        .pipe(gulp.src('./src/conf/manifest-template.json'))
        .pipe(rename('manifest.json'))
        .pipe(replace('appName', res.appName))
        .pipe(gulp.dest('public', {overwrite: true}))
        .pipe(string_src("./" + res.appName.split(' ').join('_') + ".json",
            JSON.stringify({
                targetEnv: res.targetEnv,
                googleKey:  res.googleKey,
                brandId: res.brandId,
                projectId: res.projectId,
                appName: res.appName,
                imgUrl: res.imgUrl
            }, null, 2)
        ));

}

function generateConf(cb) {
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
                message: 'What is the vercel project ConfirmedOrder ?'
            },
            {
                type: 'input',
                name: 'googleKey',
                message: 'What is the googleKey ?'
            },
            {
                type: 'input',
                name: 'appName',
                message: 'What is the app name ?'
            },
            {
                type: 'input',
                name: 'imgUrl',
                message: 'url image ?'
            },

        ], function(res){
            // console.log(res.targetEnv);
            // console.log(res.brandId);
            // console.log(res.projectId);
            // console.log(res.appName);
            // console.log(res.imgUrl);
            // console.log(res.googleKey);

            //gulp.src('./public/laToqueLogo.png')
            applyConfig(res, cb)
                .pipe(gulp.dest('./existingconfs', {overwrite: true}),
                () => cb());

        }));

}

exports.uploadFtp = uploadFtp;
exports.generateZip = generateZip;
exports.generateConf = generateConf;
exports.generateConfFromExisting = generateConfFromExisting;
//exports.installInteractive = installInteractive;