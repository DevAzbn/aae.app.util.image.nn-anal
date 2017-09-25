'use strict';

var azbn = new require(__dirname + '/../../../../../system/bootstrap')({
	
});

var app = azbn.loadApp(module);

var argv = require('optimist')
	//.usage('Usage: $0 --path=[Path to root dir] --ext=[Fileext] --str=[String]')
	//.default('path', './')
	//.default('ext', '.php')
	.demand(['image'])
	.argv
;

var Jimp = require('jimp');

app.clearRequireCache(require);

// получение максимального элемента массива
function getMaxValue(array){
	var max = array[0]; // берем первый элемент массива
	for (var i = 0; i < array.length; i++) { // переберем весь массив
		// если элемент больше, чем в переменной, то присваиваем его значение переменной
		if (max < array[i]) max = array[i]; 
	}
	// возвращаем максимальное значение
	return max;
}
 
// получение минимального элемента массива
function getMinValue(array){
	var min = array[0];
	for (var i = 0; i < array.length; i++) {
		if (min > array[i]) min = array[i];
	}
	return min;
}

Jimp.read(argv.image, function (err, _image) {
	
	var image = _image.clone().greyscale().resize(256, 256);
	
	var _colors = {
		r : 0,
		g : 0,
		b : 0,
		a : 0,
	};
	
	var cnt = 0;
	
	//console.dir(Jimp.intToRGBA(image.getPixelColor(300, 300))); // returns the colour of that pixel e.g. 0xFFFFFFFF
	
	//image.getPixelColor(x, y);	  // returns the colour of that pixel e.g. 0xFFFFFFFF
	//image.setPixelColor(hex, x, y); // sets the colour of that pixel
	
	//Jimp.rgbaToInt(r, g, b, a); // e.g. converts 255, 255, 255, 255 to 0xFFFFFFFF
	//Jimp.intToRGBA(hex);		// e.g. converts 0xFFFFFFFF to {r: 255, g: 255, b: 255, a:255}
	
	for(var _x = 0; _x < image.bitmap.width; _x++) {
		for(var _y = 0; _y < image.bitmap.height; _y++) {
			
			(function(x, y){
				
				var rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
				
				var _val = parseInt((rgba.r + rgba.g + rgba.b) / 3)
				
				image.setPixelColor(Jimp.rgbaToInt(
					_val > 127 ? 0 : 255,
					_val > 127 ? 0 : 255,
					_val > 127 ? 0 : 255,
					_val > 127 ? 255 : 0
				), x, y);
				
				/*
				
				var _c = getMaxValue([
					rgba.r,
					rgba.g,
					rgba.b,
				]);
				
				image.setPixelColor(Jimp.rgbaToInt(
					(_c - rgba.r) == 0 ? _c : 0,
					(_c - rgba.g) == 0 ? _c : 0,
					(_c - rgba.b) == 0 ? _c : 0,
					rgba.a
				), x, y);
				
				*/
				
				/*
				_colors.r = _colors.r + rgba.r;
				_colors.g = _colors.g + rgba.g;
				_colors.b = _colors.b + rgba.b;
				_colors.a = _colors.a + rgba.a;
				
				cnt++;
				*/
				
			})(_x, _y);
			
		}
	}
	
	image.write(argv.image + '.' + image.getExtension());
	
	/*
	for(var prop in _colors) {
		
		_colors[prop] = parseInt(_colors[prop] / cnt);
		
	}
	
	console.dir(_colors);
	*/
});