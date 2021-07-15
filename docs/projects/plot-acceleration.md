# Plot Acceleration

## Introduction @unplugged

The ``||led:plot bar graph||`` uses the screen to display the _magnitude_ (how big a number is whether it's positive or negative) of a value. This is a great tool to understand the data returned by sensors... like the accelerometer.

## Acceleration

In a ``||basic:forever||`` loop, ``||led:plot||`` ``||input:acceleration||`` in the ``x`` dimension on the LEDs.

```blocks
basic.forever(function() {
    led.plotBarGraph(
        input.acceleration(Dimension.X),
        0
    )
})
```

## Console

Click on the **Show Console** button by the simulator to see a chart of the values plotted by the block over a period of time. Hover over the board in the simulator to make a force in the ``x`` dimension.

## Maximum value

If you specify the maximum value, the block can do a better job at displaying the data. 
For example, we can tell the block that we don't expect values beyond ``1000`` mg.

```blocks
basic.forever(function() {
    led.plotBarGraph(
        input.acceleration(Dimension.X),
        1000
    )
})
```

## Other sensors

You can use this block for pretty much any kind of data. Try it out! Plot the ``||input:light level||`` inside the ``||loops:forever||`` instead. Play with the light sensor in the simulator. 

```blocks
basic.forever(function() {
    led.plotBarGraph(
        input.lightLevel(),
        0
    )
})
```

## Download and try

Download the code to your @boardname@ and test the sensors.
