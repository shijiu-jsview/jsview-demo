#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

function getOptInfos() {
    const optInfos = {
        'help': {
            alias: 'h',
            required: false,
            usage: 'Print help infomation and exit successfully.',
        },
        //'dump': {
            //default: 3
        //}
    };

    return optInfos;
}

function printUsage () {
    var scriptName = path.basename(__filename);

    console.log(
        `
NAME
       ${scriptName}

SYNOPSIS
       ${scriptName} [options]

DESCRIPTION
       initialize or update JsView develop environment.
       Example: ${scriptName}

OPTIONS`
    );

    const optInfos = getOptInfos();
    Object.keys(optInfos).forEach(key => {
        info = optInfos[key];
        let usage = '       ';
        usage += (!!info.alias ? '-' + info.alias + ',' : '   ');
        usage += (' --' + key);
        usage += (!!info.desc ? '=' + info.desc : '');
        console.log(usage);

        usage = '               ';
        usage += (!!info.required ? 'Required. ' : 'Optional. ');
        usage += (!!info.usage ? info.usage : '');
        console.log(usage);
    });

}

function parseOptions(argv) {
    const scriptDir = __dirname;
    const minimist = minimist_method;

    const minimistOpts = {
        alias: { },
        default: { },
    }
    const optInfos = getOptInfos();
    Object.keys(optInfos).forEach(key => {
        info = optInfos[key];
        if(!!info.alias) {
            minimistOpts.alias[key] = info.alias;
        }
        if(!!info.default) {
            minimistOpts.default[key] = info.default;
        }
    });
    const options = minimist(argv.slice(2), minimistOpts);

    if(!!options.help) {
        printUsage();
        process.exit(0);
    }

    Object.keys(optInfos).forEach(key => {
        info = optInfos[key];
        if(!!info.required
        && typeof options[key] === 'undefined') {
            let opt = (!!info.alias ? '-' + info.alias + '/' : '');
            opt += ('--' + key);
            console.error(opt + ' option is required, please input -h to print usage.');
            process.exit(1);
        }
    })

    //console.log(options);
    return options;
}

function configEnv(options) {
    options.env = { };
    options.env.scriptDir = path.resolve(__dirname);
    options.env.devJsDir = options.env.scriptDir + '/../';
    options.env.jsviewDir = options.env.devJsDir + '/jsview';
    const devJsName = path.basename(options.env.devJsDir);
    if(devJsName.indexOf('react') >= 0) {
        options.env.devFramework = 'react';
    } else if(devJsName.indexOf('vue3') >= 0) {
        options.env.devFramework = 'vue3';
    }
}

function checkOptionValue(options) {

}

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

