// infer.js
// Analizador que infiere estructuras en msg, context, flow, global y funciones dinámicas

function inferType(value) {
    if (Array.isArray(value)) {
        const itemTypes = value.map(inferType);
        return { type: "array", items: itemTypes };
    }
    if (value === null) return { type: "null" };
    if (typeof value === "object") {
        const props = {};
        for (const key in value) {
            props[key] = inferType(value[key]);
        }
        return { type: "object", properties: props };
    }
    return { type: typeof value };
}

function simulateContext() {
    return {
        get: (key) => ({ ejemplo: true, timestamp: Date.now() }),
        set: () => {},
    };
}

function evaluateCode(code) {
    const context = simulateContext();
    const globalContext = simulateContext();
    const flowContext = simulateContext();

    const consoleMessages = [];
    const console = { log: (...args) => consoleMessages.push(args.join(" ")) };

    let msg = {};

    try {
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
        const wrapped = new AsyncFunction("msg", "context", "flow", "global", "console", code);
        const result = wrapped(msg, context, flowContext, globalContext, console);
        return Promise.resolve(result).then((finalMsg) => {
            return {
                payload: inferType(finalMsg.payload),
                msg: inferType(finalMsg),
                logs: consoleMessages
            };
        });
    } catch (err) {
        return Promise.resolve({ error: err.message });
    }
}

async function analyze() {
    const editor = document.getElementById("code");
    const output = document.getElementById("output");
    const code = editor.value;
    const result = await evaluateCode(code);

    output.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
}

document.getElementById("analyze").addEventListener("click", analyze);