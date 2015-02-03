
dir[0]='japan-2014'
dir[1]='hongkong-2014'

title[0]='Japan'
title[1]='Hong Kong'

year[0]='2014'
year[1]='2014'

topdir=$(pwd)

template=$(cat template.txt)
post_template=$(cat post-template.txt)

pageindex=0


for d in "${dir[@]}"
do
   :
	output=""
	marker=""
	
	#count number of dirs
	dircount=0
	for subdir in "$d"/*
	do
		dirname=$(echo $subdir | awk -F'/' '{print $2}' | sed 's/0*//')
		re='^[0-9]+$'
		if [[ $dirname =~ $re ]] # only process numerical directories
		then
			((dircount++))
	  fi
  done

   # build html file in this directory
  index=1
	for subdir in "$d"/*
	do
		dirname=$(echo $subdir | awk -F'/' '{print $2}' | sed 's/0*//')
		re='^[0-9]+$'
		if [[ $dirname =~ $re ]] # only process numerical directories
		then
			echo $dirname
			meta=""
			content=""
		
			if [ -f "$subdir"/post.txt ]
			then
			
				meta=$(cat "$subdir"/post.txt | sed "s/---/|/g"| awk -F':' 'BEGIN{RS="|"} FNR==2 {print $0}')
				content=$(cat "$subdir"/post.txt | sed "s/---/|/g"| awk -F':' 'BEGIN{RS="|"} FNR==3 {print $0}' | tr -d '\n' | sed "s/\"/\\\"/g") # need to remove new lines, escape quotes
			fi
			
			# default text position/colors
		    top="15"
			left="15"
			width="85"
			height="85"
			
			color1="#000000"
			color2="#000000"
			color3="#888888"
			color4="#aaaaaa"
			color5="#cccccc"
			color6="#dddddd"
			color7="#ffffff"
			
			datamaxresolution="1920"
			
			top=$(echo "$meta" | awk -F':' '/top/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			left=$(echo "$meta" | awk -F':' '/left/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			width=$(echo "$meta" | awk -F':' '/width/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			height=$(echo "$meta" | awk -F':' '/height/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
		
			color1=$(echo "$meta" | awk -F':' '/color1/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			color2=$(echo "$meta" | awk -F':' '/color2/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			color3=$(echo "$meta" | awk -F':' '/color3/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			color4=$(echo "$meta" | awk -F':' '/color4/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
			color5=$(echo "$meta" | awk -F':' '/color5/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
		    color6=$(echo "$meta" | awk -F':' '/color6/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
		    color7=$(echo "$meta" | awk -F':' '/color7/ {if(b) exit; else b=1; print $2}' | tr -d ' ')
		
		  polygon=$(echo "$meta" | awk -F':' '/polygon/ {if(b) exit; else b=1; print $2}')
		  if [ ! -z "$polygon" ]
			then
				# convert to json
				polygon=$(echo $polygon | awk -F' ' 'BEGIN{RS=","} {print "{\"x\":"$1, ",\"y\":"$2"},"}' | sed '$s/,$//')
				polygon=$(echo " data-polygon='[$polygon]'")
				echo $polygon
		  fi
		
			if [ -f "$subdir"/1024.jpg ]
			then
			  palette=$(convert ""$subdir"/1024.jpg" -depth 3 +dither -colors 7 -unique-colors txt:- | tail -n +2 | awk 'BEGIN{RS=" "} /#/ {print}')
			  c1=$(echo $palette | awk -F' ' '{print $1}')
			  c2=$(echo $palette | awk -F' ' '{print $2}')
			  c3=$(echo $palette | awk -F' ' '{print $3}')
			  c4=$(echo $palette | awk -F' ' '{print $4}')
			  c5=$(echo $palette | awk -F' ' '{print $5}')
			  c6=$(echo $palette | awk -F' ' '{print $6}')
			  c7=$(echo $palette | awk -F' ' '{print $7}')
					
			  : ${color1:="$c1"}
			  : ${color2:="$c2"}
			  : ${color3:="$c3"}
			  : ${color4:="$c4"}
			  : ${color5:="$c5"}
			  : ${color6:="$c6"}
			  : ${color7:="$c7"}
			fi
		
			: ${top:="15"}
			: ${left:="15"}
			: ${width:="85"}
			: ${height:="85"}
			
			: ${color1:="#000000"}
			: ${color2:="#000000"}
			: ${color3:="#888888"}
			: ${color4:="#aaaaaa"}
			: ${color5:="#cccccc"}
			: ${color6:="#dddddd"}
			: ${color7:="#ffffff"}
			
			: ${datamaxresolution:="1920"}
		  
			post=$(echo $post_template | sed "s/{{post}}/$(echo $content | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g") # content needs to be escaped before it can be used as a replacement pattern in sed
			post=$(echo $post | sed "s/{{index}}/$index/g")
			post=$(echo $post | sed "s/{{top}}/$top/g")
			post=$(echo $post | sed "s/{{left}}/$left/g")
			post=$(echo $post | sed "s/{{width}}/$width/g")
			post=$(echo $post | sed "s/{{height}}/$height/g")
		
			post=$(echo $post | sed "s/{{datacolor1}}/$color1/g")
			post=$(echo $post | sed "s/{{datacolor2}}/$color2/g")
			post=$(echo $post | sed "s/{{datacolor3}}/$color3/g")
			post=$(echo $post | sed "s/{{datacolor4}}/$color4/g")
			post=$(echo $post | sed "s/{{datacolor5}}/$color5/g")
			post=$(echo $post | sed "s/{{datacolor6}}/$color6/g")
			post=$(echo $post | sed "s/{{datacolor7}}/$color7/g")
			
			post=$(echo $post | sed "s/{{datapolygon}}/$(echo $polygon | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g")
		
			# split between video and image
	
			if [ -f "$subdir"/full.jpg ]
			then
				dataheight=$(identify -format "%h" "$subdir"/full.jpg)
				datawidth=$(identify -format "%w" "$subdir"/full.jpg)
						
				image="<img class=\"image blank\" src=\"//:0\" onload=\" \$(this).removeAttr('style')\" />"
			else
				# video will always have 16:9 hd aspect ratio
				dataheight=1080
				datawidth=1920
						
				image="<video class=\"image $active\" src=\"//:0\" alt=\"\" type=\"video/mp4\" autoplay=\"autoplay\" loop=\"loop\" preload=\"auto\" />"
		  fi
	
			# largest numerical file name in directory
			datamaxresolution=$(ls "$subdir"/* | xargs -n1 basename | grep -E '^[0-9]+\....$' | sort -n | tail -n 1 | sed 's/\..\{3\}$//')
		
			: ${datamaxresolution:="1920"}
		
			post=$(echo $post | sed "s/{{datamaxresolution}}/$datamaxresolution/g")
			post=$(echo $post | sed "s/{{dataheight}}/$dataheight/g")
			post=$(echo $post | sed "s/{{datawidth}}/$datawidth/g")
			post=$(echo $post | sed "s/{{image}}/$(echo $image | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g")
		  
		  # marker on left side of page
		  mheight=$(echo "scale=3; 100/$dircount" | bc)
		  m="<li style=\"background-color: $color1; height: $mheight%\"><a href=\"#$index\" style=\"background-color: $color6\"></a></li>"

			((index++))
			output=$(echo $output $post)
			marker=$(echo $marker $m)
		  
			# create zip files
			
			padded_num=$(echo $subdir | awk -F'/' '{print $2}')
			
			if [ ! -f "$subdir"/"${dir[$pageindex]}-$padded_num".zip ]
			then
				
			  if [ -f "$subdir"/full.jpg ]
			  then
					cd "$subdir" # zip only works with current dir? wtf
					mkdir "${dir[$pageindex]}-$padded_num"
					cp "$topdir"/readme.txt "${dir[$pageindex]}-$padded_num"/readme.txt
					cp full.jpg "${dir[$pageindex]}-$padded_num"/"${dir[$pageindex]}-$padded_num".jpg
					zip -r "${dir[$pageindex]}-$padded_num".zip "${dir[$pageindex]}-$padded_num"
					rm -rf "${dir[$pageindex]}-$padded_num"
					cd "$topdir"
			  fi
	
			  if [ -f "$subdir/$datamaxresolution".mp4 ]
				then
					cd "$subdir" # zip only works with current dir? wtf
					mkdir "${dir[$pageindex]}-$padded_num"
					cp "$topdir"/readme.txt "${dir[$pageindex]}-$padded_num"/readme.txt
					cp "$datamaxresolution".mp4 "${dir[$pageindex]}-$padded_num"/"${dir[$pageindex]}-$padded_num".mp4
					zip -r "${dir[$pageindex]}-$padded_num".zip "${dir[$pageindex]}-$padded_num"
					rm -rf "${dir[$pageindex]}-$padded_num"
					cd "$topdir"
			  fi
		  fi
	  fi
	done
	
	#write html file
	html=$(echo $template | sed "s/{{content}}/$(echo $output | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g")
	html=$(echo $html | sed "s/{{marker}}/$(echo $marker | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g")
	
	#title
	t=$(echo ${title[$pageindex]} ${year[$pageindex]})
	html=$(echo $html | sed "s/{{title}}/$t/g")
	
	# directory variable
	html=$(echo $html | sed "s/{{dirname}}/${dir[$pageindex]}/g")

	#navigation
	navigation=""
	pindex=0
	for n in "${dir[@]}"
	do
		if [ "$pindex" -eq "$pageindex" ]
		then
		  li=$(echo "<li class=\"active\">")
		else
			li=$(echo "<li>")
	  fi
	  li=$(echo $li "<a href=\"/$n\"><span class=\"year\">${year[$pindex]}</span> ${title[$pindex]}</a></li>")
		navigation=$(echo $li $navigation)
		((pindex++))
	done
	
	html=$(echo $html | sed "s/{{navigation}}/$(echo $navigation | sed -e 's/\\/\\\\/g' -e 's/\//\\\//g' -e 's/&/\\\&/g')/g")
	
	echo $html > "$d"/index.html
	
	((pageindex++))
done

