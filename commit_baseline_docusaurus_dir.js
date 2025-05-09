const path = require('path')
const simple_git = require('simple-git')
const git = simple_git(process.cwd())

if (process.argv.length < 3) {
    console.log(
        process.argv[1] + ": error: Missing prefix to the files to add.")
    process.exit(1)
}

const prefix = process.argv[2]

const adds = [
    path.join(prefix, ".gitignore"),
    path.join(prefix, "blog"),
    path.join(prefix, "docs"),
    path.join(prefix, "docusaurus.config.js"),
    path.join(prefix, "package.json"),
    path.join(prefix, "README.md"),
    path.join(prefix, "sidebars.js"),
    path.join(prefix, "src"),
    path.join(prefix, "static"),
]

git.add(adds).then(() => {
    git.commit("Add baseline Docusaurus tree.")
})

console.log("Comitted baseline Docusaurus tree.")
