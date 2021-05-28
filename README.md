# airtable.gs
Airtable Library for Google Apps Script

This is a pared down version of the official [airtable.js](https://github.com/Airtable/airtable.js) library, built for use in Google Apps Script.

It follows many of the semantics found in the official Airtable API documentation, with some modifications.

## Usage

Create a new Airtable object and pass in your API Key as the first parameter: `new Airtable(YOUR_API_KEY)`
Optionally, you can specify a specific URL endpoint as the second paramenter. The default is `https://api.airtable.com`

Call `Airtable.base(YOUR_BASE_ID)` to create a new `Base` object.


To create an airtable and base object:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);
```

`Base` has multiple methods to add, delete, modify, and fetch records. They are as follows:

- [`.select()`](https://github.com/liamptiernan/airtable.gs#select)
- [`.find()`](https://github.com/liamptiernan/airtable.gs#find)
- [`.create()`](https://github.com/liamptiernan/airtable.gs#create)
- [`.update()`](https://github.com/liamptiernan/airtable.gs#update)
- [`.replace()`](https://github.com/liamptiernan/airtable.gs#replace---destructive)
- [`.destroy()`](https://github.com/liamptiernan/airtable.gs#destroy---destructive)

### Record Object Structure

```
{
    'createdTime': '2021-05-28T15:22:35.000Z',
    id: 'recCTk6jG5uJUwJFt',
    'fields': {
        'Field 1': 'Value 1'
        'Field 2': 'Value 2'
    }
}
```

### Select
`.select(params)`

Select returns an array of record objects that match the query. It takes one required argument; an object `params`.

`Params` Keys:
- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `fields` *(Array of Strings, Optional)*
  - Array of the names of fields to return. Only fields listed will be included in result.
- `filterByFormula` *(String, Optional)*
  - An airtable formula used to filter records. The formula will be evaluated for each record, and if the result is not 0, false, "", NaN, [], or #Error! the record will be included in the response.
- `maxRecords` *(Integer, Optional)*
  - The maximum total number of records that will be returned in your requests.
- `pageSize` *(Integer, Optional)*
  - The number of records returned in each request. Must be less than or equal to 100. Default is 100.
- `sort` *(Array of Objects, Optional)*
  - A list of sort objects that specifies how the records will be ordered. Each sort object must have a field key specifying the name of the field to sort on, and an optional direction key that is either "asc" or "desc". The default direction is "asc".
  
  - The sort parameter overrides the sorting of the view specified in the view parameter. If neither the sort nor the view parameter is included, the order of records is arbitrary.
- `view` *(String, Optional)*
  - The name or ID of a view in the DASH table. If set, only the records in that view will be returned. The records will be sorted according to the order of the view unless the sort parameter is included, which overrides that order. Fields hidden in this view will be returned in the results.

#### Example `.select()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);
const params = {
    tableName: 'Your Table',
    fields: ['Field 1','Field 2'],
    filterByFormula: 'NOT({Field 1} = '')',
    maxRecords: 500,
    pageSize: 80,
    sort: [{
        'field': 'Field 1',
        'direction': 'desc'
        },
        {'field': 'Field 2'}
    ],
    view: 'My View'
}

const records = base.select(params)
```
#### Response
Array of objects, where each object is a record that matches the above parameters.

### Find
`.find(tableName, recordId)`

Find returns the record object with the provided Record ID. It takes two required arguments; a string `tableName`, and a string `recordId`.

- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `recordId` *(String, **Required**)*
  - Record ID of the record to be returned.

#### Example `.find()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);

const record = base.find('Your Table', 'rec123456789abc');
```
#### Response
An object containing the record data.

### Create
`.create(tableName, records)`

Create creates the record object(s) with the provided field values and returns an array of the created record objects. It takes two required arguments; a string `tableName`, and an array of objects, `records`.

- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `records` *(Array of Objects, **Required**)*
  - Array of up to 10 record objects. Each of these objects should have one key, `fields`, which contains all of your record's cell values by field name. You can include all, some, or none of the field values.

#### Example `.create()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);

const createData = [
    {
        'fields': {
            'Field 1': 'Value 1',
            'Field 2': 'Value 2'
        }
    },
    {
        'fields': {
            'Field 1': 'Value 3',
            'Field 2': 'Value 4'
        }
    }
]

const createdRecords = base.create('Your Table', createData);
```
#### Response
An array of record objects of the newly created records.

### Update
`.update(tableName, records)`

Update modifies existing records with the provided field values and returns an array of the modified record objects. It takes two required arguments; a string `tableName`, and an array of objects, `records`.

Only the fields specified will be modified, with the rest left as is.

- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `records` *(Array of Objects, **Required**)*
  - Array of up to 10 record objects. Each of these objects should have an id property representing the record ID and a fields property which contains all of your record's cell values by field name. You can include all, some, or none of the field values.

#### Example `.update()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);

const updateData = [
    {
        'id': 'rec12345abc',
        'fields': {
            'Field 1': 'Value 1',
            'Field 2': 'Value 2'
        }
    },
    {
        'id': 'recabcde123',
        'fields': {
            'Field 1': 'Value 3',
            'Field 2': 'Value 4'
        }
    }
]

const updatedRecords = base.update('Your Table', updateData);
```
#### Response
An array of record objects of the updated records.

### Replace - (Destructive)
`.replace(tableName, records)`

Replace overwrites existing records with the provided field values and returns an array of the modified record objects. It takes two required arguments; a string `tableName`, and an array of objects, `records`.

A replace will perform a destructive update and clear all unspecified cell values.

- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `records` *(Array of Objects, **Required**)*
  - Array of up to 10 record objects. Each of these objects should have an id property representing the record ID and a fields property which contains all of your record's cell values by field name. You can include all, some, or none of the field values. All fields will be modified, even if unspecified.

  #### Example `.replace()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);

const replaceData = [
    {
        'id': 'rec12345abc',
        'fields': {
            'Field 1': 'Value 1',
            'Field 2': 'Value 2'
        }
    },
    {
        'id': 'recabcde123',
        'fields': {
            'Field 1': 'Value 3',
            'Field 2': 'Value 4'
        }
    }
]

const replacedRecords = base.replace('Your Table', replaceData);
```
#### Response
An array of record objects of the replaced records.

### Destroy - (Destructive)
`.destroy(tableName, records)`

Destroy deletes records with the specified record IDs and returns an array of objects, each with a 'recordId' and 'deleted' key. It takes two required arguments; a string `tableName`, and an array of strings, `records`.

Destroy will perform a destructive change and delete the record entirely from the table.

- `tableName` *(String, **Required**)*
  - Name of table in base to query.
- `records` *(Array of Strings, **Required**)*
  - Array of up to 10 record IDs to delete.

  #### Example `.replace()` call:
```javascript
const airtable = new Airtable(YOUR_API_KEY);
const base = airtable.base(YOUR_BASE_ID);

const deleteRecords = ['rec12345abc', 'recabcde123']

const deleted = base.destroy('Your Table', deleteRecords);
```
#### Response
An array of objects specifying the deleted record IDs and the deleted state.

**Example Response**
```
[
    {
        id=rec12345abc, 
        deleted=true
    },
    {
        id=recabcde123, 
        deleted=true
    }
]
```
