/*-----------------------------------------------------------------------------
	Holger Genth -Dienstleistungen-

	@version		0.2 alpha
	@build			10th March, 2011
	@created		10th MArch, 2011
	@package		JS3DPieChart
	@author			Holger Genth <http://www.grenni.de>
	@copyright		Copyright (C) 2011. All Rights Reserved
	@license		GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html
-----------------------------------------------------------------------------*/
var PieChart = new Class({
	Implements: Chain,
	canvasWidth : 400,
	canvasHeight : 400,
	center : new JS3D_Point(0,0,0),
	radius : 1,
	height : 1,
	distance : 200,
	resolution: 80,

	alpha : 30.0,
	beta  : 0.0,
	gamma : 0.0,

	transX : 0,
	transY : 0,
	transZ : 0,

	transformMatrix: Class.empty,
	rot_Matrix: Class.empty,
	trans_Matrix: Class.empty,

	sum_values: 0.0,

	geometry: Class.empty,
	geometry_centers: Class.empty,
	localTransformation: new Array(),

	slices : new Array(),

	labels: new Array(),

	labelAnchors: new Array(),

	legend: {
		shadow: {
			offset: {x: 1, y: 2},
			opacity: .3,
			blur: 5,
		},
		position: 'tr',
		width: .34,
		font: {
			size: 9,
			family: "Arial, sans-serif",
			weight: "normal",
			style: "normal"
		},
		textColor: "rgb(50,50,150)",
		lineHeight: 1.5,
		fillStyle: "rgba(254,248,170,.8)"
	},

	initialize: function(canvas,radius, height, c_width, c_height) {
		this.canvas = canvas;
		this.radius = radius;

		this.resolution = 2 * Math.PI * radius / 15;

		this.height = height;
		this.setCanvasSize(c_width, c_height);

		this.startAnimation();
	},

	setDistance: function(dist) {
		this.distance = dist;

	},

	setCanvasSize: function(w,h) {
		this.canvasWidth = w;
		this.canvasHeight = h;

	},

	setPieCenter: function() {
		this.center.z = Math.sqrt( Math.pow((this.height/2),2) + Math.pow(this.radius,2) );
		this.center.x = this.canvasWidth / 2;
		this.center.y = this.canvasHeight / 2 - this.height / 2;
	},

	startAnimation: function() {
		var me = this;
		this.running = true;
		this.update();
		(function(){this.draw();this.update();}).periodical(80,me);
	},
	rotate: function(alpha, beta, gamma) {
		this.alpha = (alpha>=0 && alpha <=360) ? alpha : this.alpha;
		this.beta  = (beta>=0  && beta <=360)  ? beta  : this.beta;
		this.gamma = (gamma>=0 && gamma <=360) ? gamma : this.gamma;
	},

	update: function() {
		this.setPieCenter();
		this.rotMatrix();
		this.transMatrix();
		this.persMatrix();
		this.transformMatrix();
		this.updateGeometry();
	},
	exposeSlice: function(idx,r, phi) {
        if (r==0 && phi == 0) {
            this.localTransformation.splice(idx,1);
            return;
        }

        var dir = (this.slices[idx].arcEnd - this.slices[idx].arcStart) / 2
                    + this.slices[idx].arcStart;
        dir = dir * Math.PI / 180;

        var x = Math.cos(dir) * r;
        var z = Math.sin(dir) * r;
        var y = -Math.sin(phi * Math.PI / 180)*r;

        this.localTransformation[idx] = [[1,0,0,z],
                                         [0,1,0,y],
                                         [0,0,1,x],
                                         [0,0,0,1]];
    },
	addSlice: function(value, color, label) {
		if (this.sum_values + value > 1) return;

		var tiles = this.resolution * value;

		var slice = new PieChart_Slice(
			this.sum_values * 360,
			value,
			this.radius,
			this.height,
			tiles,
			color,
			false);

		this.sum_values += value;
		this.slices.push(slice);
		this.labels.push(label+": "+Math.round(value * 1000) / 10 + "%");

	},

	clearSlices: function() {
		this.slices = new Array();
	},

	rotMatrix: function() {
		var cos = function(v) {return Math.cos(v);}
		var sin = function(v) {return Math.sin(v);}

		var a = this.alpha * Math.PI / 180;
		var b = this.beta * Math.PI / 180;
		var c = this.gamma * Math.PI / 180;

		this.rot_Matrix =[ [cos(c)*cos(b)-sin(c)*sin(a)*sin(b), sin(c)*cos(a), cos(c)*sin(b)+sin(c)*sin(a)*cos(b), 0],
						   [sin(c)*cos(b)+cos(c)*sin(a)*sin(b), cos(c)*cos(a), sin(c)*sin(b)-cos(c)*sin(a)*cos(b), 0],
						   [-sin(b)*cos(a),                     sin(a),        cos(a)*cos(b),                      0],
						   [0,                                  0,             0,                                  1] ];
	},
	transMatrix: function() {
		this.trans_Matrix =[ [ 1, 0, 0, this.transX + this.center.x],
							 [ 0, 1, 0, this.transY + this.center.y],
							 [ 0, 0 ,1, this.transZ + this.center.z],
							 [ 0, 0, 0, 1] ];
	},
	persMatrix: function() {
		this.pers_Matrix =[ [1, 0, 0, 0],
						    [0, 1, 0, 0],
							[0, 0, 1, 0],
							[0, 0, 1/this.distance, 0] ];
	},
	transformMatrix: function() {
		this.matrix = MatrixHelper.multiply(this.trans_Matrix,this.rot_Matrix);
		this.matrix = MatrixHelper.multiply(this.pers_Matrix,this.matrix);
	},
	transform: function(point,customMatrix) {
		var m0;
		if ($defined(point.x))
			m0 = [[point.x],
				  [point.y],
				  [point.z],
				  [1] ];
		else
			m0 = [[point[0]],
				  [point[1]],
				  [point[2]],
				  [1] ];
        var m1 = m0;

        if (arguments.length>1) {
            m1 = MatrixHelper.multiply(customMatrix,m1);
        }
		m1 = MatrixHelper.multiply(this.matrix,m1);

		return {x:Math.ceil(m1[0][0]), y:Math.ceil(m1[1][0]), z:Math.ceil(m1[2][0])};
	},
	updateGeometry: function() {
		//Array of Faces
		this.geometry = new Array();

		for (var i=0; i<this.slices.length; i++) {
			var slice = this.slices[i];

			for (var j=0; j<slice.faces.length-1; j++) {
				var points = new Array();

				for (var k=0; k<slice.faces[j].points.length; k++) {
                    if ($defined(this.localTransformation[i]))
                       var p = this.transform(slice.faces[j].points[k],this.localTransformation[i]);
                    else
					   var p = this.transform(slice.faces[j].points[k]);
					points.push(new JS3D_Point(p.x,p.y,p.z));
				}

				var f = new JS3D_Face(points,slice.faces[j].fillStyle);
				this.geometry.push(f);
			}
			if ($defined(this.localTransformation[i])) {
                this.labelAnchors[i] = this.transform(slice.anchorPoint,this.localTransformation[i]);
				this.slices[i].origin = this.transform(slice.origin,this.localTransformation[i]);
			}
			this.labelAnchors[i] = this.transform(slice.anchorPoint);
			this.slices[i].origin = this.transform(slice.origin);
		}
		this.geometry_centers = new Array(this.geometry.length);

		for (var i=0; i<this.geometry.length; i++) {
			this.geometry_centers[i] = {l:this.geometry[i].lowestZ,
										h:this.geometry[i].highestZ,
										z:this.geometry[i].center.z,
										idx:i};
		}
		var me = this;
		this.geometry_centers=this.geometry_centers.sort((function(a,b){
                if (a.z<b.z)
                    return 1;
                else if (a.z>b.z)
                    return -1;
		/*
			if (a.l<b.l) {
				if (a.h<b.h) {
					return 1;
				}
			} else {
				if (a.h>b.h) {
					return -1;
				}
			}
		*/
		var d1 = this.geometry[a.idx].distanceToRoot;
			var d2 = this.geometry[b.idx].distanceToRoot;
	//console.log(d1+" - "+d2);
			if (d1 > d2)
				return -1;
			else
				return 1;

			return 0;
		}).bind(me));
	},
	drawShadow: function(ctx,x,y,w,h,r,o_x,o_y,blur,opacity) {
		var op = opacity - blur * .05;
		for (var b=blur; b>0; b--) {
			ctx.roundRect(
				x-b + o_x,
				y-b + o_y,
				w+2*b,
				h+2*b,
				r+b,
				true,
				false,
				"rgba(0,0,0,"+op+")"
			);
		}
	},
	drawLegend: function(ctx) {
		var w = this.legend.width * this.canvasWidth;
		var h = this.slices.length * this.legend.font.size * this.legend.lineHeight + this.legend.font.size;

		var x,y;

		if (this.legend.position[0] = 't')
			y = this.legend.shadow.blur - this.legend.shadow.offset.y;
		else if (this.legend.position[0] = 'b')
			y = this.canvasHeight - h - this.legend.shadow.blur - this.legend.shadow.offset.y;

		if (this.legend.position[1] = 'r')
			x = this.canvasWidth - w - this.legend.shadow.blur - this.legend.shadow.offset.x;
		else if (this.legend.position[1] = 'r')
			x = this.legend.shadow.blur - this.legend.shadow.offset.x;

		if (!($defined(x) && $defined(y)) ) return;

		this.drawShadow(ctx,
						x,
						y,
						w,
						h,
						5,
						this.legend.shadow.offset.x,
						this.legend.shadow.offset.y,
						this.legend.shadow.blur,
						this.legend.shadow.opacity);

		ctx.roundRect(x,y,w,h,5,true,false,this.legend.fillStyle);

		ctx.font = this.legend.font.size+"px "+this.legend.font.family;
		ctx.fillStyle = this.legend.textColor;
		var sy = y;
		for (var i=0; i<this.slices.length; i++) {
			sy += Math.round(this.legend.font.size * this.legend.lineHeight)
			ctx.roundRect(x + 4,
						  sy - this.legend.font.size / (.75 * this.legend.lineHeight),
						  this.legend.font.size,
						  this.legend.font.size,
						  3,
						  true,
						  true,
						  this.slices[i].fillStyle,
						  "rgba(220,220,220,.8)",
						  2);
			ctx.fillText(this.labels[i],
						 x + 1.5 * this.legend.font.size,
						 sy );
		}
	},
	draw: function() {
		var ctx = this.canvas.getContext('2d');
		ctx.save();
		ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		//this.updateGeometry();

		//var backBuffer = document.createElement('canvas');
		//backBuffer.width = this.canvas.width * 3;
		//backBuffer.height = this.canvas.height * 3;

		var ctx2 = ctx;//backBuffer.getContext('2d');
		//ctx2.scale(3,3);

		for (var i=0; i<this.geometry_centers.length; i++) {
			var face = this.geometry[this.geometry_centers[i].idx];

			//if (slice.stroked)
				//ctx.strokeStyle = face.strokeStyle;
			ctx2.strokeStyle = face.fillStyle;
			ctx2.fillStyle   = face.fillStyle;

			var p = face.points[0];

			ctx2.beginPath();
			ctx2.moveTo(p.x,p.y);

			for (var j=1; j<face.points.length; j++) {
				p = face.points[j];

				ctx2.lineTo(p.x,p.y);
			}

			//ctx.stroke();
			ctx2.fill();

			if (this.showNormals) {
			 ctx2.beginPath();
			 ctx2.moveTo(face.center.x,face.center.y);
			 ctx2.lineTo(face.center.x+face.normalVector0[0]*50,face.center.y+face.normalVector0[1]*50);
			 ctx2.strokeStyle="black";
			 ctx2.stroke();

			 ctx2.beginPath();
			 ctx2.arc(face.center.x+face.normalVector0[0]*50,face.center.y+face.normalVector0[1]*50,5,0,Math.PI*2, false);
			 ctx2.fillStyle="yellow";
			 ctx2.fill();
			 ctx2.stroke();
			}

		};

		// Label-Legende ausgeben
		this.drawLegend(ctx);
		/*
		// F�hrungslinien f�r Sticky-Legende
		for (var i=0; i<this.slices.length; i++) {
			//Label
			try {
				ctx2.beginPath();
				ctx2.moveTo(this.labelAnchors[i].x,this.labelAnchors[i].y);
				ctx2.lineTo(this.labelAnchors[i].x,this.labelAnchors[i].y+20);
				ctx2.strokeStyle="black";
				ctx2.stroke();
			} catch (e){}
		}
		*/
		// Blur- Routine
		//var i, x, y;

		/*ctx.globalAlpha = 0.4;

		for (i = 1; i <= 4; i += 1) {
			for (y = -1; y < 2; y += 1) {
				for (x = -1; x < 2; x += 1) {
		*/
					//ctx.drawImage(backBuffer,0,0,this.canvas.width,this.canvas.height);
		/*
				}
			}
		}
		*/

		ctx.restore();
	}

});
