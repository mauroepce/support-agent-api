"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConneryToolkit = void 0;
const base_js_1 = require("../base.cjs");
/**
 * A toolkit for working with Connery actions.
 *
 * Connery is an open-source plugin infrastructure for AI.
 * Source code: https://github.com/connery-io/connery-platform
 *
 * See an example of using this toolkit here: `./examples/src/agents/connery_mrkl.ts`
 * @extends Toolkit
 */
class ConneryToolkit extends base_js_1.Toolkit {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    /**
     * Creates a ConneryToolkit instance based on the provided ConneryService instance.
     * It populates the tools property of the ConneryToolkit instance with the list of
     * available tools from the ConneryService instance.
     * @param conneryService The ConneryService instance.
     * @returns A Promise that resolves to a ConneryToolkit instance.
     */
    static async createInstance(conneryService) {
        const toolkit = new ConneryToolkit();
        toolkit.tools = [];
        const actions = await conneryService.listActions();
        toolkit.tools.push(...actions);
        return toolkit;
    }
}
exports.ConneryToolkit = ConneryToolkit;
