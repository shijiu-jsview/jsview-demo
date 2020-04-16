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
	   
    ';
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

main_run()
{
	loginfo "prepare env";
	prepare_env;

	print_version_log;

	cd react_js;
	
	# 更新环境状态
	npm install
	cd patch_package
	./update.sh
	cd ..
		
	# 编译JS
	npm run-script build

	# 输出主文件路径
	local main_path=`find build | grep "main\..*\.js$"`
	echo "MAIN JS SUB_PATH: ${main_path}"
	
	loginfo "DONE !!!";
	loginfo "BUILD SUCCESSED";
}

main_run $@;
