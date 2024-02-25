#!/usr/bin/env bash

##
## Help printout
##
if [[ $*\  == *--help\ * || $*\  == *-h\ * ]]; then
    echo -e "Användning: ./generate_mxl.sh [OPTION]..."
    echo -e "Konverterar .mscz-filer i mscz-mappen till MusicXML-filer, vilka lagras i mappen mxl/. Bör köras från music/-mappen."
    echo -e "\nFlaggor:"
fi

##
## Generate svg:s
##
if [[ ! $*\  == *--no-generate\ * ]]; then
    echo -e "\e[1;32mGenererar MXL-filer:\e[0m"
    for path in mscz/*.mscz
    do
        file=$(basename "$path")
        echo -e " - \e[34m$file\e[0m"

        # Clear old files in tmp dir.
        rm tmp/*.mscx

        # Extract the source file, so that we can modify the scale factor before rendering.
        # Note that the internal .mscx file does not neccessarily correspond to the .mscz file name if the .mscz has been renamed after saving.
        unzip -o "mscz/$file" *.mscx -d "tmp" || exit 3;

        
        sf=1;
        if [[ $*\  == *--no-hash\ * ]]; then
            # Set hash to empty.
            csum=""
        else
            # Check if another file with the same checksum exists.
            # If it's found, use the old file.
            csum="."$(sha1sum "mscz/$file")
            if ls svg/*${csum:0:8}-sf$sf-*.svg > /dev/null 2>&1
            then
                continue
            fi
        fi
        
        for tmpfile in tmp/*.mscx # Find whatever the .mscx file is called (there should only be one).
        do
            # Prevent musescore from trying to open the above file if it's not 100% finished. Makes the script more stable.
            sleep 0.2
            # Generate xml files
            mscore3 --force --export-to "xml/${file//.mscz/}.xml" "tmp/${file//mscz/tmp.mscx}" || exit 1;
            python3 xml2abc.py "xml/${file//.mscz/}.xml" > "abc/${file//.mscz/}.abc" || exit 2;
        done
    done
fi

# Cleanup
rm -rf tmp

##
## Generate svgs.json (a list of all available svg sheet music files)
##
if [[ ! $*\  == *--no-json\ * ]]; then
    echo -e "\e[1;32mGenererar abcs.json\e[0m"
    cd abc
    abcs="["
    for file in *.abc
    do
        abcs="$abcs\"$file\","
    done
    abcs="${abcs%?}]"
    cd ..
    echo $abcs > abcs.json
    cp abcs.json ../src/assets/abcs.json
fi