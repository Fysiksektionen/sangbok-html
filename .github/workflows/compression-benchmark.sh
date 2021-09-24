#!/usr/bin/env bash

main () {
    rm -f svg/*$3
    mkdir -p deflate/$4
    start=`date +%s.%N`
    for file in svg/*.svg; do
        $1 "$file" --keep $2
    done
    end=`date +%s.%N`
    t=$( echo "$end - $start" | bc -l )
    mv svg/*$3 deflate/$4
    space=$(du -s deflate/$4 | sed 's/[^0-9][0-9]*//g')
    echo -e "${t:0:5}s\t${space}kb\t$5\e[0m"
}

QUALITIES=(1 5 9)

getResults () {
    mkdir -p deflate
    rm -rf deflate/*

    echo -e "Time\tSize\tAlgorithm"
    
    for q in "${QUALITIES[@]}"
    do
        main "brotli" "-q $q" ".br" "br-$q" "\e[35mBrotli q$q" # Brotli also has a -q 11 setting.
        main "gzip" "-$q" ".gz" "gzip-$q" "\e[32mGZip q$q"
        main "bzip2" "-$q" ".bz2" "bzip2-$q" "\e[34mBZip2 q$q"
        main "lzma" "-$q" ".lzma" "lzma-$q" "\e[36mLZMA q$q"
    done
}

getResults | sort -g