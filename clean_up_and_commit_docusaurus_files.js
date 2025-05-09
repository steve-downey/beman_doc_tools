const fs = require('fs')
const path = require('path')
const simple_git = require('simple-git')
const git = simple_git(process.cwd())

const deletes = [
    "../doc/blog",
    "../doc/docs/tutorial-basics",
    "../doc/docs/tutorial-extras",
    "../doc/static/img/docusaurus-social-card.jpg",
    "../doc/static/img/docusaurus.png",
    "../doc/static/img/logo.svg",
    "../doc/static/img/undraw_docusaurus_mountain.svg",
    "../doc/static/img/undraw_docusaurus_react.svg",
    "../doc/static/img/undraw_docusaurus_tree.svg",
]

all_deletes = []

function visit_all_files(dir) {
    const paths = fs.readdirSync(dir)

    for (const p_ of paths) {
        const p = path.join(dir, p_)
        const stat = fs.statSync(p)

        if (stat.isDirectory())
            visit_all_files(p)
        else
            all_deletes.push(p)
    }
}

for (const d of deletes) {
    const stat = fs.statSync(d)
    if (stat.isFile())
        all_deletes.push(d)
    else
        visit_all_files(d)
}

const adds = [
    "../doc/docs/api",
    "../doc/docs/intro.md",
    "../doc/docusaurus.config.js",
    "../doc/sidebars.js",
    "../doc/src/components/HomepageFeatures/index.js",
    "../doc/src/pages/index.js",
    "../doc/static/img/dragonduck.png",
    "../doc/static/img/dragonduck.svg",
    "../doc/static/img/favicon.ico",
]

git.rm(all_deletes).then(() => {
    git.add(adds).then(() => {
        git.commit("Remove unused baseline Docusaurus files.")
    })
})

console.log("Removed unused baseline Docusaurus files.")
