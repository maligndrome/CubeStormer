var initialcube;
function manual_input_text()
{
	var _U,_R,_F,_D,_L,_B;
	_U=document.getElementById('U-face').value;
	_R=document.getElementById('R-face').value;
	_F=document.getElementById('F-face').value;
	_D=document.getElementById('D-face').value;
	_L=document.getElementById('L-face').value;
	_B=document.getElementById('B-face').value;
	if(_U.length==9&&_R.length==9&&_F.length==9&&_D.length==9&&_L.length==9&&_B.length==9){
			initialcube=colortoString(_U+_R+_F+_D+_L+_B);
			console.log(initialcube);
		}
	solve('manual_solution');
}

		var answer;
		//document.addEventListener('deviceready',function(){
			window.onload = function(){
				$('#proceed').hide();
		Cube.generateTables(function(){$('#initializing').hide(); $('#proceed').show();});
			}
		//},false);

document.getElementById('blah').onclick= function(){
	solve();
}

function solve(y){
	if(y=='manual_solution')
	{
		console.log(initialcube);
Cube.solveCube(initialcube,function(x){document.getElementById('manual_solution').innerHTML=x;});
	}
	else if(y=='automatic')
	{
		console.log(initialcube);
Cube.solveCube(initialcube,function(x){document.getElementById('result').innerHTML=x;});
	}
}
			function colortoString(str)
			{
				var color=str.split('');
				var string='';
				for(var i=0;i<color.length;i++)
				{
					if(color[i]=='w')
					string+='U';
					else if(color[i]=='g')
					string+='F';
					else if(color[i]=='r')
					string+='R';
					else if(color[i]=='b')
					string+='B';
					else if(color[i]=='o')
					string+='L';
					else if(color[i]=='y')
					string+='D';
				}
				return string;
			}
			function initialize(){

		var face_names=["U","R","F","D","L","B"];
		var corr_colours=new Object;
		corr_colours["U"]="white";
		corr_colours["R"]="red";
		corr_colours["F"]="green";
		corr_colours["D"]="yellow";
		corr_colours["L"]="orange";
		corr_colours["B"]="blue";
		//var face_name=document.getElementById('face-name');
		var cubeDiv= document.getElementById("cube");
		var _string="";
		for(i=0;i<6;i++)
		{
			var innerDiv = document.createElement('div');
			innerDiv.className = 'face';
			var count=1;
			for(row=0;row<3;row++)
			{
				for(col=0;col<3;col++)
				{
					
					var number=(9*i)+count;
					_string=_string+initialcube[number-1];
					colour = corr_colours[initialcube[number-1]]
					var square = document.createElement('div');
					square.className = 'square';
					square.style.top=""+row*100+"px";
					square.style.left=""+col*100+"px";
					square.style.backgroundColor=colour;
					innerDiv.appendChild(square);
					++count;
				}
			}
			cubeDiv.appendChild(innerDiv);
		}
		var faces = document.getElementsByClassName('face');
		for(i=0;i<faces.length;i++)
		{
			faces[i].style.display='none';
		}
		var curr=0;
		faces[curr].style.display='block';
		//face_name.innerHTML=face_names[curr];
			}
		//},false);
		
		var faces = document.getElementsByClassName('face');
		var curr=0;
		function prev()
		{
			faces[curr].style.display='none';
			if(curr==0)
			curr=faces.length-1;
			else
			curr-=1;
			faces[curr].style.display='block';
			face_name.innerHTML=face_names[curr];
		}
		function next()
		{
			faces[curr].style.display='none';
			if(curr==faces.length-1)
			curr=0;
			else
			curr+=1;
			faces[curr].style.display='block';
			face_name.innerHTML=face_names[curr];
		}

		function refreshCube()
		{
			var temp=randomcube.asString();
			var faces=document.getElementsByClassName('face');
			for(i=0;i<faces.length;i++)
			{
				var squares=faces[i].getElementsByClassName('square');
				for(j=0;j<squares.length;j++)
				{
					squares[j].style.backgroundColor=corr_colours[temp[9*i+j]];
				}
			}
		}