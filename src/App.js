import React, { Component } from 'react';
import './App.css';

/**
 * Main application.
 * @extends Component
 */
class App extends Component {
  /**
   * Initialize the application.
   * @param {object} props - The application props.
   */
  constructor(props) {
    super(props);

    this.state = {
      entries: Array(0),
      total: 0,
      totalPages: 0,
      page: 1,
      query: ''
    };

    this.updateEntries = this.updateEntries.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.searchChange = this.searchChange.bind(this);
    this.searchSubmit = this.searchSubmit.bind(this);

    this.props.service.getJobEntries(this.updateEntries, this.state.page);
  }

  /**
   * Update log entries.
   * @param {object} data - The entries to update.
   */
  updateEntries(data) {
    const items = data.items.slice();
    const totalPages = data.total % items.length > 0 ?
      parseInt(data.total / 10, 10) + 1 :
      parseInt(data.total / 10, 10);

    this.setState({
      entries: items,
      total: data.total,
      totalPages: totalPages
    });
  }

  /**
   * Go to previous page.
   * @param {event} e - The default event.
   */
  previousPage(e) {
    e.preventDefault();
    const newPage = (this.state.page <= 1) ? 1 : this.state.page - 1;

    this.setState({page: newPage}, function () {
      this.props.service.getJobEntries(this.updateEntries, this.state.page,
        this.state.query)
    });
  }

  /**
   * Go to next page.
   * @param {event} e - The default event.
   */
  nextPage(e) {
    e.preventDefault();
    const newPage = (this.state.page >= this.state.totalPages) ?
      this.state.totalPages : this.state.page + 1;

    this.setState({page: newPage}, function () {
      this.props.service.getJobEntries(this.updateEntries, this.state.page,
        this.state.query)
    });
  }

  /**
   * Updates state values from search form.
   * @param {event} e - The default event.
   */
  searchChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  /**
   * Submits the search form and updates the entries.
   * @param {event} e - The default event.
   */
  searchSubmit(e) {
    e.preventDefault();
    this.props.service.getJobEntries(this.updateEntries, 1, this.state.query);

    this.setState({
      page: 1
    });
  }

  /**
   * Render the main application.
   */
  render() {
    return (
      <div>
        <div className="app-header">
          <h2>
            Job add search
          </h2>
          <form onSubmit={this.searchSubmit}>
            <input name="query" type="text" value={this.state.query}
              onChange={this.searchChange} />
            <input type="submit" value="Search" />
          </form>
        </div>
        <div className="app-content">
          <p>
            Found {this.state.total} results<br/>
          </p>
          <div className="entries">
            {this.state.entries.map(function(entry, i) {
              return (
                <p key={i}>
                  <a href={entry.link}><strong>{entry.title}</strong></a><br/>
                  From <strong>{entry.author}</strong> via <strong>
                  {entry.provider}</strong>
                </p>
              );
            })}
          </div>
          <p>
            Page {this.state.page} of {this.state.totalPages}<br/>
            <a className="previous-page" href="#" onClick={this.previousPage}>previous</a> | <a href="#"
            onClick={this.nextPage}>next</a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
