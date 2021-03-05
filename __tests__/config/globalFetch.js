/** @format */

// Mocking the global.fetch included in React Native
global.fetch = jest.fn()

// Helper to mock a success response (only once)
fetch.mockResponseSuccess = (body) => {
    fetch.mockImplementationOnce(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(JSON.parse(body)),
        })
    )
}

// Helper to mock a failure response (only once)
fetch.mockResponseFailure = (error) => {
    fetch.mockImplementationOnce(() => Promise.reject(error))
}

// Helper to always mock success response
fetch.mockResponseAlwaysSuccess = (body) => {
    fetch.mockImplementation(() =>
        Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(JSON.parse(body)),
        })
    )
}
