customElements.define("mark-down", class extends HTMLElement {
  connectedCallback() {
    const md = (
      str, // input string to convert
      cnt = 1, id, code = {}) => {
      // Extract ``` code blocks and replace with placeholders
      str = str.replace(/```([\s\S]+?)```/g, (_, block) => {
        code[(id = "c" + cnt++)] =
          "<pre><code>" +
        block
          .split("\n")
          .map((l) => l.trim())
            .filter((l) => !!l) + // trim whitespace and empty lines
          "</code></pre>";
        return id; // return placeholder
      });
      // Process Markdown tags
      str = Object.keys(code).reduce(
        (html, id) => html.replace(id, code[id]),
        [
          [/#{4}\s?([^\n]+)/g, "<h4>$1</h4>"],
          [/#{3}\s?([^\n]+)/g, "<h3>$1</h3>"],
          [/#{2}\s?([^\n]+)/g, "<h2>$1</h2>"],
          [/#{1}\s?([^\n]+)/g, "<h1>$1</h1>"],
          [/\*\*([^*]+)\*\*/g, "<b>$1</b>"], // bold with **
          [/__([^_]+)__/g, "<b>$1</b>"], // bold with __
          [/\*\s?([^\n]+)\*/g, "<i>$1</i>"], // italics with *
          [/_([^_`]+)_/g, "<i>$1</i>"], // italics with _
          [/([^\n]+\n?)/g, "<p>$1</p>"], // paragraphs from newline
          [/([^\n]+)(\+|\*)([^\n]+)/g, "<ul><li>$3</li></ul>"], // UL Lists with + or *
          [
            /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
            '<img src="$2" alt="$1" title="$3">',
          ], // IMGs
          [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'], // A HREF Links
        ].reduce((html, [rgx, tmpl]) => html.replace(rgx, tmpl), str)
      );
      return str; // return final HTML
    };
    // Wait for lightDOM/innerHTML to be parsed
    setTimeout(() => (this.innerHTML = md(this.innerHTML)));
  }
});
