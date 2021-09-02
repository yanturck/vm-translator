const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const Parser = require('./Parser');
const CW = require('./CodeWriter');

const dir = argv['_'].pop();
console.log('Compilando!!!');

fs.readdirSync(dir).forEach(file => {
    if (file.indexOf('.vm') != -1) {
        
        const cmInput = dir + '/' + file;
        file = file.split('.');
        const cmOutput = dir + '/' + file[0] + '.asm';

        var p = new Parser(cmInput);
        var code = new CW(cmOutput);

        while (p.hasMoreCommands()) {
            var cmd = p.advance();
            switch (p.commandType()) {
                case 'arithmetic': code.writeArithmetic(cmd);
                    break;
                case 'push': code.writePush(p.agr1(), p.agr2());
                    break;
                case 'pop': code.writePop(p.agr1(), p.agr2());
                    break;
                default: console.log('Tipo indisponivel');
                    break;
            }
        }
    }
});
console.log('Compilado!');