const acorn = require("acorn")
const walk = require("acorn-walk")
const fs = require("node:fs")
const simple_git = require('simple-git')
const git = simple_git(process.cwd())
const path = require('path')
const os = require('os')

const username = os.userInfo().username
const beman_url = "https://www.bemanproject.org"

var git_results = {}
git.getConfig('user.name').then((user_name) => {
    git_results.user_name = user_name.value
    git.remote(['get-url', 'origin']).then((remote_url) => {
        const project_name = path.basename(remote_url.trim()).replace('.git', '')
        git_results.project_name = project_name
        main(git_results)
    })
})

function arrays_equal(l, r) {
    if (l.length !== r.length)
        return false;
    for (let i = 0; i < l.length; ++i) {
        if (l[i] !== r[i])
            return false;
    }
    return true;
}

function main(git_results) {
    if (process.argv.length < 3) {
        console.log(process.argv[1] +
                    ": error: Missing path to docusaurus.config.js.")
        process.exit(1)
    }

    const docusaurus_config_path = process.argv[2]

    var contents = ""
    try {
        contents = fs.readFileSync(docusaurus_config_path, "utf8")
    } catch (err) {
        console.error(err)
    }

    var ast = acorn.parse(contents, {ecmaVersion: 2020, sourceType: "module"})

    // First, strip out the "blog" elements.  This is necessary, because some
    // elements of the big "blog" element will get picked up later by other
    // editing, and we don't want overlapping regions.
    walk.fullAncestor(
        ast,
        (node, state, ancestors, type) => {
            if (type !== "Property" && type !== "ObjectExpression")
                return

            // TODO: This does not quite work.  These two sections need to be
            // recorded here, and applied in reverse order after.
            if (type === "Property" && node.key.name === "blog") {
                contents = contents.slice(0, node.value.start) +
                    "false" +
                    contents.slice(node.value.end)
            }

            if (type === "ObjectExpression" && node.properties.length === 3) {
                if (node.properties[0].type === "Property" &&
                    node.properties[1].type === "Property" &&
                    node.properties[2].type === "Property") {
                    //console.log(node.properties)
                    if (node.properties[0].key.name === "to" &&
                        node.properties[1].key.name === "label" &&
                        node.properties[2].key.name === "position") {
                        // console.log(node)
                        contents = contents.slice(0, node.start) +
                            contents.slice(node.end + 1)
                    }
                }
            }
        }
    )
    ast = acorn.parse(contents, {ecmaVersion: 2020, sourceType: "module"})

    // A value of undefined means "anything".
    const objects_to_edit = [
        { key: "title", value: "My Site",
          replacement_value: `${git_results.project_name} Beman Documentation`},
        { key: "tagline", value: "Dinosaurs are cool",
          replacement_value: ""},
        { key: "url", value: "https://your-docusaurus-site.example.com",
          replacement_value: beman_url},
        { key: "organizationName", value: "facebook",
          replacement_value: "bemanproject"},
        { key: "projectName", value: "docusaurus",
          replacement_value: git_results.project_name},
        {
            key: "copyright",
            value: undefined,
            replacement_value: `Copyright © ${new Date().getFullYear()} ${git_results.user_name}.`
        }
    ]

    const keys_to_delete = ['editUrl']

    const item_lists_to_replace = [
        { title: "Community", replacement_value: [
            { label: "Discourse", href: "http://discourse.boost.org" }
        ]},
        { title: "More", replacement_value: [
            { label: "Website", href: "https://www.bemanproject.org"}
        ]}
    ]

    var replacements = []
    var ancestors_just_seen = []
    var title_just_seen = null
    walk.fullAncestor(
        ast,
        (node, state, ancestors, type) => {
            if (type !== "Property")
                return

            const ancestor_starts = ancestors.slice(0, -1).map((node) => {
                return node.start
            })

            for (let obj of objects_to_edit) {
                if (obj.key !== node.key.name)
                    continue
                if (obj.value !== node.value.value &&
                    node.value.value !== undefined) {
                    continue
                }
                replacements.push({
                    start: node.value.start,
                    end: node.value.end,
                    value: obj.replacement_value
                })
            }

            for (let key of keys_to_delete) {
                if (key !== node.key.name)
                    continue
                replacements.push({
                    start: node.start,
                    end: node.end,
                    value: undefined
                })
            }

            if (node.key.name === "title" || node.key.name === "items") {
                for (let item_list of item_lists_to_replace) {
                    if (node.key.name === "title" &&
                        item_list.title === node.value.value) {
                        ancestors_just_seen = ancestor_starts
                        title_just_seen = item_list.title
                    }
                    if (node.key.name === "items" &&
                        item_list.title === title_just_seen &&
                        arrays_equal(ancestor_starts, ancestors_just_seen)) {
                        replacements.push({
                            start: node.value.start,
                            end: node.value.end,
                            value: item_list.replacement_value
                        })
                    }
                }
            }
        }
    )

    // Intentionally sorting backwards.
    replacements.sort((a, b) => b.start - a.start)
    for (let replacement of replacements) {
        if (replacement.value === undefined) {
            var offset = 0
            if (contents.charAt(replacement.end) === ",")
                offset = 1
            contents = contents.substring(0, replacement.start) +
                contents.substring(replacement.end + offset)
        } else {
            contents = contents.substring(0, replacement.start) +
                JSON.stringify(replacement.value) +
                contents.substring(replacement.end)
        }
    }

    contents = contents.replaceAll("https://github.com/facebook/docusaurus", beman_url)

    fs.writeFileSync(docusaurus_config_path, contents, "utf8")
}
