enum Direction {
    //% block=right
    Right,
    //% block=left
    Left
}

enum LedSpriteProperty {
    //% block=x
    X,
    //% block=y
    Y,
    //% block=direction
    Direction,
    //% block=brightness
    Brightness,
    //% block=blink
    Blink
}

/**
 * A single-LED sprite game engine
 */
//% color=#008272 weight=32 icon="\uf11b"
//% advanced=true
namespace game {
    let _score: number = 0;
    let _life: number = 3;
    let _startTime: number = 0;
    let _endTime: number = 0;
    let _isGameOver: boolean = false;
    let _countdownPause: number = 0;
    let _level: number = 1;
    let _gameId: number = 0;
    let img: Image;
    let sprites: LedSprite[];

    /**
     * Creates a new LED sprite pointing to the right.
     * @param x sprite horizontal coordinate, eg: 2
     * @param y sprite vertical coordinate, eg: 2
     */
    //% weight=60 blockGap=8
    //% blockId=game_create_sprite block="create sprite at|x: %x|y: %y"
    //% parts="ledmatrix"
    export function createSprite(x: number, y: number): LedSprite {
        init();
        let p = new LedSprite(x, y);
        return p;
    }

    /**
     * Gets the current score
     */
    //% weight=9 help=game/score
    //% blockId=game_score block="score" blockGap=8
    export function score(): number {
        return _score;
    }

    /**
     * Adds points to the current score and shows an animation
     * @param points amount of points to change, eg: 1
     */
    //% weight=10 help=game/add-score
    //% blockId=game_add_score block="change score by|%points" blockGap=8
    //% parts="ledmatrix"
    export function addScore(points: number): void {
        setScore(_score + points);
        control.inBackground(() => {
            led.stopAnimation();
            basic.showAnimation(`0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 0 1 0 0 0 0 0
0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0
0 0 1 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 1 1 1 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 0 1 0 0 0 0 0`, 20);
        });
    }

    /**
     * Shows an animation, then starts a game countdown timer, which causes Game Over when it reaches 0
     * @param ms countdown duration in milliseconds, eg: 10000
     */
    //% weight=9 help=game/start-countdown
    //% blockId=game_start_countdown block="start countdown|(ms) %duration" blockGap=8
    //% parts="ledmatrix"
    export function startCountdown(ms: number): void {
        if (checkStart()) {
            basic.showAnimation(`1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0
0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0
1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0
0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0
1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0`, 400);
            _countdownPause = Math.max(500, ms);
            _startTime = -1;
            _endTime = input.runningTime() + _countdownPause;
            control.inBackground(() => {
                basic.pause(_countdownPause);
                gameOver();
            });
        }
    }

    /**
     * Displays a game over animation and the score.
     */
    //% weight=8 help=game/game-over
    //% blockId=game_game_over block="game over"
    //% parts="ledmatrix"
    export function gameOver(): void {
        if (!_isGameOver) {
            _isGameOver = true;
            unplugEvents();
            led.stopAnimation();
            led.setBrightness(255);
            led.setDisplayMode(DisplayMode.BackAndWhite);
            while (true) {
                for (let i = 0; i < 8; i++) {
                    basic.clearScreen();
                    basic.pause(100);
                    basic.showLeds(`1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1
1 1 1 1 1`, 300);
                }
                basic.showAnimation(`1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 0 0 1 1 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 0 1 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 1 0 0 1 1 1 0 0 0 1 1 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 1 1 1 1 0 0 1 1 1 0 0 0 1 1 0 0 0 0 1 0 0 0 0 0`, 100);
                for (let j = 0; j < 3; j++) {
                    basic.showString(" GAMEOVER ", 100);
                    showScore();
                }
            }
        } else {
            // already in game over mode in another fiber
            while (true) {
                basic.pause(10000);
            }
        }
    }

