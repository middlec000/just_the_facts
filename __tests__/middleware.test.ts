/**
 * @jest-environment node
 */
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

function makeRequest(
  pathname: string,
  cookieHeader?: string,
): NextRequest {
  const url = `http://localhost${pathname}`;
  const headers: HeadersInit = cookieHeader
    ? { cookie: cookieHeader }
    : {};
  return new NextRequest(url, { headers });
}

describe("middleware", () => {
  describe("public paths (no session required)", () => {
    it("allows /login through without a session cookie", () => {
      const req = makeRequest("/login");
      const res = middleware(req);
      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });

    it("allows /login sub-paths through without a session cookie", () => {
      const req = makeRequest("/login?from=/statements");
      const res = middleware(req);
      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });

    it("allows /signup through without a session cookie", () => {
      const req = makeRequest("/signup");
      const res = middleware(req);
      expect(res.headers.get("location")).toBeNull();
      expect(res.status).toBe(200);
    });
  });

  describe("content paths (publicly accessible)", () => {
    it("allows /statements without a session cookie", () => {
      const req = makeRequest("/statements");
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows /statements/:id without a session cookie", () => {
      const req = makeRequest("/statements/stmt-1");
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows the root path without a session cookie", () => {
      const req = makeRequest("/");
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });

    it("allows through when a valid session cookie is present", () => {
      const req = makeRequest(
        "/statements",
        "jtf_session=someuser:somehash",
      );
      const res = middleware(req);
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
    });
  });
});
