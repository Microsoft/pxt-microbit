# forever

Keep running part of a program 
[in the background](/reference/control/in-background).

```sig
basic.forever(() => {
})
```

You can have part of a program continuously by placing it in an **forever** loop. The **forever** loop will _yield_ to the other code in your program though, allowing that code to have time to run when needs to.

### ~ reminder

#### Event-based loops

Both the **forever** loop and the **every** loop are _event-based_ loops where the code inside is run as part of a function. These are different from the [for](/blocks/loops/for) and [while](/blocks/loops/while) loops. Those are loops are part of the programming language and can have [break](/blocks/loops/break) and [continue](/blocks/loops/continue) statements in them.
You can NOT use **break** or **continue** in either a **forever** loop or an **every** loop.

### ~

## Examples

### Example: compass

The following example constantly checks the 
[compass heading](/reference/input/compass-heading) 
and updates the screen with the direction.

```blocks
let degrees = 0
basic.forever(() => {
    degrees = input.compassHeading()
    if (degrees < 45) {
        basic.showString("N")
    } else if (degrees < 135) {
        basic.showString("E")
    } else if (degrees < 225) {
        basic.showString("S")
    } else if (degrees < 315) {
        basic.showString("W")
    } else {
        basic.showString("N")
    }
})
```

### Example: counter

The following example keeps showing the [number](/types/number) stored in a global variable.
When you press button `A`, the number gets bigger.
You can use a program like this to count things with your @boardname@.

```blocks
let num = 0
basic.forever(() => {
    basic.showNumber(num)
})
input.onButtonPressed(Button.A, () => {
    num = num + 1
})
```

## Competing for the LED screen

If different parts of a program are each trying 
to show something on the LED screen at the same time, 
you may get unexpected results.
Try this on your @boardname@:

```blocks
basic.forever(() => {
    basic.showNumber(6789)
})
input.onButtonPressed(Button.A, () => {
    basic.showNumber(2)
})
```

## See also

[while](/blocks/loops/while), [in background](/reference/control/in-background), [every](/reference/loops/every-interval)

