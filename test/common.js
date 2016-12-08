const container = require('../src/common/container')

// mock some methods of the container for given test
const withContainerMock = (mock, test) => {
    let containerDump = container.dump()
    //let originalGet = container.get

    container.get = id => {
        if (id in mock) {
            return mock[id]
        }

        return containerDump[id]
    }

    test()

    //container.get = originalGet
}

module.exports = {
    withContainerMock: withContainerMock
}
