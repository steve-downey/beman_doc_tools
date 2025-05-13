// RUNME: To run this test, execute 'node --test ./{filename}', from the
// directory where {filename} is found.

const assert = require('assert')
const fs = require('node:fs')
const test = require('node:test')
const impl = require('../docusaurus_files/src/plugins/code_sampler_impl.js')

const empty_dir_name = "./empty_dir"
fs.mkdirSync(empty_dir_name, {recursive: true})

test('get_source_files() works on empty dirs', (t) => {
    const all_sources =
          impl.get_source_files({roots: [empty_dir_name, empty_dir_name]})
    assert.deepStrictEqual(all_sources, [])
});

test('get_source_files() only indexes C++ files among mixed files', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./mixed_files', empty_dir_name],
              extensions: impl.default_extensions})

    const impl_lines = [
        {num: 1, text: "#include <iostream>"},
        {num: 2, text: ""},
        {num: 3, text: ""},
        {num: 4, text: "// [foo_main"},
        {num: 5, text: "int main()"},
        {num: 6, text: "{"},
        {num: 7, text: "    std::cout << \"Hello, world!\\n\";"},
        {num: 8, text: "}"},
        {num: 9, text: "// ]"},
        {num: 10, text: ""},
    ]

    const header_lines = [
        {num: 1, text: "#ifndef FOO_H"},
        {num: 2, text: "#define FOO_H"},
        {num: 3, text: ""},
        {num: 4, text: "namespace foo {"},
        {num: 5, text: "    void bar {}"},
        {num: 6, text: "}"},
        {num: 7, text: ""},
        {num: 8, text: "#endif"},
        {num: 9, text: ""},
    ]

    assert.deepStrictEqual(
        all_sources, [
            {name: "mixed_files/foo.cpp", lines: impl_lines},
            {name: "mixed_files/foo.h", lines: header_lines}
        ])
});

test('get_tagged_regions() works on empty input', (t) => {
    const all_sources =
          impl.get_source_files({roots: [empty_dir_name, empty_dir_name]})
    const regions = impl.get_tagged_regions(all_sources)
    assert.deepStrictEqual(all_sources, [])
    assert.deepStrictEqual(regions, {})
});

test('get_tagged_regions() works on the simplest nonempty input', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./mixed_files', empty_dir_name],
              extensions: impl.default_extensions})
    const regions = impl.get_tagged_regions(all_sources)
    assert.deepStrictEqual(
        regions,
        { foo_main: [
            {num: 5, text: "int main()"},
            {num: 6, text: "{"},
            {num: 7, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 8, text: "}"}
        ]})
});

test('get_tagged_regions() properly accumulates multiple instances of the same tag in one file into one tagged region', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./split_tags', empty_dir_name],
              extensions: impl.default_extensions})
    const regions = impl.get_tagged_regions(all_sources)
    assert.deepStrictEqual(
        regions,
        { foo_main: [
            {num: 7, text: "int main()"},
            {num: 10, text: "{"},
            {num: 11, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 15, text: "}"}
        ]})
});

test('get_tagged_regions() properly handles nested tags', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./nested_tags', empty_dir_name],
              extensions: impl.default_extensions})
    const regions = impl.get_tagged_regions(all_sources)
    assert.deepStrictEqual(
        regions,
        { bar_cout_line: [
            {num: 15, text: '    std::cout << "Hello, world!\\n";'},
        ], bar_main: [
            {num: 8, text: "int main()"},
            {num: 13, text: "{"},
            {num: 15, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 20, text: "}"}
        ], entire_bar_cpp_file: [
            {num: 2, text: "#include <iostream>"},
            {num: 3, text: ""},
            {num: 4, text: ""},
            {num: 8, text: "int main()"},
            {num: 13, text: "{"},
            {num: 15, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 18, text: "    // a bunch of other stuff ..."},
            {num: 20, text: "}"}
        ], bar_main: [
            {num: 8, text: "int main()"},
            {num: 13, text: "{"},
            {num: 15, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 20, text: "}"}
        ], entire_foo_cpp_file: [
            {num: 2, text: "#include <iostream>"},
            {num: 3, text: ""},
            {num: 4, text: ""},
            {num: 6, text: "int main()"},
            {num: 7, text: "{"},
            {num: 9, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 11, text: "}"}
        ], foo_cout_line: [
            {num: 9, text: "    std::cout << \"Hello, world!\\n\";"},
        ], foo_main: [
            {num: 6, text: "int main()"},
            {num: 7, text: "{"},
            {num: 9, text: "    std::cout << \"Hello, world!\\n\";"},
            {num: 11, text: "}"}
        ]})
});

test('get_tagged_regions() rejects spurious close tag', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./unmatched_close_tag_1', empty_dir_name],
              extensions: impl.default_extensions})
    const call = () => impl.get_tagged_regions(all_sources)
    assert.throws(call, /error: unmatched_close_tag_1\/foo.cpp:3: Unexpected '\/\/ ]' close-tag comment that does not match any previous open-tag comment./)
});

test('get_tagged_regions() rejects duplicate close tag', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./unmatched_close_tag_2', empty_dir_name],
              extensions: impl.default_extensions})
    const call = () => impl.get_tagged_regions(all_sources)
    assert.throws(call, /error: unmatched_close_tag_2\/foo.cpp:9: Unexpected '\/\/ ]' close-tag comment that does not match any previous open-tag comment./)
});

test('get_tagged_regions() rejects unclosed tags', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./unclosed_tag', empty_dir_name],
              extensions: impl.default_extensions})
    const call = () => impl.get_tagged_regions(all_sources)
    assert.throws(call, /error: unclosed_tag\/foo.cpp: Tag\(s\) 'some_tag' left open at end of file./)
});

test('get_tagged_regions() rejects the use of the same tag in multiple files', (t) => {
    const all_sources =
          impl.get_source_files({
              roots: ['./reused_tag', empty_dir_name],
              extensions: impl.default_extensions})
    const call = () => impl.get_tagged_regions(all_sources)
    assert.throws(call, /error: Source file tag 'the_same_tag' repeated in reused_tag\/foo.cpp.  'the_same_tag' was first used in reused_tag\/bar.cpp./)
});
