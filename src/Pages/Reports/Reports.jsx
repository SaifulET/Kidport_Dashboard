import React from 'react';
import ParentReports from './ParentReports';
import DaycareReports from './DaycareReports';
import { isParentRole } from '../../utils/roles';

export default function ReportsPage() {
  if (isParentRole()) {
    return <ParentReports />;
  }

  return <DaycareReports />;
}

