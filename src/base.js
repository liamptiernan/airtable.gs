class Base extends Airtable {
  constructor(baseId, apiKey, endpointUrl) {
    super(apiKey, endpointUrl);
    this.baseId = baseId;
  }

  select(params) {
    let response = fetchAirtable(params, this);
    let records = response['records'];
  
    while (response.hasOwnProperty('offset')) {
      params.offset = response['offset'];
      response = fetchAirtable(params, this);
      records = records.concat(response['records']);
    }

    Logger.log(`Fetched ${records.length} records.`);
    return records;
  }

  find(tableName, recordId) {
    const params = {tableName: tableName, recordId: recordId};
    const response = fetchAirtable(params, this);

    response && Logger.log(`Returned record ${response['id']}`);
    return response;
  }

  create(tableName, records, optionalParams={}) {
    const params = {
      tableName: tableName, 
      records: {'records': records, typecast: optionalParams.typecast}
      };
    const response = modifyAirtable(params, this, 'create');

    Logger.log(`Created ${response['records'].length} records.`);
    return response['records'];
  }

  update(tableName, records, optionalParams={}) {
    const params = {
      tableName: tableName, 
      records: {'records': records, typecast: optionalParams.typecast}
    };
    const response = modifyAirtable(params, this, 'update');

    Logger.log(response);
    return response['records'];
  }

  replace(tableName, records, optionalParams={}) {
    const params = {
      tableName: tableName, 
      records: {'records': records, typecast: optionalParams.typecast}
    }
    const response = modifyAirtable(params, this, 'replace');

    Logger.log(response);
    return response['records'];
  }

  destroy(tableName, records) {
    const params = {tableName: tableName, destroy: records};
    const response = destroyAirtable(params, this);

    Logger.log(response);
    return response['records'];
  }
}
