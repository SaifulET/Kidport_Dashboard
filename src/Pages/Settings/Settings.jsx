import React from 'react';
import ParentSettings from './ParentSettings';
import DaycareSettings from './DaycareSettings';
import { isParentRole } from '../../utils/roles';

export default function SettingsPage() {
  if (isParentRole()) {
    return <ParentSettings />;
  }

  return <DaycareSettings />;
}

