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
var JS3D_Face = new Class({
	points: -1,
	center: Class.empty,
	lowestZ: 999,
	highestZ: 0,
	fillStyle: "rgba(128,128,128,0.2)",
	strokeStyle: "rgba(0,0,0,0)",

	initialize: function(points,fillStyle){
		if (arguments.length>1)
			this.setFillStyle(fillStyle);
		this.setPoints(points);
	},

	setPoints: function(points){

		if ($type(points) == 'array') {
			if ($defined(points[0].x)) {
				this.points=points;

				this.updateCenter();
			}
		}
	},
	invertNormalVector: function() {
		this.normalVector[0] = -this.normalVector[0];
		this.normalVector[1] = -this.normalVector[1];
		this.normalVector[2] = -this.normalVector[2];
		this._calculateNormalVector0();
	},
	_calculateNormalVector0: function() {
		var n = this.normalVector;
		var len = Math.sqrt(Math.pow(n[0],2)+Math.pow(n[1],2)+Math.pow(n[2],2));
		this.normalVector0 = [ n[0] / len, n[1] / len, n[2] / len];
	},
	_calculateNormalVector: function() {
		if (this.points.length<3) return;

		if ($defined(this.normalVector)) return;

		// Annahme: Alle Punkte teil der Ebene
		var x=0;
		var y=1;
		var z=2;

		var v1=[ this.points[0].x-this.points[2].x,
				 this.points[0].y-this.points[2].y,
				 this.points[0].z-this.points[2].z ];

		var v2=[ this.points[1].x-this.points[2].x,
				 this.points[1].y-this.points[2].y,
				 this.points[1].z-this.points[2].z ];

		var n=[ v1[y] * v2[z] - v1[z] * v2[y],
		        v1[z] * v2[x] - v1[x] * v2[z],
				v1[x] * v2[y] - v1[y] * v2[x] ];

		this.normalVector = n;
		this._calculateNormalVector0();
		this._calculateDistanceToRoot();
	},
	_calculateDistanceToRoot: function() {
		this.distanceToRoot = this.points[0].x*this.normalVector0[0] + this.points[0].y*this.normalVector0[1] + this.points[0].z*this.normalVector0[2];
	},
	updateCenter: function() {
		//if ($defined(this.points[0].z)) {
			this.center = new JS3D_Point(this.points[0].x,this.points[0].y,this.points[0].z);
		//} else {
		//	this.center = new JS2D_Point(this.points[0].x,this.points[0].y);
		//}
		var i = 0;
		for (i=0; i<this.points.length; i++) {
			this.center.add(this.points[i]);
			// get greatest Z-Value
			if (this.highestZ<this.points[i].z) this.highestZ = this.points[i].z;
			if (this.lowestZ>this.points[i].z) this.lowestZ = this.points[i].z;
		}
		this.center.divScalar(i+1);

		this._calculateNormalVector();
	},
	addPoints: function(points) {
		if ($type(points) == 'array') {
			if ($defined(points[0].x)) {
				this.points = this.points.append(points);
				this.updateCenter();
			}
		}
	},

	setFillStyle: function(fillStyle) {
		this.fillStyle = fillStyle;
	},

	setStrokeStyle: function(strokeStyle) {
		this.strokeStyle = strokeStyle;
	},
	getNormalVector: function() {
		return this.normalVector;
	},
	getDistanceFromPoint: function(x,y,z) {
		if (this.points.length<3) return;

		if (!$defined(this.normalVector)) return;

		var d = x*this.normalVector0[0] + y*this.normalVector0[0] + z*this.normalVector0[2] - this.distanceToRoot;

		return d;
	}

});
