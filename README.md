jQuery-TableFormInsert 1.2
======================
Small jQuery Plugin which Convert a copied Table from 'Microsoft Excel' or 'Open Office Calc' into a Table with Input Fields.

Changelog
======================
1.2
 - add requiredFields

1.1.2
 - fix set inactive fields when preselect false

1.1.1
 - fix old remove table when table is reconverted
 - fix ignore empty lines

1.1
 - add Changeable Attribute

1.0
 - first stable Version

Example
======================
`````javascript
$('#button').click(function() {
    $('#textarea').tfi({
        select: [
            ['firstname', 'Firstname'],
            ['lastname', 'LastName'],
            ['street', 'Street'],
            ['nr', 'StreetNumber']
        ]
    });
});
`````
