from time import sleep
import board
import neopixel
pixels = neopixel.NeoPixel(board.D18, 10)

for x in range(0, 9):
    pixels[x] = (255, 0, 0)
    sleep(1)

pixels.fill((0, 0, 0))
