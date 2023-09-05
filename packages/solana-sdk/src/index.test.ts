import {equal} from 'assert'
import ff from './index'

describe("testing test", () => {
  it("should equal 1", () => {
    equal(ff(), 1)
  })
})