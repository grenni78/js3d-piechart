#!/bin/bash

OUTNAME="js3dpiechart-min.js"
INFILES=" \
JS3D/MatrixHelper.js \
JS3D/JS3D_RGBA.js \
JS3D/JS2D_Point.js \
JS3D/JS3D_Point.js \
JS3D/JS3D_Face.js \
JS3D/PieChart_Slice.js \
JS3D/PieChart.js \
"
TEMPFILE="joined.js"

JAVA="/cygdrive/c/Programme/Java/jre6/bin/java.exe"
JAVAOPTS=""
YUI="../yuicompressor/yuicompressor-2.4.2.jar"
YUIOPTS="--type js -o $OUTNAME $TEMPFILE"

cat $INFILES > $TEMPFILE

$JAVA $JAVAOPTS -jar $YUI $YUIOPTS

rm $TEMPFILE