    /**
     * Sets the current score value
     * @param value new score value.
     */
    //% blockId=game_set_score block="set score %points" blockGap=8
    //% weight=10 help=game/set-score
    export function setScore(value: number): void {
        _score = Math.max(0, value);
    }

    /**
     * Gets the current life
     */
    //% weight=10
    export function life(): number {
        return _life;
    }

    /**
     * Sets the current life value
     * @param value TODO
     */
    //% weight=10
    export function setLife(value: number): void {
        _life = Math.max(0, value);
        if (_life <= 0) {
            gameOver();
        }
    }

    /**
     * Adds life points to the current life
     * @param lives TODO
     */
    //% weight=10
    export function addLife(lives: number): void {
        setLife(_life + lives);
    }

    /**
     * Gets the remaining time (since `start countdown`) or current time (since the device started or `start stopwatch`) in milliseconds.
     */
    //% weight=10
    export function currentTime(): number {
        if (_endTime > 0) {
            return Math.max(0, _endTime - input.runningTime());
        } else {
            return input.runningTime() - _startTime;
        }
    }

    /**
     * Removes some life
     * @param life TODO
     */
    //% weight=10
    //% parts="ledmatrix"
    export function removeLife(life: number): void {
        setLife(_life - life);
        control.inBackground(() => {
            led.stopAnimation();
            basic.showAnimation(`1 0 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0
0 1 0 1 0 0 0 0 0 0 0 1 0 1 0 0 0 0 0 0
0 0 1 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0
0 1 0 1 0 0 0 0 0 0 0 1 0 1 0 0 0 0 0 0
1 0 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0`, 40);
        });
    }

    /**
     * Increments the level and display a message.
     */
    //% weight=10
    //% parts="ledmatrix"
    export function levelUp(): void {
        _level = _level + 1;
        basic.showString("LEVEL:", 150);
        basic.showNumber(_level, 150);
    }

    /**
     * Gets the current level
     */
    //% weight=10
    export function level(): number {
        return _level;
    }

    /**
     * Starts a stopwatch timer. `current time` will return the elapsed time.
     */
    //% weight=10
    export function startStopwatch(): void {
        _startTime = input.runningTime();
        _endTime = -1;
    }

    /**
     * Gets a value indicating if the game is still running. Returns `false` if game over.
     */
    //% weight=10
    export function isRunning(): boolean {
        let running: boolean;
        return !_isGameOver;
    }

    /**
     * Displays the score on the screen.
     */
    //%  weight=60
    //% parts="ledmatrix"
    export function showScore(): void {
        basic.showString(" SCORE ", 100);
        basic.showNumber(_score, 150);
        basic.showString(" ", 150);
    }

    /**
     * Indicates if the game is display the game over sequence.
     */
    export function isGameOver(): boolean {
        let over: boolean;
        return _isGameOver;
    }

    /**
     * returns false if game can't start
     */
    function checkStart(): boolean {
        if (_countdownPause > 0 || _startTime > 0) {
            return false;
        } else {
            return true;
        }
    }

    function unplugEvents(): void {
        input.onButtonPressed(Button.A, () => { });
        input.onButtonPressed(Button.B, () => { });
        input.onButtonPressed(Button.AB, () => {
            control.reset();
        });
    }

    export class LedSprite {
        private _x: number;
        private _y: number;
        private _dir: number;
        private _brightness: number;
        private _blink: number;
        private _enabled: boolean;

        constructor(x: number, y: number) {
            this._x = Math.clamp(0, 4, x);
            this._y = Math.clamp(0, 4, y);
            this._dir = 90;
            this._brightness = 255;
            this._enabled = true;
            init();
            sprites.push(this);
            plot();
        }

