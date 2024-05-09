import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup'; // For HTML highlighting
import 'prismjs/components/prism-javascript'; // For JavaScript highlighting
import prismjstheme from 'prismjs/themes/prism-okaidia.css?inline'; // for Okaidia theme

function highlightHTML(htmlString) {
    return Prism.highlight(htmlString, Prism.languages.markup, 'markup');
}

function highlightJS(jsString) {
    return Prism.highlight(jsString, Prism.languages.javascript, 'javascript');
}

function unhighlightHTML(highlightedHTML) {
    // Parse the highlighted HTML string into a DOM tree
    let parser = new DOMParser();
    let doc = parser.parseFromString(highlightedHTML, 'text/html');

    // Find all span elements
    let spans = doc.querySelectorAll('span');

    // Replace each span element with its inner text
    spans.forEach(span => {
        let textNode = doc.createTextNode(span.innerText);
        span.parentNode?.replaceChild(textNode, span);
    });

    // Serialize the DOM tree back into an HTML string
    let unhighlightedHTML = new XMLSerializer().serializeToString(doc.body);

    // Remove the <body> and </body> tags added by XMLSerializer
    unhighlightedHTML = unhighlightedHTML.replace(/<body>|<\/body>/g, '');

    // Remove the xmlns attribute added by XMLSerializer
    unhighlightedHTML = unhighlightedHTML.replace(/<body xmlns="http:\/\/www.w3.org\/1999\/xhtml">/g, '');

    // Decode HTML entities
    unhighlightedHTML = unhighlightedHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    return unhighlightedHTML;
}

function unhighlightJS(highlightedJS) {
    // Parse the highlighted JS string into a DOM tree
    let parser = new DOMParser();
    let doc = parser.parseFromString(highlightedJS, 'text/html');

    // Find all span elements
    let spans = doc.querySelectorAll('span');

    // Replace each span element with its inner text
    spans.forEach(span => {
        let textNode = doc.createTextNode(span.innerText);
        span.parentNode?.replaceChild(textNode, span);
    });

    // Serialize the DOM tree back into an HTML string
    let unhighlightedJS = new XMLSerializer().serializeToString(doc.body);

    // Remove the <body> and </body> tags added by XMLSerializer
    unhighlightedJS = unhighlightedJS.replace(/<body>|<\/body>/g, '');

    // Remove the xmlns attribute added by XMLSerializer
    unhighlightedJS = unhighlightedJS.replace(/<body xmlns="http:\/\/www.w3.org\/1999\/xhtml">/g, '');

    // Decode HTML entities
    unhighlightedJS = unhighlightedJS.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    return unhighlightedJS;
}

const htmlRegex = /```html([\s\S]*?)```/g;
const jsRegex = /```(javascript|js)([\s\S]*?)```/g;


@customElement("code-example")
export class MyElement extends LitElement {
    static styles = css`
        pre {
            padding: 1em;
            max-width: 100%;
            max-height: 500px;
            overflow: auto;
        }
    `;

    @state()
    html: string = "";

    @state()
    highlightedHTML: string = "";

    @state()
    js: string = "";

    @state()
    highlightedJS: string = "";

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.updateCode(this.innerHTML);
    }

    update(changedProperties) {
        super.update(changedProperties);
        if (changedProperties.has('innerHTML')) {
            this.updateCode(this.innerHTML);
        }
    }

    updateCode(newCode: string) {
        let htmlMatches = newCode.match(htmlRegex);
        if (htmlMatches && htmlMatches.length > 0) {
            this.html = htmlMatches[0].replace(/```html|```/g, '').trim();
            this.highlightedHTML = highlightHTML(this.html);
        } else {
            const code = this.querySelector('.language-html');
            this.html = unhighlightHTML(code?.innerHTML);
            this.highlightedHTML = highlightHTML(this.html);
            
        }

        let jsMatches = newCode.match(jsRegex);
        if (jsMatches && jsMatches.length > 0) {
            this.js = jsMatches[0].replace(/```(javascript|js)|```/g, '').trim()
            this.highlightedJS = highlightJS(this.js);
        } else {
            const code = this.querySelector('.language-js');
            this.js = unhighlightJS(code?.innerHTML)
            this.highlightedJS = highlightJS(this.js);
            
        }

        if (this.html) {
            const el = document.createElement('div');
            el.innerHTML = this.html;
            el.slot = 'example';
            this.appendChild(el);
        }

        if (this.js) {
            let script = document.createElement('script');
            script.textContent = this.js;
            this.appendChild(script);
        }
    }

    render() {
        return html`
        <style>
            ${prismjstheme}
        </style>
            <slot name="example"></slot>
            <div style="background: black;">
                <pre><code class="language-markup">${unsafeHTML(this.highlightedHTML)}</code></pre>
            </div>
            <div style="background: black;">
                <pre><code class="language-javascript">${unsafeHTML(this.highlightedJS)}</code></pre>
            </div>
        `;
    }
}