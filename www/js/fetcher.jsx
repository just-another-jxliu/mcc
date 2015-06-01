(function() {
  var Fetcher = React.createClass({
    render: function() {
      return (
        <div>
          <RequestForm />
          <RetrieveForm />
        </div>
      )
    }
  })

  var RequestForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault()

      var url = React.findDOMNode(this.refs.urlToFetch).value
      var submitContext = this

      if (url) {
        $.get(
          "request",
          { url: url },
          function(data) {
            if (!isNaN(data)) {
              React.findDOMNode(submitContext.refs.jobId).innerText = "Job ID: " + data
            } else {
              React.findDOMNode(submitContext.refs.jobId).innerText = data
            }
          }
        )
      }
    },
    render: function() {
      return (
        <div id="requestForm">
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" ref="urlToFetch"placeholder="URL to fetch"></input>
              <button type="submit" className="btn btn-primary">Start Job</button>
            </div>

            <div className="form-control-static" ref="jobId"></div>
          </form>
        </div>
      )
    }
  })

  var RetrieveForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault()

      var jobId = React.findDOMNode(this.refs.jobId).value
      if (!isNaN(jobId)) {
        React.findDOMNode(this.refs.dataViewer).src = "retrieve?job=" + jobId
      }
    },
    render: function() {
      return (
        <div id="retrieveForm">
          <form className="form-inline" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" ref="jobId" placeholder="Job ID"></input>
              <button type="submit" className="btn btn-primary">Retrieve Data</button>
            </div>
          </form>

          <iframe ref="dataViewer"></iframe>
        </div>
      )
    }
  })

  function renderFetcher() {
    React.render(<Fetcher />, document.getElementsByTagName('body')[0]);
  }

  renderFetcher();
}())
