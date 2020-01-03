* = $0051

.BYTE 03
.BYTE 05

* = $0100

  CLC
  LDA *$51
  ADC *$52
  STA *$53
  BRK

.END
