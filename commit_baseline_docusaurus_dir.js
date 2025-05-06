const simple_git = require('simple-git')
const git = simple_git(process.cwd())

const adds = [
    "../doc/.gitignore",
    "../doc/blog",
    "../doc/docs",
    "../doc/docusaurus.config.js",
    "../doc/package.json",
    "../doc/README.md",
    "../doc/sidebars.js",
    "../doc/src",
    "../doc/static",
]

git.add(adds).then(() => {
    git.commit("Add baseline Docusaurus tree.")
})

console.log("Comitted baseline Docusaurus tree.")
