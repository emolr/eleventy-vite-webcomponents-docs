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
            console.error('No HTML code block found');
        }

        let jsMatches = newCode.match(jsRegex);
        if (jsMatches && jsMatches.length > 0) {
            this.js = jsMatches[0].replace(/```(javascript|js)|```/g, '').trim();
            this.highlightedJS = highlightJS(this.js);
        } else {
            console.error('No JavaScript code block found');
        }

        if (jsMatches) {
            eval(this.js);
        }
    }

    render() {
        return html`
        <style>
            ${prismjstheme}
        </style>
            <div>
                ${unsafeHTML(this.html)}
            </div>
            <div style="background: black;">
                <pre><code class="language-markup">${unsafeHTML(this.highlightedHTML)}</code></pre>
            </div>
            <div style="background: black;">
                <pre><code class="language-javascript">${unsafeHTML(this.highlightedJS)}</code></pre>
            </div>
        `;
    }
}