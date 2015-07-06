module VectorEditor {
    export class Rect extends BaseShape {
        constructor(editor: Editor, x: number, y: number, prop: any) {
            super(editor);

            this.shape = this.paper.rect(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();

            this.registerDragShapeEvent();
        }

    }
}