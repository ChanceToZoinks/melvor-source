url="https://melvoridle.com/"
dumped="./dumped"
built="$dumped/melvoridle.com/raw/assets/js/built"
outdir="./src"

echo "Dumping contents of '$url' into '$dumped'..."
webdumper -u $url -o $dumped

num_downloaded=$(ls $built | wc -l)

echo "Trimming '?number' at end of file names..."
for file in $built/*.js\?* ; do
    mv "$file" "${file%%\?*}"
done

echo "Moving updated files from '$built' to '$outdir'..."
mkdir --parents $outdir ; mv $built/* -t $outdir

num_final=$(ls $outdir | wc -l)
echo "Number of files downloaded: $num_downloaded"
echo "Number of files in $outdir:  $num_final"

echo "Cleaning up..."
rm -rf $dumped

if [ $num_downloaded -eq $num_final ]; then
    echo -e '\033[0;32mDownload and transfer was successful.\033[0m'
    exit 0
else
    echo -e '\033[0;31mDownload and transfer failed!\033[0m'
    exit 1
fi;
