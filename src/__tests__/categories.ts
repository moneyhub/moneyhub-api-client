/* eslint-disable max-nested-callbacks */
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Categories} from ".."

describe("Categories", function() {
  let moneyhub: MoneyhubInstance
  let categoryId: string | undefined
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("get standard categories", async function() {
    const categories = await moneyhub.getStandardCategories({params: {type: "personal"}})
    expect(categories.data.length).to.be.at.least(50)
    expectTypeOf<Categories.Category[]>(categories.data)
  })

  it("get standard category groups", async function() {
    const categories = await moneyhub.getStandardCategoryGroups({params: {type: "all"}})
    expect(categories.data.length).to.be.at.least(24)
    expectTypeOf<Categories.CategoryGroup[]>(categories.data)
  })

  it("get personal categories", async function() {
    const categories = await moneyhub.getCategories({userId, params: {limit: 100}})
    expect(categories.data.length).to.be.at.least(50)
    expectTypeOf<Categories.Category[]>(categories.data)
  })

  it("get personal category", async function() {
    const {data: categories} = await moneyhub.getCategories({
      userId,
      params: {type: "personal"},
    })
    const id = categories[0].categoryId
    const category = await moneyhub.getCategory({userId, categoryId: id})
    expect(category.data.categoryId).to.eql(id)
    expectTypeOf<Categories.Category[]>(categories)
  })

  it("get personal category groups", async function() {
    const groups = await moneyhub.getCategoryGroups({userId})
    expect(groups.data.length).to.equal(16)
    expectTypeOf<Categories.CategoryGroup[]>(groups.data)
  })

  it("get business categories", async function() {
    const categories = await moneyhub.getCategories({
      userId,
      params: {type: "business"},
    })
    expect(categories.data.length).to.equal(22)
    expectTypeOf<Categories.Category[]>(categories.data)
    categoryId = categories.data.find((a) => a.key === "business-loans")?.categoryId
  })

  it("get business category", async function() {
    const category = categoryId ? await moneyhub.getCategory({
      userId,
      categoryId,
      params: {type: "business"},
    }) : undefined
    expect(category?.data).to.eql({
      categoryId: "std:28a30a62-6699-40a6-b24a-ed2671019824",
      group: "group:105",
      key: "business-loans",
    })
    expectTypeOf<Categories.Category | undefined>(category?.data)
  })

  it("get business category groups", async function() {
    const groups = await moneyhub.getCategoryGroups({
      userId,
      params: {type: "business"},
    })
    expect(groups.data.length).to.equal(8)
    expectTypeOf<Categories.CategoryGroup[]>(groups.data)
  })

  it("get all categories", async function() {
    const categories = await moneyhub.getCategories({
      userId,
      params: {type: "all", limit: 200},
    })
    expect(categories.data.length).to.be.above(80)
    expectTypeOf<Categories.Category[]>(categories.data)
  })

  it("creates custom category", async function() {
    const category = await moneyhub.createCustomCategory({
      userId,
      category: {group: "group:1", name: "custom-category"},
    })
    expect(category.data.name).to.equal("custom-category")
    expectTypeOf<Categories.Category>(category.data)
  })
})
