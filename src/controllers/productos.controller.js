const ProductoModel = require('../models/producto.model');
const response = require('../helpers/response');

const parseId = (param) => {
    const id = parseInt(param, 10);
    return isNaN(id) || id <= 0 ? null : id;
};

const parseDecimal = (value) => {
    const num = parseFloat(value);
    return isNaN(num) || num < 0 ? null : num;
};

const parseInteger = (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) || num < 0 ? null : num;
};

const validateFields = (body) => {
    const errors = [];

    if (!body.nombre || typeof body.nombre !== 'string') {
        errors.push('El campo nombre es requerido.');
    } else if (body.nombre.trim().length < 2 || body.nombre.trim().length > 100) {
        errors.push('El campo nombre debe tener entre 2 y 100 caracteres.');
    }

    if (!body.descripcion || typeof body.descripcion !== 'string') {
        errors.push('El campo descripcion es requerido.');
    } else if (body.descripcion.trim().length < 2 || body.descripcion.trim().length > 500) {
        errors.push('El campo descripcion debe tener entre 2 y 500 caracteres.');
    }

    if (body.preciodecosto === undefined || body.preciodecosto === null || body.preciodecosto === '') {
        errors.push('El campo preciodecosto es requerido.');
    } else if (parseDecimal(body.preciodecosto) === null) {
        errors.push('El campo preciodecosto debe ser un número decimal positivo.');
    }

    if (body.preciodeventa === undefined || body.preciodeventa === null || body.preciodeventa === '') {
        errors.push('El campo preciodeventa es requerido.');
    } else if (parseDecimal(body.preciodeventa) === null) {
        errors.push('El campo preciodeventa debe ser un número decimal positivo.');
    }

    if (body.cantidad === undefined || body.cantidad === null || body.cantidad === '') {
        errors.push('El campo cantidad es requerido.');
    } else if (parseInteger(body.cantidad) === null) {
        errors.push('El campo cantidad debe ser un número entero positivo.');
    }

    if (!body.fotografia || typeof body.fotografia !== 'string') {
        errors.push('El campo fotografia es requerido.');
    } else if (body.fotografia.trim().length > 500) {
        errors.push('El campo fotografia no puede superar los 500 caracteres.');
    } else {
        try {
            const url = new URL(body.fotografia.trim());
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                errors.push('El campo fotografia debe ser una URL válida (http o https).');
            }
        } catch {
            errors.push('El campo fotografia debe ser una URL válida.');
        }
    }

    return errors;
};

exports.findAll = (req, res) => {
    ProductoModel.getAll((err, data) => {
        if (err)
            return response.error(res, 'Ha ocurrido un error al obtener los productos.', 500, 'ERROR_INTERNO');
        return response.success(res, data, 'Productos obtenidos exitosamente.');
    });
};

exports.findOne = (req, res) => {
    const id = parseId(req.params.id);
    if (!id)
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');

    ProductoModel.findById(id, (err, data) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Producto con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al obtener el producto con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Producto obtenido exitosamente.');
    });
};

exports.create = (req, res) => {
    if (!req.body)
        return response.error(res, 'El cuerpo de la solicitud no puede estar vacío.', 400, 'DATOS_INVALIDOS');

    const errors = validateFields(req.body);
    if (errors.length > 0)
        return response.error(res, errors.join(' '), 400, 'DATOS_INVALIDOS');

    const producto = new ProductoModel({
        nombre: req.body.nombre.trim(),
        descripcion: req.body.descripcion.trim(),
        preciodecosto: parseDecimal(req.body.preciodecosto),
        preciodeventa: parseDecimal(req.body.preciodeventa),
        cantidad: parseInteger(req.body.cantidad),
        fotografia: req.body.fotografia.trim()
    });

    ProductoModel.create(producto, (err, data) => {
        if (err){
            console.error('Error al crear producto:', err);
            return response.error(res, 'Ha ocurrido un error al crear el producto.', 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Producto creado exitosamente.', 201);
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

    const producto = new ProductoModel({
        nombre: req.body.nombre.trim(),
        descripcion: req.body.descripcion.trim(),
        preciodecosto: parseDecimal(req.body.preciodecosto),
        preciodeventa: parseDecimal(req.body.preciodeventa),
        cantidad: parseInteger(req.body.cantidad),
        fotografia: req.body.fotografia.trim()
    });

    ProductoModel.updateById(id, producto, (err, data) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Producto con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al actualizar el producto con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return response.success(res, data, 'Producto actualizado exitosamente.');
    });
};

exports.delete = (req, res) => {
    const id = parseId(req.params.id);
    if (!id)
        return response.error(res, 'El id debe ser un número entero positivo.', 400, 'PARAMETRO_INVALIDO');

    ProductoModel.remove(id, (err) => {
        if (err) {
            if (err.kind === 'not_found')
                return response.error(res, `Producto con id ${id} no encontrado.`, 404, 'RECURSO_NO_ENCONTRADO');
            return response.error(res, `Error al eliminar el producto con id ${id}.`, 500, 'ERROR_INTERNO');
        }
        return res.status(204).send();
    });
};
