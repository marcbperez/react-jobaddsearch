/**
 * Application service.
 * @extends Component
 */
class Service {
  /**
   * Initialize the service.
   * @param {string} baseUrl - The base url of the service.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Return an url parameter.
   * @param {string} name - The name of the parameter.
   * @param {string} value - The value of the parameter.
   */
  urlParameter(name, value) {
    return '&' + name + '=' + value;
  }

  /**
   * Return a search object.
   * @param {string} query - The string to search for.
   */
  searchObject(query) {
    return {
      "operator": "or",
      "conditions": [
        {
          "column": "title",
          "operator": "like",
          "value": "%" + query.trim() + "%"
        },
        {
          "column": "description",
          "operator": "like",
          "value": "%" + query.trim() + "%"
        },
      ]
    };
  }

  /**
   * Get job entries.
   * @param {function} callback - The callback to send data to.
   * @param {App} component - The app to update during the callback.
   */
  getJobEntries(callback, page, query) {
    let url = this.baseUrl + '/job?';

    /* Adds the page parameter (if set) to the url. */
    if (page) {
      url += this.urlParameter('page', page);
    }

    /* Adds the seach parameter (if set) to the url. */
    if (query) {
      const search = this.searchObject(query);
      url += this.urlParameter('search', JSON.stringify(search));
    }

    /* Prepare fetch parameters. */
    const init = {
      method: 'GET',
      cache: 'default',
    };

    /* Fetch data and send to callback. */
    fetch(url, init)
      .then(function(response) {
        return response.json();
      }).then(function(data) {
        callback(data);
      });
  }
}

export default Service;