        /**
         * Move a certain number of LEDs in the current direction
         * @param this the sprite to move
         * @param leds number of leds to move, eg: 1, -1
         */
        //% weight=50
        //% blockId=game_move_sprite block="%sprite|move by %leds" blockGap=8
        //% parts="ledmatrix"
        public move(leds: number): void {
            if (this._dir == 0) {
                this._y = this._y - leds;
            } else if (this._dir == 45) {
                this._x = this._x + leds;
                this._y = this._y - leds;
            } else if (this._dir == 90) {
                this._x = this._x + leds;
            } else if (this._dir == 135) {
                this._x = this._x + leds;
                this._y = this._y + leds;
            } else if (this._dir == 180) {
                this._y = this._y + leds;
            } else if (this._dir == -45) {
                this._x = this._x - leds;
                this._y = this._y - leds;
            } else if (this._dir == -90) {
                this._x = this._x - leds;
            } else {
                this._x = this._x - leds;
                this._y = this._y + leds;
            }
            this._x = Math.clamp(0, 4, this._x);
            this._y = Math.clamp(0, 4, this._y);
            plot();
        }

        /**
         * Go to this position on the screen
         * @param this TODO
         * @param x TODO
         * @param y TODO
         */
        //% parts="ledmatrix"
        public goTo(x: number, y: number): void {
            this._x = x;
            this._y = y;
            this._x = Math.clamp(0, 4, this._x);
            this._y = Math.clamp(0, 4, this._y);
            plot();
        }

        /**
         * If touching the edge of the stage and facing towards it, then turn away.
         * @param this TODO
         */
        //% weight=18
        //% blockId=game_sprite_bounce block="%sprite|if on edge, bounce"
        //% parts="ledmatrix"
        public ifOnEdgeBounce(): void {
            if (this._dir == 0 && this._y == 0) {
                this._dir = 180;
            } else if (this._dir == 45 && (this._x == 4 || this._y == 0)) {
                if (this._x == 0 && this._y == 0) {
                    this._dir = -135;
                } else if (this._y == 0) {
                    this._dir = 135;
                } else {
                    this._dir = -45;
                }
            } else if (this._dir == 90 && this._x == 4) {
                this._dir = -90;
            } else if (this._dir == 135 && (this._x == 4 || this._y == 4)) {
                if (this.x() == 4 && this.y() == 4) {
                    this._dir = -45;
                } else if (this._y == 4) {
                    this._dir = 45;
                } else {
                    this._dir = -135;
                }
            } else if (this._dir == 180 && this._y == 4) {
                this._dir = 0;
            } else if (this._dir == -45 && (this._x == 0 || this._y == 0)) {
                if (this.x() == 0 && this.y() == 0) {
                    this._dir = 135;
                } else if (this._y == 0) {
                    this._dir = -135;
                } else {
                    this._dir = 45;
                }
            } else if (this._dir == -90 && this._x == 0) {
                this._dir = 90;
            } else if (this._dir == -135 && (this._x == 0 || this._y == 4)) {
                if (this._x == 0 && this._y == 4) {
                    this._dir = 45;
                } else if (this._y == 4) {
                    this._dir = -45;
                } else {
                    this._dir = 135;
                }
            }
            plot();
        }

        /**
         * Turn the sprite
         * @param this TODO
         * @param direction left or right
         * @param degrees angle in degrees to turn, eg: 45, 90, 180, 135
         */
        //% weight=49
        //% blockId=game_turn_sprite block="%sprite|turn %direction|by (°) %degrees"
        public turn(direction: Direction, degrees: number) {
            if (direction == Direction.Right)
                this.setDirection(this._dir + degrees);
            else
                this.setDirection(this._dir - degrees);
        }

        /**
         * Turn to the right (clockwise)
         * @param this TODO
         * @param degrees TODO
         */
        public turnRight(degrees: number): void {
            this.turn(Direction.Right, degrees);
        }

        /**
         * Turn to the left (counter-clockwise)
         * @param this TODO
         * @param degrees TODO
         */
        public turnLeft(degrees: number): void {
            this.turn(Direction.Left, degrees);
        }

