export const isAdmin = (req, res, next) => {
    if (req.userRole === 'admin') {
        next();
        return;
    }
    res.status(403).json({ message: 'Require Admin Role!' });
};
