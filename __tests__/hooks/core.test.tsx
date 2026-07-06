import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "@/hooks/useDebounce"
import { useThrottle } from "@/hooks/useThrottle"
import { usePagination } from "@/hooks/usePagination"

describe("hooks", () => {
  describe("useDebounce", () => {
    it("returns initial value immediately", () => {
      const { result } = renderHook(() => useDebounce("initial", 100))
      expect(result.current).toBe("initial")
    })

    it("updates after delay", async () => {
      const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
        initialProps: { value: "a", delay: 30 },
      })
      rerender({ value: "b", delay: 30 })
      expect(result.current).toBe("a") // not yet
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50))
      })
      expect(result.current).toBe("b")
    })
  })

  describe("useThrottle", () => {
    it("returns initial value immediately", () => {
      const { result } = renderHook(() => useThrottle("init", 100))
      expect(result.current).toBe("init")
    })

    it("updates immediately on first change (timeElapsed >= limit)", () => {
      const { result, rerender } = renderHook(({ value, limit }) => useThrottle(value, limit), {
        initialProps: { value: 1, limit: 0 },
      })
      rerender({ value: 2, limit: 0 })
      expect(result.current).toBe(2)
    })
  })

  describe("usePagination", () => {
    it("initializes with defaults", () => {
      const { result } = renderHook(() => usePagination({ totalItems: 100 }))
      expect(result.current.page).toBe(1)
      expect(result.current.pageSize).toBe(10)
      expect(result.current.totalPages).toBe(10)
      expect(result.current.startIndex).toBe(0)
      expect(result.current.endIndex).toBe(9)
      expect(result.current.hasNextPage).toBe(true)
      expect(result.current.hasPrevPage).toBe(false)
    })

    it("navigates to next page", () => {
      const { result } = renderHook(() => usePagination({ totalItems: 50, initialPageSize: 10 }))
      act(() => result.current.nextPage())
      expect(result.current.page).toBe(2)
      expect(result.current.startIndex).toBe(10)
    })

    it("blocks nextPage at last page", () => {
      const { result } = renderHook(() => usePagination({ totalItems: 5, initialPageSize: 10 }))
      act(() => result.current.nextPage())
      expect(result.current.page).toBe(1)
    })

    it("prevPage blocks at first page", () => {
      const { result } = renderHook(() => usePagination({ totalItems: 50 }))
      act(() => result.current.prevPage())
      expect(result.current.page).toBe(1)
    })

    it("setPage clamps to valid range", () => {
      const { result } = renderHook(() => usePagination({ totalItems: 30, initialPageSize: 10 }))
      act(() => result.current.setPage(99))
      expect(result.current.page).toBe(3)
      act(() => result.current.setPage(-5))
      expect(result.current.page).toBe(1)
    })

    it("setPageSize adjusts page to preserve visible items", () => {
      const { result } = renderHook(() =>
        usePagination({ totalItems: 100, initialPage: 3, initialPageSize: 10 }),
      )
      // start index 20, with new size 20 → page 2 (items 20-39)
      act(() => result.current.setPageSize(20))
      expect(result.current.pageSize).toBe(20)
      expect(result.current.startIndex).toBe(20)
    })
  })
})
