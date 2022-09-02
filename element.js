customElements.define(
  "mark-down",
  class extends HTMLElement {
    connectedCallback(e = 0, i = (e) => "<li>" + e + "</li>") {
      setTimeout(
        () =>
          (this.innerHTML = this.innerHTML
            .replace(/\s\s\n/gim, "\n<br>\n")
            .replace(/\n\n/gim, "\n<br>\n")
            .split("\n")
            .map((e) => e.trim())
            .join("\n")
            .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
            .replace(/^### (.*$)/gim, "<h3>$1</h3>")
            .replace(/^## (.*$)/gim, "<h2>$1</h2>")
            .replace(/^# (.*$)/gim, "<h1>$1</h1>")
            .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
            .replace(/\_\_(.*)\_\_/gim, "<b>$1</b>")
            .replace(/\*(.*)\*/gim, "<i>$1</i>")
            .replace(/\_(.*)\_/gim, "<i>$1</i>")
            .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2'>")
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
            .split(/\n\* /)
            .reduce((n, l, r) => {
              if (e && l.includes("\n")) {
                let [n, ...r] = l.split("\n");
                l = [i(n), "</ul>", ...r].join("\n");
                e = 0;
              } else (e || (r && (e = n.push("<ul>")))) && (l = i(l));
              n.push(l);
              return n;
            }, [])
            .join("\n")
            .concat(e ? "</ul>" : "\n"))
      );
    }
  }
);
