import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import grapesjs from 'grapesjs';
declare var grapesjs: any;
@Component({
    selector: 'app-page-content-editor',
    templateUrl: './pages.content.edit.html',
    styleUrls: ['./pages.content.edit.scss']
})
// tslint:disable-next-line:component-class-suffix
export class PagesContentEditor implements OnInit {
    @Input() webDescription: any;
    @Output() webData = new EventEmitter();
    globalEditor: any;
    html: any;
    css: any;
    ngOnInit() {
        const editor = grapesjs.init({
            // Indicate where to init the editor. You can also pass an HTMLElement
            container: '#gjs',
            height: '300px',
            // Get the content for the canvas directly from the element
            // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
            blocks: ['link-block', 'quote', 'text-basic'],
            showStylesOnChange: true,
            showOffsets: 1,
            avoidInlineStyle: 1,
            allowScripts: 1,
            textCleanCanvas: 'Are you sure to clean the canvas?',
            textGeneral: 'General',
            textLayout: 'Layout',
            textTypography: 'Typography',
            textExtra: 'Extra',
            textFlex: 'Flex',
            blocksBasicOpts: true,
            storageManager: { autoload: 0 },
            plugins: [
                'gjs-preset-webpage'],
            pluginsOpts: {
                // 'gjs-aviary': {/* ...options */ },
                'gjs-plugin-forms': false,
                // 'gjs-plugin-ckeditor': {
                //   skin: 'Icy Orange',
                // },
                // 'gjs-component-countdown': {},
                // 'gjs-navbar': {},
                'gjs-preset-webpage': {
                    modalImportTitle: 'Import Template',
                    modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                    // tslint:disable-next-line:no-shadowed-variable
                    modalImportContent: editor => editor.getHtml(),
                    formsOpts: false,
                    countdownOpts: false,
                    navbarOpts: false,
                    'blocksBasicOpts': {},
                    // countdownOpts: {},
                },
            },
        });
        if (this.webDescription.length > 0) {
            editor.setComponents(this.webDescription);
        }
        const panelManager = editor.Panels;
        panelManager.removeButton('views', 'open-layers');
        editor.Panels.removePanel('devices-c');
        editor.on('change:changesCount', (editorModel, changes) => {
            if (changes) {
                // do something with changes
                // console.log(changes);
                // this.webData.emit(editor.getHtml());
                this.webData.emit(editor.getHtml());
            }
        });
        // this.globalEditor = editor;
        // const interval = setInterval(() => {
        //     this.html = (editor.getHtml());
        //     this.css = (editor.getCss());
        //   }, 2000);
        //   this.webData = this.html;
    }
}
