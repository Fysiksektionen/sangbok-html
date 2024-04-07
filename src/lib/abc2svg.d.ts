/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'abc2svg'

declare class Abc {
  constructor(callbacks: {
        read_file: (fname: string) => string,
        errmsg: (msg: string, l: number, c: number) => any,
        img_out: (data: string) => any,
    });

  tosvg(in_fname: string | undefined, file: string, bol?: any, eof?: any): void;
}
export default Abc
