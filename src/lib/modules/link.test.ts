import { describe, it, expect } from 'vitest';
import { group, link, isGroupLink, setLinkState } from './link';

describe("Link", () => {
  describe("SingleLink", () => {
    it("should create single link", () => {
      const expected: Parameters<typeof link>[0] = {
        displayText: "display text",
        href: "/href",
        id: "hi",
        newTab: true,
        state: 'active',
      }

      const result = link(expected)
      expect(result).toEqual(expected)
    })

    it("should provide default properties", () => {
      const expected: Parameters<typeof link>[0] = {
        displayText: "display text",
        href: "/href",
        id: "hi",
      }

      const result = link(expected)

      expect(result).not.toEqual(expected)
      expect(result).toMatchObject(expected)
    })

    it("should be able to override default properties", () => {
      const expected: Parameters<typeof link>[0] = {
        displayText: "display text",
        id: "hi",
        href: "/",
        newTab: true,
        state: 'child-active',
      }

      const result = link(expected)

      expect(result).toEqual(expected)
    })

    it("should test false for isGroupLink", () => {
      const linkGroup = link({
        displayText: "single",
        id: "single",
        href: "/single",
        newTab: true,
        state: 'inactive'
      })
      const result = isGroupLink(linkGroup)
      expect(result).toBe(false)
    })
  })
  describe("GroupLink", () => {
    const testInput: Parameters<typeof group>[0] = {
      displayText: "display text",
      id: "hi",
      links: [],
    }

    it("should create a group link", () => {  
      const expected: Parameters<typeof group>[0] = {
        ...testInput,
        isOpen: false,
        state: 'active'
      }

      const result = group(expected)

      expect(result).toEqual(expected)
    })

    it("should provide default properties", () => {
      const result = group(testInput)

      expect(result).not.toEqual(testInput)
      expect(result).toMatchObject(testInput)
    })

    it("should be able to override default properties", () => {
      const expected: Parameters<typeof group>[0] = {
        displayText: "display text",
        id: "hi",
        links: [],
        isOpen: false,
        state: 'child-active'
      }

      const result = group(expected)

      expect(result).toEqual(expected)
    })

    it("should test positive for isGroupLink", () => {
      const linkGroup = group({
        displayText: "group",
        id: "group",
        links: [],
        isOpen: true,
        state: 'inactive'
      })
      const result = isGroupLink(linkGroup)
      expect(result).toBe(true)
    })
  })
  describe("isGroupLink", () => {
    it("should return false if the input has no links", () => {
      const result = isGroupLink({
        id: "test-input",
        displayText: "hello",
        href: "/",
        newTab: false,
        state: 'inactive'
      })
      expect(result).toBe(false)
    })

    it("should return true if the input has links", () => {
      const result = isGroupLink({
        id: "test-input",
        displayText: "hello",
        state: 'child-active',
        isOpen: true,
        links: [],
      })
      expect(result).toBe(true)
    })
  })
  describe("setLInkState", () => {
    it("should set the link state", () => {
      const testLink = link({
        displayText: "link text",
        href: "/link-href",
        id: "link id",
        state: 'inactive'
      })

      setLinkState(testLink, 'active', { recursive: false })
      expect(testLink.state).toEqual('active')
    })

    it('should recursively set state', () => {
      // did three levels just to make sure
      const grandChild = group({
        id: "grandChild id",
        displayText: "grandChild text",
        links: [],
        isOpen: false,
        state: 'inactive'
      })

      const child = group({
        id: "child id",
        displayText: "child text",
        links: [grandChild],
        isOpen: false,
        state: 'inactive'
      })

      const parent = group({
        id: "parent id",
        displayText: "parent text",
        links: [child],
        isOpen: false,
        state: 'inactive'
      })

      setLinkState(parent, 'active', { recursive: true })
      expect(parent.state).toEqual('active')
      expect(child.state).toEqual('active')
      expect(grandChild.state).toEqual('active')
    })

    it("should handle cyclic groups", () => {
      const parent = group({
        id: "link id",
        displayText: "link text",
        state: 'inactive',
        links: []
      })
      
      parent.links.push(parent)
      const handle = () => setLinkState(parent, 'active', { recursive: true })
      expect(handle).not.toThrowError()
    })
  })
})
