const success = (res, data, message = 'Operación exitosa', statusCode = 200) => {
    const body = { success: true, message };
    if (data !== undefined && data !== null) body.data = data;
    return res.status(statusCode).json(body);
};

const error = (res, message, statusCode = 500, code = 'ERROR_INTERNO') => {
    return res.status(statusCode).json({
        success: false,
        error: { code, message }
    });
};

module.exports = { success, error };
