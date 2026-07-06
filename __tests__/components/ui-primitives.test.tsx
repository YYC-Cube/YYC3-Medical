import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"

describe("ui primitives", () => {
  describe("Button", () => {
    it("renders children", () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument()
    })

    it("triggers onClick", async () => {
      const user = userEvent.setup()
      const handler = jest.fn()
      render(<Button onClick={handler}>Tap</Button>)
      await user.click(screen.getByRole("button"))
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it("respects disabled attribute", () => {
      render(<Button disabled>Nope</Button>)
      expect(screen.getByRole("button")).toBeDisabled()
    })

    it.each(["default", "destructive", "outline", "secondary", "ghost", "link"] as const)(
      "applies variant=%s class",
      (variant) => {
        const { container } = render(<Button variant={variant}>X</Button>)
        expect(container.firstChild).toHaveClass("inline-flex")
      },
    )

    it.each(["default", "sm", "lg", "icon"] as const)("applies size=%s", (size) => {
      const { container } = render(<Button size={size}>X</Button>)
      expect(container.firstChild).toBeTruthy()
    })

    it("renders as child component when asChild=true", () => {
      render(
        <Button asChild>
          <a href="/foo">Link</a>
        </Button>,
      )
      const link = screen.getByRole("link", { name: "Link" })
      expect(link).toHaveAttribute("href", "/foo")
    })
  })

  describe("Badge", () => {
    it("renders children", () => {
      const { container } = render(<Badge>New</Badge>)
      expect(container.textContent).toBe("New")
    })

    it.each(["default", "secondary", "destructive", "outline", "success", "warning"] as const)(
      "applies variant=%s",
      (variant) => {
        const { container } = render(<Badge variant={variant}>X</Badge>)
        expect(container.firstChild).toHaveClass("inline-flex")
      },
    )
  })

  describe("Input", () => {
    it("renders an input element", () => {
      render(<Input placeholder="Email" />)
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument()
    })

    it("passes through type attribute", () => {
      render(<Input type="password" placeholder="pw" />)
      expect(screen.getByPlaceholderText("pw")).toHaveAttribute("type", "password")
    })

    it("supports user typing", async () => {
      const user = userEvent.setup()
      render(<Input placeholder="name" />)
      const input = screen.getByPlaceholderText("name")
      await user.type(input, "hello")
      expect(input).toHaveValue("hello")
    })

    it("respects disabled state", () => {
      render(<Input disabled placeholder="x" />)
      expect(screen.getByPlaceholderText("x")).toBeDisabled()
    })
  })

  describe("Card", () => {
    it("renders Card with its sub-components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>,
      )
      expect(screen.getByText("Title")).toBeInTheDocument()
      expect(screen.getByText("Description")).toBeInTheDocument()
      expect(screen.getByText("Body")).toBeInTheDocument()
      expect(screen.getByText("Footer")).toBeInTheDocument()
    })

    it("Card root has rounded-lg class", () => {
      const { container } = render(<Card>hi</Card>)
      expect(container.firstChild).toHaveClass("rounded-lg")
    })
  })
})
