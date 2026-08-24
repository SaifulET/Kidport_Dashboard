import React from 'react';
import ParentAIMonitoring from './ParentAIMonitoring';
import DaycareAIMonitoring from './DaycareAIMonitoring';
import { isParentRole } from '../../utils/roles';

export default function AIMonitoringPage() {
  if (isParentRole()) {
    return <ParentAIMonitoring />;
  }

  return <DaycareAIMonitoring />;
}

