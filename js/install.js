function install(){

    BX24.callBatch({
        entity_add: {
            method: 'entity.add',
            params: {
                'ENTITY': 'MyCompany', 'NAME': 'MyCompany', 'ACCESS': {U1:'W',AU:'R'}
            }
        },
        entity_item_add: {
            method: 'entity.item.add',
            params: {
                ENTITY: 'MyCompany', NAME: 'MyCompany'
            }
        },
        jur_address_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'JUR_ADDRESS',
                NAME: 'Juridic Address',
                TYPE: 'S'
            }
        },
        fiz_address_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'FIZ_ADDRESS',
                NAME: 'Declared Address',
                TYPE: 'S'
            }
        },
        reg_nr_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'REG_NR',
                NAME: 'Reg. Nr.',
                TYPE: 'S'
            }
        },
        pvn_nr_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'PVN_NR',
                NAME: 'PVN Nr.',
                TYPE: 'S'
            }
        },
        bank_details_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'BANK_DETAILS',
                NAME: 'Bank details',
                TYPE: 'S'
            }
        },
        bank_account_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'BANK_ACCOUNT_NR',
                NAME: 'Bank account number',
                TYPE: 'S'
            }
        },
        swift_add: {
            method: 'entity.item.property.add',
            params: {
                ENTITY: 'MyCompany',
                PROPERTY: 'SWIFT',
                NAME: 'swift number',
                TYPE: 'S'
            }
        },
        addDealNumber: {
            method: 'crm.deal.userfield.add',
            params: {
                fields:
                {
                    "FIELD_NAME": "DEAL_NUMBER",
                    "EDIT_FORM_LABEL": "Darījuma numurs",
                    "LIST_COLUMN_LABEL": "Darījuma numurs",
                    "USER_TYPE_ID": "string",
                    "XML_ID": "DEAL_NUMBER",
                    "SETTINGS": { "DEFAULT_VALUE": "" }
                }
            }
        },
        addCompanyRegNumber: {
            method: 'crm.company.userfield.add',
            params: {
                fields:
                {
                    "FIELD_NAME": "REG_NUMBER",
                    "EDIT_FORM_LABEL": "Reģistrācijas numurs",
                    "LIST_COLUMN_LABEL": "Reģistrācijas numurs",
                    "USER_TYPE_ID": "string",
                    "XML_ID": "REG_NUMBER",
                    "SETTINGS": { "DEFAULT_VALUE": "" }
                }
            }
        },
        addCompanyPVNNumber: {
            method: 'crm.company.userfield.add',
            params: {
                fields:
                {
                    "FIELD_NAME": "PVN_NUMBER",
                    "EDIT_FORM_LABEL": "PVN numurs",
                    "LIST_COLUMN_LABEL": "PVN numurs",
                    "USER_TYPE_ID": "string",
                    "XML_ID": "PVN_NUMBER",
                    "SETTINGS": { "DEFAULT_VALUE": "" }
                }
            }
        },
        addCompanyBankAccount: {
            method: 'crm.company.userfield.add',
            params: {
                fields:
                {
                    "FIELD_NAME": "BANK_ACCOUNT",
                    "EDIT_FORM_LABEL": "Konta numurs",
                    "LIST_COLUMN_LABEL": "Konta numurs",
                    "USER_TYPE_ID": "string",
                    "XML_ID": "BANK_ACCOUNT",
                    "SETTINGS": { "DEFAULT_VALUE": "" }
                }
            }
        },
        addCompanySwift: {
            method: 'crm.company.userfield.add',
            params: {
                fields:
                {
                    "FIELD_NAME": "SWIFT_NUMBER",
                    "EDIT_FORM_LABEL": "SWIFT kods",
                    "LIST_COLUMN_LABEL": "SWIFT kods",
                    "USER_TYPE_ID": "string",
                    "XML_ID": "SWIFT_NUMBER",
                    "SETTINGS": { "DEFAULT_VALUE": "" }
                }
            }
        },
        files_entity_add: {
            method: 'entity.add',
            params: {
                'ENTITY': 'files', 'NAME': 'files', 'ACCESS': {U1:'W',AU:'R'}
            }
        },

    }, function(result){
        // if(
        //     !result.entity_add.error() && !result.entity_item_add.error() && !result.jur_address_add.error() && !result.fiz_address_add.error()
        // && !result.reg_nr_add.error() && !result.pvn_nr_add.error() && !result.bank_details_add.error() && !result.bank_account_add.error()
        //     && !result.swift_add.error() && !result.addDealNumber.error() && !result.addCompanyRegNumber.error()
        //     && !result.addCompanyPVNNumber.error()  && !result.addCompanyBankAccount.error() && !result.addCompanySwift.error()  ){
            BX24.installFinish();
        //}
    });

}