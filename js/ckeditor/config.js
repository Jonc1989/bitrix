/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
    CKEDITOR.config.allowedContent = true;
    config.contentsCss = 'js/ckeditor/fonts.css';

    config.font_names = 'Roboto/Roboto;' + config.font_names;
    config.font_names = 'Open Sans/Open Sans;' + config.font_names;

    config.extraPlugins = 'dragresize';
    // config.extraPlugins = 'button';
    // config.extraPlugins = 'listblock';
    // config.extraPlugins = 'panel';
    // config.extraPlugins = 'floatpanel';
    // config.extraPlugins = 'richcombo';
    // config.extraPlugins = 'stylescombo';
};
