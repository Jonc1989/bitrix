function install( deal, currency, company ){
    BX24.install(function() {
        BX24.callBatch({
            deal_add: {
                method: 'entity.add',
                params: {
                    'ENTITY': deal, 'NAME': deal, 'ACCESS': {U1: 'W', AU: 'W'}
                }
            }            ,
            deal_item_add: {
                method: 'entity.item.add',
                params: {
                    ENTITY: deal, NAME: deal
                }
            },
            currency_add: {
                method: 'entity.add',
                params: {
                    'ENTITY': currency, 'NAME': currency, 'ACCESS': {U1: 'W', AU: 'W'}
                }
            }            ,
            currency_item_add: {
                method: 'entity.item.add',
                params: {
                    ENTITY: currency, NAME: currency
                }
            },
            company_add: {
                method: 'entity.add',
                params: {
                    'ENTITY': company, 'NAME': company, 'ACCESS': {U1: 'W', AU: 'W'}
                }
            }            ,
            company_item_add: {
                method: 'entity.item.add',
                params: {
                    ENTITY: company, NAME: company
                }
            }
        }, function (result) {
            if (!result.company_item_add.error()/* && !result.entity_item_add.error() */) {
                BX24.installFinish();
            }
        });
    });
}
