'use strict';

// const main = require('../main/main');

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

    expect(printReceipt(tags)).toBe(expectText);
  });

//   /* --------------- */

  it('Should return item[obj] when decodeTags() feed with tags Array String', () => {

    const tags = ['ITEM000005-2', 'ITEM000005', 'ITEM000003-2.5'];

    expect(decodeTags(tags))
    .toEqual([
      {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2.5},
      {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3}
    ]);
  });

  /* --------------- */

  it('Should return decodedBarcodes[obj] when decodeBarcodes() feed with tags Array String', () => {

    const tags = ['ITEM000005-2', 'ITEM000005', 'ITEM000003-2.5', 'ITEM000003-2.7', 'ITEM000003'];

    expect(decodeBarcodes(tags))
    .toEqual([
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 6.2}
    ]);
  });

//   /* --------------- */
  
  it('Should return items[obj] when combineItems() feed with decodedBarcodes Array Object', () => {

    const decodedBarcodes = [
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 2.5}];

    expect(combineItems(decodedBarcodes))
    .toEqual([
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2.5},
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3 }
    ]);
  });

//   /* --------------- */

  it('Should return items[obj] when loadItems() feed with decodedBarcodes with count', () => {

    const decodedBarcodes = [
    {barcode:'ITEM000005', count: 3},
    {barcode: 'ITEM000003' , count: 2.5}];

    expect(loadItems(decodedBarcodes))
    .toEqual([
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound'},
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag'}
    ]);
  });

// /* --------------------------------------------------------------------------------------------------------------------*/

  it('Should return receipt[obj] when calculateReceipt() feed with items object', () => {

    const items = [
      {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2},
      {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];

    expect(calculateReceipt(items))
    .toEqual({     
      receiptItems: [{barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 2, subtotal: 4.50},
                     {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2, subtotal: 30}],
      total : 34.50.toFixed(2),
      savings : 4.50.toFixed(2)
    });
  });

/* --------------- */

  it('Should return total when calculateReceiptTotal() feed with receiptItems object', () => {

    const receiptItems = [{"barcode": "ITEM000001", "count": 5, "name": "Sprite", "price": 3, "subtotal": 12, "unit": "bottle"}, 
    {"barcode": "ITEM000003", "count": 2.5, "name": "Litchi", "price": 15, "subtotal": 37.5, "unit": "pound"}, 
    {"barcode": "ITEM000005", "count": 3, "name": "Instant Noodles", "price": 4.5, "subtotal": 9, "unit": "bag"}];
    
    expect(calculateReceiptTotal(receiptItems))
    .toBe(58.50);
  });

 /* --------------- */

it('Should return savings when calculateReceiptTotal() feed with receiptItems object', () => {

  const receiptItems = [{"barcode": "ITEM000001", "count": 5, "name": "Sprite", "price": 3, "subtotal": 12, "unit": "bottle"}, 
  {"barcode": "ITEM000003", "count": 2.5, "name": "Litchi", "price": 15, "subtotal": 37.5, "unit": "pound"}, 
  {"barcode": "ITEM000005", "count": 3, "name": "Instant Noodles", "price": 4.5, "subtotal": 9, "unit": "bag"}];
  
  expect(calculateReceiptSavings(receiptItems))
  .toBe(7.50);
});


// /* --------------- */

it('Should return promotion when loadPromotion()', () => {
  
  expect(loadPromotion())
  .toEqual([{
    type: 'BUY_TWO_GET_ONE_FREE',
    barcodes: [
      'ITEM000000',
      'ITEM000001',
      'ITEM000005'
    ]}]);

  });

  // /* --------------- */

it('Should return receiptItems when promoteReceiptItems() feed with items and promotion object', () => {

  const items = [
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3},
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];
  const promotion = [{
    type: 'BUY_TWO_GET_ONE_FREE',
    barcodes: [
      'ITEM000000',
      'ITEM000001',
      'ITEM000005'
    ]}];
  
  expect(promoteReceiptItems(items,promotion))
  .toEqual([
  {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 3, subtotal: 9},
  {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2, subtotal: 30}
  ]);
});

// /* --------------- */

it('Should return receiptItems when calculateReceiptItems() feed with items object', () => {

  const items = [
    {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 4},
    {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2}];
  
  expect(calculateReceiptItems(items))
  .toEqual([
  {barcode:'ITEM000005', name:'Instant Noodles', price: 4.50, unit: 'bag', count: 4, subtotal: 13.50},
  {barcode: 'ITEM000003' , name:'Litchi', price: 15.00, unit: 'pound', count: 2, subtotal: 30}
  ]);
});


});

