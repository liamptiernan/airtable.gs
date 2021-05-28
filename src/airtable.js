class Airtable {
  constructor(apiKey, endpointUrl='https://api.airtable.com') {
    this.apiKey = apiKey;
    this.endpointUrl = endpointUrl;
  }

  configure(params) {
    this.apiKey = params.apiKey ? params.apiKey : this.apiKey;
    this.endpointUrl = params.endpointUrl ? params.endpointUrl : this.endpointUrl;
  }

  base(baseId) {
    return new Base(baseId, this.apiKey, this.endpointUrl);
  }
}
