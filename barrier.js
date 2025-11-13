/**
 * License Plate Barrier System
 */
/**
 * Micro:bit JavaScript Code
 */
// Function to close barrier
function closeBarrier () {
    // Barrier down position
    pins.servoWritePin(AnalogPin.P0, 0)
    barrierOpen = false
    basic.showIcon(IconNames.No)
    serial.writeLine("Barrier closed")
}
// Manual control with buttons
input.onButtonPressed(Button.A, function () {
    openBarrier()
    serial.writeLine("Manual open - Button A")
})
// Function to open barrier
function openBarrier () {
    // Barrier up position
    pins.servoWritePin(AnalogPin.P0, 90)
    barrierOpen = true
    basic.showIcon(IconNames.Yes)
    serial.writeLine("Barrier opened")
}
input.onButtonPressed(Button.B, function () {
    closeBarrier()
    basic.showString("READY")
    serial.writeLine("Manual close - Button B")
})
// Shake to reset
input.onGesture(Gesture.Shake, function () {
    closeBarrier()
    basic.showString("RESET")
    serial.writeLine("System reset")
    basic.pause(1000)
    basic.showString("READY")
})
// Handle serial commands from laptop
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    receivedCommand = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    // Remove any extra spaces
    receivedCommand = receivedCommand.trim();
serial.writeLine("Received: " + receivedCommand)
    if (receivedCommand == "OPEN") {
        if (!(barrierOpen)) {
            openBarrier()
            // Keep barrier open for 5 seconds, then auto-close
            basic.pause(5000)
            closeBarrier()
            basic.showString("READY")
        }
    } else if (receivedCommand == "CLOSE") {
        closeBarrier()
        basic.showString("READY")
    } else if (receivedCommand == "STATUS") {
        if (barrierOpen) {
            serial.writeLine("STATUS: OPEN")
        } else {
            serial.writeLine("STATUS: CLOSED")
        }
    }
})
let barrierOpen = false
let receivedCommand = ""
// Initial setup
basic.showString("READY")
// Barrier down position
pins.servoWritePin(AnalogPin.P0, 0)
barrierOpen = false
// Send startup message
basic.pause(1000)
serial.writeLine("MICRO:BIT BARRIER SYSTEM STARTED")
// Main loop - show status periodically
basic.forever(function () {
    if (!(barrierOpen)) {
        basic.showString("READY")
        basic.pause(5000)
    }
})
