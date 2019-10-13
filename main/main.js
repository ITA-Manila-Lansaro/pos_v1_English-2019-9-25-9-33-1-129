'use strict';

// const data = require('../test/fixtures');

function printReceipt(tags){

    let items = decodeTags(tags);
    let receipt = calculateReceipt(items);
   return formatTheReceipt(receipt);
}

function decodeTags(tags){
    let decodedBarcodes = decodeBarcodes(tags);

    let items = combineItems(decodedBarcodes);

    return items;
}

function decodeBarcodes(tags){

    let decodedBarcodes = [];

    tags.forEach(tag => {
        let res = tag.split("-");
        let isPresent = decodedBarcodes.find(a => a.barcode === res[0]);
        
        if (res[1] === undefined || res[1] === null)
        {
            if (isPresent){
                decodedBarcodes.map((a, index) => {
                    if (a.barcode === res[0]){
                        decodedBarcodes.push({barcode : res[0],
                                count: parseFloat(a.count) + 1});
                                decodedBarcodes.splice(index , 1);
                    }
                });
            }
            else {
                decodedBarcodes.push({
                    barcode:res[0],
                    count: 1
                });
            }
        }
        else{
            if (isPresent){
                decodedBarcodes.map((a, index) => {
                    if (a.barcode === res[0]){
                        decodedBarcodes.push({barcode : res[0],
                                count: parseFloat(a.count) + parseFloat(res[1])
                            });
                            decodedBarcodes.splice(index, 1);
                    }
                });
            }
            else {
                decodedBarcodes.push({
                    barcode:res[0],
                    count: parseFloat(res[1])
                });
            }
        }
    });

    return decodedBarcodes;
}

function combineItems (decodedBarcodes)
{
    let itemsWithoutCount = loadItems(decodedBarcodes);
    let combineItems = [];

    itemsWithoutCount.forEach(item => {
        let barcodeWithCount = decodedBarcodes.find(a => a.barcode === item.barcode);

        let itemWithCount = item;
        itemWithCount.count = barcodeWithCount.count;
    
        combineItems.push(itemWithCount);
    });

    return combineItems

}

function loadItems(decodedBarcodes){

    let itemsWithoutCount = [];

     loadAllItems().forEach(item => {
        if (decodedBarcodes.find(a => a.barcode === item.barcode))
        itemsWithoutCount.push(item);
    })

    return itemsWithoutCount;

}
// *************

function calculateReceipt(items){
    
    let receipt = {};
    let receiptItems = calculateReceiptItems(items);

    receipt.receiptItems = receiptItems;
    receipt.total = calculateReceiptTotal(receiptItems).toFixed(2);
    receipt.savings = calculateReceiptSavings(receiptItems).toFixed(2);

    return receipt;
}


function loadPromotion(){

    return loadPromotions();

}

function promoteReceiptItems (items, promotion){
    let receiptItems = [];
    
    items.forEach(item => {
        if (promotion.find(a => a.barcodes.includes(item.barcode)) && item.count > 1){
            let objectHolder = item;
            objectHolder.subtotal = (item.count * item.price) - item.price;
            receiptItems.push(objectHolder);
        }
        else{
            let objectHolder = item;
            objectHolder.subtotal = (item.count * item.price);
            receiptItems.push(objectHolder);
        }
    });

    return receiptItems;

}

function calculateReceiptItems(items){
    let promotions = loadPromotion();
    let receiptItems = promoteReceiptItems(items, promotions);

    return receiptItems;
}

function calculateReceiptTotal(receiptItems){
    
    let total = 0;

     receiptItems.forEach(item => {
        total += item.subtotal;
    });
    return total;
}

function calculateReceiptSavings(receiptItems){
    let savings = 0
        receiptItems.forEach(item => {
            savings +=(item.count*item.price) - item.subtotal;
        });
    return savings;
}

function formatTheReceipt(receipt){
    
    let output = '***<store earning no money>Receipt ***\n';

    receipt.receiptItems.forEach(item => {
        let unit = item.count > 1 ? 's' : '';

        output += 'Name：'+ item.name +
        '，Quantity：' + item.count + 
        ' '+ item.unit;

        output += unit +
        '，Unit：'+item.price.toFixed(2)+'(yuan)，'+
        'Subtotal：'+item.subtotal.toFixed(2)+'(yuan)\n'
    });

    output+= '----------------------\n' +
    'Total：'+receipt.total+'(yuan)\n'+
    'Discounted prices：'+receipt.savings+'(yuan)\n'+
    '**********************';

    return output;
}


module.exports = {
printReceipt : printReceipt,
decodeTags : decodeTags,
decodeBarcodes : decodeBarcodes,
combineItems : combineItems,
loadItems : loadItems,
calculateReceipt : calculateReceipt,
loadPromotion : loadPromotion,
promoteReceiptItems : promoteReceiptItems,
calculateReceiptItems : calculateReceiptItems,
calculateReceiptTotal : calculateReceiptTotal,
calculateReceiptSavings : calculateReceiptSavings,
formatTheReceipt : formatTheReceipt
};     