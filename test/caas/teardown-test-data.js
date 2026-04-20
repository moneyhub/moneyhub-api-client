
exports.teardownTestData = async function(config, moneyhub) {
  const {caas: {userId, accountId} = {}} = config

  try {
    if (userId) {
      await moneyhub.caasDeleteUser({userId})
    } else if (accountId) {
      await moneyhub.caasDeleteAccount({accountId})
    } else {
      console.warn("No userId or accountId defined for caas tests, skipping teardown")
    }

  } catch (err) {
    throw new Error(`Failed to teardown caas test data: ${err.message}`, {cause: err})
  }

  return true
}
