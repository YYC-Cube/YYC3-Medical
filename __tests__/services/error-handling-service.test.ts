import { errorService, ErrorType } from "@/services/error-handling-service"

describe("services/error-handling-service", () => {
  beforeEach(() => {
    errorService.clearErrorLog()
  })

  it("logs errors with correct details", () => {
    errorService.handleError(new Error("test error"))
    const log = errorService.getErrorLog()
    expect(log).toHaveLength(1)
    expect(log[0].message).toBe("test error")
    expect(log[0].type).toBe(ErrorType.UNKNOWN)
    expect(log[0].timestamp).toBeDefined()
  })

  it("accepts custom error type and additional data", () => {
    errorService.handleError(new Error("network down"), ErrorType.NETWORK, {
      path: "/api/data",
      code: "CONN_REFUSED",
    })
    const log = errorService.getErrorLog()
    expect(log[0].type).toBe(ErrorType.NETWORK)
    expect(log[0].path).toBe("/api/data")
    expect(log[0].code).toBe("CONN_REFUSED")
  })

  it("uses fallback message for errors without message", () => {
    errorService.handleError(new Error(""))
    expect(errorService.getErrorLog()[0].message).toBe("未知错误")
  })

  it("notifies registered listeners", () => {
    const listener = jest.fn()
    const unsubscribe = errorService.addErrorListener(listener)

    errorService.handleError(new Error("notify test"))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ message: "notify test" }),
    )
    unsubscribe()
  })

  it("unsubscribe stops notifications", () => {
    const listener = jest.fn()
    const unsubscribe = errorService.addErrorListener(listener)

    unsubscribe()
    errorService.handleError(new Error("after unsubscribe"))

    expect(listener).not.toHaveBeenCalled()
  })

  it("prepends new errors (most recent first)", () => {
    errorService.handleError(new Error("first"))
    errorService.handleError(new Error("second"))

    const log = errorService.getErrorLog()
    expect(log[0].message).toBe("second")
    expect(log[1].message).toBe("first")
  })

  it("caps log at maxLogSize (100)", () => {
    for (let i = 0; i < 105; i++) {
      errorService.handleError(new Error(`error-${i}`))
    }
    const log = errorService.getErrorLog()
    expect(log.length).toBeLessThanOrEqual(100)
  })

  it("listener errors do not break other listeners", () => {
    const badListener = jest.fn(() => {
      throw new Error("listener crashed")
    })
    const goodListener = jest.fn()

    errorService.addErrorListener(badListener)
    errorService.addErrorListener(goodListener)

    errorService.handleError(new Error("resilience test"))

    expect(badListener).toHaveBeenCalled()
    expect(goodListener).toHaveBeenCalled()
  })

  it("getErrorLog returns a copy (not internal reference)", () => {
    errorService.handleError(new Error("original"))
    const log1 = errorService.getErrorLog()
    errorService.clearErrorLog()
    expect(log1).toHaveLength(1)
    expect(errorService.getErrorLog()).toHaveLength(0)
  })

  it("clearErrorLog empties the log", () => {
    errorService.handleError(new Error("a"))
    errorService.handleError(new Error("b"))
    expect(errorService.getErrorLog()).toHaveLength(2)
    errorService.clearErrorLog()
    expect(errorService.getErrorLog()).toHaveLength(0)
  })
})
