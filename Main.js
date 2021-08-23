const Parser = require('Parser');
const CW = require('CodeWriter');

const cmInput = 'BasicTest.vm';
const cmOutput = 'BasicTest.asm';

var p = new Parser(cmInput);
var code = new CW(cmOutput);

while (p.hasMoreCommands()) {
    const cmd = p.advance();
    switch (p.commandType()) {
        case 'arithmetic': code.writeArithmetic(cmd);
            break;
        case 'push': code.writePush(cmd[1], cmd[2]);
            break;
        case 'pop': code.writePop(cmd[1], cmd[2]);
            break;
    }

}