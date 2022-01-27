function pingUrl(url, options, maxRetries = 4) {
  let retries = 0;
  let response;

  while (retries <= maxRetries) {
    response = UrlFetchApp.fetch(url, options);
    let code = response.getResponseCode();

    if (code < 500 || retries === maxRetries) {
      break;
    } else {
      Logger.log(`Retrying ${url} because of possible transient error: HTTP Code ${code}`);
      Utilities.sleep(1500**(1+(retries/10)));
      retries++;
    }
  }
  return response;
}

function buildUrl(params, credentials) {
  
  let url = credentials.endpointUrl + '/v0/' + credentials.baseId + '/' + encodeURIComponent(params.tableName);

  if (params.recordId) {
    return url + '/' + params.recordId;
  } else {
    url = url + '?';
  }

  if (params.destroy) {
    params.destroy.forEach(record => url = url + 'records[]=' + record + '&');
    url = url.endsWith('&') ? url.slice(0, url.length-1) : url;
    return url;
  }

  if (params.fields) { params.fields.forEach((field) => url = url + 'fields%5B%5D=' + encodeURIComponent(field) + '&'); }

  if (params.filterByFormula) { url = url + 'filterByFormula=' + encodeURIComponent(params.filterByFormula) + '&'; }

  if (params.maxRecords) { url = url + 'maxRecords=' + params.maxRecords + '&'; }

  if (params.pageSize) { url = url + 'pageSize=' + params.pageSize + '&'; }

  if (params.sort) {
    params.sort.forEach(sort => {
      const field = `sort%5B0%5D%5Bfield%5D=${encodeURIComponent(sort.field)}`;
      let direction = 'sort%5B0%5D%5Bdirection%5D=';

      switch (sort.direction) {
      case 'asc' || 'ascending' || undefined:
        direction = direction.concat('asc');
        break;
      case 'desc' || 'descending':
        direction = direction.concat('desc');
        break;
      default:
        direction = direction.concat('asc');
      }

      url = url.concat(field, '&', direction);
    });
    url = url + '&';
  }

  if (params.view) { url = url + 'view=' + encodeURIComponent(params.view) + '&'; }

  if (params.offset) { url = url + 'offset=' + params.offset; }

  url = url.endsWith('&') ? url.slice(0, url.length-1) : url;

  return url;
}
