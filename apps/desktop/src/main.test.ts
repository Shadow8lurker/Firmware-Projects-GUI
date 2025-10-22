import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createPreviewHtml } from "./main";

describe("desktop preview", () => {
  it("produces HTML with monitor and builder", async () => {
    const html = await createPreviewHtml();
    assert.match(html, /CommWatch Desktop Preview/);
    assert.match(html, /Transmit Builder/);
  });
});
