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
var PieChart_Slice = new Class({
	radius: 1,
	height: 1,
	value: 1.0,
	arcStart: 0,
	arcEnd: 0,
	arcStep: 0,
	steps: 1,
	fillRGBA: Class.empty,
	fillStyle: "red",
	strokeRGBA: Class.empty,
	strokeStyle: "black",
	stroked: false,
	faces: new Array(),
	anchorPoint: Class.empty,
	origin: {x:0, y:0,z:0},

	initialize: function(start,value,radius,height,tiles,fill,stroked,stroke) {
		if (value>1) return;

		this.height      = height;
		this.value       = value;
		this.radius      = radius;
		this.fillRGBA    = fill;
		this.fillStyle   = fill.getCSSRGBA();
		this.stroked     = stroked;

		if (arguments.length > 7) {
			this.strokeRGBA  = stroke;
			this.strokeStyle = stroke.getCSSRGBA();
		}
		this.arcStart = start;

		this.arcEnd = 360 * value + start;

		if (this.arcEnd > 360) this.arcEnd = 360;

		this.steps = tiles;
		this.arcStep = (this.arcEnd-this.arcStart) / tiles ;

		this.generateFaces();
	},

	generateFaces: function() {

		var arcStart_rad = this.arcStart * Math.PI / 180;
		var arcEnd_rad   = this.arcEnd * Math.PI / 180;
		var arcStep_rad  = this.arcStep * Math.PI / 180;
		this.direction   = (arcEnd_rad - arcStart_rad) / 2 + arcStart_rad;

		this.origin.x    = Math.sin(this.direction) * .66;
		this.origin.z    = Math.cos(this.direction) * .66;
		this.origin.y    = 0;

		var brighterColor = this.fillRGBA.getBrighterColor(.5);
		var darkerColor = this.fillRGBA.getDarkerColor(.5);

		var slicePoints = new Array(6);

		for (var i=0; i<slicePoints.length; i++)
			slicePoints[i] = {x:0, y:0, z:0};

		var points = new Array();

		var arc = this.arcStart;
		var arc_rad = arc * Math.PI / 180;

		slicePoints[0].x = 0;
		slicePoints[0].y = -this.height / 2;
		slicePoints[0].z = 0;

		slicePoints[2].x = this.radius * Math.sin(arcStart_rad);
		slicePoints[2].y = -this.height / 2;
		slicePoints[2].z = this.radius * Math.cos(arcStart_rad);

		slicePoints[3].x = this.radius * Math.sin(arcStart_rad);
		slicePoints[3].y = this.height / 2;
		slicePoints[3].z = this.radius * Math.cos(arcStart_rad);

		slicePoints[5].x = 0;
		slicePoints[5].y = this.height / 2;
		slicePoints[5].z = 0;

		// front

		this.faces.push(
			new JS3D_Face(
				[new JS3D_Point(slicePoints[0].x,slicePoints[0].y,slicePoints[0].z),
				 new JS3D_Point(slicePoints[2].x,slicePoints[2].y,slicePoints[2].z),
				 new JS3D_Point(slicePoints[3].x,slicePoints[3].y,slicePoints[3].z),
				 new JS3D_Point(slicePoints[5].x,slicePoints[5].y,slicePoints[5].z)],
				brighterColor.getCSSRGBA()));

		var top    = new JS3D_Face([new JS3D_Point(slicePoints[0].x,slicePoints[0].y,slicePoints[0].z),
							        new JS3D_Point(slicePoints[2].x,slicePoints[2].y,slicePoints[2].z)],brighterColor.getCSSRGBA());
		var bottom = new JS3D_Face([new JS3D_Point(slicePoints[5].x,slicePoints[5].y,slicePoints[5].z),
							        new JS3D_Point(slicePoints[3].x,slicePoints[3].y,slicePoints[3].z)],brighterColor.getCSSRGBA());

		// slices
		for (var i=1; i<this.steps; i++) {
			arc += this.arcStep;
			arc_rad = arc * Math.PI / 180;

			slicePoints[1] = {x:slicePoints[2].x,y:slicePoints[2].y,z:slicePoints[2].z};
			slicePoints[4] = {x:slicePoints[3].x,y:slicePoints[3].y,z:slicePoints[3].z};

			slicePoints[2].x = this.radius * Math.sin(arc_rad);
			slicePoints[2].y = -this.height / 2;
			slicePoints[2].z = this.radius * Math.cos(arc_rad);

			slicePoints[3].x = this.radius * Math.sin(arc_rad);
			slicePoints[3].y = this.height / 2;
			slicePoints[3].z = this.radius * Math.cos(arc_rad);

			// top
			top.addPoints([new JS3D_Point(slicePoints[2].x,slicePoints[2].y,slicePoints[2].z)]
			);
			// bottom
			bottom.addPoints([new JS3D_Point(slicePoints[3].x,slicePoints[3].y,slicePoints[3].z)]
			);
			// rear

			this.faces.push(
				new JS3D_Face(
					[new JS3D_Point(slicePoints[1].x,slicePoints[1].y,slicePoints[1].z),
					 new JS3D_Point(slicePoints[2].x,slicePoints[2].y,slicePoints[2].z),
					 new JS3D_Point(slicePoints[3].x,slicePoints[3].y,slicePoints[3].z),
                     new JS3D_Point(slicePoints[4].x,slicePoints[4].y,slicePoints[4].z)],
					this.fillRGBA.getCSSRGBA()));

		}
		this.faces.push(top);
		this.faces.push(bottom);

		this.anchorPoint = top.center;
		// back
		this.faces.push(
			new JS3D_Face(
				[new JS3D_Point(slicePoints[0].x,slicePoints[0].y,slicePoints[0].z),
				 new JS3D_Point(slicePoints[2].x,slicePoints[2].y,slicePoints[2].z),
				 new JS3D_Point(slicePoints[3].x,slicePoints[3].y,slicePoints[3].z),
     			 new JS3D_Point(slicePoints[5].x,slicePoints[5].y,slicePoints[5].z)],
 				brighterColor.getCSSRGBA()));

	}
});
