for dir in */
do
	if [ -f "$dir"full.jpg ]
	then
		echo $dir
		convert -size 3840x3840 "$dir"full.jpg -resize 3840x3840 -quality 90 +profile '*' "$dir"3840.jpg
		convert -size 2560x2560 "$dir"full.jpg -resize 2560x2560 -quality 90 +profile '*' "$dir"2560.jpg
		convert -size 1920x1920 "$dir"full.jpg -resize 1920x1920 -quality 90 +profile '*' "$dir"1920.jpg
		convert -size 1280x1280 "$dir"full.jpg -resize 1280x1280 -quality 90 +profile '*' "$dir"1280.jpg
		convert -size 1024x1024 "$dir"full.jpg -resize 1024x1024 -quality 90 +profile '*' "$dir"1024.jpg
	fi
	#convert -size 120x120 full.jpg -resize 120x120 -quality 98 +profile '*' test.jpg
done