function installDepends(options) {
    process.chdir(options.env.devJsDir);
    console.info("\nUpdating react js at " + __dirname);

	// react/vue3?????????dom
    const jsviewDomPath = options.env.jsviewDir + "/dom/bin/jsview-dom-package.tgz";
	
	// react?????????widget
	const jsviewReactWidgetPath = options.env.jsviewDir + "/utils/JsViewEngineWidget/bin/jsview-react-widget-package.tgz";

	// ??????dom???widget
    cmdLine = "npm install file:" + jsviewDomPath + " file:" + jsviewReactWidgetPath;
    console.info("\nRunning [" + cmdLine + "]... ");
    execSync(cmdLine, {stdio: 'inherit', stderr: 'inherit'});

    const jsviewPatchDir = options.env.jsviewDir + '/patch';
    console.info("\nPatching react js from " + jsviewPatchDir);
    copyDirSync(options.env.devJsDir, jsviewPatchDir, options.env.devJsDir + '/node_modules');

    console.info("\nCleanup node_modules cache... ");
    const nodeModuleCacheDir = options.env.devJsDir + "/node_modules/.cache";
    if(!!fs.rmSync) {
        fs.rmSync(nodeModuleCacheDir, { recursive: true, force: true });
    } else {
		deleteFolderRecursive(nodeModuleCacheDir)
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
async function printRevision(options) {
    const jsveiwVersionFile = options.env.jsviewDir + "/dom/target_core_revision.js";

    const jsviewTargetVersion = require(jsveiwVersionFile);

    console.log("**************************************************");
    console.log("* Update revision to:");
    console.log("* CORE: " + jsviewTargetVersion.CoreRevision);
    console.log("* ENGINE JS URL: " + jsviewTargetVersion.JseUrl);
    console.log("**************************************************");
}

function main() {
    const options = parseOptions(process.argv);

    configEnv(options);

    checkOptionValue(options);

    installDepends(options);

    printRevision(options);

    console.log("Done!!!");
}

/**********************************
/* Library of minimist
/*********************************/

var minimist_method;
{
	minimist_method = function (args, opts) {
		if (!opts) opts = {};
		
		var flags = { bools : {}, strings : {}, unknownFn: null };

		if (typeof opts['unknown'] === 'function') {
			flags.unknownFn = opts['unknown'];
		}

		if (typeof opts['boolean'] === 'boolean' && opts['boolean']) {
		  flags.allBools = true;
		} else {
		  [].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
			  flags.bools[key] = true;
		  });
		}
		
		var aliases = {};
		Object.keys(opts.alias || {}).forEach(function (key) {
			aliases[key] = [].concat(opts.alias[key]);
			aliases[key].forEach(function (x) {
				aliases[x] = [key].concat(aliases[key].filter(function (y) {
					return x !== y;
				}));
			});
		});

		[].concat(opts.string).filter(Boolean).forEach(function (key) {
			flags.strings[key] = true;
			if (aliases[key]) {
				flags.strings[aliases[key]] = true;
			}
		 });

		var defaults = opts['default'] || {};
		
		var argv = { _ : [] };
		Object.keys(flags.bools).forEach(function (key) {
			setArg(key, defaults[key] === undefined ? false : defaults[key]);
		});
		
		var notFlags = [];

		if (args.indexOf('--') !== -1) {
			notFlags = args.slice(args.indexOf('--')+1);
			args = args.slice(0, args.indexOf('--'));
		}

		function argDefined(key, arg) {
			return (flags.allBools && /^--[^=]+$/.test(arg)) ||
				flags.strings[key] || flags.bools[key] || aliases[key];
		}

		function setArg (key, val, arg) {
			if (arg && flags.unknownFn && !argDefined(key, arg)) {
				if (flags.unknownFn(arg) === false) return;
			}

			var value = !flags.strings[key] && isNumber(val)
				? Number(val) : val
			;
			setKey(argv, key.split('.'), value);
			
			(aliases[key] || []).forEach(function (x) {
				setKey(argv, x.split('.'), value);
			});
		}

		function setKey (obj, keys, value) {
			var o = obj;
			for (var i = 0; i < keys.length-1; i++) {
				var key = keys[i];
				if (key === '__proto__') return;
				if (o[key] === undefined) o[key] = {};
				if (o[key] === Object.prototype || o[key] === Number.prototype
					|| o[key] === String.prototype) o[key] = {};
				if (o[key] === Array.prototype) o[key] = [];
				o = o[key];
			}

			var key = keys[keys.length - 1];
			if (key === '__proto__') return;
			if (o === Object.prototype || o === Number.prototype
				|| o === String.prototype) o = {};
			if (o === Array.prototype) o = [];
			if (o[key] === undefined || flags.bools[key] || typeof o[key] === 'boolean') {
				o[key] = value;
			}
			else if (Array.isArray(o[key])) {
				o[key].push(value);
			}
			else {
				o[key] = [ o[key], value ];
			}
		}
		
		function aliasIsBoolean(key) {
		  return aliases[key].some(function (x) {
			  return flags.bools[x];
		  });
		}

		for (var i = 0; i < args.length; i++) {
			var arg = args[i];
			
			if (/^--.+=/.test(arg)) {
				// Using [\s\S] instead of . because js doesn't support the
				// 'dotall' regex modifier. See:
				// http://stackoverflow.com/a/1068308/13216
				var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
				var key = m[1];
				var value = m[2];
				if (flags.bools[key]) {
					value = value !== 'false';
				}
				setArg(key, value, arg);
			}
			else if (/^--no-.+/.test(arg)) {
				var key = arg.match(/^--no-(.+)/)[1];
				setArg(key, false, arg);
			}
			else if (/^--.+/.test(arg)) {
				var key = arg.match(/^--(.+)/)[1];
				var next = args[i + 1];
				if (next !== undefined && !/^-/.test(next)
				&& !flags.bools[key]
				&& !flags.allBools
				&& (aliases[key] ? !aliasIsBoolean(key) : true)) {
					setArg(key, next, arg);
					i++;
				}
				else if (/^(true|false)$/.test(next)) {
					setArg(key, next === 'true', arg);
					i++;
				}
				else {
					setArg(key, flags.strings[key] ? '' : true, arg);
				}
			}
			else if (/^-[^-]+/.test(arg)) {
				var letters = arg.slice(1,-1).split('');
				
				var broken = false;
				for (var j = 0; j < letters.length; j++) {
					var next = arg.slice(j+2);
					
					if (next === '-') {
						setArg(letters[j], next, arg)
						continue;
					}
					
					if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
						setArg(letters[j], next.split('=')[1], arg);
						broken = true;
						break;
					}
					
					if (/[A-Za-z]/.test(letters[j])
					&& /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
						setArg(letters[j], next, arg);
						broken = true;
						break;
					}
					
					if (letters[j+1] && letters[j+1].match(/\W/)) {
						setArg(letters[j], arg.slice(j+2), arg);
						broken = true;
						break;
					}
					else {
						setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
					}
				}
				
				var key = arg.slice(-1)[0];
				if (!broken && key !== '-') {
					if (args[i+1] && !/^(-|--)[^-]/.test(args[i+1])
					&& !flags.bools[key]
					&& (aliases[key] ? !aliasIsBoolean(key) : true)) {
						setArg(key, args[i+1], arg);
						i++;
					}
					else if (args[i+1] && /^(true|false)$/.test(args[i+1])) {
						setArg(key, args[i+1] === 'true', arg);
						i++;
					}
					else {
						setArg(key, flags.strings[key] ? '' : true, arg);
					}
				}
			}
			else {
				if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
					argv._.push(
						flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
					);
				}
				if (opts.stopEarly) {
					argv._.push.apply(argv._, args.slice(i + 1));
					break;
				}
			}
		}
		
		Object.keys(defaults).forEach(function (key) {
			if (!hasKey(argv, key.split('.'))) {
				setKey(argv, key.split('.'), defaults[key]);
				
				(aliases[key] || []).forEach(function (x) {
					setKey(argv, x.split('.'), defaults[key]);
				});
			}
		});
		
		if (opts['--']) {
			argv['--'] = new Array();
			notFlags.forEach(function(key) {
				argv['--'].push(key);
			});
		}
		else {
			notFlags.forEach(function(key) {
				argv._.push(key);
			});
		}

		return argv;
	};

	function hasKey (obj, keys) {
		var o = obj;
		keys.slice(0,-1).forEach(function (key) {
			o = (o[key] || {});
		});

		var key = keys[keys.length - 1];
		return key in o;
	}

	function isNumber (x) {
		if (typeof x === 'number') return true;
		if (/^0x[0-9a-f]+$/i.test(x)) return true;
		return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
	}
}

main()
