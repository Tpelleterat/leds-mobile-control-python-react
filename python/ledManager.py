from time import sleep
import board
import neopixel


class LedManager:

    def __init__(self):
        self.ledsCount = 10
        self.showLedNumber = 10
        self.ledsColor = (0, 0, 255)

    def initLed(self):
        self.pixels = neopixel.NeoPixel(board.D18, self.ledsCount, auto_write=False)
        self.pixels.brightness = 0.2
        self.checkSequence()

    def checkSequence(self):
        for x in range(0, self.ledsCount - 1):
            self.pixels[x] = (0, 0, 255)
            self.pixels.show()
            sleep(0.05)

        self.turnOffAll()
        
    def turnOffAll(self):
        self.pixels.fill((0, 0, 0))
        self.pixels.show()

    def refreshLeds(self):
        self.pixels.fill((0, 0, 0))

        for x in range(0, self.showLedNumber):
            self.pixels[x] = self.ledsColor
        
        self.pixels.show()

    def changeNumber(self, number):
        finalnumber = number
        if finalnumber > self.ledsCount:
            finalnumber = self.ledsCount
        print("changeNumber")
        self.showLedNumber = finalnumber
        self.refreshLeds()

    def changeColor(self, colorTupleRgb):
        self.ledsColor = colorTupleRgb
        self.refreshLeds()
    
