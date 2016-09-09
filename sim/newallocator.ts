namespace pxsim.newdefinitions {
     export interface AllocatorOpts {
        boardDef: BoardDefinition,
        partDefs: Map<PartDefinition>,
        partsList: string[]
        fnArgs: any,
        // Used for finding the nearest available power pins
        getBBCoord: (loc: BBLoc) => visuals.Coord,
    };
    export interface AllocatorResult {
        partsAndWires: PartAndWiresInst[],
    }
    export interface PartInst {
        name: string,
        visual: PartVisualDefinition,
        bbFit: PartBBFit,
        startColumnIdx: number,
        startRowIdx: number,
        breadboardConnections: BBLoc[],
        params: Map<string>,
    }
    export interface WireInst {
        start: Loc,
        end: Loc,
        color: string,
    };
    export interface AssemblyStep {
        part?: boolean,
        wireIndices?: number[],
    }
    export interface PartAndWiresInst {
        part?: PartInst,
        wires?: WireInst[],
        assembly: AssemblyStep[],
    }
    export interface PartBBFit {
        xOffset: number,
        yOffset: number,
        rowCount: number,
        colCount: number,
    }
    interface PinBBFit {
        partRelativeColIdx: number,
        partRelativeRowIdx: number,
        xOffset: number,
        yOffset: number,
    }
    interface PinIR {
        loc: XY,
        def: PartPinDefinition,
        target: PinTarget,
        bbFit: PinBBFit,
    }
    interface PartIR {
        name: string,
        def: PartDefinition,
        partParams: Map<string>,
        pins: PinIR[],
        bbFit: PartBBFit,
    };
    interface PartPlacement extends PartIR {
        startColumnIdx: number,
        startRowIdx: number,
    };
    type WireIRLoc = PinTarget | BBLoc;
    interface WireIR {
        pinIdx: number,
        start: WireIRLoc,
        end: WireIRLoc,
        color: string,
    }
    interface PartAndWireIRs extends PartPlacement {
        wires: WireIR[],
    };
    interface PowerUsage {
        topGround: boolean,
        topThreeVolt: boolean,
        bottomGround: boolean,
        bottomThreeVolt: boolean,
        singleGround: boolean,
        singleThreeVolt: boolean,
    }
    interface AllocLocOpts {
        referenceBBPin?: BBLoc,
    };
    interface AllocWireOpts {
        //TODO: port
        startColumn: number,
        partGPIOPins: string[],
    }
    function isOnBreadboardBottom(location: WireIRLoc) {
        let isBot = false;
        if (typeof location !== "string" && (<BBLoc>location).type === "breadboard") {
            let bbLoc = <BBLoc>location;
            let row = bbLoc.row;
            isBot = 0 <= ["a", "b", "c", "d", "e"].indexOf(row);
        }
        return isBot;
    }
    const arrCount = (a: boolean[]) => a.reduce((p, n) => p + (n ? 1 : 0), 0);
    const arrAny = (a: boolean[]) => arrCount(a) > 0;
    function computePowerUsage(wire: WireIR): PowerUsage {
        let ends = [wire.start, wire.end];
        let endIsGround = ends.map(e => e === "ground");
        let endIsThreeVolt = ends.map(e => e === "threeVolt");
        let endIsBot = ends.map(e => isOnBreadboardBottom(e));
        let hasGround = arrAny(endIsGround);
        let hasThreeVolt = arrAny(endIsThreeVolt);
        let hasBot = arrAny(endIsBot);
        return {
            topGround: hasGround && !hasBot,
            topThreeVolt: hasThreeVolt && !hasBot,
            bottomGround: hasGround && hasBot,
            bottomThreeVolt: hasThreeVolt && hasBot,
            singleGround: hasGround,
            singleThreeVolt: hasThreeVolt
        };
    }
    function mergePowerUsage(powerUsages: PowerUsage[]) {
        let finalPowerUsage = powerUsages.reduce((p, n) => ({
                topGround: p.topGround || n.topGround,
                topThreeVolt: p.topThreeVolt || n.topThreeVolt,
                bottomGround: p.bottomGround || n.bottomGround,
                bottomThreeVolt: p.bottomThreeVolt || n.bottomThreeVolt,
                singleGround: n.singleGround ? p.singleGround === null : p.singleGround,
                singleThreeVolt: n.singleThreeVolt ? p.singleThreeVolt === null : p.singleThreeVolt,
            }), {
                topGround: false,
                topThreeVolt: false,
                bottomGround: false,
                bottomThreeVolt: false,
                singleGround: null,
                singleThreeVolt: null,
            });
        if (finalPowerUsage.singleGround)
            finalPowerUsage.topGround = finalPowerUsage.bottomGround = false;
        if (finalPowerUsage.singleThreeVolt)
            finalPowerUsage.topThreeVolt = finalPowerUsage.bottomThreeVolt = false;
        return finalPowerUsage;
    }
    function copyDoubleArray(a: string[][]) {
         return a.map(b => b.map(p => p));
    }
    function merge2<A, B>(a: A, b: B): A & B {
        let res: any = {};
        for (let aKey in a)
            res[aKey] = (<any>a)[aKey];
        for (let bKey in b)
            res[bKey] = (<any>a)[bKey];
        return <A & B>res;
    }
    function merge3<A, B, C>(a: A, b: B, c: C): A & B & C {
        return merge2(merge2(a, b), c);
    }
    function readPin(arg: string): MicrobitPin {
        U.assert(!!arg, "Invalid pin: " + arg);
        let pin = arg.split("DigitalPin.")[1];
        return <MicrobitPin>pin;
    }
    function mkReverseMap(map: {[key: string]: string}) {
        let origKeys: string[] = [];
        let origVals: string[] = [];
        for (let key in map) {
            origKeys.push(key);
            origVals.push(map[key]);
        }
        let newMap: {[key: string]: string} = {};
        for (let i = 0; i < origKeys.length; i++) {
            let newKey = origVals[i];
            let newVal = origKeys[i];
            newMap[newKey] = newVal;
        }
        return newMap;
    }
    function isConnectedToBB(pin: PartPinDefinition): boolean {
        return pin.orientation === "-Z" && pin.style === "male";
    }
    class Allocator {
        private opts: AllocatorOpts;
        private availablePowerPins = {
            top: {
                threeVolt: mkRange(26, 51).map(n => <BBLoc>{type: "breadboard", row: "+", col: `${n}`}),
                ground: mkRange(26, 51).map(n => <BBLoc>{type: "breadboard", row: "-", col: `${n}`}),
            },
            bottom: {
                threeVolt: mkRange(1, 26).map(n => <BBLoc>{type: "breadboard", row: "+", col: `${n}`}),
                ground: mkRange(1, 26).map(n => <BBLoc>{type: "breadboard", row: "-", col: `${n}`}),
            },
        };
        private powerUsage: PowerUsage;

        constructor(opts: AllocatorOpts) {
            this.opts = opts;
        }

        //TODO: standardize allocation errors
        // private err(condition: boolean, msg: string) {
        //     U.assert(condition, `[Part(s) allocation error]: ${msg}`);
        // }

        private allocPartIRs(def: PartDefinition, name: string, bbFit: PartBBFit): PartIR[] {
            let partIRs: PartIR[] = [];
            let mkIR = (def: PartDefinition, name: string, instPins?: PinTarget[], partParams?: Map<string>): PartIR => {
                let pinIRs: PinIR[] = [];
                for (let i = 0; i < def.numberOfPins; i++) {
                    let pinDef = def.pinDefinitions[i];
                    U.assert(typeof pinDef.target === "string", "Invalid pin target for singleton part: " + name); 
                    let pinTarget: PinTarget;
                    if (typeof pinDef.target === "string") {
                        pinTarget = <PinTarget>pinDef.target;
                    } else {
                        let instIdx = (<PinInstantiationIdx>pinDef.target).pinInstantiationIdx;
                        U.assert(!!instPins && instPins[instIdx] !== undefined,
                            `No pin found for PinInstantiationIdx: ${instIdx}. (Is the part missing an ArguementRole or "trackArgs=" annotations?)`);
                        pinTarget = instPins[instIdx];
                    }
                    let pinLoc = def.visual.pinLocations[i];
                    let adjustedY = bbFit.yOffset + pinLoc.y;
                    let relativeRowIdx = Math.round(adjustedY / def.visual.pinDistance);
                    let relativeYOffset = adjustedY - relativeRowIdx * def.visual.pinDistance;
                    let adjustedX = bbFit.xOffset + pinLoc.x;
                    let relativeColIdx = Math.round(adjustedX / def.visual.pinDistance);
                    let relativeXOffset = adjustedX = relativeColIdx * def.visual.pinDistance;
                    let pinBBFit: PinBBFit = {
                        partRelativeRowIdx: relativeRowIdx,
                        partRelativeColIdx: relativeColIdx,
                        xOffset: relativeXOffset,
                        yOffset: relativeYOffset
                    };
                    pinIRs.push({
                        def: pinDef,
                        loc: pinLoc,
                        target: pinTarget,
                        bbFit: pinBBFit,
                    });
                }
                return {
                    name: name,
                    def: def,
                    pins: pinIRs,
                    partParams: partParams || {},
                    bbFit: bbFit
                };
            };
            if (def.instantiation.kind === "singleton") {
                partIRs.push(mkIR(def, name));
            } else if (def.instantiation.kind === "function") {
                let fnAlloc = def.instantiation as PartFunctionDefinition;
                let fnNm = fnAlloc.fullyQualifiedName;
                let callsitesTrackedArgs = <string[]>this.opts.fnArgs[fnNm];
                U.assert(!!callsitesTrackedArgs && !!callsitesTrackedArgs.length, "Failed to read pin(s) from callsite for: " + fnNm);
                callsitesTrackedArgs.forEach(fnArgsStr => {
                    let fnArgsSplit = fnArgsStr.split(",");
                    U.assert(fnArgsSplit.length === fnAlloc.argumentRoles.length,
                        `Mismatch between number of arguments at callsite (function name: ${fnNm}) vs number of argument roles in part definition (part: ${name}).`);
                    let instPins: PinTarget[] = [];
                    let paramArgs: Map<string> = {};
                    fnArgsSplit.forEach((arg, idx) => {
                        let role = fnAlloc.argumentRoles[idx];
                        if (role.partParameter !== undefined) {
                            paramArgs[role.partParameter] = arg;
                        }
                        if (role.pinInstantiationIdx !== undefined) {
                            let instIdx = role.pinInstantiationIdx;
                            let pin = readPin(arg);
                            instPins[instIdx] = pin;
                        }
                    });
                    partIRs.push(mkIR(def, name, instPins, paramArgs));
                });
            }
            return partIRs;
        }
        private computePartDimensions(def: PartDefinition, name: string): PartBBFit {
            let pinLocs = def.visual.pinLocations;
            let pinDefs = def.pinDefinitions;
            let numPins = def.numberOfPins;
            U.assert(pinLocs.length === numPins, `Mismatch between "numberOfPins" and length of "visual.pinLocations" for "${name}"`);
            U.assert(pinDefs.length === numPins, `Mismatch between "numberOfPins" and length of "pinDefinitions" for "${name}"`);
            U.assert(numPins > 0, `Part "${name}" has no pins`);
            let pins = pinLocs.map((loc, idx) => merge3({idx: idx}, loc, pinDefs[idx]));
            let bbPins = pins.filter(p => p.orientation === "-Z");
            let hasBBPins = bbPins.length > 0;
            let pinDist = def.visual.pinDistance;
            let xOff: number;
            let yOff: number;
            let colCount: number;
            let rowCount: number;
            if (hasBBPins) {
                let refPin = bbPins[0];
                let refPinColIdx = Math.ceil(refPin.x / pinDist);
                let refPinRowIdx = Math.ceil(refPin.y / pinDist);
                xOff = refPinColIdx * pinDist - refPin.x;
                yOff = refPinRowIdx * pinDist - refPin.y;
                colCount = Math.ceil((xOff + def.visual.width) / pinDist) + 1;
                rowCount = Math.ceil((yOff + def.visual.height) / pinDist) + 1;
            } else {
                colCount = Math.ceil(def.visual.width / pinDist);
                rowCount = Math.ceil(def.visual.height / pinDist);
                xOff = colCount * pinDist - def.visual.width;
                yOff = rowCount * pinDist - def.visual.height;
            }
            return {
                xOffset: xOff,
                yOffset: yOff,
                rowCount: rowCount,
                colCount: colCount
            };
        }
        private allocColumns(colCounts: {colCount: number}[]): number[] {
            let partsCount = colCounts.length;
            const totalColumnsCount = visuals.BREADBOARD_MID_COLS; //TODO allow multiple breadboards
            let totalSpaceNeeded = colCounts.map(d => d.colCount).reduce((p, n) => p + n, 0);
            let extraSpace = totalColumnsCount - totalSpaceNeeded;
            if (extraSpace <= 0) {
                console.log("Not enough breadboard space!");
                //TODO
            }
            let padding = Math.floor(extraSpace / (partsCount - 1 + 2));
            let partSpacing = padding; //Math.floor(extraSpace/(partsCount-1));
            let totalPartPadding = extraSpace - partSpacing * (partsCount - 1);
            let leftPadding = Math.floor(totalPartPadding / 2);
            let rightPadding = Math.ceil(totalPartPadding / 2);
            let nextAvailableCol = 1 + leftPadding;
            let partStartCol = colCounts.map(part => {
                let col = nextAvailableCol;
                nextAvailableCol += part.colCount + partSpacing;
                return col;
            });
            return partStartCol;
        }
        private placeParts(parts: PartIR[]): PartPlacement[] {
            const totalRowsCount = visuals.BREADBOARD_MID_ROWS + 2; // 10 letters + 2 for the middle gap
            let startColumnIndices = this.allocColumns(parts.map(p => p.bbFit));
            let startRowIndicies = parts.map(p => {
                let extraRows = totalRowsCount - p.bbFit.rowCount;
                let topPad = Math.floor(extraRows / 2);
                if (topPad > 4)
                    topPad = 4;
                return topPad;
            });
            let placements = parts.map((p, idx) => {
                let row = startRowIndicies[idx];
                let col = startColumnIndices[idx];
                return merge2({startColumnIdx: col, startRowIdx: row}, p);
            });
            return placements;
        }
        private allocWireIRs(part: PartPlacement): PartAndWireIRs {
            let wires: WireIR[] = part.pins.map((pin, pinIdx) => {
                let end = pin.target;
                let start: WireIRLoc;
                let colIdx = part.startColumnIdx + pin.bbFit.partRelativeColIdx;
                let colName = visuals.getColumnName(colIdx);
                let pinRowIdx = part.startRowIdx + pin.bbFit.partRelativeRowIdx;
                if (isConnectedToBB(pin.def)) {
                    //make a wire from bb top or bottom to target
                    let connectedToTop = pinRowIdx < 5;
                    let rowName = connectedToTop ? "j" : "a";
                    start = {
                        type: "breadboard",
                        row: rowName,
                        col: colName,
                    };
                } else {
                    //make a wire directly from pin to target
                    let rowName = visuals.getRowName(pinRowIdx);
                    start = {
                        type: "breadboard",
                        row: rowName,
                        col: colName,
                        xOffset: pin.bbFit.xOffset,
                        yOffset: pin.bbFit.yOffset
                    }
                }
                let color = "red"; //TODO
                return {
                    start: start,
                    end: end,
                    color: color,
                    pinIdx: pinIdx,
                }
            });
            return merge2(part, {wires: wires});
        }
        private allocLocation(location: WireIRLoc, opts: AllocLocOpts): Loc {
            if (location === "ground" || location === "threeVolt") {
                //special case if there is only a single ground or three volt pin in the whole build
                if (location === "ground" && this.powerUsage.singleGround) {
                    let boardGroundPin = this.getBoardGroundPin();
                    return {type: "dalboard", pin: boardGroundPin};
                } else if (location === "threeVolt" && this.powerUsage.singleThreeVolt) {
                    let boardThreeVoltPin = this.getBoardThreeVoltPin();
                    return {type: "dalboard", pin: boardThreeVoltPin};
                }

                U.assert(!!opts.referenceBBPin);
                let nearestCoord = this.opts.getBBCoord(opts.referenceBBPin);
                let firstTopAndBot = [
                    this.availablePowerPins.top.ground[0] || this.availablePowerPins.top.threeVolt[0],
                    this.availablePowerPins.bottom.ground[0] || this.availablePowerPins.bottom.threeVolt[0]
                ].map(loc => {
                    return this.opts.getBBCoord(loc);
                });
                if (!firstTopAndBot[0] || !firstTopAndBot[1]) {
                    console.debug(`No more available "${location}" locations!`);
                    //TODO
                }
                let nearTop = visuals.findClosestCoordIdx(nearestCoord, firstTopAndBot) == 0;
                let barPins: BBLoc[];
                if (nearTop) {
                    if (location === "ground") {
                        barPins = this.availablePowerPins.top.ground;
                    } else if (location === "threeVolt") {
                        barPins = this.availablePowerPins.top.threeVolt;
                    }
                } else {
                    if (location === "ground") {
                        barPins = this.availablePowerPins.bottom.ground;
                    } else if (location === "threeVolt") {
                        barPins = this.availablePowerPins.bottom.threeVolt;
                    }
                }
                let pinCoords = barPins.map(rowCol => {
                    return this.opts.getBBCoord(rowCol);
                });
                let closestPinIdx = visuals.findClosestCoordIdx(nearestCoord, pinCoords);
                let pin = barPins[closestPinIdx];
                if (nearTop) {
                    this.availablePowerPins.top.ground.splice(closestPinIdx, 1);
                    this.availablePowerPins.top.threeVolt.splice(closestPinIdx, 1);
                } else {
                    this.availablePowerPins.bottom.ground.splice(closestPinIdx, 1);
                    this.availablePowerPins.bottom.threeVolt.splice(closestPinIdx, 1);
                }
                return pin;
            } else if ((<BBLoc>location).type === "breadboard") {
                return <BBLoc>location;
            } else if (location === "MOSI" || location === "MISO" || location === "SCK") {
                if (!this.opts.boardDef.spiPins)
                    console.debug("No SPI pin mappings found!");
                let pin = (<any>this.opts.boardDef.spiPins)[location as string] as string;
                return {type: "dalboard", pin: pin};
            } else if (location === "SDA" || location === "SCL") {
                if (!this.opts.boardDef.i2cPins)
                    console.debug("No I2C pin mappings found!");
                let pin = (<any>this.opts.boardDef.i2cPins)[location as string] as string;
                return {type: "dalboard", pin: pin};
            } else {
                //it must be a MicrobitPin
                U.assert(typeof location === "string", "Unknown location type: " + location);
                let mbPin = <MicrobitPin>location;
                let boardPin = this.opts.boardDef.gpioPinMap[mbPin];
                U.assert(!!boardPin, "Unknown pin: " + location);
                return {type: "dalboard", pin: boardPin};
            }
        }
        private getBoardGroundPin(): string {
            let boardGround = this.opts.boardDef.groundPins[0] || null;
            if (!boardGround) {
                console.log("No available ground pin on board!");
                //TODO
            }
            return boardGround;
        }
        private getBoardThreeVoltPin(): string {
            let threeVoltPin = this.opts.boardDef.threeVoltPins[0] || null;
            if (!threeVoltPin) {
                console.log("No available 3.3V pin on board!");
                //TODO
            }
            return threeVoltPin;
        }
        private allocPowerWires(powerUsage: PowerUsage): PartAndWiresInst {
            let boardGroundPin = this.getBoardGroundPin();
            let threeVoltPin = this.getBoardThreeVoltPin();
            const topLeft: BBLoc = {type: "breadboard", row: "-", col: "26"};
            const botLeft: BBLoc = {type: "breadboard", row: "-", col: "1"};
            const topRight: BBLoc = {type: "breadboard", row: "-", col: "50"};
            const botRight: BBLoc = {type: "breadboard", row: "-", col: "25"};
            let top: BBLoc, bot: BBLoc;
            if (this.opts.boardDef.attachPowerOnRight) {
                top = topRight;
                bot = botRight;
            } else {
                top = topLeft;
                bot = botLeft;
            }
            const GROUND_COLOR = "blue";
            const POWER_COLOR = "red";
            let groundWires: WireInst[] = [];
            let threeVoltWires: WireInst[] = [];
            if (powerUsage.bottomGround && powerUsage.topGround) {
                //bb top - <==> bb bot -
                groundWires.push({
                    start: this.allocLocation("ground", {referenceBBPin: top}),
                    end: this.allocLocation("ground", {referenceBBPin: bot}),
                    color: GROUND_COLOR,
                });
            }
            if (powerUsage.topGround) {
                //board - <==> bb top -
                groundWires.push({
                    start: this.allocLocation("ground", {referenceBBPin: top}),
                    end: {type: "dalboard", pin: boardGroundPin},
                    color: GROUND_COLOR,
                });
            } else if (powerUsage.bottomGround) {
                //board - <==> bb bot -
                groundWires.push({
                    start: this.allocLocation("ground", {referenceBBPin: bot}),
                    end: {type: "dalboard", pin: boardGroundPin},
                    color: GROUND_COLOR,
                });
            }
            if (powerUsage.bottomThreeVolt && powerUsage.bottomGround) {
                //bb top + <==> bb bot +
                threeVoltWires.push({
                    start: this.allocLocation("threeVolt", {referenceBBPin: top}),
                    end: this.allocLocation("threeVolt", {referenceBBPin: bot}),
                    color: POWER_COLOR,
                });
            }
            if (powerUsage.topThreeVolt) {
                //board + <==> bb top +
                threeVoltWires.push({
                    start: this.allocLocation("threeVolt", {referenceBBPin: top}),
                    end: {type: "dalboard", pin: threeVoltPin},
                    color: POWER_COLOR,
                });
            } else if (powerUsage.bottomThreeVolt) {
                //board + <==> bb bot +
                threeVoltWires.push({
                    start: this.allocLocation("threeVolt", {referenceBBPin: bot}),
                    end: {type: "dalboard", pin: threeVoltPin},
                    color: POWER_COLOR,
                });
            }
            let assembly: AssemblyStep[] = [];
            if (groundWires.length > 0)
                assembly.push({wireIndices: groundWires.map((w, i) => i)});
            let numGroundWires = groundWires.length;
            if (threeVoltWires.length > 0)
                assembly.push({wireIndices: threeVoltWires.map((w, i) => i + numGroundWires)});
            return {
                wires: groundWires.concat(threeVoltWires),
                assembly: assembly
            };
        }
        private allocWire(wireIR: WireIR): WireInst {
            let ends = [wireIR.start, wireIR.end];
            let endIsPower = ends.map(e => e === "ground" || e === "threeVolt");
            //allocate non-power first so we know the nearest pin for the power end
            let endInsts = ends.map((e, idx) => !endIsPower[idx] ? this.allocLocation(e, {}) : null)
            //allocate power pins closest to the other end of the wire
            endInsts = endInsts.map((e, idx) => {
                if (e)
                    return e;
                let locInst = <BBLoc>endInsts[1 - idx]; // non-power end
                let l = this.allocLocation(ends[idx], {
                    referenceBBPin: locInst,
                });
                return l;
            });
            return {start: endInsts[0], end: endInsts[1], color: wireIR.color};
        }
        private allocPart(ir: PartPlacement): PartInst {
            let bbConnections = ir.pins
                .filter(p => isConnectedToBB(p.def))
                .map(p => {
                    let rowIdx = ir.startRowIdx + p.bbFit.partRelativeRowIdx;
                    let rowName = visuals.getRowName(rowIdx);
                    let colIdx = ir.startColumnIdx + p.bbFit.partRelativeColIdx;
                    let colName = visuals.getColumnName(colIdx);
                    return <BBLoc>{
                        type: "breadboard",
                        row: rowName,
                        col: colName,
                    }
                });
            let part: PartInst = {
                name: ir.name,
                visual: ir.def.visual,
                bbFit: ir.bbFit,
                startColumnIdx: ir.startColumnIdx,
                startRowIdx: ir.startRowIdx,
                breadboardConnections: bbConnections,
                params: ir.partParams,
            }
            return part;
        }
        public allocAll(): AllocatorResult {
            let partNmAndDefs = this.opts.partsList
                .map(partName => {return {name: partName, def: this.opts.partDefs[partName]}})
                .filter(d => !!d.def);
            if (partNmAndDefs.length > 0) {
                let partNmsList = partNmAndDefs.map(p => p.name);
                let partDefsList = partNmAndDefs.map(p => p.def);
                let dimensions = partNmAndDefs.map(nmAndPart => this.computePartDimensions(nmAndPart.def, nmAndPart.name));
                let partIRs: PartIR[];
                partNmAndDefs.forEach((nmAndDef, idx) => {
                    let dims = dimensions[idx];
                    let irs = this.allocPartIRs(nmAndDef.def, nmAndDef.name, dims);
                    partIRs = partIRs.concat(irs);
                })
                let partPlacements = this.placeParts(partIRs);
                let partsAndWireIRs = partPlacements.map(p => this.allocWireIRs(p));
                let allWireIRs = partsAndWireIRs.map(p => p.wires).reduce((p, n) => p.concat(n), []);
                let allPowerUsage = allWireIRs.map(w => computePowerUsage(w));
                this.powerUsage = mergePowerUsage(allPowerUsage);
                let basicWires = this.allocPowerWires(this.powerUsage);
                let partsAndWires: PartAndWiresInst[] = partsAndWireIRs.map((irs, idx) => {
                    let part = this.allocPart(irs);
                    let wires = irs.wires.map(w => this.allocWire(w));
                    let pinIdxToWireIdx: number[] = [];
                    irs.wires.forEach((wIR, idx) => {
                        pinIdxToWireIdx[wIR.pinIdx] = idx;
                    });
                    let assembly: AssemblyStep[] = irs.def.assembly.map(stepDef => {
                        return {
                            part: stepDef.part,
                            wireIndices: (stepDef.pinIndices || []).map(i => pinIdxToWireIdx[i])
                        }
                    });
                    return {
                        part: part,
                        wires: wires,
                        assembly: assembly
                    }
                });
                let all = [basicWires].concat(partsAndWires);
                return {
                    partsAndWires: all
                }
            } else {
                return {
                    partsAndWires: []
                }
            }
        }
    }

    export function allocateDefinitions(opts: AllocatorOpts): AllocatorResult {
        return new Allocator(opts).allocAll();
    }
}