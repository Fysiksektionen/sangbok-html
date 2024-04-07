#!/usr/bin/env bash

##
## Help printout
##
if [[ $*\  == *--help\ * || $*\  == *-h\ * ]]; then
    echo -e "Användning: ./generate_mxl.sh [OPTION]..."
    echo -e "Konverterar .mscz-filer i mscz-mappen till MusicXML-filer, vilka lagras i mappen mxl/. Bör köras från music/-mappen."
    echo -e "\nFlaggor:"
    echo -e "\t--force\t\t\tTvinga omgenerering av existerande filer"
    echo -e "\t--force-on-change\tTvinga omgenerering av alla existerande filer om någon fil i /mscz/ har uppdateras"
    echo -e "\t--no-generate\t\tGenerera inga nya abc-filer"
    echo -e "\t--no-hash\t\tInkludera inte en checksum i filnamnet"
    echo -e "\t--no-json\t\tStrunta i att generera abcs.json"
    exit 0
fi

##
## Cleanup and directory creation
##
mkdir -p tmp abc
if [[ $*\  == *--force\ * || "$(sha1sum mscz/*.mscz | sort | sed -z '$ s/\n$//' | sha1sum | sed -z '$ s/\n$//')" != "$(cat mscz.sha1)" && $*\  == *--force-on-change\ * ]]; then
    echo -e "\e[1;32mGenererar från scratch.\e[0m"
    rm abc/*.abc
elif [[ "$(sha1sum mscz/*.mscz | sort | sed -z '$ s/\n$//' | sha1sum | sed -z '$ s/\n$//')" == "$(cat mscz.sha1)" && $*\  == *--force-on-change\ * ]]; then
    echo -e "\e[1;32mInga förändringar av noter har skett.\e[0m"
fi

##
## Generate svg:s
##
if [[ ! $*\  == *--no-generate\ * ]]; then
    echo -e "\e[1;32mGenererar MXL-filer:\e[0m"
    for path in mscz/*.mscz
    do
        # Pick a mscz file
        file=$(basename "$path")

        if [[ $*\  == *--no-hash\ * ]]; then
            echo -e " - \e[33m$file\e[0m"
            # Set hash to empty.
            csum=""
        else
            # Check if another file with the same checksum exists.
            # If it's found, use the old file.
            csum="."$(sha1sum "mscz/$file")
            if ls abc/*${csum:0:8}.abc > /dev/null 2>&1
            then
                echo -e " - \e[34m$file\e[30m (oförändrad)\e[0m"
                continue
            else
                # A file with the checksum was not found.
                # The sheet music is either new, or has changed.
                echo -e " - \e[33m$file\e[0m"
                # Attempt to remove any "old" files (not entirely foolproof)
                prefix=$(printf "%q" "${file//.mscz/}")
                eval "rm abc/${prefix}*.abc"
            fi
        fi

        # Clear old files in tmp dir.
        rm -f tmp/*.mscx

        # Extract the source file, so that we can modify the scale factor before rendering.
        # Note that the internal .mscx file does not neccessarily correspond to the .mscz file name if the .mscz has been renamed after saving.
        unzip -o "mscz/$file" *.mscx -d "tmp" || exit 3;
        
        for tmpfile in tmp/*.mscx # Find whatever the .mscx file is called (there should only be one).
        do
            # Prevent musescore from trying to open the above file if it's not 100% finished. Makes the script more stable.
            sleep 0.2
            # Generate xml files
            mscore3 --force --export-to "tmp/${file//.mscz/}.xml" "${tmpfile//mscz/mscx}" || exit 1;
            python3 xml2abc.py "tmp/${file//.mscz/}.xml" > "abc/${file//.mscz/}${csum:0:8}.abc" || exit 2;
        done
    done
fi

# Cleanup
rm -rf tmp

##
## Generate abcs.json (a list of all available sheet music files)
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
fi


# Only update the hash if we generated from scratch
if [[ $*\  == *--force\ * ||  "$(sha1sum mscz/*.mscz | sort | sed -z '$ s/\n$//' | sha1sum | sed -z '$ s/\n$//')" != "$(cat mscz.sha1)" && $*\  == *--force-on-change\ * ]]; then
    echo -e "\e[1;32mUppdaterar hash.\e[0m"
    sha1sum mscz/*.mscz | sort | sed -z '$ s/\n$//' | sha1sum | sed -z '$ s/\n$//' > mscz.sha1
fi