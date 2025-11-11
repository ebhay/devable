# devable

Devable is a learning platform that includes an in-browser code playground (Compiler) which executes user code via the Piston execution API.

## Compiler — how it works

The Compiler page (`frontend/src/pages/compiler.jsx`) provides a small IDE-like UI with a Monaco editor, language selector, input area, and an output panel.

- Languages supported (UI): Java, Python3, C, C++, JavaScript, TypeScript, C#, Go, Rust
- The editor file name is `main.<ext>` where `<ext>` is the extension mapped from the selected language.

When you click Run the frontend sends a POST request to the Piston execution API:

- Endpoint used: `https://emkc.org/api/v2/piston/execute` (see `compiler.jsx`) 
- Payload includes: language, version (`"*"`), files (single file `main.<ext>` with the editor contents) and `stdin` (from the Input textarea).
- The API responds with execution details; the UI displays `result.run.output` (or a failure message).

Notes and configuration

- No backend is required for the Compiler feature — it runs entirely from the frontend and calls the public Piston API.
- Because it uses a public remote execution service, consider rate limits and privacy implications (user code is sent to an external service).
- To switch to a self-hosted Piston instance, update the fetch URL in `frontend/src/pages/compiler.jsx` to point to your Piston server (for example `https://your-piston-host/api/v2/execute`).

UX details

- Export: download the current editor contents as `main.<ext>`.
- Input box: used as `stdin` for the execution.
- Output: shows program stdout/stderr (or error messages). A `Clear` button empties the output.
- Theme sync: the Monaco editor theme tracks the app's light/dark mode.

Security & recommendations

- Don't rely on the public Piston API for sensitive or production workloads — self-host Piston if you need isolation and control.
- Add server-side rate-limiting or API keys on a proxy if you expect heavy usage.

Where to look in the code

- Frontend compiler UI: `frontend/src/pages/compiler.jsx`
- Monaco editor config: in the same file (monaco editor props)

If you'd like, I can add a README section showing how to self-host Piston and update the app to point to a configurable env var.
