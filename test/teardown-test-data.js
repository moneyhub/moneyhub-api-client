const deleteTestUser = async (moneyhub, userId) => await moneyhub.deleteUser({userId})

exports.teardownTestData = async function(config, moneyhub) {
  if (config.testUserId) {
    await deleteTestUser(moneyhub, config.testUserId)
  }
}