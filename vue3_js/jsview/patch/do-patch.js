#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

function copyDirSync(workDir, src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if(fs.existsSync(dest) == false) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyDirSync(workDir,
                        path.join(src, childItemName),
                        path.join(dest, childItemName));
        });
    } else {
        console.info("  " + path.relative(workDir, src) + " -> " + path.relative(workDir, dest));
        fs.copyFileSync(src, dest);
    }
}

function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function installDepends(options) {
    console.info("\nPatching jsview from " + options.patchDir);
    copyDirSync(options.rootDir, options.patchDir + '/node_modules', options.rootDir + '/node_modules');

    console.info("\nCleanup node_modules cache... ");
    const nodeModuleCacheDir = options.rootDir + "/node_modules/.cache";
    if(!!fs.rmSync) {
        fs.rmSync(nodeModuleCacheDir, { recursive: true, force: true });
    } else {
		deleteFolderRecursive(nodeModuleCacheDir)
    }
}

async function printRevision(options) {
    const jsveiwVersionFile = options.jsviewDir + "/dom/target_core_revision.js";

    const jsviewTargetVersion = require(jsveiwVersionFile);

    console.log("**************************************************");
    console.log("* Update revision to:");
    console.log("* CORE: " + jsviewTargetVersion.CoreRevision);
    console.log("* ENGINE JS URL: " + jsviewTargetVersion.JseUrl);
    console.log("**************************************************");
}

function main() {
    const options = {
        patchDir: __dirname,
        jsviewDir: path.resolve(__dirname, '../'),
        rootDir: path.resolve(__dirname, '../../'),
    }

    installDepends(options);

    printRevision(options);
}
main()
