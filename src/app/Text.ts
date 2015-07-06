module VectorEditor {
    export class Text extends BaseShape {
        constructor(editor: Editor, x: number, y: number, prop: any) {
            super(editor);

            this.shape = this.paper.text(x, y, prop.text);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }

        resize(width: number, height: number): void {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("font-size", Math.sqrt((height * height) + (width * width)));
        }
    }
}