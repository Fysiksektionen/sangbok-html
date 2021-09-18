cd svg
for file in *.svg
do
    echo -e "\e[35mKomprimerar\e[0m $file."
    svgo -i "$file" || echo -e "\e[31mKomprimering misslyckades\e[0m för $file."
done
cd ..