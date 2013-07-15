jQuery-TableFormInsert 1.1
======================
Small jQuery Plugin which Convert a copied Table from 'Microsoft Excel' or 'Open Office Calc' into a Table with Input Fields.

Changelog
======================
1.1
 - Add Changeable Attribute

1.0
 - First Stable Version

Example
======================
`````javascript
$('#textarea').tfi({
    select: [
        ['firstname', 'Firstname'],
        ['lastname', 'LastName'],
        ['street', 'Street'],
        ['nr', 'StreetNumber']
    ]
});
`````