        /**
         * Sets a property of the sprite
         * @param property the name of the property to change
         * @param the updated value
         */
        //% weight=29
        //% blockId=game_sprite_set_property block="%sprite|set %property|to %value" blockGap=8
        public set(property: LedSpriteProperty, value: number) {
            switch (property) {
                case LedSpriteProperty.X: this.setX(value); break;
                case LedSpriteProperty.Y: this.setY(value); break;
                case LedSpriteProperty.Direction: this.setDirection(value); break;
                case LedSpriteProperty.Brightness: this.setBrightness(value); break;
                case LedSpriteProperty.Blink: this.setBlink(value); break;
            }
        }

        /**
         * Changes a property of the sprite
         * @param property the name of the property to change
         * @param value amount of change, eg: 1
         */
        //% weight=30
        //% blockId=game_sprite_change_xy block="%sprite|change %property|by %value" blockGap=8
        public change(property: LedSpriteProperty, value: number) {
            switch (property) {
                case LedSpriteProperty.X: this.changeXBy(value); break;
                case LedSpriteProperty.Y: this.changeYBy(value); break;
                case LedSpriteProperty.Direction: this.changeDirectionBy(value); break;
                case LedSpriteProperty.Brightness: this.changeBrightnessBy(value); break;
                case LedSpriteProperty.Blink: this.changeBlinkBy(value); break;
            }
        }

        /**
         * Gets a property of the sprite
         * @param property the name of the property to change
         */
        //% weight=28
        //% blockId=game_sprite_property block="%sprite|%property"
        public get(property: LedSpriteProperty) {
            switch (property) {
                case LedSpriteProperty.X: return this.x();
                case LedSpriteProperty.Y: return this.y();
                case LedSpriteProperty.Direction: return this.direction()
                case LedSpriteProperty.Brightness: return this.brightness();
                case LedSpriteProperty.Blink: return this.blink();
                default: return 0;
            }
        }

        /**
         * Set the direction of the current sprite, rounded to the nearest multiple of 45
         * @param this TODO
         * @param degrees TODO
         */
        //% parts="ledmatrix"
        public setDirection(degrees: number): void {
            this._dir = ((degrees / 45) % 8) * 45;
            if (this._dir <= -180) {
                this._dir = this._dir + 360;
            } else if (this._dir > 180) {
                this._dir = this._dir - 360;
            }
            plot();
        }

        /**
         * Reports the ``x`` position of a sprite on the LED screen
         * @param this TODO
         */
        public x(): number {
            return this._x;
        }

        /**
         * Reports the ``y`` position of a sprite on the LED screen
         * @param this TODO
         */
        public y(): number {
            return this._y;
        }

        /**
         * Reports the current direction of a sprite
         * @param this TODO
         */
        public direction(): number {
            return this._dir;
        }

        /**
         * Set the ``x`` position of a sprite
         * @param this TODO
         * @param x TODO
         */
        public setX(x: number): void {
            this.goTo(x, this._y);
        }

        /**
         * Set the ``y`` position of a sprite
         * @param this TODO
         * @param y TODO
         */
        public setY(y: number): void {
            this.goTo(this._x, y);
        }

        /**
         * Changes the ``y`` position by the given amount
         * @param this TODO
         * @param y TODO
         */
        public changeYBy(y: number): void {
            this.goTo(this._x, this._y + y);
        }

        /**
         * Changes the ``x`` position by the given amount
         * @param this TODO
         * @param x TODO
         */
        public changeXBy(x: number): void {
            this.goTo(this._x + x, this._y);
        }

        /**
         * Reports true if sprite has the same position as specified sprite
         * @param this TODO
         * @param other TODO
         */
        //% weight=20
        //% blockId=game_sprite_touching_sprite block="%sprite|touching %other|?" blockGap=8
        public isTouching(other: LedSprite): boolean {
            return this._enabled && other._enabled && this._x == other._x && this._y == other._y;
        }

