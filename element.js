customElements.define(
  "mark-down",
  class extends HTMLElement {
    connectedCallback(iscode = false) {
      setTimeout(
        () =>
          (this.innerHTML = [
            // header rules
            [/#{6}\s?([^\n]+)/g, "<h6>$1</h6>"],
            [/#{5}\s?([^\n]+)/g, "<h5>$1</h5>"],
            [/#{4}\s?([^\n]+)/g, "<h4>$1</h4>"],
            [/#{3}\s?([^\n]+)/g, "<h3>$1</h3>"],
            [/#{2}\s?([^\n]+)/g, "<h2>$1</h2>"],
            [/#{1}\s?([^\n]+)/g, "<h1>$1</h1>"],
            // bold with double ** or __
            [/\*\*\s?([^\n]+)\*\*/g, "<b>$1</b>"],
            [/__([^_]+)__/g, "<b>$1</b>"],
            // italics with single * or _
            [/\*\s?([^\n]+)\*/g, "<i>$1</i>"],
            [/_([^_`]+)_/g, "<i>$1</i>"],
            // paragraphs from newline
            [/([^\n]+\n?)/g, "<p>$1</p>"],
            // links
            [/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'],
            // highlights with ` ticks
            //! this does not encode `foo` and `bar`
            // [
            //   /(`)(\s?[^\n,]+\s?)(`)/g,
            //   '<a style="background:grey;color:black;text-decoration:none;border-radius:3px;padding:0 2px;">$2</a>',
            // ],
            //Lists +
            [/([^\n]+)(\+)([^\n]+)/g, "<ul><li>$3</li></ul>"],
            //Lists *
            [/([^\n]+)(\*)([^\n]+)/g, "<ul><li>$3</li></ul>"],
            //Image
            [
              /!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,
              '<img src="$2" alt="$1" title="$3">',
            ],
          ]
            .reduce(
              (html, rule) => (html = html.replace(...rule) || html),
              this.innerHTML
            )
            // process ``` backticks
            // .split("```")
            // .map((html, idx) => {
            //   if (i % 2) {
            //   }
            // }).join("")
            // process backticks
            .split("") //split by character
            .reduce((txt, chr) => {
              // fix backtick to <code> tag
              if (chr == "`") {
                iscode = !iscode;
                if (iscode) return (txt += "<code>");
                else return (txt += "</code>");
              } else return (txt += chr);
            }, ""))
      );
    }
  }
);
