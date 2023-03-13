	; Overflow -86
	MOV AL,AA
	ROL AL
	SHL AL
	SHR AL
	ROR AL

	; Underflow 5
	MOV AL,5
	ROR AL
	SHR AL
	SHL AL
	ROL AL