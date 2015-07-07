module VectorEditor {
    export interface IShape {
        shape: RaphaelElement;
        trackerSet: RaphaelSet;
        resize(width: number, height: number): void;
        remove(): void;
        showTracker(): void;
        hideTracker(): void;
        postCreate(): void;
    }
}