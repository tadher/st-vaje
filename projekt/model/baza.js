let config = require('../knexfile'),
    knex = require('knex')(config.development),
    bookshelf = require('bookshelf')(knex);


    let Lokacija = bookshelf.Model.extend({
        tableName: 'lokacija',
        nepremicnine: function(){
            return this.hasMany(Nepremicnina);
        }
    }),
    Nepremicnina = bookshelf.Model.extend({
        tableName: 'nepremicnina',
        lokacija: function(){
            return this.belongsTo(Lokacija);
        }
    });

module.exports = {
   Lokacija,
   Nepremicnina
}