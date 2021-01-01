/**
 * @file optics.ts
 * @author Joseph R Miles
 * @summary Defines generic, type-safe optics and optic composition.
 */

import { compose } from "./compose";
import Maybe from "./maybe";

/// A lens focuses from a (W)hole type to a (P)art type of the whole.
export type Lens<W, P> =
{
    get: (w: W) => P,
    set: (w: W, p: P) => W,
};

/// A prism focuses from a (W)hole type to a (P)art type of the whole, where the
/// part may or may not exist.
export type Prism<W, P> =
{
    get: (w: W) => Maybe<P>,
    set: (w: W, p: P) => W,
};

export type Optic<W, P> = (Lens<W, P> | Prism<W, P>);

type FirstOpticParameterType<T extends Optic<any, any>[]> =
    T[0] extends Optic<infer W, any>
    ? W
    : never;

type LastOpticReturnType<T extends Optic<any, any>[]> =
    T extends [...rest: any, last: Optic<any, infer P>]
    ? P 
    : never;

export const composeOptics =
    <L extends Optic<any, any>[]>(...optics: L):
        Optic<FirstOpticParameterType<L>, LastOpticReturnType<L>> =>
    ({
        get: (w) => compose(...optics.map((l) => l.get))(w),
        set: (p, w) => 
            optics
            .map(
                (optic, i, optics) =>
                ({
                    ...optic,
                    get: (w: any) =>
                        compose(...optics.slice(0, i).map((l) => l.get))(w),
                }))
            .reduceRight(
                (acc: any, cur: any) => cur.set(acc, cur.get(w)),
                p),
    });