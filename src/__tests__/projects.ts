
import {expect} from "chai"
import {expectTypeOf} from "expect-type"

import {Moneyhub, MoneyhubInstance, Projects} from ".."

describe("Projects", function() {
  let moneyhub: MoneyhubInstance
  let projectId: string
  let userId: string

  before(async function() {
    userId = this.config.testUserId
    moneyhub = await Moneyhub(this.config)
  })

  it("can create a project", async function() {
    const {data: project} = await moneyhub.addProject({
      userId,
      project: {
        name: "Test Project",
        type: "RentalProject",
      },
    })

    expect(project.name).to.eql("Test Project")
    expect(project.id).to.be.a("string")
    expectTypeOf<Projects.Project>(project)
    projectId = project.id
  })

  it("can get a project", async function() {
    const {data: project} = await moneyhub.getProject({userId, projectId})
    expect(project.id).to.eql(projectId)
    expectTypeOf<Projects.Project>(project)
  })

  it("can get projects", async function() {
    const {data: projects} = await moneyhub.getProjects({
      userId,
      params: {limit: 1},
    })
    expect(projects.length).to.eql(1)
    expectTypeOf<Projects.Project[]>(projects)
  })

  it("can update a project", async function() {
    const {data: project} = await moneyhub.updateProject({
      userId,
      projectId,
      project: {name: "Updated"},
    })
    expect(project.id).to.eql(projectId)
    expect(project.name).to.eql("Updated")
    expectTypeOf<Projects.Project>(project)
  })

  it("can delete a project", async function() {
    const status = await moneyhub.deleteProject({userId, projectId})
    expect(status).to.eql(204)
  })
})
