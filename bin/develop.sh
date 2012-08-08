#!/bin/bash
DIR=$(dirname $0)
cd $DIR/..

COMMAND="npm start"

function watch {
    while true; do
        inotifywait \
            --timeout 1 \
            --recursive \
            --event modify \
            --event create \
            --event delete \
            --event move \
            routes app.js middleware.js

        if [[ "0" == $? ]]; then
            pkill -f "${COMMAND}"
        fi
    done
}

coproc watch 2>&1
WPID=$!
function cleanup {
    kill $WPID > /dev/null 2>&1
    wait
    exit
}

trap cleanup INT EXIT TERM

while true; do
    echo test
    npm test
    echo run
    $COMMAND
    sleep 1
done
