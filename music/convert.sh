export QT_QPA_PLATFORM=offscreen

SCALE_FACTORS=(1 2 3 4)
FORMATS=("svg") # eg. ("svg" "pdf")

for path in mscz/*.mscz
do
    file=$(basename "$path")
    echo -e "\e[35mBearbetar fil:\e[0m $file"
    # Extract the source file, so that we can modift the scale factor before rendering.
    unzip -o "mscz/$file" "${file//mscz/mscx}" -d "tmp"

    for sf in "${SCALE_FACTORS[@]}"
    do
        for f in "${FORMATS[@]}"
        do
            mkdir -p $f
            sed -e "s/<Spatium>[0-9]\.[0-9]*<\/Spatium>/<Spatium>$sf<\/Spatium>/g" "tmp/${file//mscz/mscx}" > "tmp/${file//mscz/tmp.mscx}"
            mscore3 --export-to "$f/${file//.mscz/}.$sf.$f" "tmp/${file//mscz/tmp.mscx}" --force
        done
    done
done

rm -rf tmp