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
var JS3D_RGBA = new Class({
	r : 0,
	g : 0,
	b : 0,
	a : 1,

	initialize: function(r,g,b,a) {
		this.setRed(r);
		this.setGreen(g);
		this.setBlue(b);
		this.setAlpha(a);
	},/*
	initialize: function(s) {
		var colors = (""+s).rgbToHex(true);
		if (colors.length==4) {
			this.setAlpha(colors[3]);
		} else if (colors.length==3) {
			this.setRed(colors[0]);
			this.setGreen(colors[1]);
			this.setBlue(colors[2]);
		}
	},*/
	checkColor : function(value) {
		if (value > 254) value = 254;
		else if (value < 0) value = 0;

		return Math.round(value);
	},
	checkAlpha : function(value) {
		if (value > 1) value = 1.0;
		else if (value < 0) value = 0.0;

		return value;
	},
	setRed : function (value) {
		this.r = this.checkColor(value);
	},
	setGreen : function (value) {
		this.g = this.checkColor(value);
	},
	setBlue : function (value) {
		this.b = this.checkColor(value);
	},
	setAlpha : function (value) {
		this.a = this.checkAlpha(value);
	},
	getRed   : function() {return this.r;},
	getGreen : function() {return this.g;},
	getBlue  : function() {return this.b;},
	getAlpha : function() {return this.a;},

	getCSSRGB: function() {
		return "rgb("+this.r+","+this.g+","+this.b+")";
	},
	getCSSRGBA: function() {
		return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
	},
	getBrighterColor: function(amount) {
		if (amount>1) amount /= 100;
		else if (amount<0)	amount = 0;

		var r=this.r*(1+amount);
		var g=this.g*(1+amount);
		var b=this.b*(1+amount);

		return new JS3D_RGBA(r,g,b,this.a);
	},
	getDarkerColor: function(amount) {
		if (amount>1) amount /= 100;
		else if (amount<0)	amount = 0;

		var r=this.r*(1-amount);
		var g=this.g*(1-amount);
		var b=this.b*(1-amount);

		return new JS3D_RGBA(r,g,b,this.a);
	}
});
