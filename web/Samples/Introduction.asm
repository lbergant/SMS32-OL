; =========================================================
;                    LESSON 1: Introduction
; =========================================================
; In this lesson we will begin to learn about learning 
; in assembly language. 

; 1. Try to ASSEMBLE and RUN this example
; 2. Reset the simulation by pressing RESET
; 3. Get familiar with STEP by step execution.
; 4. See how the values in registers are changeing after 
;    every step is executed
; =========================================================

    MOV AL,2    ; Value 2 is written to register AL (AL = 2)

    MOV BL,3    ; Value 3 is written to register BL (BL = 3)

    ADD AL,BL   ; Values from AL and BL are added and result 
                ; is stored in AL (AL = AL + BL)