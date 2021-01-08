const Controller = require('../../src/controllers/messenger_service.controller')
const Utils = require("../../src/utils")
const httpMocks = require('node-mocks-http')
const packageJson = require('../../package.json')

Utils.packageParseInformation = jest.fn()

let req, res, next

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('Get information', () => {

  it('Should have a getInformation function', () => {
    expect(typeof Controller.getInformation).toBe('function')
  })

  it('Should call packageParseInformation()', () => {
    Controller.getInformation(req, res, next)

    expect(Utils.packageParseInformation).toBeCalledWith(packageJson)
  })

  it('Should return 200 response code', async () => {
    await Controller.getInformation(req, res, next)

    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('Should return name and version in response', async () => {
    Utils.packageParseInformation.mockReturnValue({name: "ihna_calendarservice", version: "1.0.0"})

    await Controller.getInformation(req, res, next)

    expect(res._getJSONData()).toStrictEqual({name: "ihna_calendarservice", version: "1.0.0"})
  })

  it('Should handle errors', async () => {
    const errorMessage = {message: "Error finding"}
    const rejectedPromise = Promise.reject(errorMessage)
    Utils.packageParseInformation.mockReturnValue(rejectedPromise)

    await Controller.getInformation(req, res, next)

    expect(next).toBeCalledWith(errorMessage)
  })
})