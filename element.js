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
          // -------------------------------------------------------- H1-4
          // ignoring H5 and H6
          [/#{4}\s?([^\n]+)/g, "<h4>$1</h4>"],
          [/#{3}\s?([^\n]+)/g, "<h3>$1</h3>"],
          [/#{2}\s?([^\n]+)/g, "<h2>$1</h2>"],
          [/#{1}\s?([^\n]+)/g, "<h1>$1</h1>"],
          // -------------------------------------------------------- BOLD
          [/\*\*([^*]+)\*\*/g, "<b>$1</b>"], // bold with **
          [/__([^_]+)__/g, "<b>$1</b>"], // bold with __
          // -------------------------------------------------------- ITALICS
          [/\*\s?([^\n]+)\*/g, "<i>$1</i>"], // italics with *
          [/_([^_`]+)_/g, "<i>$1</i>"], // italics with _
          // -------------------------------------------------------- newline create paragraphs
          // [/([^\n]+\n?)/g, "<p>$1</p>"], // paragraphs from newline
          [/\.\-/g, ".</p></p>"], // replace ".-" with paragraph end
          // -------------------------------------------------------- UL lists
          [/---+/g, "<hr>"],
          // -------------------------------------------------------- UL lists
          [/([^\n]+)(\+|\*)([^\n]+)/g, "<ul><li>$3</li></ul>"], // UL Lists with + or *
          // --------------------------------------------------------
          // IMGs
          // [/!\[([^\]]+)\]\(([^)]+)\s"([^")]+)"\)/g,'<img src="$2" alt="$1" title="$3">'],
          // --------------------------------------------------------
          // [/!\[\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, src, title) => `<img src="${src}"${title ? ` title="${title}"` : ""}>`],
          [/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_, alt, src, title) => `<img src="${src}" alt="${alt}"${title ? ` title="${title}"` : ""}>`],
          // --------------------------------------------------------
          [/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2">$1</a>`], // A HREF Links
          // --------------------------------------------------------
        ].reduce((html, [rgx, tmpl]) => html.replace(rgx, tmpl), html)
      ) // reduce
    ) // convert
  ) {
    // Wait for lightDOM/innerHTML to be parsed
    setTimeout(() => this.innerHTML = convert2markdown(this.innerHTML));
  } // connectedCallback

  // AI failure:
  // convert2markdown(markdown) {
  //   let html = markdown;
  //   // Headers
  //   html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  //   html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  //   html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  //   html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  //   // Bold
  //   html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  //   html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  //   // Italic
  //   html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  //   html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  //   // Code blocks
  //   html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  //   // Inline code
  //   html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  //   // Links
  //   html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  //   // Images
  //   html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
  //   // Blockquotes
  //   html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
  //   // Unordered lists
  //   html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
  //   html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  //   html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  //   // Ordered lists
  //   html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  //   // Horizontal rules
  //   html = html.replace(/^---$/gm, '<hr>');
  //   html = html.replace(/^\*\*\*$/gm, '<hr>');
  //   // Paragraphs
  //   html = html.replace(/\n\s*\n/g, '</p><p>');
  //   html = '<p>' + html + '</p>';
  //   // Clean up empty paragraphs
  //   html = html.replace(/<p><\/p>/g, '');
  //   html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  //   html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  //   html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  //   html = html.replace(/<p>(<blockquote>)/g, '$1');
  //   html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  //   html = html.replace(/<p>(<ul>)/g, '$1');
  //   html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  //   html = html.replace(/<p>(<pre>)/g, '$1');
  //   html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  //   return html;
  // }

}); // customElements.define
