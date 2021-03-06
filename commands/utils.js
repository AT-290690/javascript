import { editor } from '../main.js';
import {
  consoleElement,
  print,
  compositionContainer,
  canvasContainer,
  alertIcon,
  errorIcon
} from '../extentions/composition.js';

export const State = {
  lastSelection: '',
  topLevel: '',
  activeWindow: null,
  comments: null,
  lastComposition: null,
  isLogged: false,
  canvasHeight: 253,
  isHelpOpen: false,
  sceneHeight: 250,
  height: window.innerHeight - 62
};

export const droneIntel = icon => {
  icon.style.visibility = 'visible';
  setTimeout(() => {
    icon.style.visibility = 'hidden';
  }, 500);
};

// ${
//   params
//     ? params
//         .map(([key, val]) => ':=($' + key + ';' + val + ')')
//         .join(';') + ';'
//     : ''
// }
//cell({ ...std })(`=>()`);

export const resizer = (resizer, mousemove, cursor) => {
  resizer.style.cursor = cursor;
  resizer.mousemove = mousemove;

  resizer.onmousedown = function (e) {
    document.documentElement.addEventListener(
      'mousemove',
      resizer.doDrag,
      false
    );
    document.documentElement.addEventListener(
      'mouseup',
      resizer.stopDrag,
      false
    );
  };

  resizer.doDrag = e => {
    if (e.which != 1) {
      resizer.stopDrag(e);
      return;
    }
    resizer.mousemove(e);
  };

  resizer.stopDrag = e => {
    document.documentElement.removeEventListener(
      'mousemove',
      resizer.doDrag,
      false
    );
    document.documentElement.removeEventListener(
      'mouseup',
      resizer.stopDrag,
      false
    );
  };
};
const lastLineAutoReturn = source => {
  let lastLine = editor.getLine(editor.lineCount() - 1)?.trim();
  if (
    lastLine &&
    !lastLine.includes('return') &&
    !lastLine.includes('const') &&
    !lastLine.includes('let') &&
    !lastLine.includes('var') &&
    !lastLine.includes('class') &&
    !lastLine.includes('function')
  ) {
    source =
      source.substring(0, source.length - lastLine.length) +
      ';return ' +
      lastLine;

    return source;
  }
};
export const exe = (source, params) => {
  try {
    const result = new Function(`${params.topLevel};${source}`)();
    droneIntel(alertIcon);
    return result;
  } catch (err) {
    droneIntel(errorIcon);
    canvasContainer.style.background = 'var(--background-primary)';
    consoleElement.classList.remove('info_line');
    consoleElement.classList.add('error_line');
    consoleElement.value = consoleElement.value.trim() || err + ' ';
  }
};
// const preprocess = source =>
//   source

export const run = () => {
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  consoleElement.value = '';
  const source = editor.getValue();
  const out = exe(source.trim(), { topLevel: State.topLevel });
  if (out !== undefined) print(out);
  return source;
};

// export const fromBase64 = (str, params) => {
//   decode(
//     LZUTF8.decompress(str, {
//       inputEncoding: 'Base64',
//       outputEncoding: 'String'
//     }).trim(),
//     source => {
//       exe(source, params);
//     }
//   );
// };
// export const fromCompressed = (str, params) => {
//   decode(str, source => {
//     exe(source, params);
//   });
// };
// export const fromCode = (str, params) => {
//   decode(str, source => {
//     exe(source, params);
//   });
// };

export const newComp = () => {
  const comp = document.createElement('div');
  comp.classList.add('composition');
  compositionContainer.appendChild(comp);
  return comp;
};
