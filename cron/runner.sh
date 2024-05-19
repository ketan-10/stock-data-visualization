#!/bin/bash

#180524  https://stackoverflow.com/questions/15032734/append-to-the-top-of-a-large-file-bash

# curl -A(agent) -L(follow-redirects) | funzip(unzip and pipe result) | tail -n +2 (eat 1st line)| while every line do
curl -A "Chrome/91.0.4472.124" -L "https://www.bseindia.com/download/BhavCopy/Equity/EQ$1_CSV.ZIP" | funzip | tail -n +2 | while IFS= read -r line; do
    IFS=',' read -r -a array <<< "$line" # split by comma
    touch output/${array[0]}.txt # create file if not exits
    # skip first 2 columns and print by adding comma back } append to file to start
    printf "%s," "$1,${array[@]:2}" | sed 's/,$/\n/' | cat - "output/${array[0]}.txt" > temp && mv temp "output/${array[0]}.txt"
done;

