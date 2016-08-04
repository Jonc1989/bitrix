var entityFields = [];
var currentSection = null, currentCRMSection;
var editor;
var back = null;
var entityFields = [];
var editorOpen = false;

function initDocument( fields, templateName ){

    initDroppable( $('#cke_TextArea1') );
    $('.dropped').remove();
    $("#document-edit-modal .modal-title").empty();
    $("#document-edit-modal .modal-title").text(templateName);

    var text = '';
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
            text = properties;
            CKEDITOR.config.extraPlugins = 'autogrow';
            CKEDITOR.config.autoGrow_minHeight = 300;
            CKEDITOR.config.autoGrow_maxHeight = 1000;

        }
    }
    });
    if( text == '' ){
        editor.setData('');
    }
    resizeMe();
    filterCRM( fields[0].NAME );
    $('#api option[value=' + currentCRMSection +']').attr('selected','selected');

    $('.field').remove(':not(.dropped)');
    var method = currentCRMSection, params = {};
    var methodString = 'crm.' + method +'.fields';

    getField( methodString, params, method );
    editorOpen = true;
}
function initDroppable($elements) {
    $elements.droppable({
        hoverClass: "textarea",
        iframeFix: true,
        iframeScroll: true,
        drop: function(event, ui) {
            var tempid = ui.draggable.data().field;
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
    }, function (result) {
        if (!result.getEntityItem.error()) {
                $('.data-grid').hide();
                $('.list-item').remove();


                $('.template-wrap').removeClass('hidden');
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
        },
        getStatuses: {
            method: 'crm.status.list',
            params: {
                order: {"SORT": "ASC"}
            }
        }
    }, function (result) {

        var statuses = [];
        if (!result.getStatuses.error() ) {
            statuses = result.getStatuses.data();
        }
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
                          SELECT: [ "ID" ]
                      }
                  }
              },function (result) {
                  if (!result.getFields.error()) {
                      $('.list-item').remove();
                      var fieldData = result.getFields.data();

                      $.each(fieldData, function (i, field) {


                          BX24.callMethod(
                              "crm." + data.NAME + ".get",
                              { id: field.ID },
                              function(result) {
                                  if (!result.error()) {

                                      var crmData = result.data();

                                  var companyId, contactId, dealId, invoiceId, currencyId, productRowId, leadId, quoteId, userId;

                                  switch (data.NAME) {
                                      case 'company':
                                          leadId = crmData.LEAD_ID != undefined ? crmData.LEAD_ID : null;
                                          userId = crmData.CREATED_BY_ID;
                                          break;
                                      case 'contact':
                                          companyId = crmData.COMPANY_ID != undefined ? crmData.COMPANY_ID : null;
                                          leadId = crmData.LEAD_ID != undefined ? crmData.LEAD_ID : null;
                                          userId = crmData.CREATED_BY_ID;
                                          break;
                                      case 'deal':
                                          companyId = crmData.COMPANY_ID != undefined ? crmData.COMPANY_ID : null;
                                          contactId = crmData.CONTACT_ID != undefined ? crmData.CONTACT_ID : null;
                                          quoteId = crmData.QUOTE_ID != undefined ? crmData.QUOTE_ID : null;
                                          leadId = crmData.LEAD_ID != undefined ? crmData.LEAD_ID : null;
                                          productRowId = crmData.ID != undefined ? crmData.ID : null;
                                          userId = crmData.CREATED_BY_ID;
                                          break;
                                      case 'invoice':
                                          companyId = crmData.UF_COMPANY_ID != undefined ? crmData.UF_COMPANY_ID : null;
                                          contactId = crmData.UF_CONTACT_ID != undefined ? crmData.UF_CONTACT_ID : null;
                                          dealId = crmData.UF_DEAL_ID != undefined ? crmData.UF_DEAL_ID : null;
                                          userId = crmData.RESPONSIBLE_ID;
                                          break;
                                      case 'currency':

                                          break;
                                      case 'lead':
                                          companyId = crmData.COMPANY_ID != undefined ? crmData.COMPANY_ID : null;
                                          contactId = crmData.CONTACT_ID != undefined ? crmData.CONTACT_ID : null;
                                          productRowId = crmData.ID != undefined ? crmData.ID : null;
                                          userId = crmData.CREATED_BY_ID;
                                          break;
                                      case 'quote':
                                          companyId = crmData.COMPANY_ID != undefined ? crmData.COMPANY_ID : null;
                                          contactId = crmData.CONTACT_ID != undefined ? crmData.CONTACT_ID : null;
                                          dealId = crmData.DEAL_ID != undefined ? crmData.DEAL_ID : null;
                                          leadId = crmData.LEAD_ID != undefined ? crmData.LEAD_ID : null;
                                          userId = crmData.CREATED_BY_ID;

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
                                          method: 'crm.' + data.NAME + '.productrows.get',
                                          params: {
                                              ID: productRowId //!= null ? productRowId : '$result[getDeal][ID]'
                                          }
                                      },
                                      getLead: {
                                          method: 'crm.lead.get',
                                          params: {
                                              ID: leadId
                                          }
                                      },
                                      getUser: {
                                          method: 'user.get',
                                          params: {
                                              ID: userId
                                          }
                                      },
                                      getQuote: {
                                          method: 'crm.quote.get',
                                          params: {
                                              ID: quoteId
                                          }
                                      },
                                      getMyCompany: {
                                          method: 'entity.item.get',
                                          params: {
                                              ENTITY: 'MyCompany'
                                          }
                                      }
                                  }, function (result) {

                                      var companyData = {}, contactData = {}, dealData = {}, dealProductRow = {}, leadData = {}, userData = {}, quoteData = {}, myCompanyData = {};
                                      if (!result.getCompany.error()) {
                                          companyData = result.getCompany.data();
                                          if(result.getCompany.more()){
                                              result.getCompany.next();
                                          }
                                      }
                                      if (!result.getContact.error()) {
                                          contactData = result.getContact.data();
                                          if(result.getContact.more()){
                                              result.getContact.next();
                                          }
                                      }
                                      if (!result.getDeal.error()) {
                                          dealData = result.getDeal.data();
                                          if(result.getDeal.more()){
                                              result.getDeal.next();
                                          }
                                      }
                                      if (!result.get_deal_productRow.error()) {
                                          dealProductRow = result.get_deal_productRow.data();
                                          if(result.get_deal_productRow.more()){
                                              result.get_deal_productRow.next();
                                          }
                                      }
                                      if (!result.getLead.error()) {
                                          leadData = result.getLead.data();
                                          if(result.getLead.more()){
                                              result.getLead.next();
                                          }
                                      }
                                      if (!result.getUser.error()) {
                                          userData = result.getUser.data()[0];
                                          if(result.getUser.more()){
                                              result.getUser.next();
                                          }
                                      }
                                      if (!result.getQuote.error()) {
                                          quoteData = result.getQuote.data();
                                          if(result.getQuote.more()){
                                              result.getQuote.next();
                                          }
                                      }
                                      if (!result.getMyCompany.error()) {
                                          myCompanyData = result.getMyCompany.data();
                                      }

                                      statuses.forEach(function( status){
                                          $.each(crmData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                crmData[key] = statusFilter( data.NAME, status, key, value );
                                              }
                                          });

                                          $.each(companyData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                  companyData[key] = statusFilter( 'company', status, key, value );
                                              }
                                          });

                                          $.each(contactData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                  contactData[key] = statusFilter( 'contact', status, key, value );
                                              }
                                          });

                                          $.each(dealData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                  dealData[key] = statusFilter( 'deal', status, key, value );
                                              }
                                          });

                                          $.each(leadData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                  leadData[key] = statusFilter( 'lead', status, key, value );
                                              }
                                          });

                                          $.each(quoteData, function( key, value ){
                                              if( status.STATUS_ID == value ){
                                                  quoteData[key] = statusFilter( 'quote', status, key, value );
                                              }
                                          });
                                      });
                                      
                                      $('.id-cell').text('ID');
                                      $('.data-grid').append(
                                      '<tr class="list-item">' +
                                      '<td><a target="_blank" href="' + window.location.protocol + '//' + me.domain + '/crm/' + data.NAME + '/show/' + crmData.ID + '/">' + crmData.ID + '</a></td>' +
                                      '<td class="name-cell_' + crmData.ID + '"></td>' +
                                      '<td class="print" id="doc_' + crmData.ID + '">Printēt</td></tr>'
                                      );


                                      var name = '';
                                      switch (data.NAME) {
                                          case 'company':
                                              name = crmData.TITLE;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          case 'contact':
                                              name = crmData.NAME + ' ' + crmData.LAST_NAME;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          case 'deal':
                                              name = crmData.TITLE;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          case 'invoice':
                                              name = crmData.ORDER_TOPIC;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          case 'lead':
                                              name = crmData.TITLE;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          case 'quote':
                                              name = crmData.TITLE;
                                              var nameSpan = $('<span />', {text: name});
                                              nameSpan.appendTo('.name-cell_' + crmData.ID);
                                              break;
                                          default:
                                              console.log('default');
                                      }


                                      $('#doc_' + crmData.ID ).on('click', function () {
                                          downloadPdf(text, crmData, documentProperties, data.NAME, companyData,
                                              contactData, dealData, dealProductRow, leadData, userData, quoteData,
                                              myCompanyData );
                                      });


                                  });


                                }
                              });

                      });
                      if(result.getFields.more()){
                          result.getFields.next();
                      }
                  }
              });
            }

        }

    });
}

