(function() {
  var express = require("express")
  var app = express()

  var fetcher = require("./fetcher.js")

  app.use("/massdrop", express.static("www"))

  app.all("/massdrop", function(req, res) {
    res.send("Hello World!")
  })

  app.get("/massdrop/request", function(req, res) {
    fetcher.requestUrl(req.query.url, req.query.delay)
    .then(function(result) {
      res.send(result)
    })
    .catch(function(e) {
      res.send("Error: " + e.message)
    })
  })

  app.get("/massdrop/retrieve", function(req, res) {
    fetcher.retrieveData(req.query.job)
    .then(function(data) {
      res.send(data)
    })
    .catch(TypeError, function(e) {
      res.send("TypeError: " + e.message)
    })
    .catch(SyntaxError, function(e) {
      // This is the case for when job data pulled from redis cannot be
      // parsed as JSON.
      res.send("SyntaxError: " + e.message)
    })
    .catch(function(e) {
      res.send("Error: " + e.message)
    })
  })

  var server = app.listen(8081, "127.0.0.1", function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Server running at http://%s:%s/", host, port)
  })
}())
