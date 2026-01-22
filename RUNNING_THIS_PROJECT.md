# IMPORTANT: How to Run This Project

Always run all commands from the project folder:

    cd homefront_github_clone
    npm install   # (only needed once, or after pulling new dependencies)
    npm run build
    npm run start

If you run npm commands from the parent folder, the app will NOT work and you will see a blank page.

## Troubleshooting
- If you see a blank page, check your terminal. If you see errors about missing package.json, you are in the wrong folder.
- Always open this folder in VS Code for editing and running.
- All your code, dependencies, and build outputs are inside this folder.

## Offline Use
- You can work offline as long as you have all files in this folder and have run `npm install` at least once.
- All source code is in this folder. No internet is needed to run or edit after setup.

---

**This is a standard requirement for all Node.js/Next.js projects.**

If you need a single-file, dependency-free app, you must use plain HTML/JS, not Next.js.