function getEntity( name ){
    back = null;
    $('.template-wrap').addClass('hidden');
    $('.data-grid').show();
    $('.list-item').remove();

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

                        BX24.callMethod('entity.item.get', {ENTITY: val.ENTITY}, function(r){
                            var data = r.data();
                            if( data.length > 0 ){
                                if( data[0].PROPERTY_VALUES !== undefined ){


                                    entityFields = data[0].PROPERTY_VALUES;
                                    $.each(entityFields, function( index, value ){
                                        if( index == 'templateName' ){
                                            templateName = data[0].ENTITY;
                                        }
                                    });

                                    $('.id-cell').empty();
                                    $('.data-grid').append(
                                    '<tr class="list-item" id="template-' + data[0].ID + '">' +
                                    '<td></td>' +
                                    '<td class="name-cell">' + templateName + '</td>' +
                                    '<td>' +
                                    '<span class="edit_entity" id="edit_' + val.ENTITY + '">Rediģēt</span>' +
                                    '<span class="list_entity" id="list_' + val.ENTITY + '">Saraksts</span>' +
                                    '<span class="delete_entity" id="delete_' + val.ENTITY + '">Dzēst</span>' +
                                    '</td>' +
                                    '</tr>'
                                    );

                                    $('#list_' + val.ENTITY).on('click', function () {
                                        getEntityProperties( val.ENTITY );
                                        back = 'getEntity("' + name + '")';
                                    });
                                    $('#edit_' + val.ENTITY).on('click', function () {
                                        editDoc( val.ENTITY, templateName );currentSection = val.ENTITY; currentCRMSection = val.NAME;
                                        back = 'getEntity("' + name + '")';
                                    });
                                    $('#delete_' + val.ENTITY).on('click', function () {
                                        deleteEntity( val.ENTITY, data[0].ID );                $('#template-' + data[0].ID ).fadeOut();
                                        back = 'getEntity("' + name + '")';
                                    });
                                }
                            }
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

                                                 $('.data-grid').show();
                                                    getEntity( entity.NAME );


                                                $('.template-wrap').addClass('hidden');
                                            }
                                        }
                                    };
                                }, 2000);
                            }

                        });

    }
});
}
function getField( methodString, params, method ){
    BX24.callMethod(
        methodString,
        params,
        function(result) {
            if(!result.error()) {
                $.each(result.data(), function(fieldName, e){


                    if( method == 'MyCompany'){
                        filterField( currentCRMSection, e.PROPERTY, method );
                    }else{
                        if( fieldName == 'COMPANY_ID' || fieldName == 'CONTACT_ID' || fieldName == 'UF_DEAL_ID' || fieldName == 'OWNER_TYPE' ||
                            fieldName == 'QUOTE_ID' || fieldName == 'LEAD_ID' || fieldName == 'PRODUCT_ID' || fieldName == 'UF_DEPARTMENT' || fieldName == 'PR_LOCATION' ||
                            fieldName == 'INVOICE_PROPERTIES' || fieldName == 'PRODUCT_ROWS' || fieldName == 'ASSIGNED_BY_ID' || fieldName == 'MODIFY_BY_ID' || fieldName == 'IM' ){

                        }else{
                            filterField( currentCRMSection, fieldName, method )
                        }
                    }
                });

                if( currentCRMSection == 'invoice' && method == 'productrow' || currentCRMSection == 'deal' && method == 'productrow' || currentCRMSection == 'lead' && method == 'productrow' ){
                    filterField( currentCRMSection, 'SUM', method );
                    filterField( currentCRMSection, 'DISCOUNT_PRICE_ALL', method );
                    filterField( currentCRMSection, 'PRICE_EXCLUSIVE_ALL', method );
                    filterField( currentCRMSection, 'TAX_SUM', method );
                    filterField( currentCRMSection, 'SUM_ALL', method );
                }
                switch (method) {
                    case 'deal':
                        filterField( currentCRMSection, 'OPPORTUNITY', 'byWords' );
                        break;
                    case 'invoice':
                        filterField( currentCRMSection, 'PRICE', 'byWords' );
                        break;
                    case 'lead':
                        filterField( currentCRMSection, 'OPPORTUNITY', 'byWords' );
                        break;
                    case 'quote':
                        filterField( currentCRMSection, 'OPPORTUNITY', 'byWords' );
                        break;
                    default:
                        console.log('default');
                }

            }
            resizeMe();
        }
    );
}
function createField( fieldName, method ){

    $('<div />', {class:"field col-md-2 col-sm-3 col-xs-4 " + method, text: translate( method, fieldName) }).data({method: method, field: fieldName }).appendTo('#field-wrap');

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

function goBack() {
    if( back != null ){
        eval( back );
    }
}

function companyData(){
    return BX24.callMethod('entity.item.get',
        {ENTITY: 'MyCompany'},
        function(result)
        {
            if(result.error()){
                console.error(result.error());
            }
            else{
                initFormData( result.data() );
            }
        });
}
function initFormData( data ){
    $('#company_name').val( data[0].NAME );
    $('#company_address').val( data[0].PROPERTY_VALUES.JUR_ADDRESS );
    $('#company_fiz_address').val( data[0].PROPERTY_VALUES.FIZ_ADDRESS );
    $('#reg_nr').val( data[0].PROPERTY_VALUES.REG_NR );
    $('#pvn_nr').val( data[0].PROPERTY_VALUES.PVN_NR );
    $('#bank_properties').val( data[0].PROPERTY_VALUES.BANK_DETAILS );
    $('#bank_account').val( data[0].PROPERTY_VALUES.BANK_ACCOUNT_NR );
    $('#swift').val( data[0].PROPERTY_VALUES.SWIFT );
//    $('#company-edit-form').validator();
    $('#save-company').on('click', function (e) {
        e.preventDefault();
        saveFormData( data[0].ID );

    })
}

function saveFormData( id ){
    BX24.callMethod('entity.item.update', {
            ENTITY: 'MyCompany',
            NAME: $('#company_name').val(),
            ID: id,
            PROPERTY_VALUES: {
                JUR_ADDRESS: $('#company_address').val(),
                FIZ_ADDRESS: $('#company_fiz_address').val(),
                REG_NR: $('#reg_nr').val(),
                PVN_NR: $('#pvn_nr').val(),
                BANK_DETAILS: $('#bank_properties').val(),
                BANK_ACCOUNT_NR: $('#bank_account').val(),
                SWIFT: $('#swift').val()
            }
        },
        function(result)
        {
            if(result.error())
                console.error(result.error(), 'Kluda');
            else{
                $('#companyModal').modal('hide');
            }


        }
    );
}
jQuery(document).ready(function(){
    BX24.install(function(){
        install();
    });
    $( window ).resize(function() {
        resizeMe();
    });
    $('.data-grid').hide();

    CKEDITOR.replace( 'TextArea1' );
    editor = CKEDITOR.instances['TextArea1'];
    CKEDITOR.config.height = 500;
    


    BX24.init(function(){

        $(document).on('click', '#save-entity', function (e) {

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
                        $('#entity-name').val('');

                        if( editorOpen || currentCRMSection != id ){

                        }else{
                            getEntity(id);
                        }
                    });
            }else{
                $('#crm-entity').tooltip()
            }
        });



        $('#api').on('change', function(){
            $('.field').remove(':not(.dropped)');
            var method = $(this).val(), params = {};
            var methodString = '';
            if( method == 'user' ){
                methodString = method + '.fields';
            }else if( method == 'MyCompany'){
                methodString = 'entity.item.property.get';
                params = {ENTITY: 'MyCompany'};
            }else{
                methodString = 'crm.' + method +'.fields';
            }
            if (method.length > 0) {
                getField( methodString, params, method )
            }

        });
    });

    $(document).on('click', '#save-doc', function () {

        var PROPERTY_VALUES = {};

        for(var instanceName in CKEDITOR.instances){
            CKEDITOR.instances[instanceName].updateElement();
        }

        PROPERTY_VALUES['text'] = CKEDITOR.instances['TextArea1'].getData();
        PROPERTY_VALUES['templateName'] = $('#document').val();
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
        editorOpen = false;
    });

    $('.crm-menu-item').not('#back').not('.crm-menu-new').click(function(){
        $('.crm-menu-item').removeClass('crm-menu-item-active');
        $(this).addClass('crm-menu-item-active');
    });

    $('#setting-tabs a').click(function (e) {
        setTimeout(resizeMe, 500);
    });

    $('#close-edit-modal').click(function () {
        editorOpen = false;
        getEntity( currentCRMSection );
    });

    $('#back').click(function(){
        if( editorOpen == true ){ areYouSurePrompt() }
        goBack();
    });

    $('#companyModal').on('shown.bs.modal', function (e) {
        companyData();
    });

    $('#entity-add-modal').on('shown.bs.modal', function () {
        $('#entity-name').focus()
    });

    function areYouSurePrompt() {
        if ( editorOpen ) {
            return 'You have unsaved changes. Are you sure you want to leave this page?';
        }
    }
    //$(window).on('beforeunload', areYouSurePrompt);

});