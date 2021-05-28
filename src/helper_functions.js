function fetchAirtable(params, credentials) {
  const options = {
    'method':'GET',
    'headers' : {
      'Authorization':'Bearer ' + credentials.apiKey
    },
    'muteHttpExceptions': true
  };
  
  const url = buildUrl(params, credentials);
  const response = pingUrl(url, options);
  
  if (response && response.getResponseCode() < 400) {
    return JSON.parse(response);
  } else {
    throw `Airtable Fetch Error. Response: ${response}`;
  }
}

function modifyAirtable(params, credentials, task) {
  let method;
  switch (task) {
    case 'create':
      method = 'POST'
      break;
    case 'update':
      method = 'PATCH'
      break;
    case 'replace':
      method = 'PUT'
      break;
    case 'destroy':
      method = 'DELETE'
      break;
  }
  const options = {
    'method': method,
    'headers' : {
      'Authorization':'Bearer ' + credentials.apiKey,
      'Content-Type': 'application/json'
    },
    'muteHttpExceptions': true,
    'payload': JSON.stringify(params.records)
  };

  const url = credentials.endpointUrl + '/v0/' + credentials.baseId + '/' + params.tableName;
  const response = pingUrl(url, options);

  if (response && response.getResponseCode() < 400) {
    return JSON.parse(response);
  } else {
    throw `Airtable Fetch Error. Response: ${response}`;
  }
}

function destroyAirtable(params, credentials) {
  const options = {
    'method':'DELETE',
    'headers' : {
      'Authorization':'Bearer ' + credentials.apiKey
    },
    'muteHttpExceptions': true
  };
  
  const url = buildUrl(params, credentials);
  const response = pingUrl(url, options);
  
  if (response && response.getResponseCode() < 400) {
    return JSON.parse(response);
  } else {
    throw `Airtable Fetch Error. Response: ${response}`;
  }
}
