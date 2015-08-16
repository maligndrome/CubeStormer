
var context=document.getElementById('picture').getContext('2d');
	var _max_label;

		//},false);
//loadCanvas("xlarge.png");
function unique(arr){
/// Returns an object with the counts of unique elements in arr
/// unique([1,2,1,1,1,2,3,4]) === { 1:4, 2:2, 3:1, 4:1 }

    var value, counts = {};
    var i, l = arr.length;
    for( i=0; i<l; i+=1) {
        value = arr[i];
        if( counts[value] ){
            counts[value] += 1;
        }else{
            counts[value] = 1;
        }
    }

    return counts;
}
var blob;
function doit()
{
	var centroids = new Object;
	var final_list = new Object;
	final_list[0]=[];
	final_list[1]=[];
	final_list[2]=[];
	final_list[3]=[];
	final_list[4]=[];
	final_list[5]=[];
	var count=0,color_count=0;
	var colours=['red','green','blue','white','yellow','orange'];
	while(count<9&&color_count<6)
	{
	blob=FindBlobs(context.getImageData(0,0,document.getElementById('picture').width,document.getElementById('picture').height),colours[color_count]);
	console.log(colours[color_count]);
	centroids=matMax(blob);
	final_list[color_count]=centroids;
	count+=centroids[0].length;
	++color_count;
	}
	console.log(final_list);
	if(count==9)
	document.getElementById('result').innerHTML="GREAT!";
	else
	document.getElementById('result').innerHTML="Okayish"+count;
}

function ColorTheBlobs(dst,blobs,colors){
    var xSize = dst.width,
        ySize = dst.height,
        dstPixels = dst.data,
        x, y, pos;

    var label, color, nColors = colors.length;

    for(y=0; y<ySize; y++){
        for(x=0; x<xSize; x++){
            pos = (y*xSize+x)*4;

            label = blobs[y][x];

            if( label !== 0 ){
                color = colors[ label % nColors ];
                dstPixels[ pos+0 ] = color[0];
                dstPixels[ pos+1 ] = color[1];
                dstPixels[ pos+2 ] = color[2];
                dstPixels[ pos+3 ] = color[3];
            }else{
                dstPixels[ pos+3 ] = 0;
            }
        }
    }

}

