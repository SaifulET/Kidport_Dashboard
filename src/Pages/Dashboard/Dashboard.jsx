import ParentDashboard from './ParentDashboard';
import DaycareDashboard from './DaycareDashboard';
import { isParentRole } from '../../utils/roles';

export default function Dashboard() {
  if (isParentRole()) {
    return <ParentDashboard />;
  }

  return <DaycareDashboard />;
}

