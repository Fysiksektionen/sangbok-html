export QT_QPA_PLATFORM=offscreen

SCALE_FACTORS=(1 1.25 1.5 1.75 2 3 4)

mkdir -p svg


for path in mscz/*.mscz
do
    file=$(basename "$path")
    echo -e "\e[35mBearbetar fil:\e[0m $file"
    # Extract the source file, so that we can modift the scale factor before rendering.
    unzip -o "mscz/$file" "${file//mscz/mscx}" -d "tmp"

    for sf in "${SCALE_FACTORS[@]}"
    do
        sed -e "s/<Spatium>[0-9]\.[0-9]*<\/Spatium>/<Spatium>$sf<\/Spatium>/g" "tmp/${file//mscz/mscx}" > "tmp/${file//mscz/tmp.mscx}"
        mscore3 --export-to "svg/${file//.mscz/}-sf$sf.svg" "tmp/${file//mscz/tmp.mscx}" --force --trim-image 140
    done
done

cd svg
svgs="["
for file in *.svg
do
    svgs="$svgs\"$file\","
done
svgs="${svgs%?}]"

cd ..
echo $svgs > svgs.json
rm -rf tmp