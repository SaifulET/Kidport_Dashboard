import React from 'react';
import ParentChildren from './ParentChildren';
import DaycareChildren from './DaycareChildren';
import { isParentRole } from '../../utils/roles';

export default function ChildrenPage() {
  if (isParentRole()) {
    return <ParentChildren />;
  }

  return <DaycareChildren />;
}

