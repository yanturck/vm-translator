const fs = require('fs');

class Parser {
    constructor (vmFile) {
        this.commands = fs.readFileSync(vmFile,'utf8').split('\r\n'); // lista de comandos
        this.commandC = ''; // comando corrente
    }

    hasMoreCommands () {
        // Retorna um valor booleano indicando se ainda existem comandos
        if (this.commands.length == 0){
            return false;
        } else {
            return true;
        }
    }

    advance () {
        // lê o primeiro comando
        if (this.hasMoreCommands()) {
            this.commandC = this.commands.shift();
            return this.commandC;
        } else {
            console.log('Acabou os comandos!');
        }
    }
    commandType () {
        // Retorna o tipo de comando: Arithmetic, Push, Pop, Label, Goto, If, Function, Return, Call
        if (this.commandC.length > 4) {
            const tipos = ['push', 'pop', 'label', 'goto', 'if', 'function', 'return', 'call'];
            var aux = this.commandC.split(' ');

            if (tipos.includes(aux[0])) {
                return aux[0];
            } else {
                console.log('Comando não reconhecido');
            }
        } else {
            const arithmetic = ['add', 'sub', 'neg', 'eq', 'gt', 'lt', 'and', 'or', 'not'];

            if (arithmetic.includes(this.commandC)) {
                return 'arithmetic';
            } else {
                console.log('Comando não reconhecido');
            }
        }
    }

    agr1 () {
        // Retorna uma string que é o primeiro argumento do comando.
        // No caso de aritmético ou lógico, deve-se retornar o próprio comando (add, sub).
        // Não deve ser chamado no caso do comando Return.
        if (this.commandC.length > 3) {
            var aux = this.commandC.split(' ');
            return aux[1];
        } else {
            return this.commandC;
        }
    }

    agr2 () {
        // Retorna o segundo argumento do comando corrente e so deve ser chamado para os comandos Push, Pop, Function ou Call.
        if (this.commandC.length > 3) {
            var aux = this.commandC.split(' ');
            return aux[2];
        } else {
            return this.commandC;
        }
    }
}
module.exports = Parser;