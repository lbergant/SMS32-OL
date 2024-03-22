; =========================================================
;                   LESSON 5: Loops
; =========================================================
; In this lesson we will get to know JNZ CMP INC and NOP command
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TODO at a time with code and repeat from step 1
;
; Result: AL = 255 (0xFF)
; =========================================================
    MOV AL,1
Start:      ; This is a line marker and marks the location 
            ; of the next line in memory

    NOP     ; This command is a no-operation command and 
    NOP     ; does nothing
    NOP     ; -||-
    
    ; TODO: This loop never finishes. Increment AL here with
    ;           a) ADD command
    ;           b) INC AL command
    
    CMP AL,A    ; Sets Z bit in SR when values are equal
    JNZ Start   ; Jumps if Z bit is NOT set
    MOV AL,FF