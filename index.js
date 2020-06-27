// Credits https://gist.github.com/dennishall1/3e96d52e73db20b27cd0

const fs = require('fs-extra')
const path = require('path');

// configs
const config = {
	sprite: 'input/icons.svg',
	output: 'output/',
	prefix: 'icon-'
}

// clean out dir before start
fs.emptyDirSync(config.output)
console.log('Out dir cleaned...')

let markup = fs.readFileSync(config.sprite).toString();
let lines = markup.split(/\n/g);
let symbols = {};
let currentSymbol = null;

lines.forEach(function(line){
	let open = line.match(/symbol.*?id="(.*?)"/);
	let close = line.match(/<\/symbol>/);
	if(currentSymbol){
		symbols[currentSymbol].push(line);
	}
	if(open){
		currentSymbol = open[1].replace(config.prefix, '');
		symbols[currentSymbol] = [line];
	}
	if(close){
		symbols[currentSymbol] = symbols[currentSymbol].join('\n').replace('<symbol', '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"').replace('</symbol', '</svg');
		fs.writeFileSync(path.join(__dirname, config.output, currentSymbol + '.svg'), symbols[currentSymbol]);
		currentSymbol = null;
	}
});

console.log( Object.keys(symbols) );
