
exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('lokacija', function (table){
            table.increments('id').primary();
            table.string('kraj');
            table.string('regija');
            table.string('dolzina');
            table.string('sirina');
        }).createTable('nepremicnina', function (table){
            table.increments('id').primary();
            table.string('posredovanje');
            table.string('vrsta');
            table.string('velikost');
            table.string('cena');
            table.string('opis');
            table.integer('lokacija_id').references('id').inTable('lokacija');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('lokacija')
        .dropTable('nepremicnina');
};
