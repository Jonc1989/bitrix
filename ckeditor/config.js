/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';

    config.contentsCss = 'js/ckeditor/fonts.css';
//the next line add the new font to the combobox in CKEditor
    config.font_names = 'Roboto/Roboto;' + config.font_names;
};
