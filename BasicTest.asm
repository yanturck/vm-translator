@10 // push constant 10
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL // pop local 0
D=M
@0
D=D+A
@R13
M=D
@SP
M=M-1
A=M
D=M
@R13
A=M
M=D
@21 // push constant 21
D=A
@SP
A=M
M=D
@SP
M=M+1
@22 // push constant 22
D=A
@SP
A=M
M=D
@SP
M=M+1
@36 // push constant 36
D=A
@SP
A=M
M=D
@SP
M=M+1
@42 // push constant 42
D=A
@SP
A=M
M=D
@SP
M=M+1
@45 // push constant 45
D=A
@SP
A=M
M=D
@SP
M=M+1
@510 // push constant 510
D=A
@SP
A=M
M=D
@SP
M=M+1
@LCL // push local 0
M=D
@0
A=D+A
D=M
@SP
A=M
M=D
@SP
M=M+1
@SP
AM=M-1
D=M
A=A-1
M=D+M
@SP
AM=M-1
D=M
A=A-1
M=D-M
@SP
AM=M-1
D=M
A=A-1
M=D+M
@SP
AM=M-1
D=M
A=A-1
M=D-M
@SP
AM=M-1
D=M
A=A-1
M=D+M
