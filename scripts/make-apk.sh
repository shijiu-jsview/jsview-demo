#!/bin/bash

set -o errexit
set -o nounset

print_usage()
{
	echo '
NAME
       make-apk

SYNOPSIS
       make-apk

DESCRIPTION
       build sample_with_button APK. auto setup code revision
       Example: ./make-apk 

OPTIONS
		--appurl=URL of APP js, such as http://192.168.0.32:3000/static/js/bundle.js
		
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
			 --long "appurl:,help" \
			 -n 'make-apk' -- "$@"`;
	eval set -- "$options"
	while true; do
		case "$1" in
			(-h | --help)
				print_usage;
				exit 0;
				;;
			(--appurl)
				APP_URL=$2;
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
	
	if [[ $APP_URL == "NO_SET" ]]; then
		logerr_and_exit "ERROR: No app url set..."
	fi
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

# specific variable
CODE_REVISION=0;
APP_URL="NO_SET";

main_run()
{
	loginfo "parsing options";
	parse_options $@;

	loginfo "prepare env";
	prepare_env;

	print_version_log;

	cd "java_app";
		
	# 编译APK
	./gradlew :sample_with_button:assembleRelease -PCustomConfig_AppUrl=${APP_URL}
	
	# 拷贝文件
	cp ./sample_with_button/build/outputs/apk/release/sample_with_button-release.apk ./main_app_${CODE_REVISION}.apk
	
	loginfo "DONE !!!";
	loginfo "BUILD SUCCESSED";
}

main_run $@;
