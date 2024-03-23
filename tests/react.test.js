import { describe, it, expect } from "vitest";
import React from "../core/react";

describe("React.createElement", () => {
  it("props is null", () => {
    const el = React.createElement("div", null, "Hello, World!");
    expect(el).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "Hello, World!",
              children: [],
            },
          },
        ],
      },
    });
  });

  it("props has property", () => {
    const el = React.createElement("div", { id: "app" }, "Hello, World!");
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "Hello, World!",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `);
  });
});
