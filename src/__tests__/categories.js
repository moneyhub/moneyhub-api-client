/* eslint-disable max-nested-callbacks */
const Moneyhub = require("..")
const config = require("../../examples/config.local")
const {expect} = require("chai")

describe("Categories", () => {
  let moneyhub
  let categoryId

  const userId = config.testUserId

  before(async () => {
    moneyhub = await Moneyhub(config)
  })

  it("get personal categories", async () => {
    const categories = await moneyhub.getCategories({userId, params: {limit: 100}})
    expect(categories.data.length).to.be.at.least(50)
    categoryId = categories.data.find((a) => a.categoryId.startsWith("std:")).categoryId
  })

  it("get personal category", async () => {
    const category = await moneyhub.getCategory({userId, categoryId})
    expect(category.data.categoryId).to.eql(categoryId)
  })

  it("get personal category groups", async () => {
    const groups = await moneyhub.getCategoryGroups({userId})
    expect(groups.data.length).to.equal(16)
  })

  it("get business categories", async () => {
    const categories = await moneyhub.getCategories({
      userId,
      params: {type: "business"},
    })
    expect(categories.data.length).to.equal(22)
    categoryId = categories.data.find((a) => a.key === "business-loans")
      .categoryId
  })

  it("get business category", async () => {
    const category = await moneyhub.getCategory({
      userId,
      categoryId,
      params: {type: "business"},
    })
    expect(category.data).to.eql({
      categoryId: "std:28a30a62-6699-40a6-b24a-ed2671019824",
      group: "group:105",
      key: "business-loans",
    })
  })

  it("get business category groups", async () => {
    const groups = await moneyhub.getCategoryGroups({
      userId,
      params: {type: "business"},
    })
    expect(groups.data.length).to.equal(8)
  })

  it.skip("get all categories", async () => {
    const categories = await moneyhub.getCategories({
      userId,
      params: {type: "all"},
    })
    expect(categories.data.length).to.equal(72)
  })

  it("creates custom category", async () => {
    const category = await moneyhub.createCustomCategory({
      userId,
      category: {group: "group:1", name: "custom-category"},
    })
    expect(category.data.name).to.equal("custom-category")
  })
})
