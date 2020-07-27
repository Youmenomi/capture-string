import { capture, captureInclude, cwc } from '../src';

export const text = `<body>
<!-- libs-begin -->
<script type="text/javascript" src="A.js"></script>
<script type="text/javascript" src="B.js"></script>
<script type="text/javascript" src="C.js"></script>

<!-- middle -->
<!-- anchor1 -->
<!-- libs-end -->

<!-- libs-begin -->
<script type="text/javascript" src="D.js"></script>
<script type="text/javascript" src="E.js"></script>
<script type="text/javascript" src="F.js"></script>

<!-- middle -->
<!-- anchor2 -->
<!-- libs-end -->

<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
<body>
`;

export const tests = {
  c: [
    {
      name: 'test head, tail',
      process: () => {
        return capture(text, '<!--', '-->');
      },
      result: [
        ' libs-begin ',
        ' middle ',
        ' anchor1 ',
        ' libs-end ',
        ' libs-begin ',
        ' middle ',
        ' anchor2 ',
        ' libs-end ',
      ],
    },
    {
      name: 'test head, tail, checkfn',
      process: () => {
        return capture(text, '<!--', '-->', (s) => {
          return s.trim() === 'libs-begin';
        });
      },
      result: [' libs-begin ', ' libs-begin '],
    },
    {
      name: 'test option with checkfn',
      process: () => {
        return capture(text, {
          head: '<!--',
          tail: '-->',
          checkfn: (s) => {
            return s.trim() === 'libs-end';
          },
        });
      },
      result: [' libs-end ', ' libs-end '],
    },
    {
      name: 'test option with checkfn, verbose',
      process: () => {
        return capture(text, {
          head: '<!--',
          tail: '-->',
          checkfn: (s) => {
            return s.trim() === 'middle';
          },
          verbose: true,
        });
      },
      result: [
        {
          capture: ' middle ',
          includeCapture: '<!-- middle -->',
          left: 188,
          right: 196,
          includeLeft: 184,
          includeRight: 199,
        },
        {
          capture: ' middle ',
          includeCapture: '<!-- middle -->',
          left: 417,
          right: 425,
          includeLeft: 413,
          includeRight: 428,
        },
      ],
    },
    {
      name: 'test captureInclude',
      process: () => {
        return captureInclude(text, '<!--', '-->');
      },
      result: [
        '<!-- libs-begin -->',
        '<!-- middle -->',
        '<!-- anchor1 -->',
        '<!-- libs-end -->',
        '<!-- libs-begin -->',
        '<!-- middle -->',
        '<!-- anchor2 -->',
        '<!-- libs-end -->',
      ],
    },
    {
      name: 'test exception',
      process: () => {
        return capture(text, {
          head: '<!--',
          tail: '-->>',
          checkfn: (s) => {
            return s.trim() === 'libs-begin';
          },
        });
      },
      result: [],
    },
  ],
  cwc: [
    {
      name: 'test headOption, tailOption',
      process: () => {
        return cwc(
          text,
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-begin';
            },
          },
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-end';
            },
          }
        );
      },
      result: [
        '\n' +
          '<script type="text/javascript" src="A.js"></script>\n' +
          '<script type="text/javascript" src="B.js"></script>\n' +
          '<script type="text/javascript" src="C.js"></script>\n' +
          '\n' +
          '<!-- middle -->\n' +
          '<!-- anchor1 -->\n',
        '\n' +
          '<script type="text/javascript" src="D.js"></script>\n' +
          '<script type="text/javascript" src="E.js"></script>\n' +
          '<script type="text/javascript" src="F.js"></script>\n' +
          '\n' +
          '<!-- middle -->\n' +
          '<!-- anchor2 -->\n',
      ],
    },
    {
      name: 'test checkfn return false',
      process: () => {
        return cwc(
          text,
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-begin';
            },
          },
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-end';
            },
          },
          () => false,
          true
        );
      },
      result: [],
    },
    {
      name: 'test include',
      process: () => {
        return cwc(
          text,
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-begin';
            },
          },
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-end';
            },
          },
          undefined,
          true
        );
      },
      result: [
        '<!-- libs-begin -->\n' +
          '<script type="text/javascript" src="A.js"></script>\n' +
          '<script type="text/javascript" src="B.js"></script>\n' +
          '<script type="text/javascript" src="C.js"></script>\n' +
          '\n' +
          '<!-- middle -->\n' +
          '<!-- anchor1 -->\n' +
          '<!-- libs-end -->',
        '<!-- libs-begin -->\n' +
          '<script type="text/javascript" src="D.js"></script>\n' +
          '<script type="text/javascript" src="E.js"></script>\n' +
          '<script type="text/javascript" src="F.js"></script>\n' +
          '\n' +
          '<!-- middle -->\n' +
          '<!-- anchor2 -->\n' +
          '<!-- libs-end -->',
      ],
    },
    {
      name: 'test verbose',
      process: () => {
        return cwc(
          text,
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-begin';
            },
          },
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'libs-end';
            },
          },
          undefined,
          false,
          true
        );
      },
      result: [
        {
          capture:
            '\n' +
            '<script type="text/javascript" src="A.js"></script>\n' +
            '<script type="text/javascript" src="B.js"></script>\n' +
            '<script type="text/javascript" src="C.js"></script>\n' +
            '\n' +
            '<!-- middle -->\n' +
            '<!-- anchor1 -->\n',
          includeCapture:
            '<!-- libs-begin -->\n' +
            '<script type="text/javascript" src="A.js"></script>\n' +
            '<script type="text/javascript" src="B.js"></script>\n' +
            '<script type="text/javascript" src="C.js"></script>\n' +
            '\n' +
            '<!-- middle -->\n' +
            '<!-- anchor1 -->\n' +
            '<!-- libs-end -->',
          left: 26,
          right: 217,
          includeLeft: 7,
          includeRight: 234,
        },
        {
          capture:
            '\n' +
            '<script type="text/javascript" src="D.js"></script>\n' +
            '<script type="text/javascript" src="E.js"></script>\n' +
            '<script type="text/javascript" src="F.js"></script>\n' +
            '\n' +
            '<!-- middle -->\n' +
            '<!-- anchor2 -->\n',
          includeCapture:
            '<!-- libs-begin -->\n' +
            '<script type="text/javascript" src="D.js"></script>\n' +
            '<script type="text/javascript" src="E.js"></script>\n' +
            '<script type="text/javascript" src="F.js"></script>\n' +
            '\n' +
            '<!-- middle -->\n' +
            '<!-- anchor2 -->\n' +
            '<!-- libs-end -->',
          left: 255,
          right: 446,
          includeLeft: 236,
          includeRight: 463,
        },
      ],
    },
    {
      name: 'test exception',
      process: () => {
        return cwc(
          text,
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'anchor2';
            },
          },
          {
            head: '<!--',
            tail: '-->',
            checkfn: (s) => {
              return s.trim() === 'anchor1';
            },
          }
        );
      },
      result: [],
    },
  ],
};
