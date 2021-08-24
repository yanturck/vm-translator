const Parser = require('./Parser');
const CW = require('./CodeWriter');

const cmInput = 'BasicTest.vm';
const cmOutput = 'BasicTest.asm';

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