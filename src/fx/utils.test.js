import { describe, it, expect, afterEach } from "vitest";
import {
  clamp,
  parseImpactMetric,
  prefersReducedMotion,
  shouldReduceFx,
} from "./utils.js";

describe("fx/utils", () => {
  describe("clamp", () => {
    it("clamps below min", () => {
      expect(clamp(-1, 0, 10)).toBe(0);
    });
    it("clamps above max", () => {
      expect(clamp(99, 0, 10)).toBe(10);
    });
    it("passes through mid", () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe("parseImpactMetric", () => {
    it("returns null for missing el", () => {
      expect(parseImpactMetric(null)).toBe(null);
    });
    it("parses data attributes from a real element", () => {
      const el = document.createElement("div");
      el.setAttribute("data-value", "95");
      el.setAttribute("data-decimals", "0");
      el.setAttribute("data-plus", "1");
      expect(parseImpactMetric(el)).toEqual({
        value: 95,
        decimals: 0,
        plus: true,
      });
    });
    it("parses decimals metric", () => {
      const el = document.createElement("div");
      el.setAttribute("data-value", "3.3");
      el.setAttribute("data-decimals", "1");
      const m = parseImpactMetric(el);
      expect(m.value).toBeCloseTo(3.3);
      expect(m.decimals).toBe(1);
      expect(m.plus).toBe(false);
    });
  });

  describe("prefersReducedMotion / shouldReduceFx", () => {
    const originalMatch = window.matchMedia;
    afterEach(() => {
      window.matchMedia = originalMatch;
      delete window.__reduceFx;
    });

    it("reads matchMedia reduce", () => {
      window.matchMedia = (q) => ({
        matches: String(q).includes("prefers-reduced-motion"),
        media: q,
        addEventListener() {},
        removeEventListener() {},
      });
      expect(prefersReducedMotion()).toBe(true);
      expect(shouldReduceFx()).toBe(true);
    });

    it("honors window.__reduceFx flag", () => {
      window.matchMedia = () => ({
        matches: false,
        media: "",
        addEventListener() {},
        removeEventListener() {},
      });
      window.__reduceFx = true;
      expect(shouldReduceFx()).toBe(true);
    });
  });
});
