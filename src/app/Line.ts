module VectorEditor {
    export class SimpleLine extends BaseShape {
        constructor(editor: Editor, x: number, y: number, prop: any) {
            super(editor);

            this.shape = this.paper.path(Raphael.format("M{0},{1}", x, y));
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();

            this.registerDragShapeEvent();
        }

        resize(width: number, height: number): void {
            var pathSplit = Raphael.parsePathString(this.shape.attr("path"));
            pathSplit.splice(1);
            this.shape.attr("path", Raphael.format("{0}L{1},{2}", pathSplit.toString(), pathSplit[0][1] + width, pathSplit[0][2] + height));
        }
        
        save(): Object {
            var baseObj = super.save();
            return $.extend(baseObj, {
                type: 'line',
                path: this.shape.attr('path')
            })
        }
    }
}