function rgbToHSV(_r,_g,_b) {
	_r/=255;
	_g/=255;
	_b/=255;
	var _h,_s,_v;
	var Cmax,Cmin;
	_r>_g?_r>_b?Cmax=_r:Cmax=_b:_g>_b?Cmax=_g:Cmax=_b;
	_r<_g?_r<_b?Cmin=_r:Cmin=_b:_g<_b?Cmin=_g:Cmin=_b;
	var delta=Cmax-Cmin;
	if(Cmax==_r)
	{
		_h=60*(((_g-_b)/delta)%6);
	}
	else if(Cmax==_g)
	{
		_h=60*(((_b-_r)/delta)+2);
	}
	else
	{
		_h=60*(((_r-_g)/delta)+4);
	}
	if(Cmax==0)
	{
		_s=0
	}
	else
	{
		_s=delta/Cmax;
	}
	_v=Cmax;
	var HSV=[_h,_s,_v];
	return HSV;
}
function FindBlobs(src,color) {

  var xSize = src.width,
      ySize = src.height,
      srcPixels = src.data,
      x, y, pos;

  // This will hold the indecies of the regions we find
  var blobMap = [];
  var label = 1;

  // The labelTable remembers when blobs of different labels merge
  // so labelTabel[1] = 2; means that label 1 and 2 are the same blob
  var labelTable = [0];

  // Start by labeling every pixel as blob 0
  for(y=0; y<ySize; y++){
    blobMap.push([]);
    for(x=0; x<xSize; x++){
      blobMap[y].push(0);
    }
  }

  // Temporary variables for neighboring pixels and other stuff
  var nn, nw, ne, ww, ee, sw, ss, se, minIndex;
  var luma = 0;
  var isVisible = 0;

  // We're going to run this algorithm twice
  // The first time identifies all of the blobs candidates the second pass
  // merges any blobs that the first pass failed to merge
  var nIter = 2;
  while( nIter-- ){

    // We leave a 1 pixel border which is ignored so we do not get array
    // out of bounds errors
    for( y=1; y<ySize-1; y++){
      for( x=1; x<xSize-1; x++){

        pos = (y*xSize+x)*4;
		var hsv_pixel=rgbToHSV(srcPixels[pos],srcPixels[pos+1],srcPixels[pos+2]);

        // We're only looking at the alpha channel in this case but you can
        // use more complicated heuristics
		if(color=='red')
        isVisible = (hsv_pixel[0]>350||hsv_pixel[0]<10)&&hsv_pixel[1]>0.5&&hsv_pixel[2]>0.5;
		else if(color=='blue')
        isVisible = (hsv_pixel[0]>220&&hsv_pixel[0]<260)&&hsv_pixel[1]>0.5&&hsv_pixel[2]>0.5;
		else if(color=='yellow')
        isVisible = (hsv_pixel[0]>50&&hsv_pixel[0]<70)&&hsv_pixel[1]>0.5&&hsv_pixel[2]>0.5;
		else if(color=='orange')
        isVisible = (hsv_pixel[0]>10&&hsv_pixel[0]<40)&&hsv_pixel[1]>0.5&&hsv_pixel[2]>0.5;
		else if(color=='white')
        isVisible = hsv_pixel[1]<0.5&&hsv_pixel[2]>0.5;
		else
        isVisible = (hsv_pixel[0]>100&&hsv_pixel[0]<150)&&hsv_pixel[1]>0.4&&hsv_pixel[2]>0.4;
        if( isVisible ){
          // Find the lowest blob index nearest this pixel
          nw = blobMap[y-1][x-1] || 0;
          nn = blobMap[y-1][x-0] || 0;
          ne = blobMap[y-1][x+1] || 0;
          ww = blobMap[y-0][x-1] || 0;
          ee = blobMap[y-0][x+1] || 0;
          sw = blobMap[y+1][x-1] || 0;
          ss = blobMap[y+1][x-0] || 0;
          se = blobMap[y+1][x+1] || 0;
          minIndex = ww;
          if( 0 < ww && ww < minIndex ){ minIndex = ww; }
          if( 0 < ee && ee < minIndex ){ minIndex = ee; }
          if( 0 < nn && nn < minIndex ){ minIndex = nn; }
          if( 0 < ne && ne < minIndex ){ minIndex = ne; }
          if( 0 < nw && nw < minIndex ){ minIndex = nw; }
          if( 0 < ss && ss < minIndex ){ minIndex = ss; }
          if( 0 < se && se < minIndex ){ minIndex = se; }
          if( 0 < sw && sw < minIndex ){ minIndex = sw; }
  
          // This point starts a new blob -- increase the label count and
          // and an entry for it in the label table
          if( minIndex === 0 ){
            blobMap[y][x] = label;
            labelTable.push(label);
            label += 1;
  
          // This point is part of an old blob -- update the labels of the
          // neighboring pixels in the label table so that we know a merge
          // should occur and mark this pixel with the label.
          }else{
            if( minIndex < labelTable[nw] ){ labelTable[nw] = minIndex; }
            if( minIndex < labelTable[nn] ){ labelTable[nn] = minIndex; }
            if( minIndex < labelTable[ne] ){ labelTable[ne] = minIndex; }
            if( minIndex < labelTable[ww] ){ labelTable[ww] = minIndex; }
            if( minIndex < labelTable[ee] ){ labelTable[ee] = minIndex; }
            if( minIndex < labelTable[sw] ){ labelTable[sw] = minIndex; }
            if( minIndex < labelTable[ss] ){ labelTable[ss] = minIndex; }
            if( minIndex < labelTable[se] ){ labelTable[se] = minIndex; }

            blobMap[y][x] = minIndex;
          }

        // This pixel isn't visible so we won't mark it as special
        }else{
          blobMap[y][x] = 0;
        }
  
      }
    }
  
    // Compress the table of labels so that every location refers to only 1
    // matching location
    var i = labelTable.length;
    while( i-- ){
      label = labelTable[i];
      while( label !== labelTable[label] ){
        label = labelTable[label];
      }
      labelTable[i] = label;
    }
  
    // Merge the blobs with multiple labels
    for(y=0; y<ySize; y++){
      for(x=0; x<xSize; x++){
        label = blobMap[y][x];
        if( label === 0 ){ continue; }
        while( label !== labelTable[label] ){
          label = labelTable[label];
        }
        blobMap[y][x] = label;
      }
    }
  }

  // The blobs may have unusual labels: [1,38,205,316,etc..]
  // Let's rename them: [1,2,3,4,etc..]
  var uniqueLabels = unique(labelTable);
  var i = 0;
  for( label in uniqueLabels ){
    labelTable[label] = i++;
  }
_max_label=i;
  // convert the blobs to the minimized labels
  for(y=0; y<ySize; y++){
    for(x=0; x<xSize; x++){
      label = blobMap[y][x];
      blobMap[y][x] = labelTable[label];
    }
  }

  // Return the blob data:
  return blobMap;

};

function matMax(matrix)
{
	var centroid_x=new Array;
	var centroid_y=new Array;
	var centroid_i=0;
	var common=new Array;
	var count=0;
	var histogram=new Array;
	var histogram_memoized=new Array;
	for(var k=0;k<=_max_label;k++)
	histogram[k]=0;
	rows=matrix.length;
	columns=matrix[0].length;
	for(var i=0;i<rows;i++)
	for(var j=0;j<columns;j++)
	{
		++histogram[matrix[i][j]];
	}
	for(var m=0;m<=_max_label;m++)
	{
	histogram_memoized[m]=histogram[m];
	}

histogram.sort(function (a, b)
    {
        return b-a;
    });

	for(var m=0;m<=_max_label;m++)
	{
	if(histogram[m]>3000&&histogram[m]<10000)
	{
		for(var c=0;c<=_max_label;c++)
		if(histogram_memoized[c]==histogram[m])
		{
		common[count]=c;
		++count;
		}
	}
	}
	var _break=false;
	for(var k=0;k<common.length;k++)
	{
		_break=false;
	for(var i=0;i<rows;i++)
	{
	for(var j=0;j<columns;j++)
	{
		if(matrix[i][j]==common[k])
		{
		var virtual_square=Math.sqrt(histogram_memoized[common[k]]);
		centroid_y[centroid_i]=i+virtual_square;
		centroid_x[centroid_i]=j+virtual_square;
		centroid_i+=1;
		_break=true;
		break;
		}
	}
	if(_break)
	break;
	}
	}
	var centroids=new Object;
	centroids[0]=centroid_y;
	centroids[1]=centroid_x;
	return centroids;
	
}