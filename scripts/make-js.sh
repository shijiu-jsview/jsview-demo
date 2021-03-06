#!/bin/bash

set -o errexit
set -o nounset

print_usage()
{
	echo '
NAME
       make-js

SYNOPSIS
       make-js

DESCRIPTION
       build sample_with_button APK. auto setup code revision
       Example: ./make-js 
	   
OPTIONS
		--certpath=Path(from folder react_js) of certification, such as src/appConfig = react_js/src/appConfig/
			default value is src/appConfig
		-h, --help
                 Optional. Print help infomation and exit successfully.;
    ';
}

parse_options()
{
	cmd_getopt="getopt";
	if [ "$KERNEL_NAME" == "Darwin" ]; then
		cmd_getopt="/usr/local/Cellar/gnu-getopt/1.1.6/bin/getopt";
	fi

	options=`$cmd_getopt -o h \
			 --long "certpath:,help" \
			 -n 'make-js' -- "$@"`;
	eval set -- "$options"
	while true; do
		case "$1" in
			(-h | --help)
				print_usage;
				exit 0;
				;;
			(--certpath)
				CERT_PATH=$2;
				shift 2;
				;;
			(- | --)
				shift;
				break;
				;;
			(*)
				echo "Internal error!";
				exit 1;
				;;
		esac
	done
}

logdbg()
{
	if [[ $DEBUG_VERBOSE == false ]]; then
		return;
	fi

	echo -e " [d]: $@";
}

logtrace()
{
	echo -e "\033[1;34m [-]: $@ \033[00m";
}

loginfo()
{
	echo -e "\033[1;32m [+]: $@ \033[00m";
}

logwarn()
{
	echo -e "\033[1;33m [!]: $@ \033[00m";
}

logerr_and_exit()
{
	echo -e "\033[1;31m [x]: $@ \033[00m";
	exit 1;
}

trim() {
	local var="$*"
	var="${var#"${var%%[![:space:]]*}"}"   # remove leading whitespace characters
	var="${var%"${var##*[![:space:]]}"}"   # remove trailing whitespace characters
	echo -n "$var"
}

print_version_log()
{
	logtrace "*********************************************************";
	logtrace " Version infomation";
	logtrace "    codeRevision   : ${CODE_REVISION}";
	logtrace "*********************************************************";
}

prepare_env()
{
	CODE_REVISION="$(git rev-list --count HEAD)";
}

# common variable
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd);
PROJECT_DIR=$(dirname "$SCRIPT_DIR");
PROJECT_DIR=$(dirname "$PROJECT_DIR");
KERNEL_NAME=$(uname -s);
DEBUG_VERBOSE=false;
CERT_PATH=src/appConfig

# specific variable
CODE_REVISION=0;

main_run()
{
	loginfo "parsing options";
	parse_options $@;
	
	loginfo "prepare env";
	prepare_env;

	print_version_log;

	cd react_js;
	
	# ??????????????????
	if [ -f "package-lock.json-perfect" ]; then
		loginfo "USE package-lock.json-perfect"
		cp package-lock.json-perfect package-lock.json
	fi
	npm install
	cd jsview/
	node do_patch.js
	cd ../
		
	loginfo "CERT_PATH=${CERT_PATH}"
		
	# ??????crt???pem????????????
	cp ${CERT_PATH}/app_sign_private_key_sample.crt src/appConfig/app_sign_private_key.crt
	cp ${CERT_PATH}/app_sign_public_key_sample.pem src/appConfig/app_sign_public_key.pem
		
	# ??????JS
	npm run-script build

	# ?????????????????????
	local main_path=`find build | grep "main\..*\.js$"`
	echo "MAIN JS SUB_PATH: ${main_path}"

	# ?????? Core ????????????
	local core_revision=`cat jsview/dom/target_core_revision.js | grep "CoreRevision"`
	core_revision=${core_revision#*CoreRevision:}; # ????????????
	core_revision=${core_revision%,*}; # ?????????????????????
	echo "CORE REVISION: ${core_revision}"
	
	# ?????? engineJs ??????
	local engine_js=`cat jsview/dom/target_core_revision.js | grep "JsViewES6"`
	engine_js=${engine_js#*\"}; # ?????????????????????
	engine_js=${engine_js%\",*}; # ?????????????????????
	echo "ENGINE JS: ${engine_js}"
	
	loginfo "DONE !!!";
	loginfo "BUILD SUCCESSED";
}

main_run $@;
