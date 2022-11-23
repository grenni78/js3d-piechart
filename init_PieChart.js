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
var chart = {};

window.addEvent("domready",function()
{
	chart.canvas = document.getElementById('3DPieChart');
	if (chart.canvas.getContext){
		chart.ctx = chart.canvas.getContext('2d');

		chart.pieChart = new PieChart(chart.canvas,120,50,300,300);
		chart.pieChart.setDistance(200);
		chart.pieChart.addSlice(.18,new JS3D_RGBA(220,220,20,.8),"Fett");
		chart.pieChart.addSlice(.26,new JS3D_RGBA(20,200,20,.8),"Protein");
		chart.pieChart.addSlice(.43,new JS3D_RGBA(200,20,20,.8),"Kohlenhydrate");
		chart.pieChart.addSlice(.13,new JS3D_RGBA(120,120,120,.8),"Balaststoffe");
		chart.pieChart.draw();

        chart.animatorS = (function() {
            if (chart.paused) return;
            if (!$defined(this.stepUp)) this.stepUp = 0;
            if (!$defined(this.stepUpStep)) this.stepUpStep = 0.0;
            if (!$defined(this.stepUpDir)) this.stepUpDir = 1;

            chart.pieChart.exposeSlice(this.stepUp,40*this.stepUpStep,70*this.stepUpStep);

            if (this.stepUpStep < 1.0 && this.stepUpDir==1)
                this.stepUpStep += .05;
            else if (this.stepUpStep > 0.1 && this.stepUpDir==-1)
                this.stepUpStep -= .1;
            else if (this.stepUpStep >= 1.0 && this.stepUpDir==1)
                this.stepUpDir  = -1;
            else if (this.stepUpStep <= 0.1 && this.stepUpDir==-1) {
                this.stepUpDir = 1;
                if (this.stepUp < 3)
                    this.stepUp++;
                else
                    this.stepUp=0;
            }
        }).periodical(100);
		chart.animatorX = (function() {
            if (chart.paused) return;
			if (!$defined(this.stepX)) this.stepX = 0;
			if (!$defined(this.stepY)) this.stepY = 0;
			if (!$defined(this.stepZ)) this.stepZ = 0;

			chart.pieChart.rotate(-1,this.stepX,-1);

			if (this.stepX<357)
				this.stepX += 3;
			else
				this.stepX = 1;

			if (this.stepY<359)
				this.stepY += 1;
			else
				this.stepY = 1;

			if (this.stepZ<358)
				this.stepZ += 2;
			else
				this.stepZ = 1;
		}).periodical(100);

		chart.canvas.addEvents({
            mouseover: function() { chart.paused=true; },
            mouseout: function() { chart.paused=false; }
        });
	}
});
