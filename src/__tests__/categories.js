/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe("Categories", () => {
  let moneyhub
  let categoryId
  let config
  let userId

  before(async function() {
    config = this.config
    userId = config.testUserId
    moneyhub = await Moneyhub(config)
  })

  it("get standard categories", async () => {
    const categories = await moneyhub.getStandardCategories({params: {type: "personal"}})
    expect(categories.data.length).to.be.at.least(50)
  })

  it("get standard category groups", async () => {
    const categories = await moneyhub.getStandardCategoryGroups({params: {type: "all"}})
    expect(categories.data.length).to.be.at.least(24)
  })

  it("get personal categories", async () => {
    const categories = await moneyhub.getCategories({userId, params: {limit: 100}})
    expect(categories.data.length).to.be.at.least(50)
  })

  it("get personal category", async () => {
    const {data: categories} = await moneyhub.getCategories({
      userId,
      params: {type: "personal"},
    })
    const categoryId = categories[0].categoryId
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

  it("get all categories", async () => {
    const categories = await moneyhub.getCategories({
      userId,
      params: {type: "all", limit: 200},
    })
    expect(categories.data.length).to.be.above(80)
  })

  it("creates custom category", async () => {
    const category = await moneyhub.createCustomCategory({
      userId,
      category: {group: "group:1", name: "custom-category"},
    })
    expect(category.data.name).to.equal("custom-category")
  })
})
