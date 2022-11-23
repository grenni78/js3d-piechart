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
 CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, w, h, r, filled, stroked, fillStyle, strokeStyle, lineWidth){
		this.save();

		if (filled)
			this.fillStyle = fillStyle;

		if (stroked) {
			this.strokeStyle = strokeStyle;
			this.lineWidth = lineWidth;
		}

        this.beginPath();

        this.moveTo(x+r, y);
        this.lineTo(x+w-r, y);
        this.quadraticCurveTo(x+w, y, x+w, y+r);
        this.lineTo(x+w, y+h-r);
        this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        this.lineTo(x+r, y+h);
        this.quadraticCurveTo(x, y+h, x, y+h-r);
        this.lineTo(x, y+r);
        this.quadraticCurveTo(x, y, x+r, y);

		if (filled)
			this.fill();
		if (stroked)
			this.stroke();

		this.restore();
 };
