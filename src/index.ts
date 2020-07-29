import defaults from 'defaults';

function defCheckfn() {
  return true;
}
const defOption = {
  checkfn: defCheckfn,
  include: false,
  detail: false,
};

export type CheckfnType = (s: string) => boolean;

export type CaptureOption = {
  head: string;
  tail: string;
  checkfn?: CheckfnType;
  include?: boolean;
  detail?: boolean;
};

export type CaptureDetails = {
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
  option: CaptureOption & { detail: true }
): CaptureDetails[];
export function capture(text: string, option: CaptureOption): string[];
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
  const { head, tail, checkfn, include, detail } = opt;
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
      if (detail) {
        const detail: CaptureDetails = {
          capture: c,
          includeCapture: head + c + tail,
          left,
          right,
          includeLeft,
          includeRight,
        };
        r.push(detail);
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

export function captureDetail(
  text: string,
  head: string,
  tail: string,
  checkfn?: CheckfnType
) {
  return capture(text, { head, tail, checkfn, detail: true });
}

export function cwc(
  text: string,
  headDetails: CaptureDetails[],
  tailDetails: CaptureDetails[],
  checkfn: CheckfnType = defCheckfn,
  include: boolean = false,
  detail: boolean = false
) {
  const r = [];
  let x = 0;
  let y = 0;
  let head = headDetails[x];
  let tail = tailDetails[y];
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
        tail = tailDetails[++y];
      }
    }

    if (c) {
      if (checkfn(c)) {
        if (detail) {
          const info: CaptureDetails = {
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
      head = headDetails[++x];
      tail = tailDetails[++y];
    } else {
      break;
    }
  }

  return r;
}

export function captureDelete(
  text: string,
  head: string,
  tail: string,
  checkfn?: CheckfnType
): string;
export function captureDelete(text: string, details: CaptureDetails[]): string;
export function captureDelete(
  text: string,
  headOrDetails: string | CaptureDetails[],
  tail?: string,
  checkfn?: CheckfnType
) {
  let details: CaptureDetails[];
  if (typeof headOrDetails === 'string') {
    details = capture(text, {
      head: headOrDetails,
      tail: tail!,
      checkfn,
      include: true,
      detail: true,
    });
  } else {
    details = headOrDetails;
  }

  let r = '';
  let d = 0;
  details.forEach((detail) => {
    const { includeLeft, includeRight } = detail;
    r += text.slice(0, includeLeft - d);
    text = text.slice(includeRight - d, -1);
    d = includeRight;
  });
  r += text;
  return r;
}
