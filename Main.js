const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const Parser = require('./Parser');
const CW = require('./CodeWriter');

const dir = argv['_'].pop();
console.log('Compilando...');

var path = dir.split('/');
const cmOutput = dir + '/' + path.pop() + '.asm';
var code = new CW(cmOutput);

fs.readdirSync(dir).forEach(file => {
    if (file.indexOf('.vm') != -1) {
        
        const cmInput = dir + '/' + file;
        file = file.split('.');
        code.setFileName(file[0]);

        var p = new Parser(cmInput);

        while (p.hasMoreCommands()) {
            var cmd = p.advance();
            switch (p.commandType()) {
                case 'arithmetic': code.writeArithmetic(cmd);
                    break;
                case 'push': code.writePush(p.agr1(), p.agr2());
                    break;
                case 'pop': code.writePop(p.agr1(), p.agr2());
                    break;
                case 'label': code.writeLabel(p.agr1());
                    break;
                case 'goto': code.writeGoto(p.agr1());
                    break;
                case 'if-goto': code.writeIf(p.agr1());
                    break;
                case 'function': code.writeFunction(p.agr1(), p.agr2());
                    break;
                case 'return': code.writeReturn();
                    break;
                case 'call': code.writeCall(p.agr1(), p.agr2());
                    break;
                default: //console.log(p.commandType() + ': Tipo indisponivel');
                    break;
            }
        }
    }
});
console.log('Compilado!');