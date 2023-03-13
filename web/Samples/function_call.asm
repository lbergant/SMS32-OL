; ====== Description ======
; This program demonstrates a subfunction call
; ====== =========== ======

	MOV AL,8 ;Number of times to add
	MOV BL,2 ;Number to add
	MOV CL,0 ;Result register
	CALL 20  ;Call function
	CALL 30
	END

; Subfunction that AL times adds BL to CL
	ORG 20
Loop:
	ADD CL,BL
	ADD AL,FF
	JNZ Loop
	RET

; Subfunction that changes AL<->BL
	ORG 30
	PUSH AL
	PUSH BL
	POP AL
	POP BL
	RET