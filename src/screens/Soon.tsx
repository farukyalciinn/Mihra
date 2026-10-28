import React from 'react';
import { Panel, T } from '../components/ui';
export default function Soon({ name }: { name: string }) {
  return <Panel dark><T light bold size={19}>{name}</T><T light>Bu sekme sıradaki aşamada React Native’e taşınacak.</T></Panel>;
}
