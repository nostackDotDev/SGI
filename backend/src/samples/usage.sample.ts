// import { PERMISSIONS } from "../constants/permissions.constants";
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { requirePermission } from "../middlewares/permissions.middleware";

// app.post(
//   '/items',
//   authMiddleware,
//   requirePermission(PERMISSIONS.CREATE_ITEM),
//   controller
// )

// tenant -> sempre filtrar por tenantId
// prisma.item.findMany({
//   where: {
//     sala: {
//       departamento: {
//         instituicaoId: req.tenantId
//       }
//     }
//   }
// });
