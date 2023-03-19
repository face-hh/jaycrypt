const rl = require('readline-sync');
const chalk = require('chalk');

function caesarCipherEncrypt(text, shift) {
	let result = '';

	for (let i = 0; i < text.length; i++) {
		let char = text[i];

		// Ignore non-alphabetic characters
		if (!char.match(/[a-z]/i)) {
			result += char;
			continue;
		}

		// Get the character code and handle uppercase/lowercase separately
		let code = char.charCodeAt(0);
		const isUpperCase = (code >= 65 && code <= 90);
		code = code - (isUpperCase ? 65 : 97);

		// Apply the shift and handle wrapping
		code = (code + shift) % 26;

		// Convert back to a character and preserve case
		char = String.fromCharCode(code + (isUpperCase ? 65 : 97));
		result += char;
	}

	return result;
}

function caesarCipherDecrypt(text, shift) {
	// To decrypt, simply shift in the opposite direction
	return caesarCipherEncrypt(text, 26 - shift);
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		// Generate a random index between 0 and i (inclusive)
		const j = Math.floor(Math.random() * (i + 1));

		// Swap the elements at indices i and j
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}

function hexEncode(str) {
	let hexStr = '';
	for (let i = 0; i < str.length; i++) {
		const hex = str.charCodeAt(i).toString(16);
		hexStr += hex.padStart(2, '0');
	}
	return hexStr;
}

function hexDecode(hexStr) {
	let str = '';
	for (let i = 0; i < hexStr.length; i += 2) {
		const hex = hexStr.substr(i, 2);
		const charCode = parseInt(hex, 16);
		str += String.fromCharCode(charCode);
	}
	return str;
}

(async () => {
	const type = rl.question(`What would you like to do? (encrypt = ${chalk.blue('0')}, decrypt = ${chalk.red('1')}): \x1b[32m`);
	if(!['0', '1'].includes(type)) return console.log('\x1b[0mERROR: Only type 0 & 1 is available.');

	switch(type) {

	case '0':{
		let string = rl.question(`\x1b[0m[${chalk.green('1')}/1] Input the string to encrypt: \x1b[32m`);
		const num = Math.floor(Math.random() * 30) + 1;

		const encryptions = shuffleArray(['base64', 'hex', 'caesar']);

		for(let i = 0; i < encryptions.length; i++) {
			switch(encryptions[i]) {
			case 'base64':
				string = btoa(string);
				break;
			case 'hex':
				string = hexEncode(string);
				break;
			case 'caesar':
				string = caesarCipherEncrypt(string, num);
				break;
			}
		}

		console.log('\x1b[0m');
		console.log({ string, caesar_shifter: num, encryptions: encryptions.join(',') });
		break;
	}
	case '1':{

		const encodedString = rl.question(`\x1b[0m[${chalk.red('1')}/3] Input the ${chalk.yellow('string')} to decrypt: \x1b[31m`);
		const caesarShifter = parseInt(rl.question(`\x1b[0m[${chalk.yellow('2')}/3] Input the ${chalk.yellow('Caesar shifter')} to decrypt: \x1b[31m`));
		const encryptions = rl.question(`\x1b[0m[${chalk.green('3')}/3] Input the ${chalk.yellow('encryptions')} (ex. hex-base64-caesar): \x1b[31m`).split(',');

		let decodedString = encodedString;

		for(let i = encryptions.length - 1; i >= 0; i--) {
			switch(encryptions[i]) {
			case 'base64':
				decodedString = atob(decodedString);
				break;
			case 'hex':
				decodedString = hexDecode(decodedString);
				break;
			case 'caesar':
				decodedString = caesarCipherDecrypt(decodedString, caesarShifter);
				break;
			}
		}

		console.log(`\x1b[0m[${chalk.green('+')}] Decoded string: ${chalk.green(decodedString)}`);
	}
	}
})();