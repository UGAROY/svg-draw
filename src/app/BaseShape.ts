module VectorEditor {
    export class BaseShape implements IShape {
        shape: RaphaelElement;
        trackerSet: RaphaelSet;

        editor: Editor;
        paper: RaphaelPaper;

        offset: number;
        originX: number;
        originY: number;
        currentRotaion: number;
        currentTransformation: string;

        constructor(editor: Editor) {
            this.editor = editor;
            this.paper = editor.paper;

            this.offset = 5;
        }

        registerDragShapeEvent(): void {
            // Add drag event listeners to shape
            this.shape.drag((dx: number, dy: number): any => {
                if (this.editor.mode !== "select") {
                    return;
                }
                this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                this.syncTracker();
            }, (): any => {
                    if (this.editor.mode !== "select") {
                        return;
                    }
                    if (!this.trackerSet) {
                        // Not sure why, but occasionally, the tracker is not getting created
                        // Definitely needs to revisit this. TODO:
                        // One guess is that the mouse up event is not fired off correctly 
                        // If the mouse is clicked too fast
                        this.addTracker();
                    }
                    this.editor.unSelectAll();
                    this.showTracker();
                    this.editor.currentShape = this;
                    this.currentTransformation = this.shape.transform();
                }, (): any => { });
        }

        addTracker(): void {
            var box = this.shape.getBBox();
            this.trackerSet = this.paper.set();
            this.trackerSet.push(
                this.paper.rect(box.x - this.offset, box.y - this.offset,
                    box.width + 2 * this.offset, box.height + 2 * this.offset),
                this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5)
                );
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet.attr("stroke-dasharray", "-");

            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red") });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white") });

            // Add rotate event listeners to rotat tracker
            this.trackerSet[1].drag((dx: number, dy: number, x: number, y: number, event: DragEvent): any => {
                var position = getRelativePositionToWindow(this.editor.container),
                    x = event.clientX - position[0], y = event.clientY - position[1], // the x, y come with the arguments don't work well with the offset
                    rad = Math.atan2(y - this.originY, x - this.originX),
                    deg = ((rad * (180 / Math.PI) + 90) % 360 + 360) % 360;
;               this.shape.transform(this.currentTransformation);
                this.shape.transform(Raphael.format("...R{0},{1},{2}", deg - this.currentRotaion, this.originX, this.originY));
                this.syncTracker();
            }, (): any => {
                    var box = this.shape.getBBox(), containerOffset = getRelativePositionToWindow(this.editor.container);
                    this.originX = (box.x + box.x2) / 2;
                    this.originY = (box.y + box.y2) / 2; 
                    this.currentRotaion = this.shape.matrix.split().rotate;
                    this.currentTransformation = this.shape.transform();
                }, (): any => {

                });

            this.trackerSet.hide();
        }
        resize(width: number, height: number): void {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("width", width);
            this.shape.attr("height", height);
        }
        postCreate(): void {
            var box = this.shape.getBBox();
            if (box.width === 0 || box.height === 0) {
                this.shape.remove();
            } else {
                this.addTracker();
            }
        }
        remove(): void {
            this.shape.remove();
        }
        showTracker(): void {
            this.trackerSet.show();

            // Make sure the shape is on top of the trackerSet
            this.trackerSet.toFront();
            this.shape.toFront();
        }
        hideTracker(): void {
            this.trackerSet.hide();
        }
        syncTracker(): void {
            this.trackerSet.transform(this.shape.transform());
        }

    }
}