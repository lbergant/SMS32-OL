; =========================================================
;                   LESSON 10: Shifting
; =========================================================
; In this lesson we will get to know OUT command
;
; ! This example requires usage of 7 Seg output (OUT 02)
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TO DO at a time with code and repeat from step 1
;
; Result: Both 7 segment displays display a "loading" motion
; =========================================================

; ===== Seven Segment Displays Port 02 =================
Start:
    ; === Example on how to write to 7 seg display ===
    ; This is just an example and should be commented out
	MOV CL,7C   ; 0xFE = 1111 1100
    MOV [60],CL
    MOV AL,[60]
	OUT 02	    ; Send the data in AL to Port 02 (7 Seg)
	OR AL,1
	OUT 02	    ; Send the data in AL to Port 02 (7 Seg)

    ROR CL   ; 0xFE = 1111 1100
    OR CL,80
    AND CL,FD
    MOV [60],CL
    MOV AL,[60]
	OUT 02	    ; Send the data in AL to Port 02 (7 Seg)
	OR AL,1
	OUT 02	    ; Send the data in AL to Port 02 (7 Seg)
    ; === Example ends here ===

    MOV AL,7D
    
loop:
    
    CALL 30 ;Write value from AL to both displays
    ; TO DO: Move the values so it forms a loading pattern
    ; HINT: Use ROR, ROL, SHL, SHR
    JMP loop
	
	END

; === Write value from AL to both displays
    ORG 30
    PUSH AL
    AND AL,FE
    OUT 02
    OR AL,01
    OUT 02
    POP AL
    RET
; ================================