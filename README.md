# Expose
Dead simple static site generator for photo/editorial mix content, exactly like my personal site at www.jack.ventures

Note: this is 3 bash scripts I wrote over a weekend for personal use, expect hacks
Note 2: these scripts were written on a mac, mileage may vary for other environments

how to use:

1. /japan-2014/resize.sh uses imagemagick (a dependency) to resize each photo into common resolutions

2. generate.sh to generate the html page and put in japan-2014

3. copy.sh to copy the whole thing to /generated-site

4. post contents to Amazon S3 or other static host

content management:

1. store photos in folders named 01, 02, etc..

2. put photo in the folder, name it full.jpg

3. put a text file in the folder, name it post.txt

4. see example files for post.txt formatting. It's just markdown.