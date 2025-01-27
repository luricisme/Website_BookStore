const ROLES_LIST = require('../../config/roles_list');

const verifyRole = (role) => {
    return (req, res, next) => {
        if(!req?.role) return res.sendStatus(401); // 401: Unauthorized
        console.log('YOUR ROLE: ', req.role);
        console.log('REQUIRED ROLE: ', ROLES_LIST[role]);
        
        const userRoleValue = req.role;
        const requiredRoleValue = ROLES_LIST[role];

        if (!userRoleValue || userRoleValue < requiredRoleValue) {
            return res.sendStatus(403); // 403: Forbidden
        }
        next();
    }
}

module.exports = verifyRole;