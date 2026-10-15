const {expect} = require("chai")
const {parseCallbackArg} = require("../parse-callback-arg")

describe("parseCallbackArg", function() {
  it("keeps a literal plus in the code and state of a redirect URL", function() {
    expect(parseCallbackArg("https://app.example/cb?code=abc+def&state=x+y"))
      .to.eql({code: "abc+def", state: "x+y"})
  })

  it("leaves a raw code unchanged when it contains code=", function() {
    expect(parseCallbackArg("pre&code=tail+more"))
      .to.eql({code: "pre&code=tail+more", state: "foo"})
  })

  it("decodes a percent-encoded plus and keeps a query-string code", function() {
    expect(parseCallbackArg("https://app.example/cb?code=abc%2Bdef&state=a%20b"))
      .to.eql({code: "abc+def", state: "a b"})
    expect(parseCallbackArg("code=abc+def&state=x+y"))
      .to.eql({code: "abc+def", state: "x+y"})
    expect(parseCallbackArg("?code=abc%2Bdef"))
      .to.eql({code: "abc+def", state: "foo"})
  })
})
