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

:::tip

When writing your Doxygen comments, you can use markdown syntax, like using
backticks (\`) for code font.  However, if you backtick-quote a type name that
is indexed by Doxygen, this will break the intra-API links that Doxygen
autogenerates.  So, when documenting class `foo`, if I refer to class `bar`, I
should do it like this:

```cpp
/** Use bar instead if you need a sorted sequence. */
struct foo;
```

If you write this:

```cpp
/** Use `bar` instead if you need a sorted sequence. */
struct foo;
```

... you will get the markdown link syntax, quoted directly, something like,
`(link-text)[link-target]`.

:::

## Custom markup

It is possible to use custom markup in your Markdown that will get processed
by the React layer of Docusaurus.  Here are the custom markup tags supported
by the tool.  Note that the rules of Docusaurus dictate that the tags all be
captialized.

### `Stdref`

`Stdref` helps you refer to sections of the standard.  The processed markup
will be wrapped in brackets and will link to https://eel.is/c++draft.  For
example, `<Stdref ref="view.interface"/>` will be replaced with this:
\[[view_interface](https://eel.is/c++draft/view.interface)\].

### `Paper`

`Paper` helps you refer to WG21 papers.  You can refer to anything that works
with `wg21.link`.  For example, `<Paper num="P3117"/>` will be replaced with
this: [P3117](https://wg21.link/P3117).  Note that you can include or exclude
the `Rn` revision number suffix, since `wg21.link` accepts either form.

:::tip

The custom markups like `Stdref` don't come through Doxygen and Moxygen
unmolested.  To preserve their formatting, you need to escape the first `<`,
like this:

```cpp
/** My Doxygen comment refers to \<Stdref ref="view.interface"/> */
struct foo;
```

:::
