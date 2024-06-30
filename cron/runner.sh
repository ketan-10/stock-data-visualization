#!/bin/bash

#180524  https://stackoverflow.com/questions/15032734/append-to-the-top-of-a-large-file-bash

# curl -A(agent) -L(follow-redirects) | funzip(unzip and pipe result) | tail -n +2 (eat 1st line)| while every line do
curl -A "Chrome/91.0.4472.124" -L "https://www.bseindia.com/download/BhavCopy/Equity/EQ$1_CSV.ZIP" | funzip | tail -n +2 | while IFS= read -r line; do
    IFS=',' read -r -a array <<< "${line%$'\r'}" # split by comma, add to array, remove \r crlf

    if [ -f "output/${array[0]}.csv" ]; then
        # print empty line, -n (to skip empty line at end) skip first 2 columns and print by adding comma back,
        echo $(IFS=, ; echo "$1,${array[*]:2}") >> output/${array[0]}.csv
    fi
done;

# remove last empty line of file ::=>  `` perl -i -pe 'BEGIN { $/ = undef } s/\n\z//' "$file" `` . <- then replace \n with \r