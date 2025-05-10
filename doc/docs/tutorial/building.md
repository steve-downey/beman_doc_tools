---
sidebar_position: 5
---

# Building and Deploying

### Step 5
Build static pages and/or deploy the docs, as needed.

### Step 5-a
To see what the static pages look like locally, run the Docusaurus build
script.
```term
cd PROJ/doc
npm run build
```

The output will be in `PROJ/doc/build`.

### Step 5-b
To see the locally-built static pages, run the Docusaurus serve script.
```term
cd PROJ/doc
npm run serve
```

### Step 5-c
To deploy to gh-pages, you'll need to create the gh-pages branch first.  This
only needs to be done once.
```term
git checkout -b gh-pages
git push --set-upstream origin gh-pages
git checkout main
```

### Step 5-d
Run the Docusaurus deploy script.  This will push to gh-pages, which is
accessible via `ORGANIZATION.github.io/PROJECT_NAME`.
```term
cd PROJ/doc
npm run deploy
```

Note that deployment assumes your organization is `ORGANIZATION` on Github,
and is autodetected from the results of running `git remote -v` on your local
repo.  If you move your Github repo into or out of the `bemanproject` org, you
should change `organizationName` in `PROJ/doc/docusaurus.config.js` to your
project's owner (usually, that's your username or `bemanproject`).  If you
have no custom edits to your `docusaurus.config.js`, you can simply do:

```term
cd PROJ/beman_doc_tools
npm run gen_docusaurus_config
```

... and the auto-detection will pick up the proper org name via `git remote
-v`.

After deploying, be sure to add a link to the online docs to the bottom of
your repo's `README.md`.  You should add something like, "Online docs at
\[ORGANIZATION.github.io/PROJECT_NAME](https://ORGANIZATION.github.io/PROJECT_NAME)".
