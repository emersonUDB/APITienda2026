const UsuarioModel = require('../models/usuario.model');
const response = require('../helpers/response');

const parseId = (param) => {
    const id = parseInt(param, 10);
    return isNaN(id) || id <= 0 ? null : id;
};

const validateFields = (body) => {
    const errors = [];

    if (!body.usuario || typeof body.usuario !== 'string') {
        errors.push('El campo usuario es requerido.');
    } else if (body.usuario.trim().length < 3 || body.usuario.trim().length > 50) {
        errors.push('El campo usuario debe tener entre 3 y 50 caracteres.');
    } else if (!/^[a-zA-Z0-9_]+$/.test(body.usuario.trim())) {
        errors.push('El campo usuario solo puede contener letras, números y guiones bajos.');
    }

    if (!body.contrasenia || typeof body.contrasenia !== 'string') {
        errors.push('El campo contrasenia es requerido.');
    } else if (body.contrasenia.length < 6 || body.contrasenia.length > 100) {
        errors.push('El campo contrasenia debe tener entre 6 y 100 caracteres.');
    }

    return errors;
};

exports.findAll = (req, res) => {
    UsuarioModel.getAll((err, data) => {
        if (err)
            return response.error(res, 'Ha ocurrido un error al obtener los usuarios.', 500, 'ERROR_INTERNO');
        return response.success(res, data, 'Usuarios obtenidos exitosamente.');
    });
};

exports.findOne = (req, res) => {
    const id = parseId(req.params.id);
    if (!id)
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');

    UsuarioModel.findById(id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al obtener el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuario obtenido exitosamente.');
    });
};

exports.create = (req, res) => {
    if (!req.body)
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400, 'DATOS_INVALIDOS');

    const errors = validateFields(req.body);
    if (errors.length > 0)
        return response.error(res, errors.join(' '), 400, 'DATOS_INVALIDOS');

    const usuario = new UsuarioModel({
        usuario: req.body.usuario.trim(),
        contrasenia: req.body.contrasenia
    });

    UsuarioModel.create(usuario, (err, data) => {
        if (err)
            return response.error(res, 'Ha ocurrido un error al crear el usuario.', 500, 'ERROR_INTERNO');
        return response.success(res, data, 'Usuario creado exitosamente.', 201);
    });
};

exports.update = (req, res) => {
    const id = parseId(req.params.id);
    if (!id)
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');

    if (!req.body)
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400, 'DATOS_INVALIDOS');

    const errors = validateFields(req.body);
    if (errors.length > 0)
        return response.error(res, errors.join(' '), 400, 'DATOS_INVALIDOS');

    UsuarioModel.updateById(id, new UsuarioModel(req.body), (err, data) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al actualizar el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Usuario actualizado exitosamente.');
    });
};

exports.delete = (req, res) => {
    const id = parseId(req.params.id);
    if (!id)
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');

    UsuarioModel.remove(id, (err) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Usuario con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al eliminar el usuario con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return res.status(204).send();
    });
};
