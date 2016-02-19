
(function(){  //start global function for avoid conflict on global level

var s = Snap("#svgout");
var front = Snap("#frontView");
//======================= Main array =========================
var mainArrayOftable = [];//main array which contein relative coords of segment of path.
//Each item of should changed according draging. Basin on this array regeneration path
//============================================================
var mainAbsArrayoftable = [];////main array which contein absolute coords
//============================================================

var kx=3.14, ky=3.14; //aspect of absolute / screen coord.

var myMatrix = new Snap.Matrix();
myMatrix.scale(0.8,0.4);            // play with scaling before and after the rotate
myMatrix.translate(800,100);      // this translate will not be applied to the rotation
myMatrix.rotate(45);            // rotate
// //myMatrix.translate(100,0);    // this translate will take into account the rotated coord space

// Со скруглениями
// var myPathString = "M3372 2277l0 370c0,62 -51,113 -113,113l-496 0c-63,0 -113,-51 -113,-113l0 -1455c0,-60 -50,-109 -110,-109l-1347 0c-60,0 -109,49 -109,109 0,91 0,182 0,273 0,19 16,35 36,35 16,0 32,0 48,0 20,0 36,16 36,36l0 893c0,20 -16,36 -36,36 -16,0 -33,0 -49,0 -19,0 -35,16 -35,35 0,249 0,498 0,747 0,62 -51,113 -113,113l-496 0c-62,0 -113,-51 -113,-113l0 -725 -362 0 0 -1077 361 0 0 -969c0,-62 51,-113 113,-113l732 0 0 -363 1081 0 0 363 970 0c62,0 113,51 113,113l0 724 360 0 0 1077 -358 0zm-2892 -595l519 0 0 606 -519 0 0 -606zm950 -1250l626 0 0 590 -626 0 0 -590z";
var myPathString = "M1084 1083l0 417 120 0 0 965 -120 0 0 895 -723 0 0 -838 -361 0 0 -1077 361 0 0 -1082 845 0 0 -363 1081 0 0 363 1083 0 0 837 360 0 0 1077 -360 0 0 483 -720 0 0 -1677 -1566 0m-604 599l519 0 0 606 -519 0 0 -606zm950 -1250l626 0 0 590 -626 0 0 -590z";
var f = s.filter(Snap.filter.shadow(10, 20, 1, '#ddd', 0.5));
var f = s.filter(Snap.filter.shadow(100, 200, 3));
var p  = s.path( myPathString ).attr({ stroke: '#123456', 'strokeWidth': 20,fill:"#999"}).transform(myMatrix);
var pp;

//=========== масштабирование примитива p в видовом окне ====
var bbox = p.getBBox();
document.querySelector('#svgout').setAttribute("viewBox", ' '+bbox.x+' '+bbox.y+' '+bbox.w+' ' +bbox.h);
var boudary = s.rect(bbox.x, bbox.y, bbox.w, bbox.h).attr({'fill': 'blue', 'opacity':0.05});
//=============================================================

				// console.dir(p.pathSegList);//pathSegList  deprecated

// console.dir(Snap.path.toRelative(myPathString));
// console.dir(Snap.path.toAbsolute(myPathString));

var points = [];//array of drowed circles
var lines = [];//array of drowed dragable lines
mainArrayOftable = getRelativeVertexofTable(p);
mainAbsArrayoftable = getAbsoluteVertexofTable(p);
drawMainArray(front);

drawControlPoints(p,s,myMatrix);
drawControlPoints(p,front,'');
// zoom0(s);
zoom0(front);
// console.dir('Screen size of front '+document.getElementById('frontView').getAttribute('Width'));
// console.info(''+front.getBBox().x + ' : ' + front.getBBox().y);
// console.dir(parseInt(br.right-br.left)+' x '+parseInt(br.bottom-br.top));
// console.dir('Screen size of front '+document.getElementById('frontView').clientWidth+' x '+document.getElementById('frontView').clientHeight);

//=========== масштабирование примитива pp в видовом окне ====
// var bBox = pp.getBBox();
// front.attr({"viewBox": ' '+bBox.x+' '+bBox.y+' '+bBox.w+' ' +bBox.h});
// document.querySelector('#frontView').setAttribute("viewBox", ' '+bBox.x+' '+bBox.y+' '+bBox.w+' ' +bBox.h);
//=============================================================

var br=document.getElementById('frontView').getBoundingClientRect();
console.info('absolute size of front '+front.getBBox().width + ' x ' + front.getBBox().height);
				 kx=parseInt(front.getBBox().width)/parseInt(br.right-br.left);
				 ky=parseInt(front.getBBox().height)/parseInt(br.bottom-br.top);
 console.log(kx+' '+ky);


// console.dir(getAbsoluteVertexofTable(p));

function zoom0(canva){ //zoom all objects in viewbox
	var bBox = canva.getBBox();
	canva.attr({"viewBox": ' '+bBox.x+' '+bBox.y+' '+bBox.w+' ' +bBox.h});
	// document.querySelector('#frontView').setAttribute("viewBox", ' '+bBox.x+' '+bBox.y+' '+bBox.w+' ' +bBox.h);
}

function drawControlPoints(mypath, mycanva, matrix){
	var j=0;
	var nodes = Snap.path.toAbsolute(mypath);
	for (var i in nodes) {
		var l=nodes[i].length;
		var textt = mycanva.text(nodes[i][l - 2], nodes[i][l-1],j)
				.attr({ fontSize: '100px', stroke:"blue",strokeWidth: 2, fill: "blue", "text-anchor": "left"	})
				.transform(matrix);
			points[j] = mycanva.circle(nodes[i][l - 2], nodes[i][l-1], 20)
				 .attr({stroke: 'red',fill:'transparent','strokeWidth': 10, cursor : 'pointer'})
				 .data('vertex',j)
				 .transform(matrix);

			if (i >0){ //draw line which connect corners.
					// console.log('i='+i+' '+nodes[i]+'   l-2='+nodes[i][l - 2]+' l-1='+nodes[i][l-1]);
					var x1 = nodes[i-1][(nodes[i-1].length) - 2];
					var y1 = nodes[i-1][(nodes[i-1].length) - 1];
					var x2 = nodes[i][l - 2];
					var y2 = nodes[i][l - 1];
					if (typeof x2 !== "undefined")
						lines[j] = mycanva.line(x1, y1, x2, y2)
						 .attr({ stroke:"blue",strokeWidth: 15, fill: "blue"})
						 .transform(matrix)
						 .data('vertex',j)
						 .drag( dragMove , start, stopE)
						 .hover(function() {
						 	this.attr({strokeWidth: 15,stroke:"red"});
						 }, function() {
						 	this.attr({strokeWidth: 25,stroke:"blue"});
						 });
				}
		j++
	};
};

function getAbsoluteVertexofTable(mypath){//get absolute coord of vertex and return array
	var nodes = Snap.path.toAbsolute(mypath);
	// var j=0, l=0;
	// for (var i in nodes) {
	// 	l=nodes[i].length;
	// 	console.log('Absolute coord:'+nodes[i]+'  nodes['+i+'].length='+l);
	// };
	return nodes;
};


function getRelativeVertexofTable(mypath){//get relative coord of vertex and return array
	// var nodes = mypath.attr('d');
	var nodes = Snap.path.toRelative(mypath);
	// var j=0, l=0;
	// for (var i in nodes) {
	// 	l=nodes[i].length;
	// 	console.log('Absolute coord:'+nodes[i]+'  nodes['+i+'].length='+l);
	// };
	return nodes;
};


function drawMainArray(canva){
	if (typeof pp !== "undefined") {
					// pp.animate({opacity:0},200, mina.easeinout,
						// function(){
							pp.remove();
							pp = canva.path(Snap.parsePathString(mainArrayOftable))
										.attr({'stroke':'black', strokeWidth:10, fill:'yellow',opacity:0.2});//draw table from array
							// })
				}
				else
					pp = canva.path(Snap.parsePathString(mainArrayOftable))
										.attr({'stroke':'black', strokeWidth:10, fill:'yellow',opacity:0.2});//draw table from array
}

function getCoordFromPathSegment(segment){
	var l = segment.length;
	return {x : segment[l-2], y : segment[l-1]}
}

function changeVertexCoord(n, x, y){//changin in main array coords. n - N of vertex, x, y - relative coord of new place
		// var coord = getCoordFromPathSegment(mainArrayOftable[n]);
		// console.log('Frome changeVertexCoord oldX : oldY'+coord.x+' : '+coord.y);

			// console.log('Frome changeVertexCoord new X : Y'+x+' : '+y);
		var l = mainArrayOftable[n].length;
		mainArrayOftable[n][l-2] = x;
		mainArrayOftable[n][l-1] = y;

		// console.log(mainArrayOftable[n]);
	}

function move(dx, dy, newx, newy){// BAD WORKING, realtime drawing
		// console.log('dx dy='+dx+' '+dy);
		// console.log('newXY='+newx+' '+newy);
		// console.log('Moving vertex N '+this.data('vertex')+'  '+mainArrayOftable[this.data('vertex')]+' ');
		console.log('Moving vertex N '+this.data('vertex')+'  '+getRelativeVertexofTable(p)[this.data('vertex')]+' ');

		var att = {cx: (newx-br.left)*kx-40,cy:(newy-br.top)*ky-40};//40 вероятно из за радиусов окружностей
		// console.log('att='+att.cx+' '+att.cy);
		this.attr(att);//absolute coords
		// changeVertexCoord(this.data('vertex'), att.cx, att.cy);
		var relCoord = getCoordFromPathSegment(mainArrayOftable[this.data('vertex')]);
		//вставить относительные координаты текущей точки + delta * k
		var delta ={
			// x : newx*kx+getCoordFromPathSegment(mainAbsArrayoftable[this.data('vertex')]).x,
			x : newx*kx+getCoordFromPathSegment(mainArrayOftable[this.data('vertex')]).x,
			y : newy*ky+getCoordFromPathSegment(mainArrayOftable[this.data('vertex')]).y,
		}
		changeVertexCoord(this.data('vertex'), relCoord.x+delta.x, relCoord.y+delta.y);
		drawMainArray(front);
	};

            var tdx, tdy, screenD={};
  function dragMove(dx, dy, x, y) {//GOOD WORKING
            var snapInvMatrix = this.transform().diffMatrix.invert();
            snapInvMatrix.e = snapInvMatrix.f = 0;
            tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
            this.transform( "t" + [ tdx, tdy ] + this.data('ot')  );
			screenD.dx=dx;  screenD.dy=dy;
    }

function start(el){console.clear();
		// console.log(this+' start moving');
		// console.log(this.attr('cx')+' '+this.attr('cy'));
		 this.data('ot', this.transform().local );
	};

function stopE(el){
			// console.log('tdx > tdy ' tdx > tdy);
			limitation(this.data('vertex'));
// alert();
			drawMainArray(front);
			zoom0(front);
	};

function limitation (n){
	var relCoord = getCoordFromPathSegment(mainArrayOftable[n]);

	// console.log(relCoord);
	var absCoord = getCoordFromPathSegment(mainAbsArrayoftable[n]);
	if (Math.abs(tdx) > Math.abs(tdy)) {tdy = 0} else {tdx = 0};//check for moving to one axis
	console.log("tdx : tdy  "+tdx+' : '+tdy);
	//перебрать все сегменты и выбрать все с координатами = relCoord.x или relCoord.y и тоже их исправить,
	//найденный если сегмент дуга , то исправлять и следующий за ним сегмент.
	//сравнивать абсолютные координаты
	//а вносить изменения в относительный массив
	for (var i in mainAbsArrayoftable) {
		var absFo = getCoordFromPathSegment(mainAbsArrayoftable[i]);
		var relFo = getCoordFromPathSegment(mainArrayOftable[i]);
		if ((absFo.x == absCoord.x) || (absFo.y == absCoord.y))
			{ console.warn(absFo);
				console.log(screenD);
				console.log('i='+i+'  '+(relFo.x+screenD.dx)+' : '+(relFo.y+screenD.dy));
				// changeVertexCoord(n, relCoord.x+tdx, relCoord.y+tdy);// WORKING!
				changeVertexCoord(i, relFo.x+tdx, relFo.y+tdy);
				// mainAbsArrayoftable = getAbsoluteVertexofTable(p);//renovation arrays after chenging coords
			}
		};
	zoom0(front);
}

    function infoAboutObj(elem) {
      coords = elem.getBoundingClientRect();
      console.log('coords.top='+coords.top+';  coords.bottom='+coords.bottom);
    }

//===Get mouse position====
var mousePos = undefined;

(function() {
    document.onmousemove = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    // console.log(mousePos);
    }
    function getMousePosition() {
        var pos = mousePos;
        if (!pos) {
    //         // We haven't seen any movement yet
        }
        else {
        	 document.getElementById('setKnobVal').innerHTML='x:'+pos.x+' y:'+pos.y
        }
    }
})();

})();//end of global function