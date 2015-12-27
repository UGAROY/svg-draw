var VectorEditor;
(function (VectorEditor) {
    var BaseShape = (function () {
        function BaseShape(editor) {
            this.editor = editor;
            this.paper = editor.paper;
            this.offset = 5;
        }
        BaseShape.prototype.registerDragShapeEvent = function () {
            var _this = this;
            // Add drag event listeners to shape
            this.shape.drag(function (dx, dy) {
                if (_this.editor.mode !== "select") {
                    return;
                }
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...T{0}, {1}", dx, dy));
                _this.syncTracker();
            }, function () {
                if (_this.editor.mode !== "select") {
                    return;
                }
                _this.editor.unSelectAll();
                _this.showTracker();
                _this.editor.currentShape = _this;
                _this.currentTransformation = _this.shape.transform();
            }, function () { });
        };
        BaseShape.prototype.addTracker = function () {
            var _this = this;
            var box = this.shape.getBBox(true);
            this.trackerSet = this.paper.set();
            this.trackerSet.push(this.paper.rect(box.x - this.offset, box.y - this.offset, box.width + 2 * this.offset, box.height + 2 * this.offset), this.paper.circle((box.x + box.x2) / 2, box.y - this.offset * 3, 5));
            this.syncTracker();
            this.trackerSet[1].attr("fill", "#FFFFFF");
            this.trackerSet.attr("stroke-dasharray", "-");
            // Add event handlers
            this.trackerSet[1].mouseover(function () { this.attr("fill", "red"); });
            this.trackerSet[1].mouseout(function () { this.attr("fill", "white"); });
            // Add rotate event listeners to rotat tracker
            this.trackerSet[1].drag(function (dx, dy, x, y, event) {
                var position = VectorEditor.getRelativePositionToWindow(_this.editor.container), x = event.clientX - position[0], y = event.clientY - position[1], // the x, y come with the arguments don't work well with the offset
                rad = Math.atan2(y - _this.originY, x - _this.originX), deg = ((rad * (180 / Math.PI) + 90) % 360 + 360) % 360;
                _this.shape.transform(_this.currentTransformation);
                _this.shape.transform(Raphael.format("...R{0},{1},{2}", deg - _this.currentRotaion, _this.originX, _this.originY));
                _this.syncTracker();
            }, function () {
                var box = _this.shape.getBBox(), containerOffset = VectorEditor.getRelativePositionToWindow(_this.editor.container);
                _this.originX = (box.x + box.x2) / 2;
                _this.originY = (box.y + box.y2) / 2;
                _this.currentRotaion = _this.shape.matrix.split().rotate;
                _this.currentTransformation = _this.shape.transform();
            }, function () {
            });
            this.trackerSet.hide();
        };
        BaseShape.prototype.resize = function (width, height) {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("width", width);
            this.shape.attr("height", height);
        };
        BaseShape.prototype.postCreate = function () {
            var box = this.shape.getBBox();
            if (box.width === 0 || box.height === 0) {
                this.shape.remove();
            }
            else {
                this.editor.shapes.push(this);
                this.addTracker();
            }
        };
        BaseShape.prototype.remove = function () {
            this.shape.remove();
        };
        BaseShape.prototype.showTracker = function () {
            this.trackerSet.show();
            // Make sure the shape is on top of the trackerSet
            this.trackerSet.toFront();
            this.shape.toFront();
        };
        BaseShape.prototype.hideTracker = function () {
            this.trackerSet.hide();
        };
        BaseShape.prototype.syncTracker = function () {
            this.trackerSet.transform(this.shape.transform());
        };
        BaseShape.prototype.save = function () {
            return {
                type: this.shape['type'],
                x: this.shape.attr('x'),
                y: this.shape.attr('y'),
                width: this.shape.attr('width'),
                height: this.shape.attr('height'),
                stroke: this.shape.attr('stroke') === 0 ? 'none' : this.shape.attr('stroke'),
                'stroke-width': this.shape.attr('stroke-width'),
                fill: this.shape.attr('fill'),
                transform: this.shape.transform().toString()
            };
        };
        return BaseShape;
    })();
    VectorEditor.BaseShape = BaseShape;
})(VectorEditor || (VectorEditor = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VectorEditor;
(function (VectorEditor) {
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect(editor, x, y, prop) {
            _super.call(this, editor);
            this.shape = this.paper.rect(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }
        return Rect;
    })(VectorEditor.BaseShape);
    VectorEditor.Rect = Rect;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    var Ellipse = (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(editor, x, y, prop) {
            _super.call(this, editor);
            this.shape = this.paper.ellipse(x, y, 0, 0);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }
        Ellipse.prototype.resize = function (width, height) {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("rx", width);
            this.shape.attr("ry", height);
        };
        Ellipse.prototype.save = function () {
            var baseObj = _super.prototype.save.call(this);
            return $.extend(baseObj, {
                rx: this.shape.attr('rx'),
                ry: this.shape.attr('ry'),
                cx: this.shape.attr('cx'),
                cy: this.shape.attr('cy')
            });
        };
        return Ellipse;
    })(VectorEditor.BaseShape);
    VectorEditor.Ellipse = Ellipse;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    var SimpleLine = (function (_super) {
        __extends(SimpleLine, _super);
        function SimpleLine(editor, x, y, prop) {
            _super.call(this, editor);
            this.shape = this.paper.path(Raphael.format("M{0},{1}", x, y));
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }
        SimpleLine.prototype.resize = function (width, height) {
            var pathSplit = Raphael.parsePathString(this.shape.attr("path"));
            pathSplit.splice(1);
            this.shape.attr("path", Raphael.format("{0}L{1},{2}", pathSplit.toString(), pathSplit[0][1] + width, pathSplit[0][2] + height));
        };
        SimpleLine.prototype.save = function () {
            var baseObj = _super.prototype.save.call(this);
            return $.extend(baseObj, {
                type: 'line',
                path: this.shape.attr('path')
            });
        };
        return SimpleLine;
    })(VectorEditor.BaseShape);
    VectorEditor.SimpleLine = SimpleLine;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    var SvgPath = (function (_super) {
        __extends(SvgPath, _super);
        function SvgPath(editor, x, y, prop) {
            _super.call(this, editor);
            this.shape = this.paper.path(Raphael.format("M{0},{1}", x, y));
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }
        SvgPath.prototype.resize = function (width, height) {
            var pathSplit = Raphael.parsePathString(this.shape.attr("path"));
            this.shape.attr("path", Raphael.format("{0}L{1},{2}", pathSplit.toString(), pathSplit[0][1] + width, pathSplit[0][2] + height));
        };
        SvgPath.prototype.save = function () {
            var baseObj = _super.prototype.save.call(this);
            return $.extend(baseObj, {
                type: 'path',
                path: this.shape.attr('path')
            });
        };
        return SvgPath;
    })(VectorEditor.BaseShape);
    VectorEditor.SvgPath = SvgPath;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    var Text = (function (_super) {
        __extends(Text, _super);
        function Text(editor, x, y, prop) {
            _super.call(this, editor);
            this.shape = this.paper.text(x, y, prop.text);
            this.shape.attr(prop);
            this.shape.id = Raphael.createUUID();
            this.registerDragShapeEvent();
        }
        Text.prototype.resize = function (width, height) {
            if (width < 0 || height < 0) {
                return;
            }
            this.shape.attr("font-size", Math.sqrt((height * height) + (width * width)));
        };
        Text.prototype.save = function () {
            var baseObj = _super.prototype.save.call(this);
            return $.extend(baseObj, {
                font: this.shape.attr('font'),
                'font-family': this.shape.attr('font-family'),
                'font-size': this.shape.attr('font-size'),
                text: this.shape.attr('text')
            });
        };
        return Text;
    })(VectorEditor.BaseShape);
    VectorEditor.Text = Text;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    function createShape(editor, x, y, type, prop) {
        if (type === "rect") {
            return new VectorEditor.Rect(editor, x, y, prop);
        }
        else if (type === "ellipse") {
            return new VectorEditor.Ellipse(editor, x, y, prop);
        }
        else if (type === "line") {
            return new VectorEditor.SimpleLine(editor, x, y, prop);
        }
        else if (type === "path") {
            return new VectorEditor.SvgPath(editor, x, y, prop);
        }
        else if (type === "text") {
            return new VectorEditor.Text(editor, x, y, prop);
        }
    }
    VectorEditor.createShape = createShape;
})(VectorEditor || (VectorEditor = {}));
var VectorEditor;
(function (VectorEditor) {
    function getRelativePositionToWindow(elem) {
        var pos = elem.offset();
        var bodyScrollTop = $(window).scrollTop();
        var bodyScrollLeft = $(window).scrollLeft();
        return [
            pos.left - bodyScrollLeft,
            pos.top - bodyScrollTop
        ];
    }
    VectorEditor.getRelativePositionToWindow = getRelativePositionToWindow;
})(VectorEditor || (VectorEditor = {}));
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
var VectorEditor;
(function (VectorEditor) {
    var Editor = (function () {
        function Editor(element) {
            this.container = $(element);
            this.paper = Raphael(element, $(element).width(), $(element).height());
            this.prop = {
                "stroke-width": 2,
                "stroke": "#000000",
                "fill": "#000000",
                "stroke-opacity": 1,
                "fill-opacity": 0,
                "text": "text"
            };
            this.mode = "select";
            this.shapes = [];
            this.onHitXy = [0, 0];
            this.registerMouseEvents();
        }
        // Set shape properties
        Editor.prototype.set = function (attribute, value) {
            this.prop[attribute] = value;
            // if there is a selected shape, set the attribute
            if (this.currentShape && this.currentShape.trackerSet) {
                this.currentShape.shape.attr(attribute, value);
            }
        };
        Editor.prototype.delete = function () {
            if (this.currentShape && this.currentShape.trackerSet) {
                this.shapes.splice(this.shapes.indexOf(this.currentShape), 1);
                this.currentShape.trackerSet.remove();
                this.currentShape.remove();
            }
        };
        Editor.prototype.clear = function () {
            this.paper.clear();
        };
        Editor.prototype.load = function (jsonStr, xOffset, yOffset) {
            var _this = this;
            if (xOffset === void 0) { xOffset = 0; }
            if (yOffset === void 0) { yOffset = 0; }
            var shapeObjs = JSON.parse(jsonStr);
            shapeObjs.forEach(function (shapeObj) {
                var shape = VectorEditor.createShape(_this, 0, 0, shapeObj.type, shapeObj);
                shape.shape.transform(Raphael.format("...T{0},{1}", xOffset, yOffset));
                shape.postCreate();
            });
        };
        Editor.prototype.serialize = function () {
            var shapeObjects = [];
            this.shapes.forEach(function (shape) {
                shapeObjects.push(shape.save());
            });
            return JSON.stringify(shapeObjects);
        };
        Editor.prototype.setMode = function (mode) {
            if (mode !== "select") {
                this.unSelectAll();
            }
            this.mode = mode;
        };
        // UnSelect all the shapes
        Editor.prototype.unSelectAll = function () {
            this.shapes.forEach(function (shape) {
                shape.hideTracker();
            });
            this.currentShape = null;
        };
        // Register Mouse Events
        Editor.prototype.registerMouseEvents = function () {
            var _this = this;
            this.container.bind("mousedown", function (event) {
                _this.onMouseDown(event);
            });
            this.container.bind("mouseup", function (event) {
                _this.onMouseUp(event);
            });
            this.container.bind("mousemove", function (event) {
                _this.onMouseMove(event);
            });
        };
        Editor.prototype.onMouseDown = function (event) {
            event.preventDefault();
            var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1];
            if (this.mode === "select") {
                if (event.target.tagName === "svg") {
                    this.unSelectAll();
                    return;
                }
            }
            else if (this.mode === "delete") {
            }
            else {
                if (this.drawing) {
                    return;
                }
                this.drawing = true;
                var shape = VectorEditor.createShape(this, x, y, this.mode, this.prop);
                this.currentShape = shape;
                // Cache the mouse down position
                this.onHitXy = [x, y];
            }
        };
        Editor.prototype.onMouseMove = function (event) {
            if (!this.drawing || !this.currentShape) {
                return;
            }
            var position = VectorEditor.getRelativePositionToWindow(this.container), x = event.clientX - position[0], y = event.clientY - position[1], shape = this.currentShape;
            shape.resize(x - this.onHitXy[0], y - this.onHitXy[1]);
        };
        Editor.prototype.onMouseUp = function (event) {
            // The mouse up event is sometimes not firing off correctly
            // TODO: revisit
            if (!this.drawing || !this.currentShape) {
                return;
            }
            this.currentShape.postCreate();
            this.currentShape = null;
            this.drawing = false;
        };
        return Editor;
    })();
    VectorEditor.Editor = Editor;
})(VectorEditor || (VectorEditor = {}));

//# sourceMappingURL=svg-draw.js.map
