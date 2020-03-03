#!/bin/bash


function divcoord(){
IFS='/'
read -ra ADDR <<< "$1"
a=${ADDR[0]}
b=${ADDR[1]}
if [[ $b == "1" ]];then
  echo $a
else
  echo "scale=4; $a/$b"|bc
fi
}

function get_coord(){
chars[0]='°'
chars[1]="\'"
chars[2]='"'
IFS=', '
n=0
ret=""
read -ra ADDR <<< "$1"
for i in "${ADDR[@]}"; do
    ret=$ret$(divcoord "$i")${chars[$n]}
    n=$((n+1))
done
echo $ret$2
#coords2="${1/, /°}"
#coords3="${coords2/, /'}"


#coords_lat=`echo "scale=8; ${coords2/, //60 + }" | bc`
#echo $sign$coords_lat
}

for img in `ls {*.JPG,*.jpg,*.jpeg,*.JPEG}`; do
datetime=`identify -format "%[exif:DateTime]" $img`

gpslat=$(get_coord "`identify -format "%[exif:GPSLatitude]" $img`" "`identify -format "%[exif:GPSLatitudeRef]" $img`")
gpslong=$(get_coord "`identify -format "%[exif:GPSLongitude]" $img`" "`identify -format "%[exif:GPSLongitudeRef]" $img`")

#echo $gpslat'+'$gpslong
#exit

echo  "images.push(['$datetime','img/$img','','','$gpslat+$gpslong']);"
ori=`identify -format "%[exif:Orientation]" $img`

extension="${img##*.}"
filename="${img%.*}"
rotate=""
if [ $ori == 8 ];then
  rotate="-90"
  newimg=$filename'_rot270.'$extension
elif [ $ori == 6 ];then
  rotate="90"
  newimg=$filename'_rot90.'$extension
elif [ $ori == 3 ];then
  rotate="180"
  newimg=$filename'_rot180.'$extension
fi
if [ $rotate ]; then
  convert -rotate $rotate $img $newimg
  echo  "images.push(['$datetime','img/$newimg','','','$gpslat+$gpslong']);"
fi

done