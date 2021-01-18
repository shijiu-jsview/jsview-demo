// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');
// @remove-on-eject-begin
// Do the preflight checks (only happens before eject).
const verifyPackageTree = require('./utils/verifyPackageTree');
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree();
}
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');
verifyTypeScriptSetup();
// @remove-on-eject-end

const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if(!!process.env.REACT_APP_INDEX_JS) {
    paths.appIndexJs = process.env.REACT_APP_INDEX_JS;
}
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Generate configuration
const config = configFactory('production');

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );

      console.log("JsView Update...");
      // main.js处理AppData信息
      function prepareMainAppData(file_md5) {
        const cryptoWorker = require('crypto');

        // 加载私钥文件
        const privateKeyText = fs.readFileSync("./src/appConfig/app_sign_private_key.crt");
        if (privateKeyText.indexOf("-----BEGIN PRIVATE KEY-----") < 0) {
          console.error("Get private from src/appConfig/app_sign_private_key.crt failed.");
          process.exit(1);
        }

        // 加载公钥文件
        const publicKeyText = fs.readFileSync("./src/appConfig/app_sign_public_key.pem");
        if (publicKeyText.indexOf("-----BEGIN PUBLIC KEY-----") < 0) {
          console.error("Get private from src/appConfig/app_sign_public_key.pem failed.");
          process.exit(1);
        }
        // 公钥格式转化pem -> der，因为java中的解码处理只识别der格式
        let publicKeyDerText = publicKeyText.toString();
        if (publicKeyDerText.indexOf('\r') >= 0) {
          publicKeyDerText = publicKeyDerText.replace(/\r/g, '');
        }        
        if (publicKeyDerText.indexOf('\n') >= 0) {
          publicKeyDerText = publicKeyDerText.replace(/\n/g, '');
        }
        publicKeyDerText = publicKeyDerText.replace('-----BEGIN PUBLIC KEY-----', '');
        publicKeyDerText = publicKeyDerText.replace('-----END PUBLIC KEY-----', '');

        // 编码md5值
        let binary_data = Buffer.from(file_md5);
        const encryptCodeBase64 = cryptoWorker.privateEncrypt({
            key: privateKeyText, 
            padding: cryptoWorker.constants.RSA_PKCS1_PADDING
          }, 
          Buffer.from(file_md5)
        ).toString('base64');

        // 校验publicKey是否是配对的
        const decryptCode = cryptoWorker.publicDecrypt({
            key: publicKeyText,
            padding: cryptoWorker.constants.RSA_PKCS1_PADDING
          }, 
          Buffer.from(encryptCodeBase64, 'base64')
        ).toString();
        if (decryptCode !== file_md5) {
          console.error("Error: public key dismath to private key!");
          process.exit(1);
        }

        // 获取AppData信息
        const appDataOriginJson = JSON.parse(fs.readFileSync("./src/appConfig/app_config.json"));

        // 组装AppData
        let targetAppData = {};
        targetAppData.AppName = appDataOriginJson.AppName;
        targetAppData.PublicKeys = [publicKeyDerText]; // 使用签名数组，支持后续追加签名
        targetAppData.EncryptCodes = [encryptCodeBase64]; // 同样使用数组，支持后续追加

        return JSON.stringify(targetAppData);
      }
      const  md5 = require('md5');
      stats.toJson({ all: false, assets: true })
           .assets.filter(asset => asset.name.startsWith('static/js') && asset.name.endsWith('js'))
           .map(asset => {
               const jsFile = path.join(buildFolder, asset.name);
               console.log("Updating " + jsFile);
               var jsvAppContents = fs.readFileSync(jsFile);
               const jsvAppMd5 = md5(jsvAppContents);
               let appDataInfo = "";
               if (asset.name.indexOf("main.jsv.") > 0) {
                 // 对main文件加入应用头信息
                 appDataInfo = prepareMainAppData(jsvAppMd5);

                 // 格式化jsvapp信息 /*jsvapp:内容长度:{内容}*/
                 const infoLen = appDataInfo.length;
                 appDataInfo = "/*jsvapp:" + infoLen + ":" + appDataInfo + "*/";
               }
               jsvAppContents = "/*jsvmd5:" + jsvAppMd5 + "*/" + appDataInfo + jsvAppContents;
               fs.writeFileSync(jsFile, jsvAppContents);
           });
    },
    err => {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
      if (tscCompileOnError) {
        console.log(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printBuildError(err);
      } else {
        console.log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
        process.exit(1);
      }
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  // We used to support resolving modules according to `NODE_PATH`.
  // This now has been deprecated in favor of jsconfig/tsconfig.json
  // This lets you use absolute paths in imports inside large monorepos:
  if (process.env.NODE_PATH) {
    console.log(
      chalk.yellow(
        'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
      )
    );
    console.log();
  }

  console.log('Creating an optimized production build...');

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage +=
            '\nCompileError: Begins at CSS selector ' +
            err['postcssNode'].selector;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
