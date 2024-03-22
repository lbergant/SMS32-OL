; =========================================================
;                   LESSON 7: Data bytes
; =========================================================
; In this lesson we will get to know DB command
;
; ! This example requires usage of VDU Output
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TO DO at a time with code and repeat from step 1
;
; Result: 
; =========================================================

    JMP Init
    ORG 2
    DB 28           ; This declares one data byte
    ; TO DO: Declare a data byte with a value 29

    ORG 60
    DB "HelloWorld" ; This declares 10 data bytes using 
                    ; ascii values
    
    ORG 10
Init:
    MOV BL,0        ; Selects to which position to write
    MOV AL,[2]      ; Moves data from address 0x00 in RAM to AL
    CALL 40         ; Calls a function that writes data from AL
                    ; to VDU output on position in BL
    
    MOV CL,60       ; Loads 0x60 in to CL (this is where the start
                    ; of data is located in RAM)
    MOV AL,[CL]     ; Moves data from address 0x20 in RAM to AL
    INC BL          ; Increments write position
    CALL 40         ; Calls a function that writes data from AL
                    ; to VDU output on position in BL

    ; TO DO: Construct a loop so all "HelloWorld" characters are 
    ;        written to VDU output

    ; TO DO: Add a closing ) to VDU Output (Character code can 
    ;        be found on address 0x03 where you declared it)

    END

; Write to display, Write char in BL to position in AL
    ORG 40
    PUSH CL
    MOV CL,C0
    ADD CL,BL

    MOV [CL],AL
    POP CL
    RET


