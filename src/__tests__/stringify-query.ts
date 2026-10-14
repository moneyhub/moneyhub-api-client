import {expect} from "chai"
import {stringify} from "../stringify-query"

describe("stringify", function() {
  it("returns an empty string when there is nothing to encode", function() {
    expect(stringify()).to.equal("")
    expect(stringify(null)).to.equal("")
    expect(stringify({})).to.equal("")
  })

  it("sorts keys and encodes scalar values", function() {
    expect(stringify({b: 1, a: "two", c: true})).to.equal("a=two&b=1&c=true")
  })

  it("repeats the key for each array value and drops empty arrays", function() {
    expect(stringify({geotagIds: ["b", "a"], empty: []})).to.equal("geotagIds=b&geotagIds=a")
  })

  it("skips undefined values and undefined array entries", function() {
    expect(stringify({clientId: undefined, limit: 10})).to.equal("limit=10")
    expect(stringify({ids: ["a", undefined, "b"]})).to.equal("ids=a&ids=b")
  })

  it("encodes null as a key with no value", function() {
    expect(stringify({flag: null})).to.equal("flag")
  })

  it("strict-encodes characters that encodeURIComponent leaves alone", function() {
    expect(stringify({q: "a b!'()*"})).to.equal("q=a%20b%21%27%28%29%2A")
  })
})
