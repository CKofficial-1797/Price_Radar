import jwt from 'jsonwebtoken';

function checkAuthToken(req, res, next) {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;
    if (!authToken && !refreshToken) {
        return res.status(401).json({ message: 'Authentication failed: No authToken or refreshToken provided', ok: false });
    }

    jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            // authtoken expired
            // check refresh token 
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshDecoded) => {
                if (refreshErr) {
                    // Both tokens are invalid
                    return res.status(401).json({ message: 'Authentication failed: Both tokens are invalid', ok: false });
                }

                else {
                    const newAuthToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
                    const newRefreshToken = jwt.sign({ userId: refreshDecoded.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });

                    res.cookie('authToken', newAuthToken);
                    res.cookie('refreshToken', newRefreshToken);

                    req.userId = refreshDecoded.userId;
                    req.ok = true;
                    next();
                }
            })
        }

        else {
            req.userId = decoded.userId;
            next();
        }
    })
}

export default checkAuthToken;