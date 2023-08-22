#!/usr/bin/env python3
# May be used to generate a list of characters to be handled in blad.cls
# Note that the actual LaTeX equivalent must be set manually, by changing "\CHANGEME" in the output.

# E.g. 0x0394 to 0x03D5, input 0394 and 03D5
print("Enter your unicode range (base 16, e.g. 03D5).")
start_codepoint = int(input("Starting codepoint: "), 16)
stop_codepoint = int(input("Ending codepoint: "), 16)

if stop_codepoint < start_codepoint:
    print("Empty or negative codepoint range.")
elif stop_codepoint - start_codepoint > 1000:
    print("More than 1000 codepoints would be generated. Aborting.")
else:
    for codepoint in range(start_codepoint, stop_codepoint + 1):
        unicode_char = chr(codepoint)
        padded_codepoint = format(codepoint, '04X')
        latex_representation = f"\\DeclareUnicodeCharacter{{{padded_codepoint}}}{{$\\CHANGEME$}} % {unicode_char}"
        print(latex_representation)