; =========================================================
;                   LESSON 9: Outputs
; =========================================================
; In this lesson we will get to know OUT command
;
; ! This example requires usage of Traffic output
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TO DO at a time with code and repeat from step 1
;
; Result: Traffic lights run in a realistic sequence:
;           ( R1G2, Y1Y2, G1R2, Y1Y2, R1G2 ... )
; =========================================================

Start:
			; Turn off all the traffic lights.
    MOV AL,0	; Copy 00000000 into the AL register.
    OUT 01		; Send AL to Port One (The traffic lights).
				; Turn on all the traffic lights.
    MOV AL,FC	; Copy 11111100 into the AL register.
    OUT 01		; Send AL to Port One (The traffic lights).
    JMP Start	; Jump back to the start.
    END		; Program ends.
	

;	TO DO
;	=========
;	Use the help page on Hexadecimal and ASCII codes.
;	Work out what hexadecimal numbers will activate the
;	correct traffic lights. Modify the program to step
;	the lights through a realistic sequence.