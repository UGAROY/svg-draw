module VectorEditor {
    export class Ellipse extends BaseShape {

        constructor(editor: Editor, x: number, y: number, prop: any) {
            super(editor);

            this.shape = this.paper.ellipse(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();

            this.registerDragShapeEvent();
        }

        resize(width: number, height: number): void {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("rx", width);
            this.shape.attr("ry", height);
        }

    }
}