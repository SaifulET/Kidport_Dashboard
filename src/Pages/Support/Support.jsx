import React from 'react';
import ParentSupport from './ParentSupport';
import DaycareSupport from './DaycareSupport';
import { isParentRole } from '../../utils/roles';

export default function SupportPage() {
  if (isParentRole()) {
    return <ParentSupport />;
  }

  return <DaycareSupport />;
}
