rsync -a --exclude 'generated-site/' --exclude '/*/*/*/***' --exclude 'full.jpg' --include '*/' --include '*.jpg' --include '*.zip'  --include '*.mp4' --include '*.html' --include '*.css' --include '*.js' --include '*.png' --include '*.eot' --include '*.svg' --include '*.ttf' --include '*.woff' --exclude '*' ./ ./generated-site/