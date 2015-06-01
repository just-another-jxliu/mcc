(function() {
  // Redis key names
  const rkJobPrefix = "job:"
  const rkNextJobId = makeJobKey("next.id")

  var Redis = require('ioredis')
  var redis = new Redis() // redis running on same box as Node

  redis.defineCommand("createJob", {
    numberOfKeys: 1,
    lua: "local newJobId = redis.call('incr', KEYS[1]) \n redis.call('set', '" + rkJobPrefix + "' .. newJobId, ARGV[1])  \n return newJobId"
  })

  function createJob(data) {
    return redis.createJob(rkNextJobId, JSON.stringify(data)) // promise
  }

  function getJob(jobId) {
    return redis.get(makeJobKey(jobId)).then(JSON.parse) // promise
  }

  function setJobData(jobId, data) {
    return redis.set(makeJobKey(jobId), JSON.stringify(data)) // promise
  }

  function makeJobKey(jobId) {
    return rkJobPrefix + jobId
  }

  module.exports = {
    createJob: createJob,
    getJob: getJob,
    setJobData: setJobData
  }
}())
