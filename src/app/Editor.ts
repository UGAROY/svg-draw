/// <reference path="../../tools/typings/raphael/raphael.d.ts" />
/// <reference path="../../tools/typings/jquery/jquery.d.ts" />
/// <reference path="IShape.ts" />
/// <reference path="BaseShape.ts" />
/// <reference path="Rect.ts" />
/// <reference path="Ellipse.ts" />
/// <reference path="Line.ts" />
/// <reference path="SvgPath.ts" />
/// <reference path="Text.ts" />
/// <reference path="shapeFactory.ts" />
/// <reference path="util.ts" />

module VectorEditor {

    export class Editor {
        container: JQuery;
        paper: RaphaelPaper;
        prop: any;
        mode: string;
        action: string;
        shapes: IShape[];

        drawing: boolean;
        onHitXy: number[];

        currentShape: IShape;

        constructor(element: HTMLElement) {

            this.container = $(element);
            this.paper = Raphael(element, $(element).width(), $(element).height());

            this.prop = {
                "strokeWidth": 1,
                "stroke": "#000000",
                "fill": "#FFFFFF",
                "stroke-opacity": 1,
                "fill-opacity": 1,
                "text": "text"
            }
            
            this.mode = "select";

            this.shapes = [];
            this.onHitXy = [0, 0];

            this.registerMouseEvents();
        }
        
        // Set shape properties
        set(attribute, value): void {
            this.prop[attribute] = value;
            // if there is a selected shape, set the attribute
            if (this.currentShape && this.currentShape.trackerSet) {
                this.currentShape.shape.attr(attribute, value);
            }
        }
        
        delete(): void {
            if (this.currentShape && this.currentShape.trackerSet) {
                this.shapes.splice(this.shapes.indexOf(this.currentShape), 1);
                this.currentShape.trackerSet.remove();
                this.currentShape.remove();
            }
        }
        
        clear(): void {
            this.paper.clear();
        }
        
        load(jsonStr: string, xOffset: number = 0, yOffset: number = 0): void {
            var shapeObjs = JSON.parse(jsonStr);
            shapeObjs.forEach((shapeObj) => {
                var shape = createShape(this, 0, 0, shapeObj.type, shapeObj);
                shape.shape.transform(Raphael.format("...T{0},{1}", xOffset, yOffset))
                shape.postCreate();
            })
        }
        
        serialize(): string {
            var shapeObjects = [];
            this.shapes.forEach(function(shape) {
                shapeObjects.push(shape.save());
            });
            return JSON.stringify(shapeObjects);
        }

        setMode(mode): void {
            if (mode !== "select") {
                this.unSelectAll();
            }
            this.mode = mode;
        }

        // UnSelect all the shapes
        unSelectAll(): void {
            this.shapes.forEach((shape) => {
                shape.hideTracker();
            });
            this.currentShape = null;
        }

        // Register Mouse Events
        private registerMouseEvents(): void {
            this.container.bind("mousedown", (event: JQueryEventObject) => {
                this.onMouseDown(event);
            });
            this.container.bind("mouseup", (event: JQueryEventObject) => {
                this.onMouseUp(event);
            });
            this.container.bind("mousemove", (event: JQueryEventObject) => {
                this.onMouseMove(event);
            });
        }

        private onMouseDown(event: JQueryEventObject): void {
            event.preventDefault();
            var position = getRelativePositionToWindow(this.container),
                x = event.clientX - position[0],
                y = event.clientY - position[1];
            if (this.mode === "select") {
                if (event.target.tagName === "svg") {
                    this.unSelectAll();
                    return;
                }
            } else if (this.mode === "delelte") {
                // Place holder. No doing anything at this moment  
            } else {
                if (this.drawing) {
                    return;
                }
                this.drawing = true;
                var shape = createShape(this, x, y, this.mode, this.prop);
                this.currentShape = shape;
                // Cache the mouse down position
                this.onHitXy = [x, y];
            }
        }

        private onMouseMove(event: JQueryEventObject): void {
            if (!this.drawing  || !this.currentShape) {
                return;
            }
            var position = getRelativePositionToWindow(this.container),
                x = event.clientX - position[0], y = event.clientY - position[1],
                shape = this.currentShape;
            shape.resize(x - this.onHitXy[0], y - this.onHitXy[1]);
        }

        private onMouseUp(event: JQueryEventObject): void {
            // The mouse up event is sometimes not firing off correctly
            // TODO: revisit
            if (!this.drawing  || !this.currentShape) {
                return;
            }
            this.currentShape.postCreate();
            this.currentShape = null;
            this.drawing = false;
        }
    }
}