const fs = require('fs');

class CodeWriter {

    construtor (asmFile) {
        // dado o nome do arquivo .asm, que será escrito com o código assembly, irá abrir o arquivo.
        this.fOutput = asmFile;
    }

    write (data) {
        fs.writeFileSync(this.fOutput, data);
    }

    segmentPointer (segment, index) {
        switch (segment) {
            case 'local': return 'LCL\n';
            case 'argument': return 'ARG\n';
            case 'this', 'that': return segment.toUpperCase() + '\n';
            case 'temp': return `R${5+index}\n`;
            case 'pointer': return `R${3+index}\n`;
            case 'static': return `${segment}.${index}\n`;
            default: console.log('Deu pau!!');
        }

    }

    writeArithmetic (command) {
        // irá escrever o código assembly equivalente a um dado um comando lógico ou aritmético.
        this.write('@SP\n');
        var aux1 = ['add', 'sub', 'and', 'or'];
        var aux2 = ['eq', 'gt', 'lt'];
        var aux3 = ['neg', 'not'];

        if (aux1.includes(command)){
            this.write('AM=M-1\n');
            this.write('D=M\n');
            this.write('A=A-1\n');

            switch (command) {
                case 'add': this.write('M = D+M\n');
                    break;
                case 'sub': this.write('M = D-M\n');
                    break;
                case 'and': this.write('M = D&M\n');
                    break;
                case 'or': this.write('M = D|M\n');
                    break;
            }
        } else if (aux2.includes(command)) {
            this.write('AM=M-1\n');
            this.write('D=M\n');
            this.write('@SP\n');
            this.write('AM=M-1\n');
            this.write('D=M-D\n'); // subtrai os valores da pilha e guarda em D
            this.write('@VERDADEIRO\n');

            switch (command) {
                case 'eq': this.write('D;JLT\n');
                    break;
                case 'gt': this.write('D;JGT\n');
                     break;
                case 'eq': this.write('D;JEQ\n');
                    break;
            }

            this.write('D=0\n');
            this.write('@EMPILHANDO\n');
            this.write('0;JMP\n');
            this.write('(VERDADEIRO)\n');
            this.write('D=-1\n');
            this.write('(EMPILHANDO)\n');
            this.write('@SP\n');
            this.write('A=M\n');
            this.write('M=D\n');
            this.write('@SP\n');
            this.write('M=M+1\n');
        } else if (aux3.includes(command)) {
            this.write('A=M\n');
            this.write('A=A-1\n');

            switch (command) {
                case 'neg': this.write('!M\n');
                    break;
                case 'not': this.write('-M\n');
                    break;
            }
        }
        return result;
    }

    writePush (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        switch (seg) {
            case 'constant':
                this.write(`@${index} // push ${seg} ${index}`);
                this.write('D=A\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
            case 'local' || 'argument' || 'this' || 'that':
                this.write(this.segmentPointer(seg, index));
                this.write('M=D\n');
                this.write(`@${index}`);
                this.write('A=D+A\n');
                this.write('D=M\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
            case 'static' || 'temp' || 'pointer':
                this.write(this.segmentPointer(seg, index));
                this.write('D=M\n');
                this.write('@SP\n');
                this.write('A=M\n');
                this.write('M=D\n');
                this.write('@SP\n');
                this.write('M=M+1\n');
                break;
        }
        return result;
    }

    writePop (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        switch (seg) {
            case 'static' || 'temp' || 'pointer':
                this.write(`@SP // push ${seg} ${index}\n`);
                this.write('M=M-1\n');
                this.write('A=M\n');
                this.write('D=M\n');
                this.write(this.segmentPointer(seg, index));
                this.write('M=D\n');
                break;
            case 'local' || 'argument' || 'this' || 'that':
                this.write(this.segmentPointer(seg, index));
                this.write('D=M\n');
                this.write(`@${index}`);
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
        return result;
    }

    // close () {
    //     // fecha o arquivo
    // }
}
exports.CodeWriter = CodeWriter;