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
var entityFields = [];

function initDocument( fields, templateName ){

    initDroppable( $('#cke_TextArea1') );
    $('.dropped').remove();
    $("#document-edit-modal .modal-title").empty();
    $("#document-edit-modal .modal-title").text(templateName);
    BX24.resizeWindow(window.innerWidth, 700);
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


            $('.field').css({
                'line-height': ( properties.lHeight != "" ) ? properties.lHeight : 1,
                'font-size': ( properties.fontSize != "" ) ? properties.fontSize : 10
            });

        }else if( name == 'text' ){
            editor.setData(properties);
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

function editDoc( name, templateName ){

    BX24.callBatch({
        getEntityItem: {
            method: 'entity.item.get',
            params: {
                ENTITY: name
            }
        }
        //getEntityItemProperties: {
        //    method: 'entity.item.property.get',
        //    params: {
        //        ENTITY: name
        //    }
        //}
    }, function (result) {

        //if (!result.getEntityItemProperties.error()) {
        //    entityFields = result.getEntityItemProperties.data();
        //}

        if (!result.getEntityItem.error()) {
            $("#document-edit-modal").modal('show');
            initDocument( result.getEntityItem.data(), templateName );
        }
    });
}

function getEntityProperties( entity ){
    var me = getDomain();

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
                        if( val ){
                            var value = JSON.parse(val);
                            if( i == 'docProperties' ){
                                documentProperties = value;
                            }else if( i == 'text' ){
                                text = value;
                            }
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


                          var companyId, contactId, dealId, invoiceId, currencyId, productRowId, leadId, quoteId, userId;

                          switch (data.NAME) {
                              case 'company':
                                  currencyId = field.CURRENCY_ID != undefined ? field.CURRENCY_ID : null;
                                  leadId = field.LEAD_ID != undefined ? d.LEAD_ID : null;
                                  userId = field.CREATED_BY_ID;
                                  break;
                              case 'contact':
                                  companyId = field.COMPANY_ID != undefined ? field.COMPANY_ID : null;
                                  leadId = field.LEAD_ID != undefined ? field.LEAD_ID : null;
                                  userId = field.CREATED_BY_ID;
                                  break;
                              case 'deal':
                                  companyId = field.COMPANY_ID != undefined ? field.COMPANY_ID : null;
                                  contactId = field.CONTACT_ID != undefined ? field.CONTACT_ID : null;
                                  quoteId = field.QUOTE_ID != undefined ? field.QUOTE_ID : null;
                                  leadId = field.LEAD_ID != undefined ? field.LEAD_ID : null;
                                  productRowId = field.ID != undefined ? field.ID : null;
                                  userId = field.CREATED_BY_ID;
                                  break;
                              case 'invoice':
                                  companyId = field.UF_COMPANY_ID != undefined ? field.UF_COMPANY_ID : null;
                                  contactId = field.UF_CONTACT_ID != undefined ? field.UF_CONTACT_ID : null;
                                  dealId = field.UF_DEAL_ID != undefined ? field.UF_DEAL_ID : null;
                                  userId = field.RESPONSIBLE_ID;
                                  break;
                              case 'currency':

                                  break;
                              case 'lead':
                                  companyId = field.COMPANY_ID != undefined ? field.COMPANY_ID : null;
                                  contactId = field.CONTACT_ID != undefined ? field.CONTACT_ID : null;
                                  userId = field.CREATED_BY_ID;
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
                                      ID:  productRowId != null ? productRowId : '$result[getDeal][ID]'
                                  }
                              },
                              getLead: {
                                  method: 'crm.lead.get',
                                  params: {
                                      ID:  leadId
                                  }
                              },
                              getUser: {
                                  method: 'user.get',
                                  params: {
                                      ID:  userId
                                  }
                              }
                          }, function (result) {

                              var companyData = {}, contactData = {}, dealData = {}, dealProductRow = {}, leadData = {}, userData = {};
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
                              if (!result.getUser.error()) {
                                  userData = result.getUser.data()[0];
                              }


                              var div = $('<div class="col-lg-12 col-md-12 list-item" id="doc_' + i + '"/>', {text: i});
                              var span = $('<span />', {text: i}); span.appendTo(div);
                              var name = '';
                              switch (data.NAME) {
                                  case 'company':
                                      name = field.TITLE;
                                      var nameSpan = $('<span />', {text: name}); nameSpan.appendTo(div);
                                      break;
                                  case 'contact':
                                      name = field.NAME + ' ' + field.LAST_NAME;
                                      var nameSpan = $('<span />', {text: name}); nameSpan.appendTo(div);
                                      break;
                                  case 'deal':
                                      name = field.TITLE;
                                      var nameSpan = $('<span />', {text: name}); nameSpan.appendTo(div);
                                      break;
                                  case 'invoice':
                                      name = field.ORDER_TOPIC;
                                      var nameSpan = $('<span />', {text: name}); nameSpan.appendTo(div);
                                      break;
                                  case 'lead':
                                      name = field.TITLE;
                                      var nameSpan = $('<span />', {text: name}); nameSpan.appendTo(div);
                                      break;
                                  default:
                                      console.log('default');
                              }

                              var print = $( '<span />', {text: 'Printēt', class: 'action'}); print.appendTo(div);



                              //$('.data-list').append('<table>' +
                              //'<tr><th>ID</th><th>Nosaukums</th><th>Darbība</th></tr>' +
                              //'<tr class="list-item">' +
                              //'<td><a target="_blank" href="' + window.location.protocol + '//' + me.domain + '/crm/invoice/show/' + val.ID + '/">' + val.ID + '</a></td>' +
                              //'<td class="name-cell"></td>' +
                              //'<td class="action" id="doc_' + i + '">Printēt</td></tr>' +
                              //'</table>');










                              div.appendTo('.data-list');
                              $('#doc_' + i + ' .action').on('click', function () {
                                  downloadPdf( text, fieldData[i], documentProperties, data.NAME, companyData, contactData, dealData, dealProductRow, leadData, userData );
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
    BX24.callMethod('entity.get',
        {},
        function (result) {
    var templateName = '';
            if(result.error())
                console.error(result.error());
            else
            {
                $.each(result.data(), function(i, val){
                    if( val.NAME == name ){

                        BX24.callMethod('entity.item.property.get', {ENTITY: val.ENTITY}, function(r){
                            entityFields = r.data();
                            entityFields.forEach(function( entity ){
                                if( entity.PROPERTY == 'templateName' ){
                                    templateName = entity.NAME;
                                }
                            });

                            var div = $('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 list-item" id="' + val.ENTITY + '"/>');
                            $('<span />', {text: templateName, class: 'entity-name' }).appendTo(div);
                            $('<span />', {text: 'Saraksts', id: 'list_' + val.ENTITY, class: 'list_entity' }).appendTo(div);
                            $('<span />', {text: 'Rediģēt', id: 'edit_' + val.ENTITY, class: 'edit_entity' }).appendTo(div);
                            div.appendTo('.data-list');

                            $('#list_' + val.ENTITY).on('click', function () {
                                getEntityProperties( val.ENTITY );
                            });
                            $('#edit_' + val.ENTITY).on('click', function () {
                                editDoc( val.ENTITY, templateName );currentSection = val.ENTITY;
                            });
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
                                }, 2000);
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
            iframeFix: true,
            start: function () {
                $("iframe").css('z-index', '-1');
            },
            stop: function () {
                $("iframe").css('z-index', '0');
            }
        }).css('z-index', 1);
    }

}

jQuery(document).ready(function(){

    var dealFields = [], currencyFields = [], companyFields = [], dealData = [], currencyData = [], companyData = [];
    var dataArray = [];

    CKEDITOR.replace( 'TextArea1' );
    editor = CKEDITOR.instances['TextArea1'];

    BX24.init(function(){

        $(document).on('click', '#save-entity', function () {
            $('#entity-name').removeClass('red');
            var id = $('input[type="radio"]:checked').attr('id');
            if( id ){
                BX24.callBatch({
                        addEntity: {
                            method: 'entity.add',
                            params: {
                                'ENTITY': $('#entity-name').val(), 'NAME': id, 'ACCESS': {U1: 'W', AU: 'R'}
                            }
                        },
                        addEntityItem: {
                            method: 'entity.item.add',
                            params: {
                                ENTITY: $('#entity-name').val(),
                                NAME: id
                            }
                        },
                        addEntityItemProperty:{
                            method: 'entity.item.property.add',
                            params: {
                                ENTITY: $('#entity-name').val(),
                                PROPERTY: 'templateName',
                                NAME: $('#entity-name').val(), TYPE: 'S'

                            }
                        }
                    },function (result) {
                        $("#entity-add-modal #close-add-entity").click();
                    $('#entity-name').removeClass('red');
                        getEntity(id);
                    });
            }else{
                $('#entity-name').tooltip()
                $('#entity-name').addClass('red');
            }
        });



        $('#api').on('change', function(){
            $('.field').remove(':not(.dropped)');
            var method = $(this).val();
            var methodString = '';
            ( method == 'user' ) ? methodString = method + '.fields' : methodString = 'crm.' + method +'.fields';
            if (method.length > 0) {
                BX24.callMethod(
                    methodString,
                    {},
                    function(result) {
                        if(!result.error()) {
                            $.each(result.data(), function(fieldName, e){
                                if( fieldName == 'COMPANY_ID' || fieldName == 'CONTACT_ID' || fieldName == 'UF_DEAL_ID' ||
                                    fieldName == 'QUOTE_ID' || fieldName == 'LEAD_ID' || fieldName == 'PRODUCT_ID' || fieldName == 'UF_DEPARTMENT' ){

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
        PROPERTY_VALUES['templateName'] = $('#document-edit-modal .modal-title').val();
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

    $('.crm-menu-item').click(function(){
        $('.crm-menu-item').removeClass('crm-menu-item-active');
        $(this).addClass('crm-menu-item-active');
    });
    $('#debug').click(function(){


    })


});