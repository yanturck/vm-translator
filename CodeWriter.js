
class CodeWriter {

    construtor () {
        // dado o nome do arquivo .asm, que será escrito com o código assembly, irá abrir o arquivo.
    }

    writeArithmetic () {
        // irá escrever o código assembly equivalente a um dado um comando lógico ou aritmético.
        var result = '@SP\n';
        const command = commandType;
        
        var aux1 = ['add', 'sub', 'and', 'or'];
        var aux2 = ['eq', 'gt', 'lt'];
        var aux3 = ['neg', 'not'];

        if (aux1.includes(command)){
            result += 'AM=M-1\n';
            result += 'D=M\n';
            result += 'A=A-1';

            switch (command) {
                case 'add': result += 'M = D+M\n';
                    break;
                case 'sub': result += 'M = D-M\n';
                    break;
                case 'and': result += 'M = D&M\n';
                    break;
                case 'or': result += 'M = D|M\n';
                    break;
            }
        } else if (aux2.includes(command)) {
            result += 'AM=M-1\n';
            result += 'D=M\n';
            result += '@SP\n';
            result += 'AM=M-1\n';
            result += 'D=M-D\n'; // subtrai os valores da pilha e guarda em D
            result += '@VERDADEIRO\n';

            switch (command) {
                case 'eq': result += 'D;JLT\n';
                    break;
                case 'gt': result += 'D;JGT\n';
                     break;
                case 'eq': result += 'D;JEQ\n';
                    break;
            }

            result += 'D=0\n';
            result += '@EMPILHANDO\n';
            result += '0;JMP\n';
            result += '(VERDADEIRO)\n';
            result += 'D=-1\n';
            result += '(EMPILHANDO)\n';
            result += '@SP\n';
            result += 'A=M\n';
            result += 'M=D\n';
            result += '@SP\n';
            result += 'M=M+1\n';
        } else if (aux3.includes(command)) {
            result += 'A=M\n';
            result += 'A=A-1\n';

            switch (command) {
                case 'neg': result += '!M\n';
                    break;
                case 'not': result += '-M\n';
                    break;
            }
        }
        return result;
    }

    writePush (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        var result = ''
        switch (seg) {
            case 'constant':
                result += `@${index} // push ${seg} ${index}`;
                result += 'D=A\n';
                result += '@SP\n';
                result += 'A=M\n';
                result += 'M=D\n';
                result += '@SP\n';
                result += 'M=M+1\n';
                break;
            case 'local' || 'argument' || 'this' || 'that':
                // falta
                result += 'M=D\n';
                // falta
                result += 'A=D+A\n';
                result += 'D=M\n';
                result += '@SP\n';
                result += 'A=M\n';
                result += 'M=D\n';
                result += '@SP\n';
                result += 'M=M+1\n';
                break;
            case 'static' || 'temp' || 'pointer':
                // falta
                result += 'D=M\n';
                result += '@SP\n';
                result += 'A=M\n';
                result += 'M=D\n';
                result += '@SP\n';
                result += 'M=M+1\n';
                break;
        }
        return result;
    }

    writePop (seg, index) {
        // dado o segmento e o indice irá escrever o codigo assembly equivalente
        var result = '';
        switch (seg) {
            case 'static' || 'temp' || 'pointer':
                result += `@SP // push ${seg} ${index}\n`;
                result += 'M=M-1\n';
                result += 'A=M\n';
                result += 'D=M\n';
                // falta
                result += 'M=D\n';
                break;
            case 'local' || 'argument' || 'this' || 'that':
                // falta
                result += 'D=M\n';
                // falta
                result += 'D=D+A\n';
                result += '@R13\n';
                result += 'M=D\n';
                result += '@SP\n';
                result += 'M=M-1\n';
                result += 'A=M\n';
                result += 'D=M\n';
                result += '@R13\n';
                result += 'A=M\n';
                result += 'M=D\n';
                break;
        }
        return result;
    }

    close () {
        // fecha o arquivo
    }
}