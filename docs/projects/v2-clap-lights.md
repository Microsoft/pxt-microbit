# Clap Lights

## 1. Introduction @unplugged

The new @boardname@s have a microphone to help them detect sound 🎤

Let's learn how to use a clap 👏 to switch your @boardname@'s lights on and off! 

## 2. Setting up the sound input

🔊 **Reacting to sound** 🔊

---

► From the ``||input:Input||`` category, find the ``||input:on [loud] sound||`` container and add it to your workspace.

```blocks
input.onSound(DetectedSound.Loud, function () {

})
```

## 3. Creating a lightsOn variable

🤿 **Diving right in** 🤿

Let's begin by creating a [__*variable*__](#variable "a holder for information that may change") to keep track of whether the @boardname@'s lights are on or off.

---

► In the ``||variables:Variables||`` category, click on ``Make a Variable...`` and make a variable named ``lightsOn``.

## 4. Displaying LEDs part 1

🔆 **On or not?** 🌑

In this step, we'll be using an [__*if then / else*__](#ifthenelse "runs some code if a Boolean condition is true and different code if the condition is false") statement to change the ``lightsOn`` variable.

---

► From the ``||logic:Logic||`` category, grab an ``||logic:if <true> then / else||`` block and snap it into your ``||input:on [loud] sound||`` container.

► Look in the ``||variables:Variables||`` category. Find the new ``||variables:lightsOn||`` variable and snap it in to **replace** the ``||logic:<true>||`` argument in your ``||logic:if <true> then / else||`` statement.

```blocks
input.onSound(DetectedSound.Loud, function () {
    // @highlight
    if (lightsOn) {
    	
    } else {
    	
    }
})
```

## 5. Displaying LEDs part 2

🌞 **Lighting the display** 🌞

---

► From the ``||basic:Basic||`` category, grab a ``||basic:show leds||`` block and snap it into the **top container** of your ``||logic:if then / else||`` statement.

► Set the lights to a pattern you like!  
💡 Feel free to make your own design 🎨 In the hint, we chose to turn on all of the outside lights.

```blocks
input.onSound(DetectedSound.Loud, function () {
    if (lightsOn) {
        // @highlight
    	basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
    }
})
```

## 6. Clearing the screen

► From the ``||basic:Basic||`` category, find the ``||basic:clear screen||`` block and snap it into the **bottom container** of your ``||logic:if then / else||`` section.  
💡 This will turn the display off if ``lightsOn`` is not ``true``.

```blocks
let lightsOn = 0
input.onSound(DetectedSound.Loud, function () {
    if (lightsOn) {
    	basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
        // @highlight
    	basic.clearScreen()
    }
})
```

## 7. Setting the lightsOn variable

🎬 **Lights, camera, _action_** ✨

Just like we'd toggle a light switch, each time we clap we want to **flip** the variable ``lightsOn`` to the **opposite** of what it was before.

---

► From ``||variables:Variables||``, locate ``||variables:set [lightsOn] to [0]||`` and snap it in at the **very top** of your ``||input:on [loud] sound||`` container.

► From the ``||logic:Logic||`` category, find the ``||logic:not <>||`` operator and use it to **replace** the ``||variables:[0]||`` in ``||variables:set [lightsOn] to [0]||``.

► From ``||variables:Variables||``, grab ``||variables:lights on||`` and snap it into the **empty part** of the ``||logic:not <>||`` operator.

```blocks
let lightsOn = false
input.onSound(DetectedSound.Loud, function () {
    // @highlight
    lightsOn = !(lightsOn)
    if (lightsOn) {
    	basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
    	basic.clearScreen()
    }
})
```

## 8. Testing in the simulator

💡 **Let's test what you've created** 💡

---

► Check out the simulator!

► Click on the pink slider bar beneath the microphone icon and drag it up and down.  
💡 Right now, your @boardname@ thinks that anything above 128 is loud. Every time the sound goes > 128, your lights should switch on/off.

## 8. Set loud sound threshold

Your @boardname@ might detect sounds when you don't want it to. Setting a [__*sound threshold*__](#soundThreshold "a number for how loud a sound needs to be to trigger an event. 0 = silence to 255 = maximum noise") could help 🔉🔊

<hr/>

► In the ``||input:Input||`` category under ``||input:...more||``, find the ``||input:set [loud] sound threshold to [128]||`` block and place it into your empty ``||basic: on start||`` container.
<br/>
&nbsp;&nbsp; 💡 Try to change the value of your sound threshold so that every time you clap, your lights will turn on if they are off and vice versa.

```blocks
// @highlight
input.setSoundThreshold(SoundThreshold.Loud, 150)
```

## 9. Testing, round 2

👏 **YOU DID IT!** 👏

Don't forget to test your code in the simulator!

If you own a new @boardname@, you can download this code and try it out!

```blocks
let lightsOn = false
input.onSound(DetectedSound.Loud, function () {
    lightsOn = !(lightsOn)
    if (lightsOn) {
    	basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
    	basic.clearScreen()
    }
})
input.setSoundThreshold(SoundThreshold.Loud, 150)
```