        /**
         * Reports true if sprite is touching an edge
         * @param this TODO
         */
        //% weight=19
        //% blockId=game_sprite_touching_edge block="%sprite|touching edge?" blockGap=8
        public isTouchingEdge(): boolean {
            return this._x == 0 || this._x == 4 || this._y == 0 || this._y == 4;
        }

        /**
         * Turns on the sprite (on by default)
         * @param this the sprite
         */
        public on(): void {
            this.setBrightness(255);
        }

        /**
         * Turns off the sprite (on by default)
         * @param this the sprite
         */
        public off(): void {
            this.setBrightness(0);
        }

        /**
         * Set the ``brightness`` of a sprite
         * @param this the sprite
         * @param brightness the brightness from 0 (off) to 255 (on), eg: 255.
         */
        //% parts="ledmatrix"
        public setBrightness(brightness: number): void {
            this._brightness = Math.clamp(0, 255, brightness);
            plot();
        }

        /**
         * Reports the ``brightness` of a sprite on the LED screen
         * @param this the sprite
         */
        //% parts="ledmatrix"
        public brightness(): number {
            let r: number;
            return this._brightness;
        }

        /**
         * Changes the ``y`` position by the given amount
         * @param this the sprite
         * @param value the value to change brightness
         */
        public changeBrightnessBy(value: number): void {
            this.setBrightness(this._brightness + value);
        }

        /**
         * Changes the ``direction`` position by the given amount by turning right
         * @param this TODO
         * @param angle TODO
         */
        public changeDirectionBy(angle: number): void {
            this.turnRight(angle);
        }

        /**
         * Deletes the sprite from the game engine. The sprite will no longer appear on the screen or interact with other sprites.
         * @param this sprite to delete
         */
        //% weight=59
        //% blockId="game_delete_sprite" block="delete %this"
        public delete(): void {
            this._enabled = false;
            if (sprites.removeElement(this)) {
                plot();
                if (sprites.length == 0) {
                    //Last sprite deleted, so plot is now disabled
                    basic.clearScreen();
                }
            }
        }

        /**
         * Sets the blink duration interval in millisecond.
         * @param sprite TODO
         * @param ms TODO
         */
        public setBlink(ms: number): void {
            this._blink = Math.clamp(0, 10000, ms);
        }

        /**
         * Changes the ``blink`` duration by the given amount of millisecons
         * @param this TODO
         * @param ms TODO
         */
        public changeBlinkBy(ms: number): void {
            this.setBlink(this._blink + ms);
        }

        /**
         * Reports the ``blink`` duration of a sprite
         * @param this TODO
         */
        public blink(): number {
            let r: number;
            return this._blink;
        }

        //% weight=-1
        //% parts="ledmatrix"
        public _plot(now: number) {
            let ps = this
            if (ps._brightness > 0) {
                let r = 0;
                if (ps._blink > 0) {
                    r = (now / ps._blink) % 2;
                }
                if (r == 0) {
                    img.setPixelBrightness(ps._x, ps._y, img.pixelBrightness(ps._x, ps._y) + ps._brightness);
                }
            }
        }
    }

    function init(): void {
        if (img == null) {
            img = images.createImage(
                `0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
0 0 0 0 0`);
            sprites = (<LedSprite[]>[]);
            led.setDisplayMode(DisplayMode.Greyscale);
            basic.forever(() => {
                basic.pause(30);
                plot();
                if (game.isGameOver()) {
                    basic.pause(600);
                }
            });
        }
    }

    /**
     * Plots the current sprites on the screen
     */
    //% parts="ledmatrix"
    function plot(): void {
        if (game.isGameOver() || sprites.length == 0) {
            return;
        }
        let now = input.runningTime();
        img.clear();
        for (let i = 0; i < sprites.length; i++) {
            sprites[i]._plot(now);
        }
        img.plotImage(0);
    }

    /**
     * Gets an invalid sprite; used to initialize locals.
     */
    //% weight=0
    export function invalidSprite(): LedSprite {
        return null;
    }

}

