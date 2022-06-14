/* eslint-disable max-nested-callbacks */
const {Moneyhub} = require("..")
const {expect} = require("chai")

describe("Projects", () => {
  let config
  let moneyhub
  let projectId
  let userId
  before(async function() {
    config = this.config
    userId = config.testUserId
    moneyhub = await Moneyhub(config)
  })

  it("can create a project", async () => {
    const {data: project} = await moneyhub.addProject({
      userId,
      project: {
        name: "Test Project",
        type: "RentalProject",
      },
    })

    expect(project.name).to.eql("Test Project")
    expect(project.id).to.be.a("string")
    projectId = project.id
  })

  it("can get a project", async () => {
    const {data: project} = await moneyhub.getProject({userId, projectId})
    expect(project.id).to.eql(projectId)
  })

  it("can get projects", async () => {
    const {data: projects} = await moneyhub.getProjects({
      userId,
      params: {limit: 1},
    })
    expect(projects.length).to.eql(1)
  })

  it("can update a project", async () => {
    const {data: project} = await moneyhub.updateProject({
      userId,
      projectId,
      project: {name: "Updated"},
    })
    expect(project.id).to.eql(projectId)
    expect(project.name).to.eql("Updated")
  })

  it("can delete a project", async () => {
    const status = await moneyhub.deleteProject({userId, projectId})
    expect(status).to.eql(204)
  })
})
