const deleteTestUser = async (moneyhub, userId) => await moneyhub.deleteUser({userId})

exports.teardownTestData = async function(config, moneyhub) {
  await deleteTestUser(moneyhub, config.testUserId)
}
