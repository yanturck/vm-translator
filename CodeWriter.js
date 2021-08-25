const fs = require('fs');

class CodeWriter {
    constructor (asmFile) {
        // dado o nome do arquivo .asm, que será escrito com o código assembly, irá abrir o arquivo.
        this.fOutput = asmFile;
        fs.writeFileSync(this.fOutput, ''); // apagando conteúdo do arquivo

        this.subCount = 0;
    }

    write (data) {
        fs.appendFileSync(this.fOutput, data);
    }

    segmentPointer (segment, index) {
        switch (segment) {
            case 'local': return 'LCL';
            case 'argument': return 'ARG';
            case 'this', 'that': return segment.toUpperCase();
            case 'temp': return `R${5+index}`;
            case 'pointer': return `R${3+index}`;
            case 'static': return `${segment}.${index}`;
            default: console.log('Deu pau!!');
        }

    }

    writeBinaryArithmetic () {
        this.write('@SP\n');
        this.write('AM=M-1\n');
        this.write('D=M\n');
        this.write('A=A-1\n');
    }
    writeArithmeticAdd () {
        this.writeBinaryArithmetic();
        this.write('M=D+M\n');
    }
    writeArithmeticSub () {
        this.writeBinaryArithmetic();
        this.write('M=D-M\n');
    }
    writeArithmeticAnd () {
        this.writeBinaryArithmetic();
        this.write('M=D&M\n');
    }
    writeArithmeticOr () {
        this.writeBinaryArithmetic();
        this.write('M=D|M\n');
    }

    writeUnaryArithmetic () {
        this.write('@SP\n');
        this.write('A=M\n');
        this.write('A=A-1\n');
    }
    writeArithmeticNeg () {
        this.writeUnaryArithmetic();
        this.write('M=-M\n');
    }
    writeArithmeticNot () {
        this.writeUnaryArithmetic();
        this.write('M=!M\n');
    }

    writeArithmeticEq () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$EQ$');
        this.writer('0;JMP');
        this.writer(`(${this.subCount})`);
        this.subCount++;
    }
    writeArithmeticGt () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$GT$');
        this.writer('0;JMP');
        this.writer(`(${this.subCount})`);
        this.subCount++;
    }
    writeArithmeticLt () {
        this.write(`@$RET${this.subCount}`);
        this.write('D=A');
        this.write('@$LT$');
        this.writer('0;JMP');
        this.writer(`(${this.subCount})`);
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
        switch (seg) {
            case 'constant':
                this.write(`@${index} // push ${seg} ${index}\n`);
                this.write('D=A\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
            case 'local' || 'argument' || 'this' || 'that':
                this.write(`@${this.segmentPointer(seg, index)} // push ${seg} ${index}\n`);
                this.write('M=D\n');
                this.write(`@${index}\n`);
                this.write('A=D+A\n');
                this.write('D=M\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
            case 'static' || 'temp' || 'pointer':
                this.write(`@${this.segmentPointer(seg, index)} // push ${seg} ${index}`);
                this.write('D=M\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
        }
    }

    writePop (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        switch (seg) {
            case 'static' || 'temp' || 'pointer':
                this.write(`@SP // pop ${seg} ${index}\n`);
                this.write('M=M-1\n');
                this.write('A=M\n');
                this.write('D=M\n');
                this.write(this.segmentPointer(seg, index));
                this.write('M=D\n');
                break;
            case 'local' || 'argument' || 'this' || 'that':
                this.write(`@${this.segmentPointer(seg, index)} // pop ${seg} ${index}\n`);
                this.write('D=M\n');
                this.write(`@${index}\n`);
                this.write('D=D+A\n');
                this.write('@R13\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M-1\n');
                this.write('A=M\n');
                this.write('D=M\n');
                this.write('@R13\n');
                this.write('A=M\n');
                this.write('M=D\n');
                break;
        }
    }

    // close () {
    //     // fecha o arquivo
    // }
}
module.exports = CodeWriter;