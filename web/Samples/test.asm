	JMP Start
	DB 176
	DB 0
	DB 3
;	DB "Hello"
	ORG 32
Start:
; Tukaj se program zacne
	MOV AL,5
	MOV BL,[4]
	ADD AL,BL
	JMP End
	JMP Start
End:
	end