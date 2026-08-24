import React from 'react';
import ParentObservations from './ParentObservations';
import DaycareObservations from './DaycareObservations';
import { isParentRole } from '../../utils/roles';

export default function ObservationsPage() {
  if (isParentRole()) {
    return <ParentObservations />;
  }

  return <DaycareObservations />;
}

