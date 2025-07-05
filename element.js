customElements.define("mark-down", class extends HTMLElement {
  connectedCallback(
    // convert function declared as parameter to save const declaration
    convert2markdown = (
      html, // input string to convert
      // declare variables as parameter to save let declaration
      cnt = 1,
      id,
      code = {}
    ) => (
  // PARAMETER 1st
      // Extract ``` code blocks and replace with placeholders
      html = html.replace(/```([\s\S]+?)```/g, (_, block) => (
        code[id = "c" + cnt++] =
        "<pre><code>" +
        block
          .split("\n")
          .map(l => l.trim())
          .filter(l => !!l) // trim whitespace and empty lines
          .join("") +
        "</code></pre>",
        id // return placeholder
      )),
      // return PARAMETER 2nd
      // Process Markdown tags
      Object.keys(code).reduce(
        (html, id) => html.replace(id, code[id]),
        [
          // ignoring H5 and H6
          [/#{4}\s?([^\n]+)/g, "<h4>$1</h4>"],
          [/#{3}\s?([^\n]+)/g, "<h3>$1</h3>"],
          [/#{2}\s?([^\n]+)/g, "<h2>$1</h2>"],
          [/#{1}\s?([^\n]+)/g, "<h1>$1</h1>"],
          // BOLD
          [/\*\*([^*]+)\*\*/g, "<b>$1</b>"], // bold with **
          [/__([^_]+)__/g, "<b>$1</b>"], // bold with __
          // ITALICS
          [/\*\s?([^\n]+)\*/g, "<i>$1</i>"], // italics with *
          [/_([^_`]+)_/g, "<i>$1</i>"], // italics with _
          // newline create paragraphs
          [/([^\n]+\n?)/g, "<p>$1</p>"], // paragraphs from newline
          // UL lists
          [/([^\n]+)(\+|\*)([^\n]+)/g, "<ul><li>$3</li></ul>"], // UL Lists with + or *
          // IMGs
          // [/!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,'<img src="$2" alt="$1" title="$3">'],
          // ------------------------------------------------------------------
          // [/!\[\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, src, title) => `<img src="${src}"${title ? ` title="${title}"` : ""}>`],
          // ------------------------------------------------------------------
          [/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) => `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ""}>`],
          // ------------------------------------------------------------------
          [/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`], // A HREF Links
          // ------------------------------------------------------------------
        ].reduce((html, [rgx, tmpl]) => html.replace(rgx, tmpl), html)
      ) // reduce
    ) // convert
  ) {
    // Wait for lightDOM/innerHTML to be parsed
    setTimeout(() => this.innerHTML = convert2markdown(this.innerHTML));
  }
});
