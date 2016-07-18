var entityFields = [];
var currentSection = null;
var editor;
var deal = 'crm.deal';
var currency = 'crm.currency';
var company = 'crm.company';
var contact = 'crm.contact';
var invoice = 'crm.invoice';
var productrow = 'crm.productrow';
var lead = 'crm.lead';

function initDocument(fields){
    $('.dropped').remove();
    $("#document-edit-modal .modal-title").empty();
    $("#document-edit-modal .modal-title").text(fields[0].ENTITY);
    $.each(fields[0].PROPERTY_VALUES, function( name, val ){
        if(val){
            var properties = JSON.parse(val);


        if( name == 'docProperties'){
            $('.margin-left').val( ( properties.left != "" ) ? properties.left : 40 ),
            $('.margin-top').val( ( properties.top != "" ) ? properties.top : 60 ),
            $('.margin-right').val( ( properties.right != "" ) ? properties.right : 40 ),
            $('.margin-bottom').val( ( properties.bottom != "" ) ? properties.bottom : 60 ),
            $('.line-height').val( ( properties.lHeight != "" ) ? properties.lHeight : 1 ),
            $('.font-size').val( ( properties.fontSize != "" ) ? properties.fontSize : 10 ),
            $('.date-format').val( properties.dateFormat != "" ? properties.dateFormat : 'YYYY-MM-DD' ),

            //$('#document').css({
            //    'padding-left': ( properties.left != "" ) ? properties.left + 'px' : 40 + 'px',
            //    'padding-top': ( properties.top != "" ) ? properties.top + 'px' : 60 + 'px' ,
            //    'padding-right': ( properties.right != "" ) ? properties.right + 'px' : 40 + 'px',
            //    'padding-bottom': ( properties.bottom != "" ) ? properties.bottom + 'px' : 60 + 'px'
            //}),
            $('.field').css({
                'line-height': ( properties.lHeight != "" ) ? properties.lHeight : 1,
                'font-size': ( properties.fontSize != "" ) ? properties.fontSize : 10
            });

        }else{

            //$('#TextArea1').html( properties );
            // $('#TextArea1').each(function(){
            //     this.contentEditable = true;
            // });


            //editor.resize($("#document").width(),$("#document").height());
            editor.setData(properties);

            initDroppable( $('#cke_TextArea1') );


        }
    }
    });
}
function initDroppable($elements) {
    $elements.droppable({
        hoverClass: "textarea",
        iframeFix: true,
        iframeScroll: true,
        drop: function(event, ui) {
            var tempid = ui.draggable.text();
            var dropText;
            dropText = " {" + ui.draggable.data().method + ":" + tempid + "} ";

            if (CKEDITOR.dom.selection) {
                editor.insertText( dropText )
            }
        }
    });
}

function editDoc( name ){

    BX24.callBatch({
        getEntityItem: {
            method: 'entity.item.get',
            params: {
                ENTITY: name
            }
        },
        getEntityItemProperties: {
            method: 'entity.item.property.get',
            params: {
                ENTITY: name
            }
        }
    }, function (result) {

        if (!result.getEntityItemProperties.error()) {
            entityFields = result.getEntityItemProperties.data();
        }

        if (!result.getEntityItem.error()) {
            $("#document-edit-modal").modal('show');
            initDocument( result.getEntityItem.data() );
        }
    });
}

