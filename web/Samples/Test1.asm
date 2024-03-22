; =========================================================
;                   LESSON 6: Repeat
; =========================================================
; With the knowledge gathered from previous lessons make a 
; program that writes 10000000b to AL and than moves the 1 
; to turn on all of the 7 segment display parts (a to f)
;
; Example of AL register: 10000000 -> 01000000 -> 00100000 -> ... -> 00000010
; 
; FOR THIS EXAMPLE YOU MUST ENABLE "7 Seg" IN THE OUTPUT PANEL ON THE RIGHT
;
; 1. Try to ASSEMBLE and RUN this example
; 2. Replace one TODO at a time with code and repeat from step 1
;
; Result: 
; =========================================================

    MOV AL,FF ; Remove this line. this is an example

    ; START 
    ; This part sends the data to 7 segment display
    AND AL,FE
    OUT 02
    OR AL,1
    OUT 02	; Send the data in AL to 7 segment display
    ; END