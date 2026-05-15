import { describe, expect, it } from "vitest";

import { formatCookies, parseCliArgs } from "../src/cli.js";

describe("CLI", () => {
	it("parses a bare domain and browser/header options", () => {
		const parsed = parseCliArgs([
			"github.com",
			"--browser",
			"chrome,firefox",
			"--browser",
			"chrome",
			"--format",
			"header",
			"--name",
			"user_session,logged_in",
		]);

		expect(parsed).toMatchObject({
			ok: true,
			options: {
				url: "https://github.com/",
				browsers: ["chrome", "firefox"],
				format: "header",
				names: ["user_session", "logged_in"],
			},
		});
	});

	it("parses profile, origin, mode, and inline options", () => {
		const parsed = parseCliArgs([
			"https://app.example.com/path",
			"--origin=https://accounts.example.com",
			"--profile",
			"Default",
			"--chromium-browser",
			"brave",
			"--mode",
			"first",
			"--include-expired",
			"--timeout-ms",
			"5000",
			"--inline-file",
			"/tmp/cookies.json",
		]);

		expect(parsed).toMatchObject({
			ok: true,
			options: {
				url: "https://app.example.com/path",
				origins: ["https://accounts.example.com"],
				profile: "Default",
				chromiumBrowser: "brave",
				mode: "first",
				includeExpired: true,
				timeoutMs: 5000,
				inlineCookiesFile: "/tmp/cookies.json",
			},
		});
	});

	it("rejects invalid browsers", () => {
		const parsed = parseCliArgs(["github.com", "--browser", "opera"]);
		expect(parsed).toMatchObject({
			ok: false,
			exitCode: 1,
			message: "Invalid --browser: opera",
		});
	});

	it("formats cookie header output", () => {
		const text = formatCookies(
			[
				{ name: "b", value: "2", domain: "example.com" },
				{ name: "a", value: "1", domain: "example.com" },
				{ name: "a", value: "newer", domain: "example.com" },
			],
			"header",
		);

		expect(text).toBe("Cookie: a=1; b=2");
	});
});
