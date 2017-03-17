import assert from 'assert'
import YamlHelper from './YamlHelper'

describe('# tools/YamlHelper', function() {
  describe('serialize', function() {
    it("should serialize given structure", () => assert.equal("config:\n  a: b\n  c: d\n", (new YamlHelper().serialize({config: {a: "b", c: "d"}}))))
  })
})
