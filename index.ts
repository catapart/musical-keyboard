import { MusicalKeyboard } from "./component/musical-keyboard.component";

export const MusicalKeyboardComponent = MusicalKeyboard.KeyboardController;
MusicalKeyboard.registerComponent();

// export class MusicalKeyboardComponent extends HTMLElement
// {
//     constructor()
//     {
//         super();
//         this.innerHTML = "<div>Hello world!</div>"
//     }
// }

// customElements.define('musical-keyboard', MusicalKeyboardComponent);