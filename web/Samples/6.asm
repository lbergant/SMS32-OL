; =========================================================
;                   LESSON 6: Function call
; =========================================================
; In this lesson we will get to know ORG CALL and RET operators
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TO DO at a time with code and repeat from step 1
;
; Result: AL = 33 (0x21)
; =========================================================

    JMP Start   ; This command jumps to Start no matter the 
                ; value in SP
    
    ORG 10      ; This commands moves the code after it to 
                ; address 0x10
            
Start:          ; This is an address marker with value 0x10 (16)
    MOV AL,10
    CALL 20     ; CALL moves current IP to the stack (bottom
                ; line of the memory) and starts executing
                ; code at address 20
                
    ; TO DO: Call DoubleAL at address 0x30 (48)

    MOV AL,20
    ; TO DO: Call DoubleAndHalve

    CALL F0

    ORG F0  ; This commands moves the code after it to 
            ; address 0x10
    NOP
    END

    ORG 30
DoubleAL:
    MUL AL,2
    ; TO DO: Return back

    ORG 20
HalveAL:
    DIV AL,2
    RET

    ORG 40
DoubleAndHalve:
    ; TO DO: Call DoubleAL at address 0x30 (48)

    ADD AL,2

    ; TO DO: Call HalveAL  at address 0x20 (32)

    ADD AL,2

    ; TO DO: Return back