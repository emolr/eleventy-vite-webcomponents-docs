import { customElement } from "lit/decorators.js";
import { LitElement, html, css } from "lit";

@customElement("my-component")
export class MyComponent extends LitElement {
    static styles = css`
        p {
            color: red;
        }
    `;

    render() {
        return html`<p>Hello, World! said my-component.</p>`;
    }
}