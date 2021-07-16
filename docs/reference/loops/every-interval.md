# every Interval

Run part of the program in a loop continuously at a time interval.

```sig
loops.everyInterval(500, function () {})
```

If you want to run some code continuously, but on a time interval, then use an **every** loop. You set the amount of time that the loop waits before the code inside runs again. This is similar to a [forever](/reference/basic/forever) loop, in that it runs continuously, except that there's a time interval set to wait on before the loop runs the next time. This loop is useful when you want some of a program's code run on a _schedule_.

## Parameters

* **interval**: a [number](/types/number) that is the amount of time in milliseconds to wait before running the loop again.

### ~ reminder

#### Event-based loops

Both the **every** loop and the **forever** loop are _event-based_ loops where the code inside is run as part of a function. These are different from the [for](/blocks/loops/for) and [while](/blocks/loops/while) loops. Those are loops are part of the programming language and can have [break](/blocks/loops/break) and [continue](/blocks/loops/continue) statements in them.
You can NOT use **break** or **continue** in either an **every** loop or a **forever** loop.

### ~

## Example

At every `200` milliseconds of time, check if either the **A** or **B** button is pressed. If so, show on the screen which one is pressed.

```blocks
loops.everyInterval(200, function () {
    if (input.buttonIsPressed(Button.A)) {
        basic.showString("A")
    } else if (input.buttonIsPressed(Button.B)) {
        basic.showString("B")
    } else {
        basic.clearScreen()
    }
})
```

## See also

[forever](/reference/basic/forever)