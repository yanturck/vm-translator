const fs = require('fs');

class CodeWriter {
    constructor (asmFile) {
        // dado o nome do arquivo .asm, que será escrito com o código assembly, irá abrir o arquivo.
        this.fOutput = asmFile;
        fs.writeFileSync(this.fOutput, ''); // apagando conteúdo do arquivo

        this.subCount = 1;
    }

    write (data) {
        fs.appendFileSync(this.fOutput, `${data}\n`);
    }

    segmentPointer (segment, index) {
        switch (segment) {
            case 'local': return 'LCL';
            case 'argument': return 'ARG';
            case 'this': return segment.toUpperCase();
            case 'that': return segment.toUpperCase();
            case 'temp': return `@R${5+parseInt(index)}`;
            case 'pointer': return `@R${3+parseInt(index)}`;
            case 'static':
                var aux1 = this.fOutput.split('/');
                var aux2 = aux1.pop().split('.');
                return `@${aux2[0]}.${index}`;
            default: console.log(`${segment}: Segmento não reconhecido!`);
        }

    }

    writeBinaryArithmetic () {
        this.write('@SP');
        this.write('AM=M-1');
        this.write('D=M');
        this.write('A=A-1');
    }
    writeArithmeticAdd () {
        this.writeBinaryArithmetic();
        this.write('M=D+M');
    }
    writeArithmeticSub () {
        this.writeBinaryArithmetic();
        this.write('M=M-D');
    }
    writeArithmeticAnd () {
        this.writeBinaryArithmetic();
        this.write('M=D&M');
    }
    writeArithmeticOr () {
        this.writeBinaryArithmetic();
        this.write('M=D|M');
    }

    writeUnaryArithmetic () {
        this.write('@SP');
        this.write('A=M');
        this.write('A=A-1');
    }
    writeArithmeticNeg () {
        this.writeUnaryArithmetic();
        this.write('M=-M');
    }
    writeArithmeticNot () {
        this.writeUnaryArithmetic();
        this.write('M=!M');
    }

    writeArithmeticEq () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$EQ$');
        this.write('0;JMP');
        this.write(`($RET${this.subCount})`);
        this.subCount++;
    }
    writeArithmeticGt () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$GT$');
        this.write('0;JMP');
        this.write(`($RET${this.subCount})`);
        this.subCount++;
    }
    writeArithmeticLt () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$LT$');
        this.write('0;JMP');
        this.write(`($RET${this.subCount})`);
        this.subCount++;
    }

    writeArithmetic (command) {
        // irá escrever o código assembly equivalente a um dado um comando lógico ou aritmético.
        switch (command) {
            case 'add': this.writeArithmeticAdd();
                break;
            case 'sub': this.writeArithmeticSub();
                break;
            case 'and': this.writeArithmeticAnd();
                break;
            case 'or': this.writeArithmeticOr();
                break;
            case 'neg': this.writeArithmeticNeg();
                break;
            case 'not': this.writeArithmeticNot();
                break;
            case 'eq': this.writeArithmeticEq();
                break;
            case 'lt': this.writeArithmeticLt();
                break;
            case 'gt': this.writeArithmeticGt();
                break;
            default:
                console.log('Comando não encontrado!');
                break;
        }
    }

    writePush (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        var aux1 = ['static', 'temp', 'pointer'];
        var aux2 = ['local', 'argument', 'this', 'that'];

        if (seg == 'constant') {
                this.write(`@${index} // push ${seg} ${index}`);
                this.write('D=A');
                this.write('@SP');
                this.write('A=M');
                this.write('M=D');
                this.write('@SP');
                this.write('M=M+1');
        } else if (aux2.includes(seg)) {
                this.write(`@${this.segmentPointer(seg, index)} // push ${seg} ${index}`);
                this.write('D=M');
                this.write(`@${index}`);
                this.write('A=D+A');
                this.write('D=M');
                this.write('@SP');
                this.write('A=M');
                this.write('M=D');
                this.write('@SP');
                this.write('M=M+1');
        } else if (aux1.includes(seg)) {
                this.write(`${this.segmentPointer(seg, index)} // push ${seg} ${index}`);
                this.write('D=M');
                this.write('@SP');
                this.write('A=M');
                this.write('M=D');
                this.write('@SP');
                this.write('M=M+1');
        }
    }

    writePop (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        var aux1 = ['static', 'temp', 'pointer'];
        var aux2 = ['local', 'argument', 'this', 'that'];

        if (aux1.includes(seg)) {
            this.write(`@SP // pop ${seg} ${index}`);
            this.write('M=M-1');
            this.write('A=M');
            this.write('D=M');
            this.write(this.segmentPointer(seg, index));
            this.write('M=D');
        } else if (aux2.includes(seg)) {
            this.write(`@${this.segmentPointer(seg, index)} // pop ${seg} ${index}`);
            this.write('D=M');
            this.write(`@${index}`);
            this.write('D=D+A');
            this.write('@R13');
            this.write('M=D');
            this.write('@SP');
            this.write('M=M-1');
            this.write('A=M');
            this.write('D=M');
            this.write('@R13');
            this.write('A=M');
            this.write('M=D');
        }
    }

    // close () {
    //     // fecha o arquivo
    // }
}
module.exports = CodeWriter;