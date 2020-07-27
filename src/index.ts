import defaults from 'defaults';

function defCheckfn() {
  return true;
}
const defOption = {
  checkfn: defCheckfn,
  include: false,
  verbose: false,
};

export type CheckfnType = (s: string) => boolean;

export type CaptureOption = {
  head: string;
  tail: string;
  checkfn?: CheckfnType;
  include?: boolean;
  verbose?: boolean;
};

export type CaptureInfo = {
  capture: string;
  includeCapture: string;
  left: number;
  right: number;
  includeLeft: number;
  includeRight: number;
};

export function capture(
  text: string,
  head: string,
  tail: string,
  checkfn?: CheckfnType
): string[];
export function capture(
  text: string,
  option: CaptureOption & { verbose: true }
): CaptureInfo[];
export function capture(
  text: string,
  option: CaptureOption & { verbose?: false }
): string[];
export function capture(
  text: string,
  headOrOption: string | CaptureOption,
  tailOr?: string,
  checkfnOr?: CheckfnType
) {
  let opt: Required<CaptureOption>;
  if (typeof headOrOption === 'string') {
    opt = defaults(
      {
        head: headOrOption,
        tail: tailOr!,
        checkfn: checkfnOr,
      },
      defOption
    );
  } else {
    opt = defaults(headOrOption, defOption);
  }
  const { head, tail, checkfn, include, verbose } = opt;
  const r = [];
  const hLen = head.length;
  let includeLeft = 0;
  while (includeLeft !== -1) {
    includeLeft = text.indexOf(head, includeLeft);
    if (includeLeft === -1) break;
    const left = includeLeft + hLen;
    const right = text.indexOf(tail, left);
    if (right === -1) break;
    const c = text.substring(left, right);
    const includeRight = right + tail.length;
    if (checkfn(c)) {
      if (verbose) {
        const info: CaptureInfo = {
          capture: c,
          includeCapture: head + c + tail,
          left,
          right,
          includeLeft,
          includeRight,
        };
        r.push(info);
      } else {
        r.push(include ? head + c + tail : c);
      }
    }
    includeLeft = includeRight;
  }
  return r;
}

export function captureInclude(
  text: string,
  head: string,
  tail: string,
  checkfn?: CheckfnType
) {
  return capture(text, { head, tail, checkfn, include: true });
}

type CwcOption = {
  head: string;
  tail: string;
  checkfn?: CheckfnType;
};
export function cwc(
  text: string,
  headOption: CwcOption,
  tailOption: CwcOption,
  checkfn: CheckfnType = defCheckfn,
  include: boolean = false,
  verbose: boolean = false
) {
  const r = [];
  const heads = capture(text, {
    head: headOption.head,
    tail: headOption.tail,
    checkfn: headOption.checkfn,
    verbose: true,
  });
  const tails = capture(text, {
    head: tailOption.head,
    tail: tailOption.tail,
    checkfn: tailOption.checkfn,
    verbose: true,
  });

  let x = 0;
  let y = 0;
  let head = heads[x];
  let tail = tails[y];
  while (head !== undefined && tail !== undefined) {
    let left = 0;
    let right = 0;
    let c: string | undefined;
    while (tail !== undefined) {
      left = head.includeRight;
      right = tail.includeLeft;
      if (right > left) {
        c = text.substring(left, right);
        break;
      } else {
        tail = tails[++y];
      }
    }

    if (c) {
      if (checkfn(c)) {
        if (verbose) {
          const info: CaptureInfo = {
            capture: c,
            includeCapture: head.includeCapture + c + tail.includeCapture,
            left,
            right,
            includeLeft: head.includeLeft,
            includeRight: tail.includeRight,
          };
          r.push(info);
        } else {
          r.push(include ? head.includeCapture + c + tail.includeCapture : c);
        }
      }
      head = heads[++x];
      tail = tails[++y];
    } else {
      break;
    }
  }

  return r;
}
