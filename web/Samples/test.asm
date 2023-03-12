	JMP Start
	DB FE
	DB 0
	DB 3
;	DB "Hello"
	ORG 20
Start:
; Tukaj se program zacne
	MOV AL,5
	MOV BL,[4]
	MOV [2],BL
	ADD AL,BL
	JMP End
	JMP Start
End:
	end