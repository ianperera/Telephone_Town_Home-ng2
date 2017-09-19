import { reduce, filter } from 'lodash';

/**
 * Following are some helper functions that are useful for keeping life immutable.
 */

// Wrapper for Object.assign on an object literal
export function oa(...objs) {
  return Object.assign({}, ...objs);
}

/**
 *  One level deep set a property in an object tree and return new parent
 * object and new target object. ie.
 * state = { // Say this object has reference id 001
 *   1: { // Say this object has reference id 002
 *     thing: 'value'
 *   },
 *   2: { // Say this object has reference id 003
 *     thing: 'other value'
 *   },
 *   3: { // Say this object has reference id 004
 *     thing: 'last value'
 *   }
 * }
 * 
 * ds(state, 1, {thing, 'blah'}) returns:
 * 
 * state = { // Now this object has reference id 005
 *   1: { // Now this object has reference id 006
 *     thing: 'blah'
 *   },
 *   2: { // This object still has reference id 003
 *     thing: 'other value'
 *   },
 *   3: { // This object still has reference id 004
 *     thing: 'last value'
 *   }
 * }
 */
export function ds<T>(state: T, target: number, replacement: {[index: string]: any}): T {
  return oa(state, {[target]: oa(state[target], replacement)});
}
