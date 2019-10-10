'use strict';

const main = require('../main/main');

describe('pos', () => {

  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<store earning no money>Receipt ***\n`+
`Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)\n`+
`Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)\n`+
`Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)\n`+
`----------------------\n`+
`Total：58.50(yuan)\n`+
`Discounted prices：7.50(yuan)\n`+
`**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

  /* --------------- */

  it('Should return item[obj] when decodeTags() feed with tags Array String', () => {

    const tags = ['ITEM000005-2', 'ITEM000005', 'ITEM000003-2.5'];

    expect(require.decodeTags(tags))
    .toMatchObject([
      {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3},
      {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}
    ]);
  });

  /* --------------- */

  it('Should return decodedBarcodes[obj] when decodeBarcodes() feed with tags Array String', () => {

    const tags = [['ITEM000005-2', 'ITEM000005', 'ITEM000003-2.5']];

    expect(require.decodeBarcodes(tags))
    .toMatchObject([
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 2.5}
    ]);
  });

  /* --------------- */
  
  it('Should return items[obj] when combineItems() feed with decodedBarcodes Array Object', () => {

    const decodedBarcodes = [
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 2.5}];

    expect(require.combineItems(decodedBarcodes))
    .toMatchObject([
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3 },
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2.5}
    ]);
  });

  /* --------------- */

  it('Should return items[obj] when loadItems() feed with decodedBarcodes with out count', () => {

    const decodedBarcodes = [
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 2.5}];

    expect(require.loadItems(decodedBarcodes))
    .toMatchObject([
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag'},
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound'}
    ]);
  });

/* --------------------------------------------------------------------------------------------------------------------*/

  it('Should return receipt[obj] when calculateReceipt() feed with items object', () => {

    const items = [
      {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
      {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];
    
    expect(require.calculateReceipt(items))
    .toMatchObject({     
      receiptItems: [{barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
                     {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}],
      total: 34.50,
      saving: 4.50
    });
  });

/* --------------- */
receiptItems
  it('Should return receipt[obj] when calculateReceipt() feed with items object', () => {

    const items = [
      {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
      {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];
    
    expect(require.calculateReceiptItems(items))
    .toMatchObject({     
      receiptItems: [{barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
                     {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}],
      total: 34.50,
      saving: 4.50
    });
  });

/* --------------- */
receiptItems
it('Should return when calculateReceiptItems() feed with items object', () => {

  const items = [
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];
  
  expect(require.calculateReceiptItems(items))
  .toMatchObject({     
    receiptItems: [{barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
                   {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}],
    total: 34.50,
    saving: 4.50
  });
});


});
