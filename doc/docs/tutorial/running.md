---
sidebar_position: 4
---

# Running and Editing

### Step 4
Start the live-updated documentation website.  This is the development mode
for writing the docs.  This command will start a webserver and serve the docs.
It will create a new tab in your browser, and bring your browser and the new
tab up immediately.  It will also detect any changes you make, as you make
them.  This means that you won't need to refresh the page to see changes; the
pages will simply change as you save edits to your files, and even as you add
new files.

### Step 4-a
Run the command itself.
```term
cd PROJ/doc
npm run start
```

### Step 4-b

Edit your Markdown files.  The full Docusaurus tree is at `PROJ/doc`, and the
The Markdown files being served are found in `PROJ/doc/docs`.  Edit those to
write your documentation.  See the [Docusaurus](https://docusaurus.io/) docs
for details.

### Step 4-c
If you make changes to the Doxygen comments in your source files, you need to
re-run the building of the Doxygen API docs.  This is done when initially
building the docs.  You only need to re-run this script when you edit the
in-source comments.
```term
cd PROJ/beman_doc_tools
npm run build_api_docs
```