function getEntityProperties( entity ){
    BX24.callBatch({
        getEntityProps: {
            method: 'entity.item.get',
            params: {
                ENTITY: entity
            }
        }
    }, function (result) {

        if (!result.getEntityProps.error() ) {

                var data = result.getEntityProps.data()[0];
                if (data.PROPERTY_VALUES != undefined || data.PROPERTY_VALUES != null) {
                    var text = '';
                    var documentProperties = {};

                    $.each( data.PROPERTY_VALUES, function( i, val ){
                        var value = JSON.parse(val);
                        if( i == 'docProperties' ){
                             documentProperties = value;
                        }else if( i == 'text' ){
                            text = value;
                        }
                    });
              BX24.callBatch({
                  getFields: {
                      method: 'crm.' + data.NAME + '.list',
                      params: {
                          //SELECT: keys
                      }
                  }
              },function (result) {
                  if (!result.getFields.error()) {
                      $('.data-list').empty();
                      var fieldData = result.getFields.data();

                      $.each(fieldData, function (i, field) {

                          var companyId, contactId, dealId, invoiceId, currencyId, productRowId, leadId, quoteId;

                          switch (data.NAME) {
                              case 'company':
                                  currencyId = field.CURRENCY_ID != undefined ? field.CURRENCY_ID : null;
                                  leadId = field.LEAD_ID != undefined ? d.LEAD_ID : null;
                                  break;
                              case 'contact':
                                  companyId = field.COMPANY_ID != undefined ? field.COMPANY_ID : null;
                                  leadId = field.LEAD_ID != undefined ? field.LEAD_ID : null;
                                  break;
                              case 'deal':
                                  companyId = field.COMPANY_ID != undefined ? field.COMPANY_ID : null;
                                  contactId = field.CONTACT_ID != undefined ? field.CONTACT_ID : null;
                                  quoteId = field.QUOTE_ID != undefined ? field.QUOTE_ID : null;
                                  leadId = field.LEAD_ID != undefined ? field.LEAD_ID : null;
                                  productRowId = field.ID != undefined ? field.ID : null;
                                  break;
                              case 'invoice':
                                  companyId = field.UF_COMPANY_ID != undefined ? field.UF_COMPANY_ID : null;
                                  contactId = field.UF_CONTACT_ID != undefined ? field.UF_CONTACT_ID : null;
                                  dealId = field.UF_DEAL_ID != undefined ? field.UF_DEAL_ID : null;
                                  break;
                              case 'currency':

                                  break;
                              case 'lead':

                                  break;
                              default:
                                  console.log('default');
                          }


                          BX24.callBatch({
                              getCompany: {
                                  method: 'crm.company.get',
                                  params: {
                                      ID: companyId
                                  }
                              }, getContact: {
                                  method: 'crm.contact.get',
                                  params: {
                                      ID: contactId
                                  }
                              },
                              getDeal: {
                                  method: 'crm.deal.get',
                                  params: {
                                      ID: dealId
                                  }
                              },
                              get_deal_productRow: {
                                  method: 'crm.deal.productrows.get',
                                  params: {
                                      ID:  productRowId
                                  }
                              },
                              getLead: {
                                  method: 'crm.lead.get',
                                  params: {
                                      ID:  leadId
                                  }
                              }
                          }, function (result) {

                              var companyData = {}, contactData = {}, dealData = {}, dealProductRow = {}, leadData = {};
                              if (!result.getCompany.error() ) {
                                  companyData = result.getCompany.data();
                              }
                              if (!result.getContact.error()) {
                                  contactData = result.getContact.data();
                              }
                              if (!result.getDeal.error()) {
                                  dealData = result.getDeal.data();
                              }
                              if (!result.get_deal_productRow.error()) {
                                  dealProductRow = result.get_deal_productRow.data();
                              }
                              if (!result.getLead.error()) {
                                  leadData = result.getLead.data();
                              }


                              var div = $('<div class="col-lg-12 col-md-12 list-item" id="doc_' + i + '"/>', {text: i});
                              var span = $('<span />', {text: i}); span.appendTo(div);
                              var print = $( '<span />', {text: 'Printēt', class: 'action'}); print.appendTo(div);

                              div.appendTo('.data-list');
                              $('#doc_' + i + ' .action').on('click', function () {
                                  downloadPdf( text, fieldData[i], documentProperties, data.NAME, companyData, contactData, dealData, dealProductRow, leadData );
                              });


                          });
                      });
                  }
              });
            }

        }

    });
}

function getEntity( name ){
    $('.data-list').empty();
    $('.crm-menu-item').removeClass('crm-menu-item-active');
    $(this).addClass('crm-menu-item-active');
    BX24.callMethod('entity.get',
        {},
        function (result) {

            if(result.error())
                console.error(result.error());
            else
            {
                $.each(result.data(), function(i, val){
                    if( val.NAME == name ){
                        var div = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 list-item" id="' + val.ENTITY + '"/>');
                        $('<span />', {text: val.ENTITY, class: 'entity-name' }).appendTo(div);
                        $('<span />', {text: 'Saraksts', id: 'list_' + val.ENTITY, class: 'list_entity' }).appendTo(div);
                        $('<span />', {text: 'Rediģēt', id: 'edit_' + val.ENTITY, class: 'edit_entity' }).appendTo(div);
                        div.appendTo('.data-list');

                        $('#list_' + val.ENTITY).on('click', function () {
                            getEntityProperties( val.ENTITY );
                        });
                        $('#edit_' + val.ENTITY).on('click', function () {
                            editDoc( val.ENTITY );currentSection = val.ENTITY;
                        });
                    }
                });

            }

        });
}

