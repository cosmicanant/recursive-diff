export as namespace rdiff;

export = rdiff

declare namespace rdiff {
  export type rdiffResult = {
    op: 'add';
    path: Array<string | number>;
    val: any;
  } | {
    op: 'update';
    path: Array<string | number>;
    val: any;
  } | {
    op: 'delete';
    path: Array<string | number>;
    val: any;
  }
  export function getDiff(A: any, B: any): rdiffResult[];
  export function applyDiff(A: any, B: rdiffResult[], C?: Function): any;
}