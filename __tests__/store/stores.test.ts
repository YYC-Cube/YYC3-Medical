import { useAuthStore } from "@/store/useAuthStore"

beforeEach(() => {
  // Reset zustand store between tests
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })
})

describe("store/useAuthStore", () => {
  const mockUser = {
    id: "u1",
    name: "Test",
    email: "t@e.com",
    phone: "13800138000",
    role: "admin",
    createdAt: "2026-01-01",
  }

  it("starts logged out", () => {
    const s = useAuthStore.getState()
    expect(s.isAuthenticated).toBe(false)
    expect(s.user).toBeNull()
    expect(s.token).toBeNull()
  })

  it("login sets user + token + isAuthenticated", () => {
    useAuthStore.getState().login("tok-1", mockUser)
    const s = useAuthStore.getState()
    expect(s.isAuthenticated).toBe(true)
    expect(s.token).toBe("tok-1")
    expect(s.user?.id).toBe("u1")
  })

  it("logout clears all auth state", () => {
    useAuthStore.getState().login("tok-1", mockUser)
    useAuthStore.getState().logout()
    const s = useAuthStore.getState()
    expect(s.isAuthenticated).toBe(false)
    expect(s.user).toBeNull()
    expect(s.token).toBeNull()
  })

  it("updateUser merges partial user data", () => {
    useAuthStore.getState().login("tok-1", mockUser)
    useAuthStore.getState().updateUser({ name: "NewName" })
    expect(useAuthStore.getState().user?.name).toBe("NewName")
    expect(useAuthStore.getState().user?.email).toBe("t@e.com") // unchanged
  })

  it("updateUser is a no-op when user is null", () => {
    useAuthStore.getState().updateUser({ name: "X" })
    expect(useAuthStore.getState().user).toBeNull()
  })

  it("setLoading / setError / clearError", () => {
    useAuthStore.getState().setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)
    useAuthStore.getState().setError("boom")
    expect(useAuthStore.getState().error).toBe("boom")
    useAuthStore.getState().clearError()
    expect(useAuthStore.getState().error).toBeNull()
  })

  it("refreshToken returns true when token exists, false otherwise", async () => {
    expect(await useAuthStore.getState().refreshToken()).toBe(false)
    useAuthStore.getState().login("tok-1", mockUser)
    expect(await useAuthStore.getState().refreshToken()).toBe(true)
  })
})
