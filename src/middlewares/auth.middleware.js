import { verifyToken } from "../libs/jwtUtil.js";

export const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) return res.status(401).json({ message: "No has iniciado Sesión" });

      const token = authHeader.split(" ")[1];

      const validToken = await verifyToken(token);

      if (!validToken)
        return res.status(401).json({ message: "Sesión Caducada" });

      if (roles.length > 0) {
        const userRoles = validToken.roles;
        let validRoles = 0;

        roles.map((role) => {
          userRoles.map((userRole) => {
            if (role === userRole.name) {
              validRoles++;
            }
          });
        });

        if (validRoles === 0) {
          return res .status(403) .json({ message: "Prohibido, no tienes roles válidos" });
        }
      }


      next();
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error });
    }
  };
};