function sync( name, fields ){

        var crmFields = ( fields.length != 0 ) ? Object.keys(fields) : [];

        BX24.callMethod('entity.item.get', {
                ENTITY: name
            },
            function(result){
                if(result.error()){
                    addEntity( name, fields );
                }
                else {
                    var entities = result.data();
                        entities.forEach(function (entity) {
                            if (entity.ENTITY == name ) {
                                var entityFields = ( entity.PROPERTY_VALUES != undefined ) ? Object.keys(entity.PROPERTY_VALUES) : [];

                                var fieldsToAdd = diff(crmFields, entityFields);
                                var fieldsToDelete = diff(entityFields, crmFields);
                                var data = {}; var data2 = {};
                                fieldsToAdd.forEach( function(field){
                                    data[field] = JSON.stringify(fields[field]);
                                });
                                saveFields( name, data );

                                fieldsToDelete.forEach( function(field){
                                    data2[field] = '';
                                });
                                deleteFields( name, data2);

                                var update = {};
                                $.each(fields, function(i, val){
                                    update[i] = JSON.stringify(fields[i]);
                                });


                                setTimeout(function(){


                                    var response, xhr;
                                    xhr = updateEntity( entity.ID, name, entity.NAME, update );
                                    xhr.onreadystatechange = function() {
                                        if (xhr.readyState == 4 && xhr.status == 200) {
                                            response = JSON.parse(xhr.response);
                                            if(response.result){
                                                $("#document-edit-modal #close-edit-modal").click()
                                            }

                                        }
                                    };

                                }, 3000);
                            }

                        });

    }
});
}

function createField( fields, fieldName, method){

    var bool = $.grep(fields, function(e){ return e.PROPERTY == fieldName; });

    if( bool.length < 1 && fieldName ){
        $('<div />', {class:"field col-md-2 " + method, text: fieldName}).data({method: method, field: fieldName }).appendTo('#field-wrap');

        $('.field').draggable({
            cursor: 'move',
            helper: "clone",

            stop: function(event, ui) {
                //var tempid = ui.helper[0].innerText;
                //var dropText;
                //dropText = " {" + method + ":" + tempid + "} ";
                //
                //if (CKEDITOR.dom.selection) {
                //    var sel = editor.getSelection();
                //    // if (sel.rangeCount) {
                //    //     var range = sel.getRangeAt(0); console.log(range);
                //    //     range.deleteContents();
                //    //     range.insertNode( document.createTextNode(dropText) );
                //    // }
                //    editor.insertText( dropText )
                //}
            }

        }).css('z-index', 1);
    }

}

jQuery(document).ready(function(){

    var dealFields = [], currencyFields = [], companyFields = [], dealData = [], currencyData = [], companyData = [];
    var dataArray = [];

    CKEDITOR.replace( 'TextArea1' );
    editor = CKEDITOR.instances['TextArea1'];

    CKEDITOR.editorConfig = function( config ) {
             //config.uiColor = '#F7B42C';
        };
    BX24.init(function(){

        $(document).on('click', '#save-entity', function () {
            var id = $('input[type="radio"]:checked').attr('id');
            if( id ){
                BX24.callMethod('entity.add',
                    {'ENTITY': $('#entity-name').val(), 'NAME': id, 'ACCESS': {U1:'W',AU:'R'}
                    }, function (result) {
                        if(!result.error()){
                            BX24.callMethod('entity.item.add', {
                                ENTITY: $('#entity-name').val(),
                                NAME: id
                            },function( result ){
                                if(!result.error()){
                                    $("#entity-add-modal #close-add-entity").click()
                                }
                            });
                        }
                    } );
            }
        });



        $('#api').on('change', function(){
            $('.field').remove(':not(.dropped)');
            var method = $(this).val();
            if (method.length > 0) {
                BX24.callMethod(
                    'crm.' + method +'.fields',
                    {},
                    function(result) {
                        if(!result.error()) {
                            $.each(result.data(), function(fieldName, e){
                                if( fieldName == 'COMPANY_ID' || fieldName == 'CONTACT_ID' || fieldName == 'UF_DEAL_ID' ||
                                    fieldName == 'QUOTE_ID' || fieldName == 'LEAD_ID' || fieldName == 'PRODUCT_ID' ){

                                }else{
                                    createField( entityFields, fieldName, method );
                                }
                            });
                        }
                    }
                );
            }
        });
    });

    $(document).on('click', '#save-doc', function () {

        var PROPERTY_VALUES = {};

        for(var instanceName in CKEDITOR.instances){
            CKEDITOR.instances[instanceName].updateElement();
        }

        PROPERTY_VALUES['text'] = CKEDITOR.instances['TextArea1'].getData();

        PROPERTY_VALUES['docProperties'] = {
            left: ( $('.margin-left').val() != '') ? $('.margin-left').val() : 40 ,
            top: ($('.margin-top').val() != '') ? $('.margin-top').val() : 60 ,
            right: ( $('.margin-right').val() != '') ? $('.margin-right').val() : 40 ,
            bottom: ($('.margin-bottom').val() != '') ? $('.margin-bottom').val() : 60 ,
            lHeight: ( $('.line-height').val() != '' ) ? $('.line-height').val() : 1,
            fontSize: $('.font-size').val(),
            dateFormat: ($('.date-format').val() != '') ? $('.date-format').val() : 'YYYY-MM-DD'
        };

        sync( currentSection, PROPERTY_VALUES );

    });

    $('#debug').click(function(){
        console.log(window.getSelection())

    })


});