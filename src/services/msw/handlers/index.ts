import { authHandlers } from './auth';
import { dashboardHandlers } from './dashboard';
import { atestadosHandlers } from './atestados';
import { agendaHandlers } from './agenda';
import { patientsHandlers } from './patients';
import { attendancesHandlers } from './attendances';
import { usersHandlers } from './users';
import { examsHandlers } from './exams';
import { auditHandlers } from './audit';
import { feriasHandlers } from './ferias';
import { desviosHandlers } from './desvios';
import { indicadoresHandlers } from './indicadores';
import { cidHandlers } from './cid';

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...atestadosHandlers,
  ...agendaHandlers,
  ...patientsHandlers,
  ...attendancesHandlers,
  ...usersHandlers,
  ...examsHandlers,
  ...auditHandlers,
  ...feriasHandlers,
  ...desviosHandlers,
  ...indicadoresHandlers,
  ...cidHandlers,
];
