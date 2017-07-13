// @flow

import type { Metadata } from '../lib/location';
import type { AnimationKeyframes } from '../animator';

import animator from '../animator';
import deferred from '../lib/deferred';
import buildCircleExpand from './circle-expand';
import buildCircleShrink from './circle-shrink';
import buildFadeout from './fadeout';
import buildMove from './move';
import buildReveal from './reveal';

type AnimationFunc = (element: HTMLElement, options: Object, metadata?: Metadata) => ({
  name: string,
  options: Object,
  from: Object,
  to: { keyframes: AnimationKeyframes } | (toElement: HTMLElement) => { keyframes: AnimationKeyframes },
});

function animate (animationBuilder: AnimationFunc, element: HTMLElement, options: Object, metadata?: Metadata) {
  const animation = animationBuilder(element, options, metadata);
  const defer = deferred();

  const start = animator(element, {
    options,
    animation,
    resolve: defer.resolve,
  });

  return (toElement: HTMLElement) => {
    const animateTo = (typeof animation.to === 'function')
      ? animation.to(toElement)
      : animation.to;

    start(animateTo);

    return defer.promise;
  };
}

export function circleExpand (element: HTMLElement, options: Object, metadata?: Metadata) {
  return animate(buildCircleExpand, element, options, metadata);
}

export function circleShrink (element: HTMLElement, options: Object, metadata?: Metadata) {
  return animate(buildCircleShrink, element, options, metadata);
}

export function fadeout (element: HTMLElement, options: Object, metadata?: Metadata) {
  return animate(buildFadeout, element, options, metadata);
}

export function move (element: HTMLElement, options: Object, metadata?: Metadata) {
  return animate(buildMove, element, options, metadata);
}

export function reveal (element: HTMLElement, options: Object, metadata?: Metadata) {
  return animate(buildReveal, element, options, metadata);
}

export const custom = animate;
