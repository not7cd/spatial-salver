 /* 
    Spatial - Space Engineers world viewer

    In this file you will find all things needed to show a map on the screen.


    by not7CD
    www.not7CD.pl 
 */


//Function to convert hex format to a rgb color
function rgb2hex(rgb){
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return hex(255) + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

$(document).ready(function(){
    $('#transformBlock').keypress(function(e){
      if(e.keyCode==13)
      $('#transformMove').click();
    });
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


var Vector3 = function () {
	this.x = 0;
	this.y = 0;
	this.z = 0;
}
// namespace Spatial

var Spatial = Spatial || {};


var gameobjectsDisplay = function (name, color, size) {
	this.name = name;
	this.size = size;
	this.colorName = color;
	this.color = (rgb2hex(String($('.label-'+this.colorName).css('background-color'))));;
	//console.log(this.color);
   	this.outsidePoints = true;
    this.insidePoints = true;
    this.insideLines = true;
};


var Display = function () {
	//TODO: fix
    //this.bgColor = rgb2hex(String($('body').css('backgroundColor')));
    //this.lnColor = rgb2hex(String($('.label-default').css('backgroundColor')));
    this.centerCircles = true;
    this.centerCirclesRad = 200;
    this.centerLines = true;
    this.centerCoords = true;
    this.debugInfo = true;
    // DESC
    this.layers = new Array();

    this.updatePos = false;

    this.Update = function () {
        console.log("updated check boxes");
    }

    this.Init = function () {
        console.log("initialized check boxes");
    }

};
Spatial.Display = new Display();

var Math3 = function () {
  	this.RotatePoint = function(vector, angle) {
  		var newVector = new Vector3();
  		newVector.x = ((vector.x)*Math.cos(angle) - (vector.y)*Math.sin(angle));   
        newVector.y = ((vector.x)*Math.sin(angle) + (vector.y)*Math.cos(angle));
        newVector.z = vector.z;
        return newVector;
  	}

	this.Translate = function(vector, translate) {
		var newVector = new Vector3();
		newVector.x = vector.x + translate.x;
		newVector.y = vector.y + translate.y;
		newVector.z = vector.z + translate.z;
		return newVector;
	}

	this.Scale = function(vector, scale) {
		var newVector = new Vector3();
		newVector.x = vector.x * scale;
		newVector.y = vector.y * scale;
		newVector.z = vector.z * scale;
		return newVector;
	}

	this.Dist = function(x1, y1, x2, y2) {
		return Math.sqrt( Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
	}
}

Spatial.Math3 = new Math3();

var GameObject = function () {

   	this.position = new Vector3();
   	this.calculatedPosition = new Vector3();
   	this.inCenter = true;
   	this.name;

   	this.CalculatePosition = function () {
        this.calculatedPosition = Spatial.Math3.Translate(this.position, Spatial.Transform.position);
        this.calculatedPosition = Spatial.Math3.RotatePoint(this.calculatedPosition, Spatial.Transform.rot);

        this.calculatedPosition.z =  (Spatial.Transform.position.z+this.position.z)
                                    + (this.calculatedPosition.y
        						    - (Spatial.Transform.position.z+this.position.z))/Math.tan(Spatial.Transform.ang); 

        this.calculatedPosition = Spatial.Math3.Scale(this.calculatedPosition, Spatial.Transform.scale);

        if( Spatial.Math3.Dist(this.calculatedPosition.x, this.calculatedPosition.y, 0, 0) <300 && Math.abs(Spatial.Transform.position.z+this.position.z)*Spatial.Transform.scale<300) {this.inCenter = true;} else{this.inCenter = false;}
    
   	}

};

var DataLayer = function (name, color, weight) {
	this.name = name;
	this.objects = new Array ();

	this.display = new gameobjectsDisplay(this.name, color, weight);
	Spatial.Display.layers.push(this.display);
}

var Data = function () {

	this.unitsPerPix = 1;
	this.unitName = "m";

	this.dataLayers = new Array();

};
Spatial.Data = new Data();


var Transform = function () {

	this.position = new Vector3();

   	this.ang = 1;
   	this.rot = 0.5;
   	this.scale = 1;
    this.axis = "y";

    this.TranslateByMouse = function (deltaMouseX, deltaMouseY) {
        var deltaMouse = new Vector3();
        deltaMouse.x = deltaMouseX;
        deltaMouse.y = deltaMouseY/Math.tan(this.ang);

        deltaMouse = Spatial.Math3.Scale(Spatial.Math3.RotatePoint(deltaMouse, -this.rot), 1/this.scale);
        this.position = Spatial.Math3.Translate(this.position, deltaMouse);
    
        this.position.z += (deltaMouseY-deltaMouseY/Math.tan(this.ang)) / this.scale;
    }

   	this.Update = function () {
   		document.getElementById("transformX").value = Math.round(this.position.x);
   		document.getElementById("transformY").value = Math.round(this.position.y);
   		document.getElementById("transformZ").value = Math.round(this.position.z);
   	}

   	this.Move = function () {
   		this.position.x = Math.round(document.getElementById("transformX").value);
   		this.position.y = Math.round(document.getElementById("transformY").value);
   		this.position.z = Math.round(document.getElementById("transformZ").value);
   		Spatial.Display.updatePos = true;
   	}

   	this.Set = function (vector) {
   		document.getElementById("transformX").value = Math.round(vector.x);
   		document.getElementById("transformY").value = Math.round(vector.y);
   		document.getElementById("transformZ").value = Math.round(vector.z);
   	}
};
Spatial.Transform = new Transform();