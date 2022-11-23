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
var MatrixHelper = new Class();

MatrixHelper.multiply = function(m1,m2) {
	if ($type(m1) == 'array' && $type(m2) == 'array') {

		//Zeilen m1
		var l = m1.length;
		//Spalten m1
		var m = m1[0].length;

		//Zeilen m2
		var n = m2.length;
		//Spalten m2
		var o = m2[0].length;

		if (m!=n) return -1;

		var c = new Array(l);

		for (var i=0; i<l; i++) {
			c[i] = new Array(o);
			for (var j=0; j<o; j++) {
				c[i][j] = 0;
				for (var k=0; k<m; k++)
					c[i][j] += m1[i][k] * m2[k][j];
			}
		}

		return c;
	}
};

MatrixHelper.add = function(m1,m2) {
	/*
	if ($type(m1) == 'array' && $type(m2) == 'array') {

		//Zeilen m1
		var l = m1.length;
		//Spalten m1
		var m = m1[0].length;

		//Zeilen m2
		var n = m2.length;
		//Spalten m2
		var o = m2[0].length;

		if (m!=n) return -1;

		var c = new Array(l);

		for (var i=0; i<l; i++) {
			c[i] = new Array(o);
			for (var j=0; j<o; j++) {
				c[i][j] = 0;
				for (var k=0; k<m; k++)
					c[i][j] += m1[i][k] * m2[k][j];
			}
		}

		return c;

	}*/
};
