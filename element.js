customElements.define("mark-down", class extends HTMLElement {
  connectedCallback(
    markdown = str => {
      // ===== Extract ``` code blocks and replace with placeholders
      let counter = 0, id, codes = {};
      str = str.replace(/```([\s\S]+?)```/g, (match, code) => {
        codes[id = "precode" + counter++] = "<pre><code>" +
          // ------------------------------------- trim whitespace and empty lines from codeline
          code.split("\n").map(l => l.trim()).filter(Boolean).join("\n") +
          "</code></pre>";
        // ------------------------------------- return placeholder to input str
        return id
      });
      return Object.keys(codes).reduce(
        (html, id) => html.replace(id, codes[id]),
        // --------------------------------------- process other Markdown tags
        [[/#{6}\s?([^\n]+)/g, "<h6>$1</h6>"], // headers from # to ######
        [/#{5}\s?([^\n]+)/g, "<h5>$1</h5>"],
        [/#{4}\s?([^\n]+)/g, "<h4>$1</h4>"],
        [/#{3}\s?([^\n]+)/g, "<h3>$1</h3>"],
        [/#{2}\s?([^\n]+)/g, "<h2>$1</h2>"],
        [/#{1}\s?([^\n]+)/g, "<h1>$1</h1>"],
        // --------------------------------------- bold with double ** or __
        [/\*\*\s?([^\n]+)\*\*/g, "<b>$1</b>"], // /\*\*(.+?)\*\*/g or /__(.+?)__/g
        [/__([^_]+)__/g, "<b>$1</b>"],
        // --------------------------------------- italics with single * or _
        [/\*\s?([^\n]+)\*/g, "<i>$1</i>"], ///\*(.+?)\*/g or /_(.+?)_/g
        [/_([^_`]+)_/g, "<i>$1</i>"], //
        [/```([\s\S]+?)```/g, '<code><pre>$1</pre></code>'],
        // --------------------------------------- paragraphs from newline
        [/([^\n]+\n?)/g, "<p>$1</p>"],
        // --------------------------------------- UL Lists with + and *
        [/([^\n]+)(\+)([^\n]+)/g, "<ul><li>$3</li></ul>"], // with +
        [/([^\n]+)(\*)([^\n]+)/g, "<ul><li>$3</li></ul>"],// with *
        // --------------------------------------- IMGs
        [/!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g, '<img src="$2" alt="$1" title="$3">'],
        // --------------------------------------- A HREF Links
        [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'], // /\[(.+?)\]\((.+?)\)/g
          // --------------------------------------- Process regexs, built HTML
        ].reduce((html, rgx) => html.replace(...rgx), str)
      )
    }
  ) {
    setTimeout(() => this.innerHTML = markdown(this.innerHTML))
  }
})
