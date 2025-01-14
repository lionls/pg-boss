const assert = require('assert')
const helper = require('./testHelper')

describe('cancel', function () {
  it('should reject missing id argument', async function () {
    const boss = this.test.boss = await helper.start(this.test.bossConfig)

    try {
      await boss.resume()
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('should cancel and resume a pending job', async function () {
    const config = this.test.bossConfig
    const boss = this.test.boss = await helper.start(config)

    const jobId = await boss.send('will_cancel', null, { startAfter: 1 })

    await boss.cancel(jobId)

    const job = await boss.getJobById(jobId)

    assert(job && job.state === 'cancelled')

    const jobResume = await boss.resume(jobId)

    assert(jobResume && jobResume.state === 'created')
  })
})
