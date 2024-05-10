import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {styleMap} from 'lit-html/directives/style-map.js';

function unhighlightCode(highlightedCode: string): string {
    // Parse the highlighted code string into a DOM tree
    let parser = new DOMParser();
    let doc = parser.parseFromString(highlightedCode, 'text/html');

    // Find all span elements
    let spans = doc.querySelectorAll('span');

    // Replace each span element with its inner text
    spans.forEach(span => {
        let textNode = doc.createTextNode(span.innerText);
        span.parentNode?.replaceChild(textNode, span);
    });

    // Serialize the DOM tree back into an HTML string
    let unhighlightedCode = new XMLSerializer().serializeToString(doc.body);

    // Remove the <body> and </body> tags added by XMLSerializer
    unhighlightedCode = unhighlightedCode.replace(/<body>|<\/body>/g, '');

    // Remove the xmlns attribute added by XMLSerializer
    unhighlightedCode = unhighlightedCode.replace(/<body xmlns="http:\/\/www.w3.org\/1999\/xhtml">/g, '');

    // Decode HTML entities
    unhighlightedCode = unhighlightedCode.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    return unhighlightedCode;
}

@customElement("code-example")
export class MyElement extends LitElement {
    @property({ attribute: 'min-height' })
    exampleHeight: string = "0";

    connectedCallback(): void {
        super.connectedCallback();

        const html = this.querySelector('code.language-html');
        
        if (html) {
            const rawHTML = unhighlightCode(html?.innerHTML);
            const el = document.createElement('div');
            el.innerHTML = rawHTML;
            el.slot = 'example';
            this.appendChild(el);
        }

        const js = this.querySelector('code.language-js');
        
        if (js) {
            const rawJS = unhighlightCode(js?.innerHTML)
            let script = document.createElement('script');
            script.textContent = rawJS;
            this.appendChild(script);
        }
    }

    render() {
        return html`
            <div style=${styleMap({
                minHeight: this.exampleHeight,
            })}>
                <slot name="example"></slot>
            </div>
            <slot></slot>
        `;
    }
}