// USE: This is intended to be used only once, when initially setting up the
// Docusaurus docs in a Beman project.  It will tak the path to
// docusaurus.config.js.in, and the path at which docusaurus.config.js should
// be written.

const fs = require("node:fs")
const simple_git = require('simple-git')
const git = simple_git(process.cwd())
const path = require('path')

const beman_url = "https://www.bemanproject.org"

var git_results = {}
git.getConfig('user.name').then((user_name) => {
    git_results.user_name = user_name.value
    git.remote(['get-url', 'origin']).then((remote_url) => {
        remote_url = remote_url.trim()
        const slash_pos = remote_url.indexOf('/')
        var org_name = remote_url.substring(0, slash_pos)
        const org_name_colon = org_name.indexOf(':')
        if (0 < org_name_colon)
            org_name = org_name.substring(org_name_colon + 1)
        const repo_name =
              remote_url.substring(slash_pos + 1).replace('.git', '')
        git_results.org_name = org_name
        git_results.repo_name = repo_name
        main(git_results)
    })
})

function main(git_results) {
    if (process.argv.length < 4) {
        console.log(
            process.argv[1] +
                ": error: Missing path(s) to docusaurus.config.js.in and " +
                "docusaurus.config.js.")
        process.exit(1)
    }

    const docusaurus_in_path = process.argv[2]
    const docusaurus_config_path = process.argv[3]

    var contents = ""
    try {
        contents = fs.readFileSync(docusaurus_in_path, "utf8")
    } catch (err) {
        console.error(err)
    }

    const year = `${new Date().getFullYear()}`
    const user_name = git_results.user_name
    const org_name = git_results.org_name
    const repo_name = git_results.repo_name

    contents = contents.
        replaceAll("%year%", year).
        replaceAll("%user_name%", user_name).
        replaceAll("%org_name%", org_name).
        replaceAll("%repo_name%", repo_name)

    fs.writeFileSync(docusaurus_config_path, contents, "utf8")
}
