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
capitalized.

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

## Sampling source code in your docs

This tool comes with a plugin that samples lines from your source code, and
places those lines in your documentation, without your having to copy and
paste.

For instance, say you have this in one of your source files.

```cpp
auto foo()
{ return 42; }
```

To sample that function, you need to put special comments that give a name (a
"sample tag") to the section you want to sample.  From now on, we'll refer to
lines delimited this way as a "tagged region".

```cpp
// [ foo_func
auto foo()
{ return 42; }
// ]
```

Then, you write this in one of your markdown files, using the same tag.

<code>
&#96;&#96;&#96;cpp foo_func<br/>
&#96;&#96;&#96;
</code>

The code sampling plugin will change your markdown to include the tagged
region, as if you wrote this.

<code>
&#96;&#96;&#96;cpp<br/>
auto foo()<br/>
\{ return 42; \}<br/>
&#96;&#96;&#96;
</code>

Note that the `//` tag comment lines from the source file are omitted.

### How files are searched for tagged regions

All files under `../src` and `../include` are searched.  These are relative to
the `PROJ/doc` directory that the Docusaurus files are in, so those correspond
to `PROJ/src` and `PROJ/include`.

The only files searched are likely C++ files.  A C++-specific subset of the
(very long) list of extensions accepted by Doxygen is used by the code sampler
plugin.

These are only defaults.  The paths in which to look for files, and the file
extensions required for files, are each configurable.  See the section on
configuration below.

### Tag-comment syntax

The sample comment lines must be single-line comments, consisting only of the
tokens `//`, `[`, `]`, and a tag identifier.  An open-tag comment has the form
`// [ {identifier}`.  A close-tag comment has the form `// ]`.

Identifiers (tag-names) are matched using the Javascript regex `\w+`, which is
the same as `[A-Za-z0-9_]+`.

Arbitrary amounts of whitespace are ignored before, after, and between the
tokens.

If the code sampler plugin sees an open-tag comment that remains unclosed at
end of the file, or sees a close-tag comment when there is no currently-open
tag, it will throw an exception.

### Split tagged regions

You can split a sampled region up into multiple sections for convenience.
Consider this source code.

```cpp
// [ foo_func
int foo()
{
    step1();
// ]
    step2();
// [ foo_func
    step3();
}
// ]
```

When you sample `foo_func` into your docs, you'll get this:

```cpp
int foo()
{
    step1();
    step3();
}
```

However, a particular sample tag may only be used multiple times *within the
same file*.  If you re-use `foo_func` above in another file, the code sampler
plugin will throw an exception.

### Nested tagged regions

It is also possible to nest taggged regions.  This is useful when you want to
sample an entire file or function, and then have smaller snippets that you
discuss elsewhere, one at a time.  Consider this example.

```cpp
// [ entire_file
// [ includes
#include <foo.h>
// ]

// [ main
int main()
{
   // etc...
}
// ]
// ]
```

The `entire_file` tag refers to the entire file, minus the open- and close-tag
lines.  The `includes` tag refers to just the includes, and the `main` tag
refers only to the lines of `main()`.

Nesting and split tags may be combined.  Here is an example.


```cpp
// [ entire_file
// [ includes
#include <foo.h>
// ]

// [ main
int main()
{
// ]
// [ main
   // etc...
}
// ]
// ]
```

The tagged regions in this example are identical to the tagged regions in the
previous example &mdash; the fact that `main` is split up does not change which
lines are associated with which tags.

### Plugin configuration

The code sampler plugin can be configured by providing an options object along
with it in `docusaurus.config.js`.  So, instead of the current enablement of
`code_sampler` by itself:

```jsx
docs: {
  sidebarPath: './sidebars.js',
  remarkPlugins: [code_sampler],
},
```
... you would provide the plugin, plus a configuration object.

```jsx
docs: {
  sidebarPath: './sidebars.js',
  remarkPlugins: [[code_sampler, {/* options here ... */}]],
},
```

If you do not provide an object, or only provide a subset of possible options,
the other options will have their default values.  Here are the options.

* `.roots` This must be a list (`[]`) of strings, indicating paths relative to
  `PROJ/doc` where your code can be found.

* `.extensions` This must be a list (`[]`) of strings, each of which is an
  acceptable file extension (`".cpp"`, `".c++"`, etc.).
