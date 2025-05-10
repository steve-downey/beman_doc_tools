---
sidebar_position: 3
---

# Initial Steps

Below, your organization is referred to as `ORGANIZATION`, and your project is
referred to as `PROJECT_NAME`.  These are taken from the url for your Github
repo, which is expected to be something like
`git@github.com:ORGANIZATION/PROJECT_NAME.git`.  `ORGANIZATION` is usually
your Github username, or `bemanproject` (depending on whether or not your
project has been put under `bemanproject` or not).

### Step 1
Clone your project; let's call the directory where it sits, "`PROJ`".

### Step 2
Clone beman_doc_tools into a subdirectory of `PROJ`.

### Step 3
Create the baseline Docusaurus tree for your project.
```term
cd PROJ/beman_doc_tools
npm install
node run build_starter_docusaurus_tree
```

You will be asked to pick between Javascript and Typescript Docusaurus source
files.  Pick Javascript unless you want to embark on an adventure.

This command does a number of things.  In this order, it:

- runs `npm init docusaurus ../doc classic`, creating the default Docusaurus
  tree, including the Docusaurus tutorial;

- commits the default Docusaurus tree as a standalone commit, which you can
  revert back to if you want to experiment with the default Docusaurus install
  for learning purposes;

- generates a `docusaurus.config.js` specific to the Beman doc tool, and
  copies certain Beman-specific files over the default/generated ones; and

- removes much of the generated Docusaurus content, including its tutorial,
  and commits the final result.

As mentioned above, Doxygen API docs are built as part of this initial build.
If you have no Doxygen comments, then the `PROJ/doc/docs/api` directory will
be empty, and you'll get an error when you try to serve the doc pages (see the
next step below), since they will be full of broken links to the
(non-existent) API pages.  To remedy this, just add a simple Doxygen comment
on a (non-`detail`-namespace) class.  For example:

```cpp
/** Just to get things working.... */
struct foo { /* ... */ };
```

At the time of this writing, there's no way to automatically disable the
Doxygen API docs.  However, you can simply remove all references to API.
