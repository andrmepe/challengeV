const express = require('express')
const mysql = require('mysql')

const app = express()

const conexionBD = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'compra'
})


app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


const  obtenerVehiculo = () => {
    return {
        id : 1,
        marca: 'Toyota',
        vehiculo : 'rav4',      
        modelo : 2020,
        precio: 145000000,
        cantidad: 8,
        estado : true
    }
}

app.use((req, res, next) => {
    const VehiculoPermitido = obtenerVehiculo() 
    req.locals = {
      VehiculoPermitido
    }
    next()
})

const middlwareAgregarVehiculo = (req, res, next) => {
    console.log(' Se ejecuto el middlwareAgregarVehiculo')
    const VehiculoPermitido = Vehiculo() 
    
    if (VehiculoPermitido.Vehiculo === "rav4"){
        req.locals = {
          VehiculoPermitido,
        }
        next()
    } else {
        req.locals = 'Vehiculo sin permisos'
        console.log('Vehiculo no permitido')
        next()
    }
}

app.get('/', (req,res) => {
    res.send('Bienvenidos al inicio')
})

 
app.get('/vehiculo', (req, res) => {
    const sql = 'SELECT * FROM vehiculo'

    conexionBD.query(sql, (error, results) => {
      if (error) throw error

      if (results.length > 0) {
        res.json(results)
      } else {
        res.send('No hay datos disponibles')
      }
    })
    
})

 
app.get('/vehiculo/:idvehiculo', (req, res) => {
    const id = req.params
    const sql = `SELECT * FROM vehiculo WHERE  idvehiculo = ${id.idvehiculo}`

    conexionBD.query(sql, (error, result) => {
        if (error) throw error

        if(result.length > 0){
          res.json(result)
        } else {
          res.send('vehiculo no encontrado')
        }
    })
})



app.post('/agregar-vehiculo',(req,res) => {
    const sql = 'INSERT INTO vehiculo SET ?'

    const marcaVehiculo = {
      idvehiculos : req.body.idvehiculo,
      marca : req.body.marca,
      vehiculo : req.body.vehiculo,
      modelo : req.body.modelo,
      precio: req.body.precio,
      cantidad: req.body.cantidad,
    }

    conexionBD.query(sql, marcaVehiculo, error => {
      if (error) throw error

      res.send('vehiculo creado con exito!')
    })
})


app.put('/actualizar-vehiculo/:vehiculoId',(req, res) => {
    const id = req.params
    const {marca,vehiculo,modelo,precio,cantidad} = req.body 

    const sql = `UPDATE vehiculos SET marca = '${marca}', vehiculo = '${vehiculo}', modelo = '${modelo}', precio = '${precio}', cantidad = '${cantidad}' where idvehiculos = ${id.vehiculoId}`

    conexionBD.query(sql, error => {
      if (error) throw error

      res.send('vehiculo actualizado con exito!')
    })
})


app.delete('/eliminar-vehiculo/:vehiculoId', (req, res) => {
    const id = req.params
    const sql = `DELETE FROM vehiculos where idvehiculos = ${id.vehiculoId}`

    conexionBD.query(sql, error => {
      if (error) throw error

      res.send('Vehiculo eliminado con exito!')
    })
})


app.listen(3001, () => {
    console.log('Servidor en el puerto 3001')
})
