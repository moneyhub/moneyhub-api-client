#!/bin/bash

red='\033[0;31m'
NC='\033[0m' # No Color

function hasOnlys {
  onlys=$(git diff --cached -G "(describe|it)\.(only|skip)" | grep "^+[^+]" | grep -E "(describe|it)\.(only|skip)")
  if [ $(echo $onlys | wc -c) -gt 1 ]
  then
    echo ""
    echo -e "${red}WARNING!!"
    echo -e "-----------------------${NC}"
    echo "You have '.only/.skip' calls in your tests:"
    echo ""
    echo $onlys
    echo ""
    echo "No commit made.  Please fix these errors then commit again."
    exit 1
  fi
}

function hasLogs {
  addedLogs=$(git diff -- src --cached -G "(console.log|debugger)" | grep "^+[^+]" | grep -E "(console.log|debugger)")
  if [ $(echo $addedLogs | wc -c) -gt 1 ]
  then
    echo ""
    echo -e "${red}WARNING!!"
    echo -e "-----------------------${NC}"
    echo "You have 'console.log' calls in your code:"
    echo ""
    echo $addedLogs
    echo ""
    echo "No commit made.  Please fix these errors then commit again."
    exit 1
  fi
}

echo git precommit:checking for omitted unit tests...
hasOnlys
echo git precommit:checking for console.logs...
hasLogs

exit 0
