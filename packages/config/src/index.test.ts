import { describe, expect, it } from "vitest";
import { services, url } from "./index";
import { clientConfig } from "./client";

describe("topology", () => {
  it("exposes a port for every service", () => {
    expect(services.api.port).toBe(3001);
    expect(services.posts.port).toBe(5001);
    expect(services.host.port).toBe(5173);
  });

  it("builds a localhost url from the port", () => {
    expect(url("api")).toBe("http://localhost:3001");
    expect(url("posts")).toBe("http://localhost:5001");
  });
});

describe("client config", () => {
  it("falls back to the topology url when VITE_API_URL is unset", () => {
    // В тестовом окружении нет VITE_API_URL → применяется значение по умолчанию.
    expect(clientConfig.apiUrl).toBe(url("api"));
  });
});
