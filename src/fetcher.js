(function() {

  const maxDelay = 600000 // 10 minutes

  const initJobData = {
    timeRequested: null,  // timestamp in ms
    url: null,
    data: null,           // data fetched from URL
    timeCompleted: null   // timestamp in ms
  }

  var Promise = require("bluebird")

  var _ = require("underscore")
  var validator = require("validator")
  var request = require("request-promise")

  var datastore = require("./datastore.js")

  function requestUrl(url, delay) {
    delay = Math.min(delay, maxDelay) || 0

    return new Promise(function(resolve, reject) {
      if (validator.isURL(url, { require_protocol: true })) {
        var jobData = {
          timeRequested: _.now(),
          url: url
        }

        _.defaults(jobData, initJobData)

        datastore.createJob(jobData)
        .then(function(jobId) {
          _.delay(function() {
            request.get(url)
            .then(_.partial(saveData, jobId))
            .catch(function(e) {
              switch (e.name) {
                case "StatusCodeError": // 404s, etc.
                  if (e.response && e.response.body) {
                    // 404 page is valid data, so let's save that and call it a day
                    return saveData(jobId, e.response.body)
                  }
                  break
                case "RequestError":    // Domain not found
                  return saveData(jobId, "URL not found: " + url)
              }

              console.error("Failed to save data for jobId: " + jobId)
            })
          }, delay)

          resolve(jobId.toString())
        })
        .catch(reject)
      } else {
        reject(new Error("Invalid URL: " + url))
      }
    })
  }

  function retrieveData(jobId) {
    return datastore.getJob(jobId)
      .then(function(job) {
        if (job) {
          if (job.data) {
            return job.data
          } else {
            return "Job " + jobId + " still in progress."
          }
        }

        throw new Error("Failed to retrieve data from URL: " + job.url)
      })
  }

  function saveData(jobId, data) {
    return datastore.getJob(jobId)
      .then(function(jobData) {
        jobData.data = data
        jobData.timeCompleted = _.now()
        return datastore.setJobData(jobId, jobData)
      })
  }

  module.exports = {
    requestUrl: requestUrl,
    retrieveData: retrieveData
  }
}())
