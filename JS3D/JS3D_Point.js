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
var JS3D_Point = new Class({
	initialize: function(x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	},
	add: function(p2) {
		this.x += p2.x;
		this.y += p2.y;
		this.z += p2.z;
	},
	divScalar: function(scalar) {
		this.x /= scalar;
		this.y /= scalar;
		this.z /= scalar;
	},
	getX: function() { return this.x; },
	getY: function() { return this.y; },
	getZ: function() { return this.z; }
});
