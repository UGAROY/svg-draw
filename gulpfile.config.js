'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';
        
        this.tscOption = {
            target: 'ES5',
            declarationFiles: false,
            noExternalResolve: true,
            out: "svg-draw.js"};

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
        this.appTypeScriptReferences = this.typings + 'typescriptApp.d.ts';
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
