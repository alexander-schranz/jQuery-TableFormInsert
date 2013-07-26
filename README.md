jQuery-TableFormInsert 1.3.1
======================
Small jQuery Plugin which Convert a copied Table from 'Microsoft Excel' or 'Open Office Calc' into a Table with Input Fields.

Changelog
======================
1.3.1
 - fix deselect row

1.3
 - fix reconvert required fields check
 - add multi form support

1.2.1
 - add infobox for required fields

1.2
 - add required fields

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
