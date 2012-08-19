#!/bin/sh

curl -G --data-urlencode "title=$1" --data-urlencode "text=$2" localhost:3000/ok-msgbox
