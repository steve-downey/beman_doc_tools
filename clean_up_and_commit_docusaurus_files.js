const fs = require('fs')
const path = require('path')
const simple_git = require('simple-git')
const git = simple_git(process.cwd())

if (process.argv.length < 3) {
    console.log(
        process.argv[1] + ": error: Missing prefix to the files to add.")
    process.exit(1)
}

const prefix = process.argv[2]

const deletes = [
    path.join(prefix, "blog"),
    path.join(prefix, "docs/tutorial-basics"),
    path.join(prefix, "docs/tutorial-extras"),
    path.join(prefix, "static/img/docusaurus-social-card.jpg"),
    path.join(prefix, "static/img/docusaurus.png"),
    path.join(prefix, "static/img/logo.svg"),
    path.join(prefix, "static/img/undraw_docusaurus_mountain.svg"),
    path.join(prefix, "static/img/undraw_docusaurus_react.svg"),
    path.join(prefix, "static/img/undraw_docusaurus_tree.svg"),
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
    path.join(prefix, "docs/api"),
    path.join(prefix, "docs/intro.md"),
    path.join(prefix, "docusaurus.config.js"),
    path.join(prefix, "sidebars.js"),
    path.join(prefix, "src/components/Paper.js"),
    path.join(prefix, "src/components/Stdref.js"),
    path.join(prefix, "src/components/HomepageFeatures/index.js"),
    path.join(prefix, "src/pages/index.js"),
    path.join(prefix, "src/theme/MDXComponents/"),
    path.join(prefix, "static/img/dragonduck.png"),
    path.join(prefix, "static/img/dragonduck.svg"),
    path.join(prefix, "static/img/favicon.ico"),
]

git.rm(all_deletes).then(() => {
    git.add(adds).then(() => {
        git.commit("Remove unused baseline Docusaurus files.")
    })
})

console.log("Removed unused baseline Docusaurus files.")
